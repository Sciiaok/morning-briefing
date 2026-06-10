import assert from "node:assert/strict";
import test from "node:test";
import { getTopicForDate } from "../src/topics.js";

test("getTopicForDate returns different adjacent weekday topics", () => {
  const first = getTopicForDate("2026-06-10");
  const second = getTopicForDate("2026-06-11");

  assert.notEqual(first.term, second.term);
});

test("getTopicForDate is deterministic for the same date", () => {
  assert.deepEqual(getTopicForDate("2026-06-10"), getTopicForDate("2026-06-10"));
});
