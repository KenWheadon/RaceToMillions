const SG_CONFIG = {
  gameId: "slots_gold",
  gameName: "Golden Slots",
  version: "1.0.0",

  symbols: [
    {
      name: "💎",
      rarity: 0.02, // Reduced to lower RTP
      payout: 50,
      description: "Diamond - Ultra Rare",
      multipliers: { 3: 3, 4: 6, 5: 12 }, // Payout multipliers for matches
    },
    {
      name: "👑",
      rarity: 0.05, // Reduced
      payout: 25,
      description: "Crown - Very Rare",
      multipliers: { 3: 3, 4: 6, 5: 12 },
    },
    {
      name: "💰",
      rarity: 0.08, // Reduced
      payout: 15,
      description: "Money Bag - Rare",
      multipliers: { 3: 3, 4: 6, 5: 12 },
    },
    {
      name: "🎰",
      rarity: 0.15,
      payout: 10,
      description: "Slot Machine - Uncommon",
      multipliers: { 3: 3, 4: 6, 5: 12 },
    },
    {
      name: "🔥",
      rarity: 0.25, // Increased
      payout: 5,
      description: "Fire - Common",
      multipliers: { 3: 3, 4: 6, 5: 12 },
    },
    {
      name: "⭐",
      rarity: 0.45, // Increased
      payout: 2,
      description: "Star - Very Common",
      multipliers: { 3: 3, 4: 6, 5: 12 },
    },
  ],

  mechanics: {
    reelCount: 5,
    paylineCount: 1,
    minMatchCount: 3, // Updated from 2
    maxMatchCount: 5, // Updated from 3
    baseRTP: 0.5,
    startingGold: 10,
    spinCost: 1,
  },

  betting: {
    betAmounts: [1, 100, 10000],
    betLabels: ["$1", "$100", "$10,000"],
    defaultBetIndex: 0,
  },

  prestige: {
    baseCosts: [10, 100, 1000],
    costMultiplier: 10,
    bonusPerPrestige: 0.5,
    maxDisplayedCost: 3,
  },

  leveling: {
    baseExpNeeded: 1,
    expFormula: "level * 3 + 1",
    bonusPerLevel: 0.05,
    expPerSpin: 1,
  },

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

  achievements: {
    symbolAchievements: {
      match3Multiplier: 2, // Updated from match2
      match4Multiplier: 4,
      match5Multiplier: 8,
    },
    moneyMilestones: [100, 500, 1000, 5000, 10000, 50000, 100000],
    moneyRewardMultiplier: 0.1,
    winStreakTargets: [5, 10, 20, 50, 100],
    loseStreakTargets: [5, 10, 20, 50, 100],
    streakRewardMultiplier: 2,
  },

  toasts: {
    duration: 3000,
    animationDuration: 300,
    maxVisible: 5,
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

  ui: {
    colors: {
      primary: "#ffd700",
      secondary: "#ffed4e",
      background: "#2c1810",
      backgroundLight: "#3d2817",
      success: "#00ff00",
      error: "#ff6b6b",
      achievement: "#ff00ff",
      levelup: "#00ffff",
      prestige: "#ffd700",
    },
    animations: {
      spinDuration: 800,
      reelSpinInterval: 50,
      reelStaggerDelay: 100,
      toastSlideDistance: "100%",
    },
  },

  saveSystem: {
    enabled: true,
    saveKey: "slots_gold_save",
    autoSaveInterval: 30000,
    saveVersion: 1,
  },

  debug: {
    enabled: false,
    logLevel: "info",
    showHitRates: false,
    godMode: false,
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SG_CONFIG;
}

if (typeof window !== "undefined") {
  window.SG_CONFIG = SG_CONFIG;
}
