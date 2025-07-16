export const prizeTable = {
  1: 0.3333,
  2: 0.15,
  3: 0.08,
  4: 0.0567,
  5: 0.045,
  6: 0.045,
  7: 0.0342,
  8: 0.0342,
  9: 0.025,
  10: 0.025,
  11: 0.025,
  12: 0.025,
  13: 0.0183,
  14: 0.0183,
  15: 0.0183,
  16: 0.0183,
  17: 0.0116,
  18: 0.0116,
  19: 0.0116,
  20: 0.0116,
};

export const awardPrize = ({ teamName, placement, poolAmount, currentBudget }) => {
  const pct = prizeTable[placement] || 0;
  const amount = Math.round(pct * poolAmount);
  const newBudget = currentBudget + amount;

  return { amount, newBudget };
};
