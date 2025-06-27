// Enhanced Slots game with own configuration and achievement system
class SlotsGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.gameState = null;
    this.screenElement = null;
    this.spinning = false;
    this.achievements = [];
    this.achievementRewards = 0;
    this.streakCounter = 0;
    this.bestStreak = 0;
    this.sessionStats = {
      spinsPlayed: 0,
      totalWon: 0,
      totalLost: 0,
      biggestWin: 0,
      sessionStartTime: null,
      symbolFrequency: {},
      winsByType: { small: 0, medium: 0, big: 0, jackpot: 0 },
      specialCombinations: 0,
    };
    this.reelElements = [];
    this.currentSymbols = [null, null, null];
    this.init();
  }

  init() {
    // Check if SlotsConfig is available
    if (typeof SlotsConfig === "undefined") {
      console.error(
        "SlotsConfig is not loaded! Make sure slots-config.js is loaded before slots.js"
      );
      return;
    }

    this.initializeAchievements();
    this.sessionStats.sessionStartTime = Date.now();
  }

  initializeAchievements() {
    if (typeof SlotsConfig === "undefined") {
      console.error("SlotsConfig is not available for achievements");
      this.possibleAchievements = [];
      return;
    }
    this.possibleAchievements = Object.values(SlotsConfig.ACHIEVEMENTS);
  }

  // Enhanced HTML template with better UI
  getHTMLTemplate() {
    const currentBet =
      this.game.gameSettings?.slotsBet ||
      (typeof SlotsConfig !== "undefined" ? SlotsConfig.MIN_BET : 1);
    const playerMoney = this.game.playerMoney || 0;

    // Get random tip safely
    const randomTip =
      typeof SlotsConfig !== "undefined" && SlotsConfig.getRandomTip
        ? SlotsConfig.getRandomTip()
        : "💡 Spin the reels to win big prizes!";

    return `
      <div id="slots-screen" class="screen">
        <div class="container">
          <button id="slots-back" class="back-button">← Cash Out & Exit</button>
          
          <!-- Enhanced Header -->
          <div class="game-header">
            <div class="game-info">
              <h1>🎰 Lucky Slots</h1>
              <p class="game-subtitle">Spin to Win Big!</p>
            </div>
            <div class="player-stats">
              <p class="money-display">Money: <span id="slots-money">$${playerMoney.toFixed(
                2
              )}</span></p>
              <p class="bet-display">Bet: $<span id="slots-current-bet">${currentBet}</span></p>
              <p class="session-display">
                Spins: <span id="spins-count">0</span> | 
                Streak: <span id="win-streak">0</span> | 
                Biggest: $<span id="biggest-win">0</span>
              </p>
              <p class="rewards-display">🏆 Rewards: $<span id="achievement-rewards">0</span></p>
            </div>
          </div>

          <div class="slots-machine">
            <!-- Slot Machine Display -->
            <div class="machine-body">
              <div class="machine-top">
                <div class="neon-sign">🎰 JACKPOT 🎰</div>
                <div class="payout-display">
                  <div class="potential-win">Next Win: <span id="potential-payout">$${
                    currentBet * 2
                  }</span></div>
                </div>
              </div>

              <!-- Reels Section -->
              <div class="reels-container">
                <div class="reel-frame">
                  <div id="reel-1" class="reel">
                    <div class="symbol-container">
                      <div class="symbol">🍒</div>
                    </div>
                  </div>
                  <div id="reel-2" class="reel">
                    <div class="symbol-container">
                      <div class="symbol">🍒</div>
                    </div>
                  </div>
                  <div id="reel-3" class="reel">
                    <div class="symbol-container">
                      <div class="symbol">🍒</div>
                    </div>
                  </div>
                </div>
                
                <!-- Win Line Indicator -->
                <div id="win-line" class="win-line"></div>
              </div>

              <!-- Control Panel -->
              <div class="control-panel">
                <button id="spin-button" class="spin-button glow-button">
                  <span class="button-icon">🎲</span>
                  <span class="button-text">SPIN</span>
                  <span class="button-cost">($<span id="spin-cost">${currentBet}</span>)</span>
                </button>
                
                <div class="game-info-panel">
                  <div id="last-win" class="last-win">Last Win: $0</div>
                  <div id="game-status" class="game-status">Ready to Spin!</div>
                </div>
              </div>
            </div>

            <!-- Side Panels -->
            <div class="side-panels">
              <!-- Paytable -->
              <div class="paytable-panel">
                <h4>💰 Paytable</h4>
                <div class="paytable-content">
                  <div class="payout-row">
                    <span class="symbols">💎💎💎</span>
                    <span class="multiplier">500x</span>
                  </div>
                  <div class="payout-row">
                    <span class="symbols">7️⃣7️⃣7️⃣</span>
                    <span class="multiplier">100x</span>
                  </div>
                  <div class="payout-row">
                    <span class="symbols">💰💰💰</span>
                    <span class="multiplier">35x</span>
                  </div>
                  <div class="payout-row">
                    <span class="symbols">🔔🔔🔔</span>
                    <span class="multiplier">20x</span>
                  </div>
                  <div class="payout-row">
                    <span class="symbols">🍇🍇🍇</span>
                    <span class="multiplier">15x</span>
                  </div>
                  <div class="payout-row special">
                    <span class="symbols">🍒🍋🍊</span>
                    <span class="multiplier">8x</span>
                  </div>
                </div>
              </div>

              <!-- Achievements Panel -->
              <div class="achievements-panel">
                <h4>🏆 Achievements</h4>
                <div class="achievement-summary">
                  <p>Session: <span id="achievement-count">0</span> unlocked</p>
                  <p class="reward-preview">Cash Out: $<span id="cashout-preview">0</span></p>
                </div>
                <div id="achievements-list" class="achievements-list">
                  <div class="no-achievements">Spin to unlock achievements!</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips Panel -->
          <div class="tips-panel">
            <div id="current-tip" class="tip-display">
              ${randomTip}
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
      this.screenElement = document.getElementById("slots-screen");
      this.reelElements = [
        document.getElementById("reel-1"),
        document.getElementById("reel-2"),
        document.getElementById("reel-3"),
      ];
      this.bindEvents();
      this.resetAchievements();
      this.updateTips();
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
      AnimationUtils.slideIn(this.screenElement, "right", 500);
    }
  }

  hide() {
    if (this.screenElement) {
      this.cashOutAchievements();
      this.screenElement.classList.remove("active");
      setTimeout(() => {
        this.destroyScreen();
      }, 100);
    }
  }

  // Achievement system methods
  resetAchievements() {
    this.achievements = [];
    this.achievementRewards = 0;
    this.streakCounter = 0;
    this.sessionStats = {
      spinsPlayed: 0,
      totalWon: 0,
      totalLost: 0,
      biggestWin: 0,
      sessionStartTime: Date.now(),
      symbolFrequency: {},
      winsByType: { small: 0, medium: 0, big: 0, jackpot: 0 },
      specialCombinations: 0,
    };
    this.updateAchievementDisplay();
    this.updateStatsDisplay(); // Changed from updateSessionStats() to updateStatsDisplay()
  }

  cashOutAchievements() {
    if (this.achievementRewards > 0) {
      this.game.winMoney(this.achievementRewards);
      this.game.showMessage(
        `🏆 Slots Achievement Bonus: +$${this.achievementRewards}! Total achievements: ${this.achievements.length}`,
        GameConfig.UI.LONG_MESSAGE_DURATION
      );

      const container = document.querySelector(".slots-machine");
      if (container) {
        AnimationUtils.createConfetti(container, 25);
      }
    }
  }

  bindEvents() {
    const spinButton = document.getElementById("spin-button");
    const backButton = document.getElementById("slots-back");

    if (spinButton) {
      spinButton.addEventListener("click", (e) => {
        if (!this.spinning) {
          AnimationUtils.rippleEffect(spinButton, e);
          this.spin();
        }
      });
    }

    if (backButton) {
      backButton.addEventListener("click", () => {
        this.showExitConfirmation();
      });
    }

    // Update tips periodically
    setInterval(() => {
      this.updateTips();
    }, 8000);
  }

  showExitConfirmation() {
    const rewardText =
      this.achievementRewards > 0
        ? `You'll receive $${this.achievementRewards} in achievement bonuses!`
        : "No achievement bonuses this session.";

    const sessionTime = Math.floor(
      (Date.now() - this.sessionStats.sessionStartTime) / 1000 / 60
    );
    const confirmMessage = `Ready to cash out?\n\nSession: ${sessionTime} minutes\nSpins: ${this.sessionStats.spinsPlayed}\n${rewardText}\n\nLeave the slots?`;

    if (confirm(confirmMessage)) {
      this.game.showScreen("hub");
    }
  }

  spin() {
    const bet = this.game.gameSettings?.slotsBet || SlotsConfig.MIN_BET;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage(
        "Not enough money! Try a smaller bet or search for trash!",
        GameConfig.UI.LONG_MESSAGE_DURATION
      );
      return;
    }

    this.spinning = true;
    this.sessionStats.spinsPlayed++;

    // Unlock first spin achievement
    if (this.sessionStats.spinsPlayed === 1) {
      this.unlockAchievement("slots_first_spin");
    }

    // Disable spin button
    const spinButton = document.getElementById("spin-button");
    if (spinButton) {
      spinButton.disabled = true;
      spinButton.classList.add("spinning");
    }

    // Update status
    this.updateGameStatus("Spinning...");

    // Play spin sound
    this.playSound("SPIN_START");

    // Start reel animations
    this.startReelAnimations();

    // Generate results
    const results = this.generateSpinResults();

    // Stop reels with results
    this.stopReelsWithResults(results, bet);
  }

  generateSpinResults() {
    // Safety check for SlotsConfig
    if (typeof SlotsConfig === "undefined" || !SlotsConfig.getRandomSymbol) {
      console.error("SlotsConfig not available, using fallback symbols");
      const fallbackSymbols = [
        {
          key: "CHERRY",
          symbol: "🍒",
          name: "Cherry",
          value: 1,
          color: "#dc3545",
        },
        {
          key: "LEMON",
          symbol: "🍋",
          name: "Lemon",
          value: 2,
          color: "#ffc107",
        },
        { key: "BELL", symbol: "🔔", name: "Bell", value: 5, color: "#ffd700" },
      ];
      return [
        fallbackSymbols[Math.floor(Math.random() * fallbackSymbols.length)],
        fallbackSymbols[Math.floor(Math.random() * fallbackSymbols.length)],
        fallbackSymbols[Math.floor(Math.random() * fallbackSymbols.length)],
      ];
    }

    return [
      SlotsConfig.getRandomSymbol(),
      SlotsConfig.getRandomSymbol(),
      SlotsConfig.getRandomSymbol(),
    ];
  }

  startReelAnimations() {
    this.reelElements.forEach((reel, index) => {
      if (reel) {
        reel.classList.add("spinning");

        // Animate symbols changing rapidly
        const symbolContainer = reel.querySelector(".symbol-container");
        if (symbolContainer) {
          this.animateReelSymbols(symbolContainer);
        }
      }
    });
  }

  animateReelSymbols(container) {
    // Safety check for SlotsConfig
    if (typeof SlotsConfig === "undefined" || !SlotsConfig.SYMBOLS) {
      console.error("SlotsConfig.SYMBOLS not available");
      return;
    }

    const symbols = Object.values(SlotsConfig.SYMBOLS);
    let animationCount = 0;
    const maxAnimations = 20;

    const symbolAnimation = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const symbolElement = container.querySelector(".symbol");
      if (symbolElement) {
        symbolElement.textContent = randomSymbol.symbol;
        symbolElement.style.color = randomSymbol.color;
      }

      animationCount++;
      if (animationCount >= maxAnimations) {
        clearInterval(symbolAnimation);
      }
    }, SlotsConfig.ANIMATION?.SYMBOL_SPIN_SPEED || 100);
  }

  stopReelsWithResults(results, bet) {
    // Safety check
    if (!results || results.length !== 3) {
      console.error("Invalid results for stopping reels:", results);
      this.spinning = false;
      return;
    }

    // Stop reels one by one with delay
    results.forEach((result, index) => {
      setTimeout(() => {
        this.stopReel(index, result);
        this.playSound("REEL_STOP");

        // If this is the last reel, process the results
        if (index === results.length - 1) {
          setTimeout(() => {
            this.processSpinResults(results, bet);
          }, 300);
        }
      }, index * (typeof SlotsConfig !== "undefined" ? SlotsConfig.ANIMATION?.REEL_DELAY || 200 : 200));
    });
  }

  stopReel(reelIndex, symbol) {
    const reel = this.reelElements[reelIndex];
    if (reel) {
      reel.classList.remove("spinning");

      const symbolContainer = reel.querySelector(".symbol-container");
      const symbolElement = symbolContainer?.querySelector(".symbol");

      if (symbolElement) {
        symbolElement.textContent = symbol.symbol;
        symbolElement.style.color = symbol.color;

        // Add stop animation
        symbolElement.classList.add("symbol-stop");
        setTimeout(() => {
          symbolElement.classList.remove("symbol-stop");
        }, 300);
      }
    }

    this.currentSymbols[reelIndex] = symbol;
  }

  processSpinResults(results, bet) {
    // Safety check for SlotsConfig
    if (typeof SlotsConfig === "undefined") {
      console.error("SlotsConfig not available for processing results");
      this.spinning = false;
      return;
    }

    const payout = SlotsConfig.calculatePayout(results, bet);
    const winType = SlotsConfig.getWinType(results, payout, bet);
    const isWin = payout > 0;

    // Update statistics
    this.updateSessionStats(bet, payout, winType, results);

    // Process money
    this.game.spendMoney(bet);
    if (isWin) {
      this.game.winMoney(payout);
      this.streakCounter++;
      this.sessionStats.totalWon += payout;
    } else {
      this.streakCounter = 0;
      this.sessionStats.totalLost += bet;
    }

    // Check for achievements
    this.checkAchievements(results, payout, bet, winType, isWin);

    // Show results
    this.showSpinResults(results, payout, bet, winType, isWin);

    // Re-enable spinning
    this.spinning = false;
    const spinButton = document.getElementById("spin-button");
    if (spinButton) {
      spinButton.disabled = false;
      spinButton.classList.remove("spinning");
    }

    // Update displays
    this.updateAllDisplays();
  }

  updateSessionStats(bet = 0, payout = 0, winType = "none", results = []) {
    // Only track symbol frequency if results are provided
    if (results && results.length > 0) {
      results.forEach((symbol) => {
        this.sessionStats.symbolFrequency[symbol.key] =
          (this.sessionStats.symbolFrequency[symbol.key] || 0) + 1;
      });
    }

    // Track win types
    if (payout > 0 && winType !== "none") {
      this.sessionStats.winsByType[winType]++;
    }

    // Track biggest win
    const netWin = payout - bet;
    if (netWin > this.sessionStats.biggestWin) {
      this.sessionStats.biggestWin = netWin;
    }

    // Track special combinations
    if (
      typeof SlotsConfig !== "undefined" &&
      SlotsConfig.isSpecialCombination &&
      results &&
      results.length > 0
    ) {
      if (SlotsConfig.isSpecialCombination(results)) {
        this.sessionStats.specialCombinations++;
      }
    }
  }

  checkAchievements(results, payout, bet, winType, isWin) {
    // First win
    if (
      isWin &&
      this.sessionStats.winsByType.small +
        this.sessionStats.winsByType.medium +
        this.sessionStats.winsByType.big +
        this.sessionStats.winsByType.jackpot ===
        1
    ) {
      this.unlockAchievement("slots_first_win");
    }

    // Specific symbol achievements
    const symbolKeys = results.map((r) => r.key);
    if (symbolKeys.every((key) => key === "CHERRY")) {
      this.unlockAchievement("cherry_triple");
    }
    if (symbolKeys.every((key) => key === "SEVEN")) {
      this.unlockAchievement("triple_seven");
    }
    if (symbolKeys.every((key) => key === "DIAMOND")) {
      this.unlockAchievement("triple_diamond");
    }

    // High roller achievement
    if (isWin && bet >= SlotsConfig.MAX_BET) {
      this.unlockAchievement("slots_high_roller");
    }

    // Big win achievement
    const multiplier = payout / bet;
    if (multiplier >= 50) {
      this.unlockAchievement("slots_big_win");
    }

    // Win streak achievement
    if (this.streakCounter >= 5) {
      this.unlockAchievement("slots_win_streak_5");
    }

    // Fruit salad achievement (needs counter)
    const fruitSymbols = ["CHERRY", "LEMON", "ORANGE", "PLUM"];
    if (symbolKeys.every((key) => fruitSymbols.includes(key))) {
      // Would need to track fruit combinations
    }

    // Spin master achievement
    if (this.sessionStats.spinsPlayed >= 100) {
      this.unlockAchievement("spin_master");
    }

    // Marathon player achievement
    const sessionTime = Date.now() - this.sessionStats.sessionStartTime;
    if (sessionTime >= 30 * 60 * 1000) {
      // 30 minutes
      this.unlockAchievement("slots_marathon");
    }
  }

  showSpinResults(results, payout, bet, winType, isWin) {
    const netWin = payout - bet;

    // Update last win display
    const lastWinElement = document.getElementById("last-win");
    if (lastWinElement) {
      lastWinElement.textContent = isWin
        ? `Last Win: $${netWin}`
        : "Last Win: $0";
      lastWinElement.className = `last-win ${isWin ? "win" : "lose"}`;
    }

    // Show win line if winning
    if (isWin) {
      this.showWinLine();
      this.playWinSound(winType);
      this.showWinEffects(winType, netWin);
    } else {
      this.playSound("LOSE");
    }

    // Show message
    const symbolNames = results.map((r) => r.name).join(", ");
    const message = isWin
      ? `🎰 ${symbolNames} - Won $${netWin}!`
      : `🎰 ${symbolNames} - No win this time`;

    this.game.showMessage(message, GameConfig.UI.NORMAL_MESSAGE_DURATION);

    // Update game status
    this.updateGameStatus(isWin ? `Won $${netWin}!` : "Try again!");
  }

  showWinLine() {
    const winLine = document.getElementById("win-line");
    if (winLine) {
      winLine.classList.add("active");
      setTimeout(() => {
        winLine.classList.remove("active");
      }, 2000);
    }
  }

  playWinSound(winType) {
    const soundMap = {
      small: "WIN_SMALL",
      medium: "WIN_MEDIUM",
      big: "WIN_BIG",
      jackpot: "WIN_JACKPOT",
    };
    this.playSound(soundMap[winType] || "WIN_SMALL");
  }

  showWinEffects(winType, amount) {
    const machine = document.querySelector(".slots-machine");
    if (!machine) return;

    // Add win class for styling
    machine.classList.add(`win-${winType}`);
    setTimeout(() => {
      machine.classList.remove(`win-${winType}`);
    }, 2000);

    // Confetti for big wins
    if (winType === "big" || winType === "jackpot") {
      const particleCount =
        winType === "jackpot"
          ? SlotsConfig.PERFORMANCE.MAX_CONFETTI_PARTICLES
          : 20;
      AnimationUtils.createConfetti(machine, particleCount);
    }

    // Screen flash for jackpot
    if (winType === "jackpot") {
      const screen = document.getElementById("slots-screen");
      if (screen) {
        screen.classList.add("jackpot-flash");
        setTimeout(() => {
          screen.classList.remove("jackpot-flash");
        }, 1500);
      }
    }

    // Floating win amount
    const rect = machine.getBoundingClientRect();
    AnimationUtils.floatingText(
      `+$${amount}`,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      SlotsConfig.UI.COLORS.SUCCESS,
      2000
    );
  }

  // Achievement system methods
  unlockAchievement(achievementId) {
    if (this.achievements.includes(achievementId)) return;

    // Safety check for SlotsConfig
    if (typeof SlotsConfig === "undefined" || !SlotsConfig.getAchievement) {
      console.error("SlotsConfig not available for achievements");
      return;
    }

    const achievement = SlotsConfig.getAchievement(achievementId);
    if (achievement) {
      this.achievements.push(achievementId);
      this.achievementRewards += achievement.reward;
      this.showAchievement(achievement);
      this.updateAchievementDisplay();
      this.playSound("ACHIEVEMENT");
    }
  }

  showAchievement(achievement) {
    const achievementsList = document.getElementById("achievements-list");
    if (achievementsList) {
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

      this.showFloatingAchievement(achievement);

      if (achievementsList.children.length > 4) {
        achievementsList.lastChild.remove();
      }
    }
  }

  showFloatingAchievement(achievement) {
    const rect = document
      .querySelector(".achievements-panel")
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

  updateAllDisplays() {
    this.updateMoneyDisplay();
    this.updateStatsDisplay();
    this.updateAchievementDisplay();
  }

  updateMoneyDisplay() {
    const moneyElement = document.getElementById("slots-money");
    if (moneyElement) {
      const formattedMoney = this.game.formatMoney
        ? this.game.formatMoney(this.game.playerMoney)
        : `$${this.game.playerMoney.toFixed(2)}`;
      moneyElement.textContent = formattedMoney;
    }
  }

  updateStatsDisplay() {
    const spinsElement = document.getElementById("spins-count");
    const streakElement = document.getElementById("win-streak");
    const biggestWinElement = document.getElementById("biggest-win");

    if (spinsElement) spinsElement.textContent = this.sessionStats.spinsPlayed;
    if (streakElement) {
      streakElement.textContent = this.streakCounter;
      streakElement.className = this.streakCounter >= 3 ? "hot-streak" : "";
    }
    if (biggestWinElement)
      biggestWinElement.textContent = this.sessionStats.biggestWin;
  }

  updateGameStatus(message) {
    const statusElement = document.getElementById("game-status");
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  updateTips() {
    const tipElement = document.getElementById("current-tip");
    if (tipElement) {
      if (typeof SlotsConfig !== "undefined" && SlotsConfig.getRandomTip) {
        tipElement.textContent = SlotsConfig.getRandomTip();
      } else {
        tipElement.textContent = "💡 Spin the reels to win big!";
      }
    }
  }

  playSound(soundType) {
    try {
      if (
        typeof SlotsConfig !== "undefined" &&
        SlotsConfig.SOUNDS &&
        SlotsConfig.SOUNDS.ENABLED
      ) {
        console.log(`🔊 Playing slots sound: ${soundType}`);
        // Placeholder for actual sound implementation
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }

  onShow() {
    const bet =
      this.game.gameSettings?.slotsBet ||
      (typeof SlotsConfig !== "undefined" ? SlotsConfig.MIN_BET : 1);

    // Update bet displays
    const elements = [
      { id: "slots-current-bet", value: bet },
      { id: "spin-cost", value: bet },
      { id: "potential-payout", value: `$${bet * 2}` },
    ];

    elements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    this.updateAllDisplays();

    // Check affordability
    const spinButton = document.getElementById("spin-button");
    if (spinButton) {
      spinButton.disabled = !this.game.canAfford(bet);
    }
  }

  // Utility methods
  getGameState() {
    return {
      spinning: this.spinning,
      sessionStats: this.sessionStats,
      achievements: this.achievements.length,
      achievementRewards: this.achievementRewards,
      streakCounter: this.streakCounter,
      bestStreak: this.bestStreak,
    };
  }

  cleanup() {
    // Clear any running animations
    this.reelElements.forEach((reel) => {
      if (reel) {
        reel.classList.remove("spinning");
      }
    });

    this.spinning = false;
  }

  destroy() {
    this.cleanup();
    this.destroyScreen();
  }
}

// Make SlotsGame available globally
if (typeof window !== "undefined") {
  window.SlotsGame = SlotsGame;
}
