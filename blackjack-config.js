// Blackjack Game Configuration
const BlackjackConfig = {
  // Game Rules
  DEALER_STANDS_ON: 17,
  BLACKJACK_PAYOUT: 2.5, // 2.5x the bet for blackjack
  REGULAR_WIN_PAYOUT: 2.0, // 2x the bet for regular wins

  // Animation Settings
  DEAL_ANIMATION_DELAY: 400, // milliseconds between card deals
  CARD_FLIP_DELAY: 250,

  // Betting Limits
  MIN_BET: 5,
  MAX_BET: 50000,

  // Achievement System
  ACHIEVEMENTS: {
    // Starter Achievements
    FIRST_BLACKJACK: {
      id: "first_blackjack",
      name: "Natural Born Winner",
      desc: "Get your first blackjack (21 with first 2 cards)",
      reward: 100,
      icon: "🎯",
      rarity: "common",
    },

    // Streak Achievements
    WIN_STREAK_3: {
      id: "win_streak_3",
      name: "Hot Streak Master",
      desc: "Win 3 hands in a row",
      reward: 150,
      icon: "🔥",
      rarity: "uncommon",
    },

    WIN_STREAK_5: {
      id: "win_streak_5",
      name: "Unstoppable Force",
      desc: "Win 5 hands in a row",
      reward: 300,
      icon: "⚡",
      rarity: "rare",
    },

    WIN_STREAK_10: {
      id: "win_streak_10",
      name: "Legendary Champion",
      desc: "Win 10 hands in a row",
      reward: 1000,
      icon: "👑",
      rarity: "legendary",
    },

    // Special Hand Achievements
    PERFECT_21: {
      id: "perfect_21",
      name: "Perfect Hand Master",
      desc: "Hit exactly 21 with 5 or more cards",
      reward: 200,
      icon: "🎪",
      rarity: "rare",
    },

    // Betting Achievements
    HIGH_ROLLER: {
      id: "high_roller",
      name: "High Roller Elite",
      desc: "Win with a bet of $25,000 or more",
      reward: 500,
      icon: "💎",
      rarity: "epic",
    },

    DOUBLE_DOWN_MASTER: {
      id: "double_down_master",
      name: "Double Down Demon",
      desc: "Win 5 double down hands in one session",
      reward: 400,
      icon: "⚡",
      rarity: "rare",
    },

    // Dealer-based Achievements
    DEALER_BUST_5: {
      id: "dealer_bust_5",
      name: "Bust Master Supreme",
      desc: "Win by dealer busting 10 times in one session",
      reward: 300,
      icon: "💥",
      rarity: "uncommon",
    },

    DEALER_NIGHTMARE: {
      id: "dealer_nightmare",
      name: "Dealer's Nightmare",
      desc: "Beat the dealer 20 times in one session",
      reward: 600,
      icon: "😈",
      rarity: "epic",
    },

    // Session Achievements
    SESSION_MASTER: {
      id: "session_master",
      name: "Marathon Player",
      desc: "Play 25 hands in one session",
      reward: 200,
      icon: "🎲",
      rarity: "uncommon",
    },

    SESSION_LEGEND: {
      id: "session_legend",
      name: "Session Legend",
      desc: "Play 50 hands in one session",
      reward: 500,
      icon: "🌟",
      rarity: "rare",
    },

    // Comeback Achievements
    COMEBACK_KING: {
      id: "comeback_king",
      name: "Phoenix Rising",
      desc: "Win after losing 5 hands in a row",
      reward: 400,
      icon: "🔄",
      rarity: "epic",
    },

    // Special Achievements
    CARD_COUNTER: {
      id: "card_counter",
      name: "Mathematical Genius",
      desc: "Win 15 hands with perfect basic strategy",
      reward: 750,
      icon: "🧠",
      rarity: "epic",
    },

    LUCKY_SEVENS: {
      id: "lucky_sevens",
      name: "Lucky Sevens",
      desc: "Get dealt 7-7 and win the hand",
      reward: 177,
      icon: "🍀",
      rarity: "uncommon",
    },

    ACE_COLLECTOR: {
      id: "ace_collector",
      name: "Ace in the Hole",
      desc: "Get 10 blackjacks in one session",
      reward: 1000,
      icon: "🅰️",
      rarity: "legendary",
    },

    // Ultimate Achievement
    BLACKJACK_MASTER: {
      id: "blackjack_master",
      name: "Blackjack Grandmaster",
      desc: "Unlock all other blackjack achievements",
      reward: 2500,
      icon: "🏅",
      rarity: "legendary",
    },
  },

  // UI Configuration
  UI: {
    ANIMATION_SPEED: 400,
    FAST_ANIMATION_SPEED: 200,
    SLOW_ANIMATION_SPEED: 800,
    ACHIEVEMENT_DISPLAY_TIME: 3500,

    // Color Scheme
    COLORS: {
      PRIMARY: "#1a5f3f",
      SECONDARY: "#2d8659",
      ACCENT: "#ffd700",
      CARD_RED: "#dc3545",
      CARD_BLACK: "#000000",

      // Achievement Rarity Colors
      RARITY_COMMON: "#74b9ff",
      RARITY_UNCOMMON: "#00b894",
      RARITY_RARE: "#fdcb6e",
      RARITY_EPIC: "#e17055",
      RARITY_LEGENDARY: "#fd79a8",
    },

    // Animation Easing
    EASING: {
      EASE_OUT_CUBIC: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
      EASE_OUT_QUART: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
      EASE_OUT_BACK: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
      BOUNCE: "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
    },
  },

  // Sound System Configuration
  SOUNDS: {
    ENABLED: true,
    VOLUME: 0.7,

    // Sound Effect Mappings
    EFFECTS: {
      CARD_DEAL: "card_flip.mp3",
      CARD_FLIP: "card_flip.mp3",
      WIN: "win_chime.mp3",
      LOSE: "lose_buzz.mp3",
      BLACKJACK: "jackpot_fanfare.mp3",
      ACHIEVEMENT: "achievement_ding.mp3",
      BUTTON_CLICK: "button_click.mp3",
      DEALER_BUST: "dealer_bust.mp3",
      PLAYER_BUST: "player_bust.mp3",
      CHIPS_WIN: "chips_collect.mp3",
    },
  },

  // Performance Settings
  PERFORMANCE: {
    MAX_PARTICLES: 50, // For confetti effects
    CONFETTI_PARTICLE_COUNT: {
      SMALL: 15,
      MEDIUM: 30,
      LARGE: 50,
      MASSIVE: 100,
    },
  },

  // Dealer Personalities Configuration
  DEALERS: {
    PERSONALITY_ROTATION: true,
    PERSONALITY_CHANGE_FREQUENCY: 5, // Every 5 games

    CHAT_FREQUENCY: {
      DEAL: 0.8, // 80% chance of chat on deal
      WIN: 0.9, // 90% chance of chat on win
      LOSE: 0.7, // 70% chance of chat on loss
      BLACKJACK: 1.0, // Always chat on blackjack
      BUST: 0.8, // 80% chance of chat on bust
    },

    MESSAGE_DURATION: {
      SHORT: 2000,
      MEDIUM: 3500,
      LONG: 5000,
      CELEBRATION: 6000,
    },
  },

  // Tutorial & Help System
  TUTORIAL: {
    ENABLED: true,
    SHOW_TIPS: true,
    TIP_ROTATION_INTERVAL: 10000, // 10 seconds
    BASIC_STRATEGY_HINTS: true,
    PROBABILITY_DISPLAY: true,
  },

  // Utility Functions
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
  module.exports = BlackjackConfig;
} else if (typeof window !== "undefined") {
  window.BlackjackConfig = BlackjackConfig;
}
