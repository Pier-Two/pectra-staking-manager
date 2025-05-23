/**
 * Delays for the welcome page animations.
 *
 * Each delay is a multiple of 0.125 seconds,
 * staggered down the page.
 */
export const welcomeAnimationDelays = (() => {
  const d = 0.125;

  return {
    headline: {
      thisIs: 0,
      theFutureOf: 2 * d,
      ethereum: 4 * d,
      staking: 6 * d,
    },
    infoParagraph: 8 * d,
    infoCards: [9 * d, 10 * d, 11 * d],
    enterSiteButton: 12 * d,
    infoShield: 13 * d,
    footer: {
      pierTwo: 14 * d,
      labrys: 15 * d,
      esp: 16 * d,
      ethFoundation: 17 * d,
    },
    chart: 16 * d,
    faq: 17 * d,
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
