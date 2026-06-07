import assert from "node:assert/strict";
import test from "node:test";
import { buildBriefingCards, buildFeishuCardPayloads } from "../src/cards.js";

const briefing = [
  "晨间简报｜2026-06-07",
  "",
  "1. AI 产品人今日名词",
  "今天讲 Agent Harness。",
  "",
  "2. 今日值得看的 AI 文章/讨论",
  "量子位文章",
  "https://www.qbitai.com/example",
  "",
  "3. 一个有趣但有用的小知识",
  "为什么信用卡先从餐厅开始？",
  "",
  "4. 今日杭州吃饭/外卖打卡",
  "西湖区：清爽一点。"
].join("\n");

test("buildBriefingCards splits briefing into four Feishu cards", () => {
  const cards = buildBriefingCards(briefing);

  assert.equal(cards.length, 4);
  assert.equal(cards[0].header.title.content, "晨间简报｜AI 产品人今日名词");
  assert.equal(cards[1].header.title.content, "晨间简报｜值得看的 AI 文章/讨论");
  assert.equal(cards[2].header.title.content, "晨间简报｜有趣但有用的小知识");
  assert.equal(cards[3].header.title.content, "晨间简报｜杭州吃饭/外卖打卡");
  assert.equal(cards[0].elements[0].text.tag, "plain_text");
  assert.equal(cards[0].elements[0].text.content.includes("Agent Harness"), true);
});

test("buildFeishuCardPayloads creates interactive webhook payloads", () => {
  const payloads = buildFeishuCardPayloads(briefing);

  assert.equal(payloads.length, 4);
  assert.equal(payloads[0].msg_type, "interactive");
  assert.equal(payloads[0].card.header.title.content.includes("晨间简报"), true);
});

test("buildBriefingCards turns URLs into clickable card buttons", () => {
  const cards = buildBriefingCards(briefing);
  const readsCard = cards[1];
  const actionElement = readsCard.elements.find((element) => element.tag === "action");

  assert.equal(Boolean(actionElement), true);
  assert.equal(actionElement.actions[0].tag, "button");
  assert.equal(actionElement.actions[0].url, "https://www.qbitai.com/example");
  assert.equal(actionElement.actions[0].text.content.includes("量子位文章"), true);
});
