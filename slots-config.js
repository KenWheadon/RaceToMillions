// Slots Game Configuration
const SlotsConfig = {
  // Game Rules
  REELS: 3,
  SYMBOLS_PER_REEL: 5,

  // Betting Limits
  MIN_BET: 1,
  MAX_BET: 10000,

  // Slot Symbols and their properties
  SYMBOLS: {
    CHERRY: {
      symbol: "🍒",
      name: "Cherry",
      weight: 25, // Higher weight = more common
      value: 1,
      color: "#dc3545",
    },
    LEMON: {
      symbol: "🍋",
      name: "Lemon",
      weight: 20,
      value: 2,
      color: "#ffc107",
    },
    ORANGE: {
      symbol: "🍊",
      name: "Orange",
      weight: 18,
      value: 3,
      color: "#fd7e14",
    },
    PLUM: {
      symbol: "🍇",
      name: "Plum",
      weight: 15,
      value: 4,
      color: "#6f42c1",
    },
    BELL: {
      symbol: "🔔",
      name: "Bell",
      weight: 12,
      value: 5,
      color: "#ffd700",
    },
    BAR: {
      symbol: "💰",
      name: "Money Bag",
      weight: 8,
      value: 8,
      color: "#28a745",
    },
    SEVEN: {
      symbol: "7️⃣",
      name: "Lucky Seven",
      weight: 2,
      value: 15,
      color: "#e74c3c",
    },
    DIAMOND: {
      symbol: "💎",
      name: "Diamond",
      weight: 1,
      value: 25,
      color: "#17a2b8",
    },
  },

  // Payout Rules
  PAYOUTS: {
    // Three of a kind multipliers
    THREE_OF_KIND: {
      CHERRY: 5,
      LEMON: 8,
      ORANGE: 12,
      PLUM: 15,
      BELL: 20,
      BAR: 35,
      SEVEN: 100,
      DIAMOND: 500,
    },

    // Two of a kind multipliers
    TWO_OF_KIND: {
      CHERRY: 1.2,
      LEMON: 1.5,
      ORANGE: 2,
      PLUM: 2.5,
      BELL: 3,
      BAR: 5,
      SEVEN: 10,
      DIAMOND: 25,
    },

    // Special combinations
    SPECIAL: {
      ALL_FRUITS: 8, // Any 3 fruits (cherry, lemon, orange, plum)
      MIXED_PREMIUM: 12, // Bell + Bar + Seven in any order
      JACKPOT: 1000, // Three diamonds
    },
  },

  // Animation Settings
  ANIMATION: {
    SPIN_DURATION: 2000, // Total spin time in ms
    REEL_DELAY: 200, // Delay between each reel stopping
    CELEBRATION_DURATION: 3000,
    SYMBOL_SPIN_SPEED: 100, // Speed of individual symbol changes
  },

  // Achievement System
  ACHIEVEMENTS: {
    FIRST_SPIN: {
      id: "slots_first_spin",
      name: "Slot Rookie",
      desc: "Spin the slots for the first time",
      reward: 50,
      icon: "🎰",
      rarity: "common",
    },

    FIRST_WIN: {
      id: "slots_first_win",
      name: "Beginner's Luck",
      desc: "Win your first slots game",
      reward: 100,
      icon: "🍀",
      rarity: "common",
    },

    CHERRY_WINNER: {
      id: "cherry_triple",
      name: "Cherry Picker",
      desc: "Get three cherries in a row",
      reward: 150,
      icon: "🍒",
      rarity: "uncommon",
    },

    LUCKY_SEVEN: {
      id: "triple_seven",
      name: "Lucky Sevens",
      desc: "Hit triple sevens!",
      reward: 777,
      icon: "7️⃣",
      rarity: "rare",
    },

    DIAMOND_RUSH: {
      id: "triple_diamond",
      name: "Diamond Rush",
      desc: "Hit the diamond jackpot!",
      reward: 2500,
      icon: "💎",
      rarity: "legendary",
    },

    HIGH_ROLLER: {
      id: "slots_high_roller",
      name: "Slots High Roller",
      desc: "Win with maximum bet",
      reward: 1000,
      icon: "👑",
      rarity: "epic",
    },

    FRUIT_SALAD: {
      id: "fruit_salad",
      name: "Fruit Salad Master",
      desc: "Get all fruits combination 5 times",
      reward: 300,
      icon: "🥗",
      rarity: "uncommon",
    },

    SPIN_MASTER: {
      id: "spin_master",
      name: "Spin Master",
      desc: "Spin 100 times in one session",
      reward: 500,
      icon: "🌪️",
      rarity: "rare",
    },

    WIN_STREAK_5: {
      id: "slots_win_streak_5",
      name: "Slot Streak",
      desc: "Win 5 spins in a row",
      reward: 400,
      icon: "🔥",
      rarity: "rare",
    },

    BIG_WIN: {
      id: "slots_big_win",
      name: "Big Winner",
      desc: "Win 50x your bet in a single spin",
      reward: 600,
      icon: "💰",
      rarity: "epic",
    },

    MARATHON_PLAYER: {
      id: "slots_marathon",
      name: "Slot Marathon",
      desc: "Play for 30 minutes straight",
      reward: 350,
      icon: "⏰",
      rarity: "uncommon",
    },
  },

  // UI Configuration
  UI: {
    COLORS: {
      PRIMARY: "#8b0000", // Deep red
      SECONDARY: "#ffd700", // Gold
      ACCENT: "#ff6b35", // Orange-red
      SUCCESS: "#28a745",
      BACKGROUND: "#1a1a2e",
      REEL_BACKGROUND: "#16213e",

      // Symbol colors match their definitions above
      SYMBOL_GLOW: "#ffd700",
      WIN_LINE: "#00ff00",

      // Achievement rarity colors
      RARITY_COMMON: "#74b9ff",
      RARITY_UNCOMMON: "#00b894",
      RARITY_RARE: "#fdcb6e",
      RARITY_EPIC: "#e17055",
      RARITY_LEGENDARY: "#fd79a8",
    },

    ANIMATION_SPEED: 300,
    FAST_ANIMATION: 150,
    SLOW_ANIMATION: 600,
  },

  // Sound Effects
  SOUNDS: {
    ENABLED: true,
    VOLUME: 0.8,

    EFFECTS: {
      SPIN_START: "slot_spin_start.mp3",
      REEL_STOP: "reel_stop.mp3",
      WIN_SMALL: "small_win.mp3",
      WIN_MEDIUM: "medium_win.mp3",
      WIN_BIG: "big_win.mp3",
      WIN_JACKPOT: "jackpot.mp3",
      COIN_DROP: "coin_drop.mp3",
      BUTTON_CLICK: "button_click.mp3",
      ACHIEVEMENT: "achievement.mp3",
      LOSE: "lose_sound.mp3",
    },
  },

  // Game Statistics
  STATISTICS: {
    TRACK_SYMBOL_FREQUENCY: true,
    TRACK_WIN_PATTERNS: true,
    TRACK_SESSION_TIME: true,
  },

  // Performance Settings
  PERFORMANCE: {
    MAX_CONFETTI_PARTICLES: 40,
    SYMBOL_CACHE_SIZE: 50,
    ANIMATION_FRAME_TARGET: 60,
  },

  // Special Features
  FEATURES: {
    AUTOPLAY: false, // Future feature
    TURBO_MODE: false, // Future feature
    BONUS_ROUNDS: false, // Future feature
    PROGRESSIVE_JACKPOT: false, // Future feature
  },

  // Tips and Help
  TIPS: [
    "💡 Higher value symbols appear less frequently",
    "🎯 Three of a kind pays much more than two of a kind",
    "💎 Diamonds are the rarest and most valuable symbol",
    "🍒 Cherries are the most common winning symbol",
    "7️⃣ Triple sevens are extremely rare but very rewarding",
    "🍓 Any three fruits combination gives a special bonus",
    "💰 Higher bets can lead to bigger wins",
    "🎰 Each spin is completely independent and random",
    "🔔 Bell symbols often lead to decent payouts",
    "⚖️ Manage your bankroll - set limits before playing",
  ],

  // Utility Functions
  getSymbolArray: function () {
    const symbols = [];
    Object.entries(this.SYMBOLS).forEach(([key, symbolData]) => {
      for (let i = 0; i < symbolData.weight; i++) {
        symbols.push({
          key: key,
          ...symbolData,
        });
      }
    });
    return symbols;
  },

  getRandomSymbol: function () {
    const symbolArray = this.getSymbolArray();
    return symbolArray[Math.floor(Math.random() * symbolArray.length)];
  },

  calculatePayout: function (symbols, bet) {
    if (symbols.length !== 3) return 0;

    const [first, second, third] = symbols;

    // Check for three of a kind
    if (first.key === second.key && second.key === third.key) {
      const multiplier = this.PAYOUTS.THREE_OF_KIND[first.key] || 0;

      // Special jackpot for triple diamonds
      if (first.key === "DIAMOND") {
        return bet * this.PAYOUTS.SPECIAL.JACKPOT;
      }

      return bet * multiplier;
    }

    // Check for two of a kind
    let twoOfKindSymbol = null;
    if (first.key === second.key) twoOfKindSymbol = first.key;
    else if (first.key === third.key) twoOfKindSymbol = first.key;
    else if (second.key === third.key) twoOfKindSymbol = second.key;

    if (twoOfKindSymbol) {
      const multiplier = this.PAYOUTS.TWO_OF_KIND[twoOfKindSymbol] || 0;
      return Math.floor(bet * multiplier);
    }

    // Check for special combinations
    const symbolKeys = symbols.map((s) => s.key);

    // All fruits combination
    const fruitSymbols = ["CHERRY", "LEMON", "ORANGE", "PLUM"];
    if (symbolKeys.every((key) => fruitSymbols.includes(key))) {
      return bet * this.PAYOUTS.SPECIAL.ALL_FRUITS;
    }

    // Mixed premium combination
    const premiumSymbols = ["BELL", "BAR", "SEVEN"];
    if (
      symbolKeys.every((key) => premiumSymbols.includes(key)) &&
      new Set(symbolKeys).size === 3
    ) {
      return bet * this.PAYOUTS.SPECIAL.MIXED_PREMIUM;
    }

    return 0; // No win
  },

  getWinType: function (symbols, payout, bet) {
    if (payout === 0) return "none";

    const multiplier = payout / bet;

    if (multiplier >= 100) return "jackpot";
    if (multiplier >= 50) return "big";
    if (multiplier >= 10) return "medium";
    return "small";
  },

  isSpecialCombination: function (symbols) {
    const symbolKeys = symbols.map((s) => s.key);

    // All same (three of a kind)
    if (new Set(symbolKeys).size === 1) return true;

    // All fruits
    const fruitSymbols = ["CHERRY", "LEMON", "ORANGE", "PLUM"];
    if (symbolKeys.every((key) => fruitSymbols.includes(key))) return true;

    // Mixed premium
    const premiumSymbols = ["BELL", "BAR", "SEVEN"];
    if (
      symbolKeys.every((key) => premiumSymbols.includes(key)) &&
      new Set(symbolKeys).size === 3
    )
      return true;

    return false;
  },

  getRandomTip: function () {
    return this.TIPS[Math.floor(Math.random() * this.TIPS.length)];
  },

  getAchievement: function (id) {
    return Object.values(this.ACHIEVEMENTS).find(
      (achievement) => achievement.id === id
    );
  },

  getAchievementsByRarity: function (rarity) {
    return Object.values(this.ACHIEVEMENTS).filter(
      (achievement) => achievement.rarity === rarity
    );
  },

  getTotalAchievementReward: function () {
    return Object.values(this.ACHIEVEMENTS).reduce(
      (total, achievement) => total + achievement.reward,
      0
    );
  },

  getColorByRarity: function (rarity) {
    const rarityColors = {
      common: this.UI.COLORS.RARITY_COMMON,
      uncommon: this.UI.COLORS.RARITY_UNCOMMON,
      rare: this.UI.COLORS.RARITY_RARE,
      epic: this.UI.COLORS.RARITY_EPIC,
      legendary: this.UI.COLORS.RARITY_LEGENDARY,
    };
    return rarityColors[rarity] || this.UI.COLORS.RARITY_COMMON;
  },
};

// Export for different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = SlotsConfig;
} else if (typeof window !== "undefined") {
  window.SlotsConfig = SlotsConfig;
}
