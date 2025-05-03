/**
 * Delays for the welcome page animations.
 *
 * Each delay is a multiple of 0.125 seconds,
 * staggered down the page.
 */
export const welcomeAnimationDelays = (() => {
  const d = 0.125;

  return {
    pectraLink: 0,
    headline: {
      thisIs: 0,
      theFutureOf: 2 * d,
      ethereum: 4 * d,
      staking: 6 * d,
    },
    chart: 8 * d,
    infoParagraph: 9 * d,
    infoCards: [10 * d, 11 * d, 12 * d],
    infoShield: 13 * d,
    enterSiteButton: 14 * d,
    footer: {
      pierTwo: 15 * d,
      labrys: 16 * d,
    },
  };
})();

export const dashboardAnimationDelays = (() => {
  const d = 0.125;

  return {
    toolCards: {
      consolidate: 0,
      batchDeposit: d,
      withdrawal: d * 2,
    },
    activeValidators: 0,
    totalStake: d,
    totalDailyIncome: d * 3,
  };
})();
