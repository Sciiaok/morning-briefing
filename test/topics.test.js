import assert from "node:assert/strict";
import test from "node:test";
import { getDailyPlanForDate, getTopicForDate } from "../src/topics.js";

test("getTopicForDate returns different adjacent weekday topics", () => {
  const first = getTopicForDate("2026-06-10");
  const second = getTopicForDate("2026-06-11");

  assert.notEqual(first.term, second.term);
});

test("getTopicForDate is deterministic for the same date", () => {
  assert.deepEqual(getTopicForDate("2026-06-10"), getTopicForDate("2026-06-10"));
});

test("getDailyPlanForDate rotates all non-term card directions", () => {
  const first = getDailyPlanForDate("2026-06-10");
  const second = getDailyPlanForDate("2026-06-11");

  assert.notEqual(first.articleFocus.name, second.articleFocus.name);
  assert.notEqual(first.knowledgeTheme.name, second.knowledgeTheme.name);
  assert.notEqual(first.foodTheme.name, second.foodTheme.name);
});

test("getDailyPlanForDate is deterministic for the same date", () => {
  assert.deepEqual(getDailyPlanForDate("2026-06-10"), getDailyPlanForDate("2026-06-10"));
});
