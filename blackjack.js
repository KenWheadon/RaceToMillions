class BlackjackGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.gameState = null;
    this.screenElement = null;
    this.soundEnabled = BlackjackConfig.SOUNDS.ENABLED;
    this.streakCounter = 0;
    this.bestStreak = 0;
    this.achievements = [];
    this.achievementRewards = 0; // Track total achievement rewards
    this.handCount = 0;
    this.sessionStats = {
      handsPlayed: 0,
      handsWon: 0,
      blackjacks: 0,
      busts: 0,
      perfectTwentyOnes: 0,
      dealerBusts: 0,
    };
    this.dealerPersonality = this.getRandomDealerPersonality();
    this.init();
  }

  init() {
    this.initializeAchievements();
    this.showWelcomeMessage();
  }

  showWelcomeMessage() {
    console.log(
      `🎰 Welcome to ${this.dealerPersonality.name}'s Blackjack Table! 🎰`
    );
  }

  // Enhanced dealer personalities with more character
  getRandomDealerPersonality() {
    const personalities = [
      {
        name: "Lucky Luke",
        avatar: "🤠",
        winQuotes: [
          "Well I'll be! Great hand!",
          "You're one lucky cowpoke!",
          "Yeehaw! That's a winner!",
        ],
        loseQuotes: [
          "Better luck next time, partner!",
          "House always wins in the end!",
          "Don't let it get ya down!",
        ],
        dealQuotes: [
          "Let's see what Lady Luck brings!",
          "Cards are flying!",
          "Saddle up for another round!",
        ],
        blackjackQuotes: [
          "Holy moly! That's a natural!",
          "Jackpot! You hit the motherlode!",
        ],
        bustQuotes: [
          "Ouch! That's a tough break!",
          "Sometimes the cards just ain't friendly!",
        ],
      },
      {
        name: "Smooth Sophia",
        avatar: "💃",
        winQuotes: [
          "Magnificent play, darling! ✨",
          "You're absolutely dazzling! 💎",
          "Simply exquisite! 🌟",
        ],
        loseQuotes: [
          "Oh darling, such drama! 🎭",
          "The cards can be so cruel! 💔",
          "Don't worry, you'll bounce back! 💪",
        ],
        dealQuotes: [
          "Let's dance with destiny! 💃",
          "The stage is set! 🎪",
          "Time for some magic! ✨",
        ],
        blackjackQuotes: [
          "Absolutely STUNNING! 🎉",
          "You're a natural star! ⭐",
        ],
        bustQuotes: [
          "Oh my! That's quite the plot twist! 🎭",
          "Even stars have their off moments! 🌟",
        ],
      },
      {
        name: "Professor Poker",
        avatar: "🎓",
        winQuotes: [
          "Excellent calculation!",
          "A+ performance!",
          "Statistically impressive!",
        ],
        loseQuotes: [
          "Probability wasn't in your favor.",
          "An interesting data point.",
          "Let's analyze the next hand.",
        ],
        dealQuotes: [
          "Initiating card distribution.",
          "Calculating probabilities...",
          "Data incoming!",
        ],
        blackjackQuotes: [
          "Perfect mathematical outcome!",
          "21 - the golden number!",
        ],
        bustQuotes: [
          "Exceeding optimal parameters!",
          "Statistical variance at work!",
        ],
      },
      {
        name: "Cheerful Charlie",
        avatar: "😊",
        winQuotes: [
          "WOOHOO! Amazing! 🎉",
          "You're incredible! 🌟",
          "Best hand ever! 🔥",
        ],
        loseQuotes: [
          "Aww, so close! 😅",
          "Next one's yours! 💪",
          "Keep that smile! 😊",
        ],
        dealQuotes: [
          "Here comes the fun! 🎲",
          "Let's play! 🎮",
          "Exciting times! 🎪",
        ],
        blackjackQuotes: ["BLACKJACK PARTY! 🎊", "You're on FIRE! 🔥"],
        bustQuotes: ["Oopsie daisy! 😅", "These things happen! 🤷‍♂️"],
      },
    ];
    return personalities[Math.floor(Math.random() * personalities.length)];
  }

  // Enhanced achievement system with better rewards and tracking
  initializeAchievements() {
    this.possibleAchievements = Object.values(BlackjackConfig.ACHIEVEMENTS);
  }

  // Enhanced HTML template with improved visual elements
  getHTMLTemplate() {
    // Safe fallback values in case gameSettings is not initialized
    const currentBet =
      this.game.gameSettings?.blackjackBet || BlackjackConfig.MIN_BET || 5;
    const playerMoney = this.game.playerMoney || 0;

    return `
      <div id="blackjack-screen" class="screen">
        <div class="container">
          <button id="blackjack-back" class="back-button">← Cash Out & Exit</button>
          
          <!-- Enhanced Header with Session Stats -->
          <div class="game-header">
            <div class="dealer-info">
              <span class="dealer-avatar">${
                this.dealerPersonality.avatar
              }</span>
              <div class="dealer-details">
                <h2>🃏 Blackjack Royale</h2>
                <p class="dealer-name">Dealer: ${
                  this.dealerPersonality.name
                }</p>
                <div class="session-stats">
                  <span>Hands: <strong id="hands-played">0</strong></span>
                  <span>Won: <strong id="hands-won">0</strong></span>
                  <span>Win Rate: <strong id="win-rate">0%</strong></span>
                </div>
              </div>
            </div>
            <div class="player-stats">
              <p class="money-display magic-text">Money: <span id="blackjack-money">${playerMoney.toFixed(
                2
              )}</span></p>
              <p class="bet-display">Bet: $<span id="blackjack-current-bet">${currentBet}</span></p>
              <p class="streak-display">Streak: <span id="current-streak">0</span> | Best: <span id="best-streak">0</span></p>
              <p class="rewards-display">🏆 Rewards: $<span id="achievement-rewards">0</span></p>
            </div>
          </div>
          
          <!-- Enhanced Dealer Chat with Personality -->
          <div id="dealer-chat" class="dealer-chat">
            <div class="chat-bubble">
              <span id="dealer-message">Welcome to my table! Ready to test your luck?</span>
            </div>
          </div>
          
          <div id="blackjack-table" class="blackjack-table">
            <!-- Dealer Section with Card Count -->
            <div class="dealer-section">
              <div class="section-header">
                <h3>Dealer ${this.dealerPersonality.avatar}</h3>
                <div class="total-display">
                  <span class="total-label">Total:</span>
                  <span id="dealer-total" class="total-value">0</span>
                  <span class="card-count" id="dealer-card-count">(0 cards)</span>
                </div>
              </div>
              <div id="dealer-cards" class="card-area dealer-area">
                <div class="card-placeholder">Dealer cards will appear here</div>
              </div>
            </div>
            
            <!-- Enhanced Player Section -->
            <div class="player-section">
              <div class="section-header">
                <h3>You 🎮</h3>
                <div class="total-display">
                  <span class="total-label">Total:</span>
                  <span id="player-total" class="total-value">0</span>
                  <span class="card-count" id="player-card-count">(0 cards)</span>
                  <div class="hand-strength" id="hand-strength"></div>
                </div>
              </div>
              <div id="player-cards" class="card-area player-area">
                <div class="card-placeholder">Your cards will appear here</div>
              </div>
            </div>
            
            <!-- Enhanced Game Controls with More Options -->
            <div class="game-controls">
                              <button id="deal-button" class="deal-button pulse-button">
                <span class="button-icon">🎲</span>
                <span class="button-text">Deal Cards</span>
                <span class="button-cost">($<span id="deal-cost">${currentBet}</span>)</span>
              </button>
              
              <div id="game-actions" class="game-actions" style="display: none;">
                <button id="hit-button" class="action-button hit-btn">
                  <span class="button-icon">👊</span>
                  <span class="button-text">HIT</span>
                </button>
                <button id="stand-button" class="action-button stand-btn">
                  <span class="button-icon">✋</span>
                  <span class="button-text">STAND</span>
                </button>
                <button id="double-down-button" class="action-button double-btn">
                  <span class="button-icon">⚡</span>
                  <span class="button-text">DOUBLE</span>
                </button>
              </div>
              
              <!-- Enhanced Game Status -->
              <div id="game-status" class="game-status">
                <div class="status-indicator" id="status-indicator">
                  <span class="status-text">Ready to Play</span>
                  <div class="status-glow"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Achievements Panel with Cash Out Preview -->
          <div id="achievements-panel" class="achievements-panel">
            <h4>🏆 Achievement Vault</h4>
            <div class="achievement-summary">
              <p>Current Session: <span id="achievement-count">0</span> achievements</p>
              <p class="reward-preview">Cash Out Value: $<span id="cashout-preview">0</span></p>
            </div>
            <div id="achievements-list" class="achievements-list">
              <div class="no-achievements">Complete achievements to earn bonus money!</div>
            </div>
          </div>
          
          <!-- Enhanced Tips & Strategy -->
          <div id="strategy-panel" class="strategy-panel">
            <h4>📊 Live Strategy</h4>
            <div id="strategy-content">
              <div class="tip-section">
                <p class="current-tip" id="current-tip">💡 Dealer must hit on 16 and stand on 17</p>
              </div>
              <div id="hand-analysis" class="hand-analysis">
                <p>Win Probability: <span class="probability-value" id="win-probability">--</span></p>
                <p>Recommended: <span class="action-recommendation" id="recommended-action">--</span></p>
                <p>Risk Level: <span class="risk-level" id="risk-level">--</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createScreen() {
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.innerHTML = this.getHTMLTemplate();
      this.screenElement = document.getElementById("blackjack-screen");
      this.bindEvents();
      this.updateTips();
      this.resetAchievements(); // Reset achievements on entry
    }
  }

  destroyScreen() {
    if (this.screenElement) {
      this.screenElement.remove();
      this.screenElement = null;
    }
    this.gameState = null;
  }

  show() {
    this.createScreen();
    if (this.screenElement) {
      this.screenElement.classList.add("active");
      this.onShow();
      this.showDealerMessage(this.dealerPersonality.dealQuotes);
      // Enhanced entrance animation
      AnimationUtils.slideIn(this.screenElement, "bottom", 600);
    }
  }

  hide() {
    if (this.screenElement) {
      // Cash out achievements before hiding
      this.cashOutAchievements();

      this.screenElement.classList.remove("active");
      setTimeout(() => {
        this.destroyScreen();
      }, 100);
    }
  }

  // New method to reset achievements when entering the game
  resetAchievements() {
    this.achievements = [];
    this.achievementRewards = 0;
    this.streakCounter = 0;
    this.sessionStats = {
      handsPlayed: 0,
      handsWon: 0,
      blackjacks: 0,
      busts: 0,
      perfectTwentyOnes: 0,
      dealerBusts: 0,
    };
    this.updateAchievementDisplay();
    this.updateSessionStats();
  }

  // Cash out achievements and give player the money
  cashOutAchievements() {
    if (this.achievementRewards > 0) {
      this.game.winMoney(this.achievementRewards);
      this.game.showMessage(
        `🏆 Achievement Bonus: +$${this.achievementRewards}! Total achievements: ${this.achievements.length}`,
        GameConfig.UI.LONG_MESSAGE_DURATION
      );

      // Show celebration for cash out
      const container = document.getElementById("blackjack-table");
      if (container) {
        AnimationUtils.createConfetti(container, 20);
      }
    } else if (this.achievements.length > 0) {
      this.game.showMessage(
        `🎯 You earned ${this.achievements.length} achievements! Keep playing to unlock rewards!`,
        GameConfig.UI.NORMAL_MESSAGE_DURATION
      );
    }
  }

  bindEvents() {
    const dealButton = document.getElementById("deal-button");
    const hitButton = document.getElementById("hit-button");
    const standButton = document.getElementById("stand-button");
    const doubleButton = document.getElementById("double-down-button");
    const backButton = document.getElementById("blackjack-back");

    if (dealButton) {
      dealButton.addEventListener("click", (e) => {
        AnimationUtils.rippleEffect(dealButton, e);
        this.dealCards();
      });
    }
    if (hitButton) {
      hitButton.addEventListener("click", (e) => {
        AnimationUtils.rippleEffect(hitButton, e);
        this.hit();
      });
    }
    if (standButton) {
      standButton.addEventListener("click", (e) => {
        AnimationUtils.rippleEffect(standButton, e);
        this.stand();
      });
    }
    if (doubleButton) {
      doubleButton.addEventListener("click", (e) => {
        AnimationUtils.rippleEffect(doubleButton, e);
        this.doubleDown();
      });
    }
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.showExitConfirmation();
      });
    }
  }

  // Enhanced exit confirmation
  showExitConfirmation() {
    const rewardText =
      this.achievementRewards > 0
        ? `You'll receive $${this.achievementRewards} in achievement bonuses!`
        : "No achievement bonuses this session.";

    const confirmMessage = `Ready to cash out?\n\n${rewardText}\n\nLeave the table?`;

    if (confirm(confirmMessage)) {
      this.game.showScreen("hub");
    }
  }

  // Enhanced dealer message system with more personality
  showDealerMessage(messages, duration = 3500, type = "normal") {
    const messageElement = document.getElementById("dealer-message");
    const chatBubble = document.getElementById("dealer-chat");

    if (messageElement && chatBubble) {
      const message = Array.isArray(messages)
        ? messages[Math.floor(Math.random() * messages.length)]
        : messages;

      messageElement.textContent = message;
      chatBubble.classList.remove("show", "excited", "disappointed");
      chatBubble.classList.add("show", type);

      setTimeout(() => {
        chatBubble.classList.remove("show", type);
      }, duration);
    }
  }

  // Enhanced card dealing with better animations
  dealCards() {
    // Safe fallback for bet amount
    const bet =
      this.game.gameSettings?.blackjackBet || BlackjackConfig.MIN_BET || 5;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage(
        "Not enough money! Try a smaller bet or search for trash!",
        GameConfig.UI.LONG_MESSAGE_DURATION
      );
      this.showDealerMessage("Come back when you have more chips, friend!");
      return;
    }

    this.clearTable();
    this.updateGameStatus("Dealing cards...", "dealing");

    // Enhanced game state
    this.gameState = {
      playerCards: [],
      dealerCards: [],
      gamePhase: "dealing",
      bet: bet,
      startTime: Date.now(),
      cardCount: 0,
      canDoubleDown: true,
      isDoubleDown: false,
    };

    this.sessionStats.handsPlayed++;
    this.updateSessionStats();

    this.showDealerMessage(this.dealerPersonality.dealQuotes, 2000, "excited");
    this.animatedDeal();
  }

  // Enhanced animated dealing with better timing
  animatedDeal() {
    const sequence = [
      () => this.dealCardWithAnimation("player", 0),
      () => this.dealCardWithAnimation("dealer", 0),
      () => this.dealCardWithAnimation("player", 1),
      () => this.dealCardWithAnimation("dealer", 1, true),
      () => {
        this.gameState.gamePhase = "playing";
        this.updateDisplay();
        this.checkInitialBlackjack();
        this.updateHandAnalysis();
        this.updateGameStatus("Your turn!", "playing");
      },
    ];

    sequence.forEach((action, index) => {
      setTimeout(action, index * BlackjackConfig.DEAL_ANIMATION_DELAY);
    });
  }

  // Enhanced card dealing with sound and better animations
  dealCardWithAnimation(target, index, hidden = false) {
    const card = this.drawCard();

    if (target === "player") {
      this.gameState.playerCards[index] = card;
    } else {
      this.gameState.dealerCards[index] = card;
    }

    const containerId = target === "player" ? "player-cards" : "dealer-cards";
    const container = document.getElementById(containerId);

    if (container) {
      const placeholder = container.querySelector(".card-placeholder");
      if (placeholder) {
        placeholder.remove();
      }

      const cardEl = this.createCardElement(card, hidden);
      cardEl.style.opacity = "0";
      cardEl.style.transform = "translateY(-80px) rotateY(180deg) scale(0.8)";

      container.appendChild(cardEl);

      setTimeout(() => {
        cardEl.style.transition =
          "all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        cardEl.style.opacity = "1";
        cardEl.style.transform = "translateY(0) rotateY(0deg) scale(1)";
      }, 100);
    }

    this.playSound("deal");
  }

  // Enhanced game status updates
  updateGameStatus(message, type = "normal") {
    const statusText = document.querySelector(".status-text");
    const statusIndicator = document.getElementById("status-indicator");

    if (statusText && statusIndicator) {
      statusText.textContent = message;
      statusIndicator.className = `status-indicator ${type}`;
    }
  }

  // New double down functionality
  doubleDown() {
    if (
      !this.gameState ||
      this.gameState.gamePhase !== "playing" ||
      !this.gameState.canDoubleDown
    )
      return;
    if (!this.game.canAfford(this.gameState.bet)) {
      this.game.showMessage("Not enough money to double down!");
      return;
    }

    this.gameState.bet *= 2;
    this.gameState.isDoubleDown = true;
    this.gameState.canDoubleDown = false;

    this.showDealerMessage("Doubling down! Bold move!", 2000, "excited");
    this.updateGameStatus("Doubled down! One more card only.", "double");

    // Deal one final card
    const newCard = this.drawCard();
    this.gameState.playerCards.push(newCard);
    this.dealCardWithAnimation("player", this.gameState.playerCards.length - 1);

    setTimeout(() => {
      const playerTotal = this.calculateTotal(this.gameState.playerCards);
      this.updateDisplay();

      if (playerTotal > 21) {
        this.endGame("bust", `💥 Double down bust! You went over 21`);
      } else {
        this.stand(); // Auto-stand after double down
      }
    }, 800);
  }

  // Enhanced hand analysis with risk assessment
  updateHandAnalysis() {
    if (!this.gameState || this.gameState.gamePhase !== "playing") return;

    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerUpCard = this.gameState.dealerCards[0];

    const recommendation = this.getBasicStrategyRecommendation(
      playerTotal,
      dealerUpCard
    );
    const winProbability = this.calculateWinProbability(
      playerTotal,
      dealerUpCard
    );
    const riskLevel = this.calculateRiskLevel(playerTotal, dealerUpCard);

    this.updateAnalysisDisplay(winProbability, recommendation, riskLevel);
    this.updateHandStrength(playerTotal);
  }

  updateAnalysisDisplay(winProbability, recommendation, riskLevel) {
    const probElement = document.getElementById("win-probability");
    const actionElement = document.getElementById("recommended-action");
    const riskElement = document.getElementById("risk-level");

    if (probElement) {
      probElement.textContent = `${winProbability}%`;
      probElement.className = `probability-value ${
        winProbability > 50 ? "positive" : "negative"
      }`;
    }

    if (actionElement) {
      actionElement.textContent = recommendation;
      actionElement.className = `action-recommendation ${recommendation
        .toLowerCase()
        .replace(" ", "-")}`;
    }

    if (riskElement) {
      riskElement.textContent = riskLevel;
      riskElement.className = `risk-level ${riskLevel
        .toLowerCase()
        .replace(" ", "-")}`;
    }
  }

  updateHandStrength(playerTotal) {
    const strengthElement = document.getElementById("hand-strength");
    if (strengthElement) {
      let strength = "";
      if (playerTotal === 21) strength = "🔥 PERFECT";
      else if (playerTotal >= 19) strength = "💪 STRONG";
      else if (playerTotal >= 17) strength = "👍 GOOD";
      else if (playerTotal >= 12) strength = "⚖️ RISKY";
      else strength = "🔄 BUILDING";

      strengthElement.textContent = strength;
    }
  }

  calculateRiskLevel(playerTotal, dealerUpCard) {
    if (playerTotal >= 17) return "LOW";
    if (playerTotal <= 11) return "SAFE";
    if (dealerUpCard >= 7) return "HIGH";
    return "MEDIUM";
  }

  // Enhanced display updates
  updateDisplay() {
    if (!this.gameState) return;

    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    this.animateTotal("player-total", playerTotal);
    this.animateTotal(
      "dealer-total",
      this.gameState.gamePhase === "playing"
        ? this.calculateTotal([this.gameState.dealerCards[0]])
        : dealerTotal
    );

    this.updateCardCounts();
    this.updateButtons();
    this.updateStreakDisplay();
  }

  updateCardCounts() {
    const playerCount = document.getElementById("player-card-count");
    const dealerCount = document.getElementById("dealer-card-count");

    if (playerCount && this.gameState) {
      playerCount.textContent = `(${this.gameState.playerCards.length} cards)`;
    }
    if (dealerCount && this.gameState) {
      dealerCount.textContent = `(${this.gameState.dealerCards.length} cards)`;
    }
  }

  updateButtons() {
    const dealButton = document.getElementById("deal-button");
    const gameActions = document.getElementById("game-actions");
    const doubleButton = document.getElementById("double-down-button");

    if (dealButton) {
      dealButton.style.display =
        this.gameState?.gamePhase === "playing" ? "none" : "flex";
    }

    if (gameActions) {
      gameActions.style.display =
        this.gameState?.gamePhase === "playing" ? "flex" : "none";
    }

    if (doubleButton && this.gameState) {
      doubleButton.style.display =
        this.gameState.canDoubleDown && this.game.canAfford(this.gameState.bet)
          ? "flex"
          : "none";
    }
  }

  // Enhanced end game with better rewards and celebrations
  endGame(result, message) {
    this.gameState.gamePhase = "ended";
    let winAmount = 0;
    let celebration = false;

    switch (result) {
      case "blackjack":
        winAmount = this.gameState.bet * BlackjackConfig.BLACKJACK_PAYOUT;
        celebration = true;
        this.streakCounter++;
        this.sessionStats.handsWon++;
        this.sessionStats.blackjacks++;
        this.unlockAchievement("first_blackjack");
        this.showDealerMessage(
          this.dealerPersonality.blackjackQuotes,
          4000,
          "excited"
        );
        break;
      case "win":
        winAmount = this.gameState.bet * BlackjackConfig.REGULAR_WIN_PAYOUT;
        celebration = true;
        this.streakCounter++;
        this.sessionStats.handsWon++;
        this.showDealerMessage(
          this.dealerPersonality.winQuotes,
          3000,
          "excited"
        );
        break;
      case "push":
        winAmount = this.gameState.bet;
        this.showDealerMessage("Fair game! It's a push!");
        break;
      case "lose":
      case "bust":
        winAmount = 0;
        this.streakCounter = 0;
        if (result === "bust") {
          this.sessionStats.busts++;
          this.showDealerMessage(
            this.dealerPersonality.bustQuotes,
            3000,
            "disappointed"
          );
        } else {
          this.showDealerMessage(
            this.dealerPersonality.loseQuotes,
            3000,
            "disappointed"
          );
        }
        break;
    }

    this.checkStreakAchievements();
    this.checkSpecialAchievements(result);

    if (this.streakCounter > this.bestStreak) {
      this.bestStreak = this.streakCounter;
    }

    this.game.spendMoney(this.gameState.bet);
    if (winAmount > 0) {
      this.game.winMoney(winAmount);
    }

    if (celebration) {
      this.celebrateWin(result, winAmount);
    } else if (result === "lose" || result === "bust") {
      this.showLossEffect();
    }

    this.updateGameStatus(message, result);
    this.updateSessionStats();
    this.game.showMessage(message, GameConfig.UI.LONG_MESSAGE_DURATION);

    setTimeout(() => {
      this.resetGame();
    }, GameConfig.UI.LONG_MESSAGE_DURATION);
  }

  checkStreakAchievements() {
    if (this.streakCounter >= 3) this.unlockAchievement("win_streak_3");
    if (this.streakCounter >= 5) this.unlockAchievement("win_streak_5");
    if (this.streakCounter >= 10) this.unlockAchievement("win_streak_10");
  }

  checkSpecialAchievements(result) {
    if (result === "win" && this.gameState.isDoubleDown) {
      // Track double down wins (would need counter for achievement)
    }
    const maxBet =
      this.game.gameSettings?.maxBet || BlackjackConfig.MAX_BET || 50000;
    if (this.gameState.bet >= maxBet && result === "win") {
      this.unlockAchievement("high_roller");
    }
    if (this.sessionStats.handsPlayed >= 25) {
      this.unlockAchievement("session_master");
    }
  }

  // Enhanced achievement system
  unlockAchievement(achievementId) {
    if (this.achievements.includes(achievementId)) return;

    const achievement = this.possibleAchievements.find(
      (a) => a.id === achievementId
    );
    if (achievement) {
      this.achievements.push(achievementId);
      this.achievementRewards += achievement.reward;
      this.showAchievement(achievement);
      this.updateAchievementDisplay();
    }
  }

  showAchievement(achievement) {
    const achievementsList = document.getElementById("achievements-list");
    if (achievementsList) {
      // Remove no-achievements message
      const noAchievements = achievementsList.querySelector(".no-achievements");
      if (noAchievements) noAchievements.remove();

      const achievementEl = document.createElement("div");
      achievementEl.className = `achievement-item new ${achievement.rarity}`;
      achievementEl.innerHTML = `
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
          <strong>${achievement.name}</strong>
          <small>${achievement.desc}</small>
          <div class="achievement-reward">+$${achievement.reward}</div>
        </div>
      `;

      achievementsList.insertBefore(achievementEl, achievementsList.firstChild);

      setTimeout(() => {
        achievementEl.classList.remove("new");
      }, 100);

      // Show floating achievement notification
      this.showFloatingAchievement(achievement);

      if (achievementsList.children.length > 5) {
        achievementsList.lastChild.remove();
      }
    }
  }

  showFloatingAchievement(achievement) {
    const rect = document
      .getElementById("achievements-panel")
      ?.getBoundingClientRect();
    if (rect) {
      AnimationUtils.floatingText(
        `🏆 ${achievement.name} +$${achievement.reward}`,
        rect.left + rect.width / 2,
        rect.top,
        "#ffd700",
        3000
      );
    }
  }

  updateAchievementDisplay() {
    const countElement = document.getElementById("achievement-count");
    const previewElement = document.getElementById("cashout-preview");
    const rewardsElement = document.getElementById("achievement-rewards");

    if (countElement) countElement.textContent = this.achievements.length;
    if (previewElement) previewElement.textContent = this.achievementRewards;
    if (rewardsElement) rewardsElement.textContent = this.achievementRewards;
  }

  updateSessionStats() {
    const handsPlayedEl = document.getElementById("hands-played");
    const handsWonEl = document.getElementById("hands-won");
    const winRateEl = document.getElementById("win-rate");

    if (handsPlayedEl)
      handsPlayedEl.textContent = this.sessionStats.handsPlayed;
    if (handsWonEl) handsWonEl.textContent = this.sessionStats.handsWon;
    if (winRateEl) {
      const winRate =
        this.sessionStats.handsPlayed > 0
          ? Math.round(
              (this.sessionStats.handsWon / this.sessionStats.handsPlayed) * 100
            )
          : 0;
      winRateEl.textContent = `${winRate}%`;
    }
  }

  // Enhanced celebration with better effects
  celebrateWin(result, amount) {
    const table = document.getElementById("blackjack-table");
    if (table) {
      table.classList.add("table-win");

      if (result === "blackjack") {
        AnimationUtils.createConfetti(table, 50);
        this.playSound("jackpot");
        this.updateGameStatus("🎯 BLACKJACK! Natural 21!", "blackjack");
      } else {
        AnimationUtils.createConfetti(table, 25);
        this.playSound("win");
        this.updateGameStatus(`🏆 Winner! +$${amount}`, "win");
      }

      setTimeout(() => {
        table.classList.remove("table-win");
      }, 2000);
    }
  }

  showLossEffect() {
    const table = document.getElementById("blackjack-table");
    if (table) {
      table.classList.add("table-lose");
      this.playSound("lose");
      setTimeout(() => {
        table.classList.remove("table-lose");
      }, 1000);
    }
  }

  // Enhanced tips system with contextual advice
  updateTips() {
    const tips = [
      "💡 Dealer must hit on 16 and stand on 17",
      "🎯 Blackjack pays 2.5:1 - much better than regular wins!",
      "🃏 Face cards (J, Q, K) are all worth 10 points",
      "🎲 Aces can be worth 1 or 11 points automatically",
      "🏆 The goal is to get as close to 21 as possible",
      "💥 Going over 21 is a bust - you lose immediately",
      "👀 Watch the dealer's up card to make smart decisions",
      "⚡ Double down to double your bet and get exactly one more card",
      "🔥 Build win streaks for bigger achievement bonuses!",
      "💎 Achievement bonuses are paid when you leave the table",
    ];

    const tipElement = document.getElementById("current-tip");
    if (tipElement) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      tipElement.textContent = randomTip;
    }
  }

  playSound(soundType) {
    if (!this.soundEnabled) return;
    // Enhanced sound system (placeholder for actual implementation)
    console.log(`🔊 Playing sound: ${soundType}`);
  }

  // Rest of the methods remain the same but with enhanced error handling
  drawCard() {
    return Math.floor(Math.random() * 13) + 1;
  }

  calculateTotal(cards) {
    let total = 0;
    let aces = 0;

    cards.forEach((card) => {
      if (card === 1) {
        aces++;
        total += 11;
      } else if (card > 10) {
        total += 10;
      } else {
        total += card;
      }
    });

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  }

  getCardDisplay(card) {
    if (card === 1) return "A";
    if (card === 11) return "J";
    if (card === 12) return "Q";
    if (card === 13) return "K";
    return card.toString();
  }

  getCardSuit() {
    const suits = ["♠", "♥", "♦", "♣"];
    return suits[Math.floor(Math.random() * suits.length)];
  }

  createCardElement(card, hidden = false) {
    const cardEl = document.createElement("div");
    cardEl.className = "playing-card";

    if (hidden) {
      cardEl.innerHTML = `
        <div class="card-back">
          <div class="card-pattern"></div>
          <div class="card-logo">🎰</div>
        </div>
      `;
      cardEl.classList.add("hidden-card");
    } else {
      const suit = this.getCardSuit();
      const isRed = suit === "♥" || suit === "♦";
      const cardValue = this.getCardDisplay(card);

      cardEl.innerHTML = `
        <div class="card-front ${isRed ? "red" : "black"}">
          <div class="card-corner top-left">
            <div class="card-value">${cardValue}</div>
            <div class="card-suit-small">${suit}</div>
          </div>
          <div class="card-suit-large">${suit}</div>
          <div class="card-corner bottom-right">
            <div class="card-value">${cardValue}</div>
            <div class="card-suit-small">${suit}</div>
          </div>
        </div>
      `;
    }

    return cardEl;
  }

  clearTable() {
    const playerCards = document.getElementById("player-cards");
    const dealerCards = document.getElementById("dealer-cards");

    [playerCards, dealerCards].forEach((container) => {
      if (container) {
        const cards = container.querySelectorAll(".playing-card");
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.transition = "all 0.4s ease";
            card.style.opacity = "0";
            card.style.transform =
              "translateY(50px) rotateY(180deg) scale(0.8)";
            setTimeout(() => card.remove(), 400);
          }, index * 100);
        });

        setTimeout(() => {
          const placeholder = document.createElement("div");
          placeholder.className = "card-placeholder";
          placeholder.textContent =
            container.id === "player-cards"
              ? "Your cards will appear here"
              : "Dealer cards will appear here";
          container.appendChild(placeholder);
        }, 600);
      }
    });
  }

  animateTotal(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
      const currentValue = parseInt(element.textContent) || 0;
      if (currentValue !== newValue) {
        element.classList.add("total-update");
        AnimationUtils.animateNumber(element, currentValue, newValue, 500);
        setTimeout(() => {
          element.classList.remove("total-update");
        }, 500);
      }
    }
  }

  updateStreakDisplay() {
    const currentStreakEl = document.getElementById("current-streak");
    const bestStreakEl = document.getElementById("best-streak");

    if (currentStreakEl) {
      currentStreakEl.textContent = this.streakCounter;
      currentStreakEl.className = this.streakCounter >= 3 ? "streak-hot" : "";
    }

    if (bestStreakEl) {
      bestStreakEl.textContent = this.bestStreak;
    }
  }

  getBasicStrategyRecommendation(playerTotal, dealerUpCard) {
    if (playerTotal >= 17) return "STAND";
    if (playerTotal <= 11) return "HIT";
    if (playerTotal >= 12 && playerTotal <= 16) {
      return dealerUpCard >= 7 ? "HIT" : "STAND";
    }
    return "HIT";
  }

  calculateWinProbability(playerTotal, dealerUpCard) {
    if (playerTotal > 21) return 0;
    if (playerTotal === 21) return 85;

    const dealerBustChance = dealerUpCard >= 7 ? 25 : 40;
    const playerWinChance = playerTotal >= 17 ? 45 : 35;

    return Math.min(90, Math.max(10, dealerBustChance + playerWinChance));
  }

  checkInitialBlackjack() {
    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    if (playerTotal === 21) {
      this.unlockAchievement("first_blackjack");
      if (dealerTotal === 21) {
        this.endGame("push", "🤝 Both have blackjack! Push!");
      } else {
        this.endGame("blackjack", "🎯 BLACKJACK! Natural 21!");
      }
    }
  }

  hit() {
    if (!this.gameState || this.gameState.gamePhase !== "playing") return;

    const newCard = this.drawCard();
    this.gameState.playerCards.push(newCard);
    this.gameState.canDoubleDown = false;

    this.dealCardWithAnimation("player", this.gameState.playerCards.length - 1);

    const playerTotal = this.calculateTotal(this.gameState.playerCards);

    setTimeout(() => {
      this.updateDisplay();
      this.updateHandAnalysis();

      if (playerTotal > 21) {
        this.endGame("bust", `💥 Bust! You went over 21 with ${playerTotal}`);
      } else if (playerTotal === 21) {
        if (this.gameState.playerCards.length >= 5) {
          this.unlockAchievement("perfect_21");
        }
        this.showDealerMessage("Perfect 21! Let's see if I can match it.");
        this.stand();
      }
    }, 700);
  }

  stand() {
    if (!this.gameState || this.gameState.gamePhase !== "playing") return;

    this.gameState.gamePhase = "dealer";
    this.updateGameStatus("Dealer's turn...", "dealer");
    this.showDealerMessage("My turn! Let's see what happens.");

    this.revealDealerCard();
    setTimeout(() => {
      this.dealerPlay();
    }, 1200);
  }

  revealDealerCard() {
    const dealerCards = document.getElementById("dealer-cards");
    const hiddenCard = dealerCards?.querySelector(".hidden-card");

    if (hiddenCard) {
      hiddenCard.style.transform = "rotateY(180deg)";
      setTimeout(() => {
        const card = this.gameState.dealerCards[1];
        const suit = this.getCardSuit();
        const isRed = suit === "♥" || suit === "♦";
        const cardValue = this.getCardDisplay(card);

        hiddenCard.innerHTML = `
          <div class="card-front ${isRed ? "red" : "black"}">
            <div class="card-corner top-left">
              <div class="card-value">${cardValue}</div>
              <div class="card-suit-small">${suit}</div>
            </div>
            <div class="card-suit-large">${suit}</div>
            <div class="card-corner bottom-right">
              <div class="card-value">${cardValue}</div>
              <div class="card-suit-small">${suit}</div>
            </div>
          </div>
        `;
        hiddenCard.classList.remove("hidden-card");
        hiddenCard.style.transform = "rotateY(0deg)";
      }, 300);
    }
  }

  dealerPlay() {
    const dealerPlayStep = () => {
      const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

      if (dealerTotal < GameConfig.BLACKJACK.DEALER_STANDS_ON) {
        const newCard = this.drawCard();
        this.gameState.dealerCards.push(newCard);
        this.dealCardWithAnimation(
          "dealer",
          this.gameState.dealerCards.length - 1
        );

        setTimeout(() => {
          this.updateDisplay();
          dealerPlayStep();
        }, 1000);
      } else {
        this.updateDisplay();
        setTimeout(() => {
          this.resolveGame();
        }, 600);
      }
    };

    dealerPlayStep();
  }

  resolveGame() {
    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    if (dealerTotal > 21) {
      this.sessionStats.dealerBusts++;
      this.endGame(
        "win",
        `🎉 Dealer bust with ${dealerTotal}! You win with ${playerTotal}!`
      );
    } else if (playerTotal > dealerTotal) {
      this.endGame("win", `🏆 You win! ${playerTotal} beats ${dealerTotal}`);
    } else if (playerTotal === dealerTotal) {
      this.endGame("push", `🤝 Push! Both have ${playerTotal}`);
    } else {
      this.endGame(
        "lose",
        `😔 Dealer wins. ${dealerTotal} beats ${playerTotal}`
      );
    }
  }

  resetGame() {
    this.gameState = null;
    this.clearTable();

    const elements = [
      { id: "player-total", content: "0" },
      { id: "dealer-total", content: "0" },
      { id: "player-card-count", content: "(0 cards)" },
      { id: "dealer-card-count", content: "(0 cards)" },
    ];

    elements.forEach(({ id, content }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = content;
      }
    });

    this.updateButtons();
    this.updateTips();
    this.updateGameStatus("Ready for next hand!", "ready");
  }

  onShow() {
    // Safe fallback values
    const bet =
      this.game.gameSettings?.blackjackBet || BlackjackConfig.MIN_BET || 5;
    const playerMoney = this.game.playerMoney || 0;

    const elements = [
      { id: "blackjack-current-bet", value: bet },
      { id: "deal-cost", value: bet },
    ];

    elements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    const moneyElement = document.getElementById("blackjack-money");
    if (moneyElement) {
      const formattedMoney = this.game.formatMoney
        ? this.game.formatMoney(playerMoney)
        : `${playerMoney.toFixed(2)}`;
      moneyElement.textContent = formattedMoney;
    }

    const dealButton = document.getElementById("deal-button");
    if (dealButton) {
      dealButton.disabled = !this.game.canAfford || !this.game.canAfford(bet);
    }

    this.updateStreakDisplay();
    this.updateAchievementDisplay();
    this.updateSessionStats();
  }
}

if (typeof window !== "undefined") {
  window.BlackjackGame = BlackjackGame;
}
