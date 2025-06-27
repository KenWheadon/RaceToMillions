// Roulette Game Configuration
const RouletteConfig = {
  // Game Rules
  RED_NUMBERS: [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ],

  // Betting Limits
  MIN_BET: 1000,
  MAX_BET: 100000,

  // Payout Ratios
  PAYOUTS: {
    EVEN_MONEY: 2, // Red/Black, Odd/Even (1:1 payout + original bet = 2x)
    DOZENS: 3, // 1-12, 13-24, 25-36 (2:1 payout + original bet = 3x)
    SINGLE_NUMBER: 36, // Single number (35:1 payout + original bet = 36x)
    SPLIT: 18, // Two numbers (17:1 payout + original bet = 18x)
    STREET: 12, // Three numbers (11:1 payout + original bet = 12x)
    CORNER: 9, // Four numbers (8:1 payout + original bet = 9x)
    LINE: 6, // Six numbers (5:1 payout + original bet = 6x)
    COLUMN: 3, // Column bet (2:1 payout + original bet = 3x)
  },

  // Animation Settings
  SPIN_DURATION: 2000, // milliseconds for wheel spin
  RESULT_DISPLAY_TIME: 4000, // milliseconds to show result
  HIGHLIGHT_DURATION: 3000, // milliseconds to highlight winning bets

  // UI Configuration
  UI: {
    COLORS: {
      PRIMARY: "#8b0000", // Dark red
      SECONDARY: "#2c5f2d", // Green
      ACCENT: "#ffd700", // Gold
      RED: "#dc3545",
      BLACK: "#000000",
      GREEN: "#28a745",
      TABLE_FELT: "#0d5016",
    },

    ANIMATION_SPEED: 300,
    WHEEL_SPIN_SPEED: 2000,
  },

  // Sound Effects
  SOUNDS: {
    ENABLED: true,
    VOLUME: 0.8,

    EFFECTS: {
      WHEEL_SPIN: "roulette_spin.mp3",
      BALL_DROP: "ball_drop.mp3",
      WIN: "roulette_win.mp3",
      LOSE: "roulette_lose.mp3",
      CHIP_PLACE: "chip_place.mp3",
      BUTTON_CLICK: "button_click.mp3",
    },
  },

  // Wheel Layout (European Roulette)
  WHEEL_ORDER: [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ],

  // Game Statistics Tracking
  STATISTICS: {
    TRACK_HOT_NUMBERS: true,
    TRACK_COLD_NUMBERS: true,
    TRACK_PATTERNS: true,
    HOT_NUMBER_THRESHOLD: 3, // Number must hit 3+ times to be "hot"
    COLD_NUMBER_THRESHOLD: 20, // Number must not hit for 20+ spins to be "cold"
  },

  // Achievement System (if implemented)
  ACHIEVEMENTS: {
    FIRST_WIN: {
      id: "roulette_first_win",
      name: "Beginner's Luck",
      desc: "Win your first roulette bet",
      reward: 100,
      icon: "🍀",
      rarity: "common",
    },

    RED_STREAK: {
      id: "red_streak_5",
      name: "Seeing Red",
      desc: "Win 5 red bets in a row",
      reward: 300,
      icon: "🔴",
      rarity: "uncommon",
    },

    BLACK_STREAK: {
      id: "black_streak_5",
      name: "In the Black",
      desc: "Win 5 black bets in a row",
      reward: 300,
      icon: "⚫",
      rarity: "uncommon",
    },

    HIGH_ROLLER: {
      id: "roulette_high_roller",
      name: "Roulette Royalty",
      desc: "Win with maximum bet",
      reward: 1000,
      icon: "👑",
      rarity: "epic",
    },

    DOZEN_MASTER: {
      id: "dozen_master",
      name: "Dozen Master",
      desc: "Win 10 dozen bets in one session",
      reward: 500,
      icon: "🎯",
      rarity: "rare",
    },

    LUCKY_NUMBER: {
      id: "lucky_number",
      name: "Lucky Number",
      desc: "Hit the same number twice in a row",
      reward: 777,
      icon: "🎰",
      rarity: "legendary",
    },
  },

  // Strategy Tips
  TIPS: [
    "💡 European roulette has better odds than American (no double zero)",
    "🎯 Even money bets (Red/Black, Odd/Even) have the best odds",
    "📊 Dozens and columns pay 2:1 but have lower win probability",
    "🔄 The ball has no memory - each spin is independent",
    "💰 Manage your bankroll - set limits before playing",
    "🎲 Single number bets pay 35:1 but are very risky",
    "⚖️ Outside bets are safer, inside bets pay more",
    "🍀 No betting system can overcome the house edge",
  ],

  // Utility Functions
  isRed: function (number) {
    return this.RED_NUMBERS.includes(number);
  },

  isBlack: function (number) {
    return number !== 0 && !this.isRed(number);
  },

  getNumberColor: function (number) {
    if (number === 0) return "green";
    return this.isRed(number) ? "red" : "black";
  },

  getRandomTip: function () {
    return this.TIPS[Math.floor(Math.random() * this.TIPS.length)];
  },

  calculatePayout: function (betType, betAmount) {
    const multiplier = this.PAYOUTS[betType.toUpperCase()] || 1;
    return betAmount * multiplier;
  },

  // Betting validation
  isValidBet: function (betType, number) {
    const validBets = [
      "red",
      "black",
      "odd",
      "even",
      "1-12",
      "13-24",
      "25-36",
      "column1",
      "column2",
      "column3",
    ];

    if (validBets.includes(betType)) return true;
    if (betType === "single" && number >= 0 && number <= 36) return true;

    return false;
  },

  // Check if bet wins
  checkWin: function (betType, betNumber, winningNumber) {
    switch (betType) {
      case "red":
        return this.isRed(winningNumber);
      case "black":
        return this.isBlack(winningNumber);
      case "odd":
        return winningNumber % 2 === 1 && winningNumber !== 0;
      case "even":
        return winningNumber % 2 === 0 && winningNumber !== 0;
      case "1-12":
        return winningNumber >= 1 && winningNumber <= 12;
      case "13-24":
        return winningNumber >= 13 && winningNumber <= 24;
      case "25-36":
        return winningNumber >= 25 && winningNumber <= 36;
      case "single":
        return winningNumber === betNumber;
      default:
        return false;
    }
  },
};

// Export for different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = RouletteConfig;
} else if (typeof window !== "undefined") {
  window.RouletteConfig = RouletteConfig;
}
