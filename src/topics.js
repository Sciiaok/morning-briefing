export const AI_PRODUCT_TOPICS = [
  { term: "Context Engineering", angle: "上下文不是越多越好，而是要按任务装配。" },
  { term: "Eval Harness", angle: "把主观体验变成可重复评估的产品基础设施。" },
  { term: "Retrieval-Augmented Generation", angle: "让模型从业务知识里拿证据，而不是只靠记忆。" },
  { term: "Re-ranking", angle: "检索之后再排序，决定用户最终看到什么证据。" },
  { term: "Tool Calling", angle: "让模型从回答问题升级为调用系统完成动作。" },
  { term: "Function Calling", angle: "把自然语言意图变成可执行的结构化参数。" },
  { term: "Agent Harness", angle: "包住模型的控制层，负责权限、状态、重试和验收。" },
  { term: "Human-in-the-loop", angle: "把人放在高风险节点，而不是每一步都人工确认。" },
  { term: "Synthetic Data", angle: "用生成数据补足冷启动、长尾和评测样本。" },
  { term: "Inference Cost", angle: "单位任务成本决定 AI 产品能不能规模化赚钱。" },
  { term: "Latency Budget", angle: "用户愿意等多久，决定工作流能拆成几步。" },
  { term: "Memory Layer", angle: "长期记忆是用户留存能力，不只是聊天记录。" },
  { term: "Model Router", angle: "不同任务分配给不同模型，平衡质量、速度和成本。" },
  { term: "Prompt Injection", angle: "AI 产品里的安全边界必须默认不信任输入。" },
  { term: "Guardrails", angle: "用规则、评估和拦截器限制模型越界行为。" },
  { term: "Groundedness", angle: "回答是否被证据支撑，是企业用户信任的核心。" },
  { term: "Embeddings", angle: "把文本变成可计算的语义坐标，支撑搜索和推荐。" },
  { term: "Chunking Strategy", angle: "知识怎么切，直接影响 RAG 的答案质量。" },
  { term: "Multi-agent Workflow", angle: "多个专职 Agent 协作，不等于简单堆多个聊天机器人。" },
  { term: "Vibe Coding", angle: "自然语言驱动开发改变的是原型速度和协作方式。" },
  { term: "AI Browser", angle: "浏览器可能成为 Agent 进入真实工作流的入口。" },
  { term: "AI SDR", angle: "销售自动化的关键不是群发，而是识别时机和上下文。" },
  { term: "Workflow Automation", angle: "AI 的价值常常藏在跨工具的连续动作里。" },
  { term: "Task Decomposition", angle: "复杂任务拆得好，模型才不会在中途漂移。" },
  { term: "Confidence Calibration", angle: "产品要知道什么时候让 AI 少说一点。" },
  { term: "Observability for AI", angle: "记录输入、工具、输出和失败原因，才能持续改进。" },
  { term: "Few-shot Examples", angle: "好例子比长规则更能塑造模型行为。" },
  { term: "Structured Output", angle: "稳定 JSON 或字段输出，是 AI 接业务系统的前提。" },
  { term: "MCP", angle: "让模型连接外部工具和数据源的协议层。" },
  { term: "Capability Boundary", angle: "定义 AI 能做什么和不能做什么，减少过度承诺。" }
];

export const ARTICLE_FOCUS_TOPICS = [
  { name: "产品形态", instruction: "优先找新 AI 产品、Agent 产品、AI 原生应用、工作流产品，重点分析交互和使用场景。" },
  { name: "商业化与定价", instruction: "优先找定价、付费转化、企业采购、成本结构、商业模式相关内容。" },
  { name: "开发者生态", instruction: "优先找 SDK、MCP、Agent 框架、开发者工具、开源项目相关内容。" },
  { name: "企业落地", instruction: "优先找企业级 AI、组织协作、知识库、办公自动化、行业案例相关内容。" },
  { name: "海外 Builder 讨论", instruction: "优先找 Hacker News、Reddit、海外创业者和产品构建者的真实讨论。" },
  { name: "中文高质量长文", instruction: "优先找 Datawhale、机器之心、量子位、Founder Park、晚点、极客公园等中文内容。" },
  { name: "模型与基础设施", instruction: "优先找推理成本、模型路由、上下文、评测、RAG、部署和算力相关内容。" },
  { name: "用户需求与工作流", instruction: "优先找真实用户痛点、垂直场景、工作流替代、从工具到系统的讨论。" },
  { name: "竞争格局", instruction: "优先找同类产品对比、平台入口变化、巨头动作、创业公司差异化。" },
  { name: "失败案例与反思", instruction: "优先找产品没跑通、用户不买单、Agent 落地困难、AI 功能鸡肋化的讨论。" }
];

export const KNOWLEDGE_THEMES = [
  { name: "城市与街区", instruction: "讲一个城市、街区、港口或公共空间背后的故事，不要谈 AI。" },
  { name: "货币与信用", instruction: "讲一个货币、票据、银行、信用或支付习惯的历史故事，不要谈 AI。" },
  { name: "饮食与贸易", instruction: "讲一种食物、香料、茶、咖啡或餐桌习惯如何被贸易改变，不要谈 AI。" },
  { name: "地图与地理", instruction: "讲地图、边界、河流、山脉、航线或地理误解带来的影响，不要谈 AI。" },
  { name: "公司史", instruction: "讲一家传统公司、品牌、商号或行业组织的关键转折，不要谈 AI 或科技创业。" },
  { name: "博物馆与收藏", instruction: "讲一件文物、收藏、展览或博物馆制度背后的故事，不要谈 AI。" },
  { name: "交通与基础设施", instruction: "讲铁路、运河、港口、公路、邮政或物流系统如何改变日常生活，不要谈 AI。" },
  { name: "制度与组织", instruction: "讲一个制度、行会、大学、公司治理或官僚体系的具体故事，不要谈 AI。" },
  { name: "艺术与审美", instruction: "讲一种艺术风格、设计潮流、建筑或审美习惯的来龙去脉，不要谈 AI。" },
  { name: "日用品史", instruction: "讲一种普通日用品如何被发明、传播并改变行为，不要谈 AI。" }
];

export const FOOD_THEMES = [
  { name: "轻食高蛋白", instruction: "优先找蔬菜、优质蛋白、谷物碗、沙拉、少油但不寡淡的选择。" },
  { name: "地方小馆", instruction: "优先找有地域特色的小馆，如贵州、云南、台州、潮汕、新疆等，不要只推荐网红店。" },
  { name: "异国料理", instruction: "优先找健康度较好的日料、越南、泰国、中东、地中海等，注意不要重油重糖。" },
  { name: "咖啡简餐", instruction: "优先找适合工作日下午或轻晚餐的咖啡简餐、三明治、brunch、烘焙轻食。" },
  { name: "清爽中式", instruction: "优先找蒸煮炖、鱼、汤、菌菇、时蔬，避免大油大辣。" },
  { name: "适合小聚", instruction: "优先找适合 2-4 人下班见面、环境舒服但不喧闹的晚餐店。" },
  { name: "外卖友好", instruction: "优先找外卖体验稳定、不容易塌、不太油、送到后仍好吃的选择。" },
  { name: "低负担晚餐", instruction: "优先找晚上吃完不撑、少碳水、口味有特色的选择。" },
  { name: "西湖区优先", instruction: "今天优先西湖区，滨江区作为补充；注意商圈和下单前营业确认。" },
  { name: "滨江区优先", instruction: "今天优先滨江区，西湖区作为补充；注意商圈和下单前营业确认。" }
];

export function getTopicForDate(dateInput = new Date()) {
  return pickForDate(AI_PRODUCT_TOPICS, dateInput, 0);
}

export function getDailyPlanForDate(dateInput = new Date()) {
  return {
    aiTopic: pickForDate(AI_PRODUCT_TOPICS, dateInput, 0),
    articleFocus: pickForDate(ARTICLE_FOCUS_TOPICS, dateInput, 3),
    knowledgeTheme: pickForDate(KNOWLEDGE_THEMES, dateInput, 6),
    foodTheme: pickForDate(FOOD_THEMES, dateInput, 9)
  };
}

function pickForDate(items, dateInput, offset) {
  const days = getDayNumber(dateInput);
  return items[(days + offset) % items.length];
}

function getDayNumber(dateInput) {
  const date = normalizeDate(dateInput);
  return Math.floor(date.getTime() / 86400000);
}

function normalizeDate(dateInput) {
  if (dateInput instanceof Date) {
    return new Date(Date.UTC(dateInput.getUTCFullYear(), dateInput.getUTCMonth(), dateInput.getUTCDate()));
  }

  const [year, month, day] = String(dateInput).slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
