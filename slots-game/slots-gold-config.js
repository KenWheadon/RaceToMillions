// slots_gold_config.js - Configuration file for Gold Slots Game

const SG_CONFIG = {
  // Game identification
  gameId: "slots_gold",
  gameName: "Golden Slots",
  version: "1.0.0",

  // Symbol configuration with rarity and payouts
  symbols: [
    {
      name: "💎",
      rarity: 0.05,
      payout: 50,
      description: "Diamond - Ultra Rare",
    },
    {
      name: "👑",
      rarity: 0.08,
      payout: 25,
      description: "Crown - Very Rare",
    },
    {
      name: "💰",
      rarity: 0.12,
      payout: 15,
      description: "Money Bag - Rare",
    },
    {
      name: "🎰",
      rarity: 0.15,
      payout: 10,
      description: "Slot Machine - Uncommon",
    },
    {
      name: "🔥",
      rarity: 0.2,
      payout: 5,
      description: "Fire - Common",
    },
    {
      name: "⭐",
      rarity: 0.4,
      payout: 2,
      description: "Star - Very Common",
    },
  ],

  // Game mechanics
  mechanics: {
    reelCount: 5,
    paylineCount: 1,
    minMatchCount: 2,
    maxMatchCount: 3,
    baseRTP: 0.5, // Return to Player percentage
    startingGold: 10,
    spinCost: 1,
  },

  // Betting system
  betting: {
    betAmounts: [1, 100, 10000],
    betLabels: ["$1", "$100", "$10,000"],
    defaultBetIndex: 0,
  },

  // Prestige system
  prestige: {
    baseCosts: [10, 100, 1000], // First 3 prestige costs
    costMultiplier: 10, // Each subsequent prestige costs 10x more
    bonusPerPrestige: 0.5, // 50% bonus per prestige level
    maxDisplayedCost: 3, // Show specific costs for first 3 levels
  },

  // Level system
  leveling: {
    baseExpNeeded: 1, // EXP needed to complete level 0
    expFormula: "level * 3 + 1", // Formula: current_level * 3 + 1
    bonusPerLevel: 0.05, // 5% bonus per level
    expPerSpin: 1,
  },

  // Begging system (when player runs out of money)
  begging: {
    enabled: true,
    chances: [
      { amount: 0, chance: 0.45, message: "Nothing..." },
      { amount: 0.1, chance: 0.25, message: "A few cents" },
      { amount: 0.25, chance: 0.2, message: "Quarter!" },
      { amount: 1, chance: 0.1, message: "A whole dollar!" },
    ],
    messages: [
      "Please sir, just a coin...",
      "I'll do anything for gold...",
      "Have mercy on a poor soul...",
      "Spare some change?",
      "I'm desperate here...",
      "Just one more dollar...",
      "My family needs food...",
      "I haven't eaten in days...",
      "Help a fellow gambler out?",
      "The slots took everything...",
    ],
  },

  // Achievement system
  achievements: {
    // Symbol-based achievements (auto-generated)
    symbolAchievements: {
      match2Multiplier: 1, // Reward = symbol payout * 1
      match3Multiplier: 2, // Reward = symbol payout * 2
    },

    // Money milestones
    moneyMilestones: [100, 500, 1000, 5000, 10000, 50000, 100000],
    moneyRewardMultiplier: 0.1, // Reward = milestone * 0.1

    // Streak achievements
    winStreakTargets: [5, 10, 20, 50, 100],
    loseStreakTargets: [5, 10, 20, 50, 100],
    streakRewardMultiplier: 2, // Reward = streak count * 2
  },

  // Toast/notification system
  toasts: {
    duration: 3000, // 3 seconds
    animationDuration: 300,
    maxVisible: 5,

    // Toast messages for different scenarios
    neutralMessages: [
      "Lucky spin!",
      "Keep going!",
      "Fortune favors the bold!",
      "The crowd cheers!",
      "Jackpot incoming?",
      "Roll those reels!",
      "Golden opportunity!",
      "Spin to win!",
      "Lady Luck smiles!",
      "One more time!",
      "Feeling lucky?",
      "The reels are hot!",
      "Gold rush!",
      "Spin those symbols!",
      "Victory awaits!",
    ],

    bigWinMessages: [
      "INCREDIBLE WIN!",
      "JACKPOT!",
      "AMAZING!",
      "SPECTACULAR!",
      "The crowd goes wild!",
      "Unbelievable luck!",
      "MASSIVE WIN!",
      "You're on fire!",
      "GOLDEN MOMENT!",
      "LEGENDARY SPIN!",
    ],

    losingStreakMessages: [
      "Don't give up!",
      "Your luck will change!",
      "Stay strong!",
      "The next spin is the one!",
      "Keep your chin up!",
      "Fortune is coming!",
      "Believe in yourself!",
      "The tide will turn!",
      "Patience pays off!",
    ],
  },

  // UI Configuration
  ui: {
    colors: {
      primary: "#ffd700", // Gold
      secondary: "#ffed4e", // Light Gold
      background: "#2c1810", // Dark Brown
      backgroundLight: "#3d2817",
      success: "#00ff00", // Green
      error: "#ff6b6b", // Red
      achievement: "#ff00ff", // Magenta
      levelup: "#00ffff", // Cyan
      prestige: "#ffd700", // Gold
    },

    animations: {
      spinDuration: 800, // Milliseconds
      reelSpinInterval: 50, // Symbol change interval during spin
      reelStaggerDelay: 100, // Delay between each reel starting
      toastSlideDistance: "100%",
    },
  },

  // Save/Load system configuration
  saveSystem: {
    enabled: true,
    saveKey: "slots_gold_save",
    autoSaveInterval: 30000, // Auto-save every 30 seconds
    saveVersion: 1,
  },

  // Debug and development
  debug: {
    enabled: false,
    logLevel: "info", // 'debug', 'info', 'warn', 'error'
    showHitRates: false,
    godMode: false, // Infinite money, always win, etc.
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = SG_CONFIG;
}

// Global access in browser
if (typeof window !== "undefined") {
  window.SG_CONFIG = SG_CONFIG;
}
