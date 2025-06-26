// Game configuration settings
const GameConfig = {
  // Starting money for all players
  STARTING_MONEY: 100,

  // Win condition
  WIN_GOAL: 1000000, // $1 million

  // Betting options
  SLOTS_BETS: [10, 250, 10000],
  BLACKJACK_BETS: [5, 500, 50000],
  ROULETTE_BETS: [1000, 25000, 100000],

  // Trash search reward
  TRASH_REWARD: 0.1,

  // Slots configuration
  SLOTS: {
    SYMBOLS: ["🍒", "🍋", "🍊", "⭐", "💎", "7️⃣", "🎰", "💰"],
    WEIGHTS: [20, 18, 16, 12, 8, 6, 4, 3], // Probability weights (higher = more common)
    JACKPOT_SYMBOLS: ["7️⃣", "💎", "💰", "🎰"],
    PAYOUTS: {
      // Mega Jackpots
      "7️⃣7️⃣7️⃣": {
        multiplier: 100,
        name: "LUCKY SEVENS JACKPOT!",
        tier: "mega",
      },
      "💎💎💎": { multiplier: 50, name: "DIAMOND JACKPOT!", tier: "mega" },
      "💰💰💰": { multiplier: 25, name: "MONEY BAGS JACKPOT!", tier: "mega" },
      "🎰🎰🎰": { multiplier: 20, name: "SLOT MACHINE BONUS!", tier: "mega" },

      // High payouts
      "⭐⭐⭐": { multiplier: 15, name: "TRIPLE STARS!", tier: "high" },
      "🍊🍊🍊": { multiplier: 8, name: "Orange Burst!", tier: "high" },
      "🍋🍋🍋": { multiplier: 6, name: "Lemon Triple!", tier: "medium" },
      "🍒🍒🍒": { multiplier: 5, name: "Cherry Combo!", tier: "medium" },

      // Mixed jackpot symbols (any 3 different jackpot symbols)
      JACKPOT_MIX: { multiplier: 12, name: "Mixed Jackpot!", tier: "high" },

      // Premium pairs
      "💎💎_": { multiplier: 5, name: "Diamond Pair", tier: "medium" },
      "7️⃣7️⃣_": { multiplier: 4, name: "Lucky Sevens", tier: "medium" },
      "💰💰_": { multiplier: 3, name: "Money Pair", tier: "low" },
      "🎰🎰_": { multiplier: 2.5, name: "Slot Pair", tier: "low" },
      "⭐⭐_": { multiplier: 2, name: "Star Pair", tier: "low" },

      // Regular pairs
      TWO_OF_A_KIND: { multiplier: 1.5, name: "Matching Pair!", tier: "low" },

      // Single symbol bonuses
      SINGLE_DIAMOND: {
        multiplier: 0.5,
        name: "Diamond Sparkle",
        tier: "bonus",
      },
      SINGLE_SEVEN: { multiplier: 0.25, name: "Lucky Seven", tier: "bonus" },
    },
  },

  // Blackjack configuration
  BLACKJACK: {
    DEALER_STANDS_ON: 17,
    BLACKJACK_PAYOUT: 2.5, // 2.5:1 for blackjack
    REGULAR_WIN_PAYOUT: 2, // 1:1 plus return bet
  },

  // Roulette configuration
  ROULETTE: {
    RED_NUMBERS: [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ],
    PAYOUTS: {
      EVEN_MONEY: 1, // Red, Black, Odd, Even (1:1)
      DOZENS: 2, // 1-12, 13-24, 25-36 (2:1)
    },
  },

  // AI Player configurations
  AI_PLAYERS: [
    {
      id: 1,
      name: "Lucky Luke",
      style: "conservative",
      preferredGames: ["slots", "trash"],
      riskTolerance: 0.3,
      updateFrequency: 2000, // ms
    },
    {
      id: 2,
      name: "High Roller",
      style: "aggressive",
      preferredGames: ["roulette", "blackjack"],
      riskTolerance: 0.8,
      updateFrequency: 1500,
    },
    {
      id: 3,
      name: "Card Counter",
      style: "moderate",
      preferredGames: ["blackjack", "slots"],
      riskTolerance: 0.5,
      updateFrequency: 2500,
    },
  ],

  // AI behavior settings
  AI_BEHAVIOR: {
    LOCATION_CHANGE_CHANCE: 0.3, // 30% chance to change activity each update
    WIN_RATES: {
      SLOTS: 0.4, // 40% win rate for AI
      BLACKJACK: 0.45, // 45% win rate for AI
      ROULETTE: 0.4, // 40% win rate for AI
    },
    BET_AMOUNTS: {
      conservative: {
        slots: 1,
        blackjack: 5,
        roulette: 1000,
      },
      moderate: {
        slots: 10,
        blackjack: 50,
        roulette: 5000,
      },
      aggressive: {
        slots: 100,
        blackjack: 500,
        roulette: 25000,
      },
    },
  },

  // UI Configuration
  UI: {
    MESSAGE_DURATION: 2000, // Default message display time
    LONG_MESSAGE_DURATION: 3000, // Longer messages (game results)
    ANIMATION_SPEEDS: {
      FAST: 300,
      NORMAL: 500,
      SLOW: 1000,
    },
    MONEY_UPDATE_ANIMATION: 1000, // Money counting animation duration
    SCREEN_TRANSITION: 500, // Screen change animation
  },

  // Sound effects (for future implementation)
  SOUNDS: {
    ENABLED: false, // Can be toggled by user
    VOLUME: 0.5,
    EFFECTS: {
      WIN: "win.mp3",
      LOSE: "lose.mp3",
      SPIN: "spin.mp3",
      DEAL: "deal.mp3",
      COIN: "coin.mp3",
      JACKPOT: "jackpot.mp3",
    },
  },

  // Game balance settings
  BALANCE: {
    // Minimum bet amounts to prevent micro-betting
    MIN_BETS: {
      SLOTS: 1,
      BLACKJACK: 5,
      ROULETTE: 1000,
    },

    // Maximum bet amounts (if needed)
    MAX_BETS: {
      SLOTS: 10000,
      BLACKJACK: 50000,
      ROULETTE: 100000,
    },

    // Bankruptcy protection
    ALLOW_NEGATIVE_MONEY: false,
    AUTO_TRASH_WHEN_BROKE: false,
  },

  // Statistics tracking (for future features)
  STATS: {
    TRACK_GAMES_PLAYED: true,
    TRACK_BIGGEST_WIN: true,
    TRACK_BIGGEST_LOSS: true,
    TRACK_TOTAL_WAGERED: true,
    TRACK_TIME_PLAYED: true,
  },

  // Development/Debug settings
  DEBUG: {
    ENABLED: false,
    LOG_AI_ACTIONS: false,
    LOG_GAME_EVENTS: false,
    SHOW_PROBABILITIES: false,
    FAST_AI_UPDATES: false, // Speed up AI for testing
  },

  // Responsive breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },

  // Theme settings (for future customization)
  THEME: {
    PRIMARY_COLOR: "#667eea",
    SECONDARY_COLOR: "#764ba2",
    ACCENT_COLOR: "#ffd700",
    SUCCESS_COLOR: "#28a745",
    DANGER_COLOR: "#dc3545",
    WARNING_COLOR: "#ffc107",
  },
};

// Utility functions for config
GameConfig.getBetAmount = function (game, style) {
  return this.AI_BEHAVIOR.BET_AMOUNTS[style][game];
};

GameConfig.getWinRate = function (game) {
  return this.AI_BEHAVIOR.WIN_RATES[game.toUpperCase()];
};

GameConfig.isValidBet = function (game, amount) {
  const validBets = this[`${game.toUpperCase()}_BETS`];
  return validBets && validBets.includes(amount);
};

GameConfig.getMinBet = function (game) {
  return this.BALANCE.MIN_BETS[game.toUpperCase()];
};

GameConfig.getMaxBet = function (game) {
  return this.BALANCE.MAX_BETS[game.toUpperCase()];
};

// Export for global use
if (typeof window !== "undefined") {
  window.GameConfig = GameConfig;
}

// For Node.js environments (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameConfig;
}
