// Core Game Configuration - Shared settings only
const GameConfig = {
  // Global Game Settings
  STARTING_MONEY: 100,
  WIN_GOAL: 1000000,
  TRASH_REWARD: 0.1,

  // Bet Options for UI Selectors (used by main.js)
  SLOTS_BETS: [1, 100, 10000],
  BLACKJACK_BETS: [5, 500, 50000],
  ROULETTE_BETS: [1000, 25000, 100000],

  // Balance and Minimum Bets
  BALANCE: {
    MIN_BETS: {
      SLOTS: 1,
      BLACKJACK: 5,
      ROULETTE: 1000,
    },
  },

  // AI Behavior Configuration
  AI_BEHAVIOR: {
    LOCATION_CHANGE_CHANCE: 0.3,
    WIN_RATES: {
      slots: 0.4,
      blackjack: 0.45,
      roulette: 0.35,
    },
    BETTING_STYLES: {
      conservative: 0.5,
      moderate: 1.0,
      aggressive: 2.0,
    },
  },

  // Global UI Configuration
  UI: {
    MESSAGE_DURATION: 2000,
    NORMAL_MESSAGE_DURATION: 2500,
    LONG_MESSAGE_DURATION: 4000,

    // Global Colors
    COLORS: {
      SUCCESS: "#27ae60",
      DANGER: "#e74c3c",
      WARNING: "#f39c12",
      INFO: "#3498db",
    },
  },

  // AI Helper Functions
  getBetAmount: function (game, style) {
    const baseAmounts = {
      slots: this.SLOTS_BETS[0],
      blackjack: this.BLACKJACK_BETS[0],
      roulette: this.ROULETTE_BETS[0],
    };

    const multiplier = this.AI_BEHAVIOR.BETTING_STYLES[style] || 1.0;
    return Math.floor(baseAmounts[game] * multiplier);
  },

  getWinRate: function (game) {
    return this.AI_BEHAVIOR.WIN_RATES[game] || 0.4;
  },
};

// Export for different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameConfig;
} else if (typeof window !== "undefined") {
  window.GameConfig = GameConfig;
}
