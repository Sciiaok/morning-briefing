export const SCHEDULES = [
  { cron: "30 10 * * 1-5", cardIndex: 1 },
  { cron: "0 15 * * 1-5", cardIndex: 2 },
  { cron: "0 17 * * 1-5", cardIndex: 4 },
  { cron: "30 21 * * 1-5", cardIndex: 3 }
];

export function getCardIndexForCron(cronExpression) {
  return SCHEDULES.find((item) => item.cron === cronExpression)?.cardIndex || null;
}
