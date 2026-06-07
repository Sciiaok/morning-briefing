import { formatForFeishuText } from "./format.js";

const SECTION_DEFS = [
  {
    key: "term",
    marker: "1. AI 产品人今日名词",
    title: "晨间简报｜AI 产品人今日名词",
    template: "blue"
  },
  {
    key: "reads",
    marker: "2. 今日值得看的 AI 文章/讨论",
    title: "晨间简报｜值得看的 AI 文章/讨论",
    template: "purple"
  },
  {
    key: "knowledge",
    marker: "3. 一个有趣但有用的小知识",
    title: "晨间简报｜有趣但有用的小知识",
    template: "wathet"
  },
  {
    key: "food",
    marker: "4. 今日杭州吃饭/外卖打卡",
    title: "晨间简报｜杭州吃饭/外卖打卡",
    template: "green"
  }
];

export function buildFeishuCardPayloads(briefingText) {
  return buildBriefingCards(briefingText).map((card) => ({
    msg_type: "interactive",
    card
  }));
}

export function buildBriefingCards(briefingText) {
  const sections = splitBriefingSections(briefingText);
  return SECTION_DEFS.map((section) => buildCard(section, sections[section.key]));
}

function splitBriefingSections(briefingText) {
  const text = formatForFeishuText(briefingText);
  const sections = {};

  for (let index = 0; index < SECTION_DEFS.length; index += 1) {
    const current = SECTION_DEFS[index];
    const next = SECTION_DEFS[index + 1];
    const start = text.indexOf(current.marker);
    const end = next ? text.indexOf(next.marker) : -1;

    if (start === -1) {
      sections[current.key] = "今天这一段生成得不够稳定，建议稍后手动重试。";
      continue;
    }

    const raw = end === -1 ? text.slice(start) : text.slice(start, end);
    sections[current.key] = raw.replace(current.marker, "").trim();
  }

  return sections;
}

function buildCard(section, content) {
  return {
    config: {
      wide_screen_mode: true
    },
    header: {
      template: section.template,
      title: {
        tag: "plain_text",
        content: section.title
      }
    },
    elements: [
      {
        tag: "div",
        text: {
          tag: "plain_text",
          content: clampText(content || "暂无内容。", 1900)
        }
      }
    ]
  };
}

function clampText(text, maxLength) {
  const normalized = formatForFeishuText(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 20).trim()}\n\n内容较长，已截断。`;
}
