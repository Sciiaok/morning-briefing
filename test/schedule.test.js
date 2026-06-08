import assert from "node:assert/strict";
import test from "node:test";
import { getCardIndexForCron, SCHEDULES } from "../src/schedule.js";

test("SCHEDULES maps weekdays to requested card send times", () => {
  assert.deepEqual(SCHEDULES, [
    { cron: "30 10 * * 1-5", cardIndex: 1 },
    { cron: "0 15 * * 1-5", cardIndex: 2 },
    { cron: "0 17 * * 1-5", cardIndex: 4 },
    { cron: "30 21 * * 1-5", cardIndex: 3 }
  ]);
});

test("getCardIndexForCron resolves card index from cron expression", () => {
  assert.equal(getCardIndexForCron("30 10 * * 1-5"), 1);
  assert.equal(getCardIndexForCron("0 15 * * 1-5"), 2);
  assert.equal(getCardIndexForCron("0 17 * * 1-5"), 4);
  assert.equal(getCardIndexForCron("30 21 * * 1-5"), 3);
  assert.equal(getCardIndexForCron("unknown"), null);
});
