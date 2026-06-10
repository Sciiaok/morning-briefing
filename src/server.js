import express from "express";
import cron from "node-cron";
import { buildFeishuCardPayloads, buildSingleFeishuCardPayload } from "./cards.js";
import { formatForFeishuText } from "./format.js";
import { getCardIndexForCron, SCHEDULES } from "./schedule.js";
import { getTopicForDate } from "./topics.js";

const DEFAULT_WEBHOOKS = [
  "https://open.feishu.cn/open-apis/bot/v2/hook/965a26e1-f3e9-4702-a979-c64b03b6480a",
  "https://open.feishu.cn/open-apis/bot/v2/hook/b13ccf79-c59b-4d20-a1aa-f3d0a4f3e299"
];

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "AI 晨间简报",
    schedule: "Asia/Shanghai weekdays 10:30 card 1, 15:00 card 2, 17:00 card 4, 21:30 card 3",
    model: process.env.MODEL || "glm-5",
    provider: "Alibaba Cloud Model Studio / Bailian"
  });
});

app.get("/debug/config", (req, res) => {
  if (process.env.RUN_SECRET) {
    const token = req.get("x-run-secret") || req.query.secret;
    if (token !== process.env.RUN_SECRET) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }

  const apiKeyInfo = getApiKeyInfo();
  res.json({
    ok: true,
    model: process.env.MODEL || "glm-5",
    baseUrl: getBaseUrl(),
    searchStrategy: process.env.SEARCH_STRATEGY || "agent_max",
    apiKey: apiKeyInfo
  });
});

app.post("/run", async (req, res) => {
  if (process.env.RUN_SECRET) {
    const token = req.get("x-run-secret") || req.query.secret;
    if (token !== process.env.RUN_SECRET) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
  }

  try {
    const cardIndex = req.query.card ? Number(req.query.card) : null;
    const result = await runBriefing("manual", cardIndex);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

for (const schedule of SCHEDULES) {
  cron.schedule(
    schedule.cron,
    () => {
      runBriefing(`cron:${schedule.cron}`, schedule.cardIndex).catch((error) => console.error("Briefing failed:", error));
    },
    { timezone: "Asia/Shanghai" }
  );
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`AI morning briefing service listening on ${port}`);
});

async function runBriefing(trigger, requestedCardIndex = null) {
  const cardIndex = requestedCardIndex || getCardIndexForCron(String(trigger).replace(/^cron:/, ""));
  const briefing = await generateBriefing();
  const payloads = cardIndex
    ? [buildSingleFeishuCardPayload(briefing, cardIndex)]
    : buildFeishuCardPayloads(briefing);
  const webhooks = getWebhooks();
  const results = [];

  for (let webhookIndex = 0; webhookIndex < webhooks.length; webhookIndex += 1) {
    for (let cardIndex = 0; cardIndex < payloads.length; cardIndex += 1) {
      const response = await sendFeishuPayload(webhooks[webhookIndex], payloads[cardIndex]);
      results.push({
        webhookIndex: webhookIndex + 1,
        cardIndex: cardIndex + 1,
        ok: response.ok,
        status: response.status,
        body: await response.text()
      });
    }
  }

  return {
    ok: results.every((result) => result.ok),
    trigger,
    cardIndex: cardIndex || "all",
    sentAt: new Date().toISOString(),
    results
  };
}

function getWebhooks() {
  const configured = process.env.FEISHU_WEBHOOKS;
  if (!configured) return DEFAULT_WEBHOOKS;
  return configured.split(",").map((item) => item.trim()).filter(Boolean);
}

async function generateBriefing() {
  const apiKey = getApiKeyValue();
  if (!apiKey) {
    throw new Error("DASHSCOPE_API_KEY or BAILIAN_API_KEY is required.");
  }

  const today = new Date().toLocaleDateString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  });
  const topicDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" });
  const todayTopic = getTopicForDate(topicDate);

  const researchContext = await collectResearchContext(today);
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.MODEL || "glm-5",
      messages: [
        {
          role: "system",
          content: "你是一位面向 AI 产品经理和 AI 创始人的中文晨间简报编辑。你必须联网核验近期资讯，表达具体、清楚、有判断。"
        },
        {
          role: "user",
          content: buildPrompt(today, researchContext, todayTopic)
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Bailian API failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const text = formatForFeishuText(extractOutputText(data));
  return text.includes("晨间简报") ? text : `晨间简报\n\n${text}`;
}

function getBaseUrl() {
  return process.env.BAILIAN_BASE_URL || "https://coding.dashscope.aliyuncs.com/v1";
}

function getApiKeyInfo() {
  const found = getApiKeyCandidate();
  if (!found) {
    return {
      source: null,
      present: false,
      length: 0,
      masked: null,
      hasLeadingOrTrailingWhitespace: false
    };
  }

  const [source, rawValue] = found;
  const value = rawValue.trim();
  return {
    source,
    present: true,
    length: value.length,
    masked: maskSecret(value),
    hasLeadingOrTrailingWhitespace: rawValue !== value
  };
}

function getApiKeyValue() {
  return getApiKeyCandidate()?.[1]?.trim() || "";
}

function getApiKeyCandidate() {
  const candidates = [
    ["DASHSCOPE_API_KEY", process.env.DASHSCOPE_API_KEY],
    ["BAILIAN_API_KEY", process.env.BAILIAN_API_KEY],
    ["OPENAI_API_KEY", process.env.OPENAI_API_KEY]
  ];
  return candidates.find(([, value]) => value);
}

function maskSecret(value) {
  if (value.length <= 8) return "*".repeat(value.length);
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function extractOutputText(data) {
  const content = data.choices?.[0]?.message?.content;
  if (Array.isArray(content)) {
    return content.map((item) => item.text || item.content || "").join("\n").trim();
  }
  return String(content || "").trim();
}

async function collectResearchContext(today) {
  const queries = [
    `site:qbitai.com AI Agent 产品 大模型 2026 6月`,
    `site:jiqizhixin.com AI Agent 产品 大模型 2026 6月`,
    `site:datawhale.club 大模型 Agent RAG 2026`,
    `AI agents product founder discussion 2026 Hacker News Reddit`,
    `杭州 西湖区 滨江区 健康 小众 餐厅 外卖 推荐`
  ];

  const results = [];
  for (const query of queries) {
    const items = await searchDuckDuckGo(query).catch((error) => [
      { title: "搜索失败", url: "", snippet: `${query}: ${error.message}` }
    ]);
    results.push({ query, items: items.slice(0, 4) });
  }

  const hn = await fetchHackerNews("AI agents product founder").catch(() => []);
  if (hn.length) {
    results.push({
      query: "Hacker News: AI agents product founder",
      items: hn.slice(0, 4)
    });
  }

  return [
    `检索日期：${today}`,
    ...results.map((group) => {
      const lines = group.items.map((item, index) => (
        `${index + 1}. ${item.title}\n链接：${item.url || "无"}\n摘要：${item.snippet || "无摘要"}`
      ));
      return `【搜索：${group.query}】\n${lines.join("\n")}`;
    })
  ].join("\n\n");
}

async function searchDuckDuckGo(query) {
  const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 MorningBriefingBot/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`DuckDuckGo search failed: ${response.status}`);
  }

  const html = await response.text();
  const matches = [...html.matchAll(/<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[\s\S]*?>([\s\S]*?)<\/a>/g)];
  return matches.map((match) => ({
    url: decodeDuckDuckGoUrl(stripHtml(match[1])),
    title: normalizeText(stripHtml(match[2])),
    snippet: normalizeText(stripHtml(match[3]))
  })).filter((item) => item.title && item.url);
}

async function fetchHackerNews(query) {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const data = await response.json();
  return (data.hits || []).map((hit) => ({
    title: hit.title,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    snippet: `points: ${hit.points || 0}, comments: ${hit.num_comments || 0}, created_at: ${hit.created_at || ""}`
  }));
}

function decodeDuckDuckGoUrl(value) {
  const decoded = decodeHtml(value);
  try {
    const url = new URL(decoded, "https://duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : decoded;
  } catch {
    return decoded;
  }
}

function stripHtml(value) {
  return decodeHtml(String(value).replace(/<[^>]+>/g, " "));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function normalizeText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function buildPrompt(today, researchContext, todayTopic) {
  return `今天是 ${today}。请生成一份中文「晨间简报」，目标受众是 AI 产品经理、AI 产品创始人、正在做 AI 产品商业化的人。内容要具体、细、可读、有启发，避免泛泛而谈、空话、新闻通稿腔。整体像一份小型 AI 产品人内参。

今天第一张卡片的指定名词是：${todayTopic.term}
讲述角度：${todayTopic.angle}
必须讲这个名词，不要改成其他名词。不要连续多天使用同一个名词。

以下是真实联网检索到的候选链接和摘要。你必须优先基于这些材料写“今日值得看的 AI 文章/讨论”和“今日杭州吃饭/外卖打卡”。不要编造不存在的链接；如果材料不足，要明确说明“可验证材料有限”，并给出可搜索关键词。

${researchContext}

必须输出 4 个板块：

1. AI 产品人今日名词
介绍指定名词“${todayTopic.term}”。要求：一句话解释它是什么；讲清它为什么对 AI 产品有用；给一个真实产品场景或创业场景例子；给一个今天就能试的小练习或判断清单；不要写成百科词条，要写成产品人能用的认知工具。

2. 今日值得看的 AI 文章/讨论
联网检索并推荐 2-4 条最近热门、值得 AI 产品经理/创始人阅读的 AI 相关文章、公众号文章、社区讨论或长文。优先关注 Datawhale、机器之心、量子位、Founder Park、硅星人、AI 产品榜、晚点、极客公园、海外 AI Builder/产品讨论、Hacker News、Reddit、X/Twitter 上有影响力的 AI 产品/创业讨论等。尽量提供可打开链接；公众号文章无法稳定抓取时，提供公众号名称、标题、发布日期和搜索关键词。每条说明为什么值得看，重点说对产品判断、商业化、用户需求、竞争格局、工作流设计的启发。

3. 一个有趣但有用的小知识
提供一个与 AI 无关的通识知识点，可来自历史、人文、经济、地理、商业史、城市、饮食、艺术、组织管理、认知科学等。不要写 AI、模型、算法、机器人或科技创业案例。开头要有吸引人的问题或反常识钩子；讲述要具体，有人物、场景、冲突或可视化细节；最后只用一小句落到对产品经理/创始人有启发的观察。

4. 今日杭州吃饭/外卖打卡
推荐 2-3 个适合今天尝试的杭州餐饮选择，范围限定在西湖区和滨江区。目标：好吃、相对健康、有特色，不要只是大众热门口味或网红店堆砌。每个推荐写清：区域、适合场景、推荐理由、建议点什么、健康/口味提醒。如果无法确认当天营业状态，请明确说“营业状态需下单前确认”。

格式和风格：
- 总字数控制在 900-1300 字。
- 使用清晰小标题，适合飞书 text 消息阅读。
- 不要使用 Markdown 语法。不要使用 #、##、**加粗**、表格、代码块、项目符号短横线、Markdown 链接格式。
- 链接请单独成行展示，格式为：标题换行，URL 换行，简短点评。
- 小标题建议直接写成：“1. AI 产品人今日名词”，不要加粗，不要加井号。
- 标题和正文必须包含“晨间简报”四个字。
- 语气聪明、具体、轻快，但不要油腻、不要鸡汤。
- 对最新资讯和餐饮推荐，尽量给出来源链接或可搜索关键词；涉及日期时写具体日期。`;
}

async function sendFeishuPayload(webhook, payload) {
  return fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
