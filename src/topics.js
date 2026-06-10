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

export function getTopicForDate(dateInput = new Date()) {
  const date = normalizeDate(dateInput);
  const days = Math.floor(date.getTime() / 86400000);
  return AI_PRODUCT_TOPICS[days % AI_PRODUCT_TOPICS.length];
}

function normalizeDate(dateInput) {
  if (dateInput instanceof Date) {
    return new Date(Date.UTC(dateInput.getUTCFullYear(), dateInput.getUTCMonth(), dateInput.getUTCDate()));
  }

  const [year, month, day] = String(dateInput).slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
