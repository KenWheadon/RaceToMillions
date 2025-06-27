// slots_gold.js - Gold Slot Machine Game
class SlotsGold {
  constructor(targetContainer = null, config = null) {
    // Use provided config or global SG_CONFIG
    this.sg_config =
      config || (typeof SG_CONFIG !== "undefined" ? SG_CONFIG : null);

    if (!this.sg_config) {
      throw new Error(
        "SlotsGold: Configuration not found. Please load slots-gold-config.js first."
      );
    }

    // Store target container
    this.targetContainer = targetContainer;

    // Initialize game state
    this.sg_state = {
      gold: this.sg_config.mechanics.startingGold,
      currentBet: this.sg_config.betting.defaultBetIndex,
      level: 0,
      exp: 0,
      expNeeded: 1,
      prestige: 0,
      winStreak: 0,
      loseStreak: 0,
      totalEarned: 0,
      totalSpins: 0,
      achievements: {},
      isSpinning: false,
    };

    // Initialize
    this.initializeAchievements();
    this.createGameElements();
    this.bindEvents();
    this.updateDisplay();
  }

  initializeAchievements() {
    const achievements = {};

    // Symbol combination achievements
    this.sg_config.symbols.forEach((symbol) => {
      achievements[`${symbol.name}_2`] = {
        name: `Double ${symbol.name}`,
        description: `Get 2 ${symbol.name} in a row`,
        reward:
          symbol.payout *
          this.sg_config.achievements.symbolAchievements.match2Multiplier,
        unlocked: false,
      };
      achievements[`${symbol.name}_3`] = {
        name: `Triple ${symbol.name}`,
        description: `Get 3 ${symbol.name} in a row`,
        reward:
          symbol.payout *
          this.sg_config.achievements.symbolAchievements.match3Multiplier,
        unlocked: false,
      };
    });

    // Money achievements
    this.sg_config.achievements.moneyMilestones.forEach((amount) => {
      achievements[`earned_${amount}`] = {
        name: `Gold Collector ${amount}`,
        description: `Earn ${amount} total gold`,
        reward: Math.floor(
          amount * this.sg_config.achievements.moneyRewardMultiplier
        ),
        unlocked: false,
      };
    });

    // Streak achievements
    this.sg_config.achievements.winStreakTargets.forEach((count) => {
      achievements[`win_streak_${count}`] = {
        name: `Win Streak ${count}`,
        description: `Win ${count} times in a row`,
        reward: count * this.sg_config.achievements.streakRewardMultiplier,
        unlocked: false,
      };
    });

    this.sg_config.achievements.loseStreakTargets.forEach((count) => {
      achievements[`lose_streak_${count}`] = {
        name: `Unlucky ${count}`,
        description: `Lose ${count} times in a row`,
        reward: count * this.sg_config.achievements.streakRewardMultiplier,
        unlocked: false,
      };
    });

    this.sg_state.achievements = achievements;
  }

  createGameElements() {
    // Determine where to append the game
    let container;
    if (this.targetContainer) {
      container =
        typeof this.targetContainer === "string"
          ? document.getElementById(this.targetContainer) ||
            document.querySelector(this.targetContainer)
          : this.targetContainer;
    } else {
      container = document.body;
    }

    if (!container) {
      throw new Error("SlotsGold: Target container not found.");
    }

    const gameContainer = document.createElement("div");
    gameContainer.className = "sg-game-container";
    gameContainer.innerHTML = `
            <div class="sg-header">
                <button id="sg-paytable-btn" class="sg-paytable-btn">📊 Pay Table</button>
                <h1>🎰 Golden Slots</h1>
                <div class="sg-stats">
                    <div class="sg-gold">💰 <span id="sg-gold-amount">${
                      this.sg_state.gold
                    }</span></div>
                    <div class="sg-level">⭐ Level <span id="sg-level">${
                      this.sg_state.level
                    }</span></div>
                    <div class="sg-prestige">👑 Prestige <span id="sg-prestige">${
                      this.sg_state.prestige
                    }</span></div>
                </div>
                <div class="sg-bonuses">
                    <div class="sg-level-bonus">Level Bonus: <strong>+<span id="sg-level-bonus">0</span>%</strong></div>
                    <div class="sg-prestige-bonus">Prestige Bonus: <strong>+<span id="sg-prestige-bonus">0</span>%</strong></div>
                </div>
            </div>

            <div class="sg-machine">
                <div id="sg-win-display" class="sg-win-display"></div>
                <div class="sg-reels">
                    <div class="sg-reel" id="sg-reel-0">🎰</div>
                    <div class="sg-reel" id="sg-reel-1">🎰</div>
                    <div class="sg-reel" id="sg-reel-2">🎰</div>
                    <div class="sg-reel" id="sg-reel-3">🎰</div>
                    <div class="sg-reel" id="sg-reel-4">🎰</div>
                </div>
                
                <div class="sg-exp-bar">
                    <div class="sg-exp-fill" id="sg-exp-fill"></div>
                    <span class="sg-exp-text" id="sg-exp-text">EXP: 0/1</span>
                </div>
            </div>

            <div class="sg-controls">
                <div class="sg-bet-controls">
                    <label>Bet Amount:</label>
                    <select id="sg-bet-select">
                        ${this.sg_config.betting.betLabels
                          .map(
                            (label, index) =>
                              `<option value="${index}" ${
                                index === this.sg_state.currentBet
                                  ? "selected"
                                  : ""
                              }>${label}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                
                <button id="sg-spin-btn" class="sg-spin-btn">SPIN (${
                  this.sg_config.betting.betLabels[this.sg_state.currentBet]
                })</button>
                <button id="sg-beg-btn" class="sg-beg-btn" style="display: none;">BEG</button>
                
                <button id="sg-prestige-btn" class="sg-prestige-btn">
                    PRESTIGE ($${this.getPrestigeCost()})
                </button>
            </div>

            <div class="sg-drawers">
                <button class="sg-drawer-toggle" data-drawer="achievements">🏆 Achievements</button>
            </div>

            <div id="sg-achievements-drawer" class="sg-drawer">
                <h3>🏆 Achievements</h3>
                <div id="sg-achievements-list"></div>
            </div>

            <div id="sg-beg-overlay" class="sg-overlay">
                <div class="sg-beg-popup">
                    <h3>💸 Begging Corner</h3>
                    <p>When all hope is lost...</p>
                    <button id="sg-beg-action" class="sg-beg-action">Ask for Charity</button>
                    <div id="sg-beg-result"></div>
                    <button id="sg-beg-close" class="sg-close-btn">Close</button>
                </div>
            </div>

            <div id="sg-paytable-overlay" class="sg-overlay">
                <div class="sg-paytable-popup">
                    <h3>📊 Pay Table</h3>
                    <div id="sg-paytable-content"></div>
                    <div class="sg-rtp-info">
                        <strong>Return to Player: ${(
                          this.sg_config.mechanics.baseRTP * 100
                        ).toFixed(1)}%</strong>
                    </div>
                    <button id="sg-paytable-close" class="sg-close-btn">Close</button>
                </div>
            </div>

            <div id="sg-toast-container" class="sg-toast-container"></div>
            <div id="sg-particles-container" class="sg-particles-container"></div>
        `;

    container.appendChild(gameContainer);
    this.gameContainer = gameContainer;
    this.updateAchievementsDisplay();
    this.createPaytableContent();
  }

  bindEvents() {
    this.gameContainer
      .querySelector("#sg-spin-btn")
      .addEventListener("click", () => this.spin());
    this.gameContainer
      .querySelector("#sg-beg-btn")
      .addEventListener("click", () => this.showBegPopup());
    this.gameContainer
      .querySelector("#sg-beg-action")
      .addEventListener("click", () => this.beg());
    this.gameContainer
      .querySelector("#sg-beg-close")
      .addEventListener("click", () => this.hideBegPopup());
    this.gameContainer
      .querySelector("#sg-prestige-btn")
      .addEventListener("click", () => this.prestige());
    this.gameContainer
      .querySelector("#sg-paytable-btn")
      .addEventListener("click", () => this.showPaytablePopup());
    this.gameContainer
      .querySelector("#sg-paytable-close")
      .addEventListener("click", () => this.hidePaytablePopup());

    this.gameContainer
      .querySelector("#sg-bet-select")
      .addEventListener("change", (e) => {
        this.sg_state.currentBet = parseInt(e.target.value);
        this.updateSpinButton();
      });

    this.gameContainer.querySelectorAll(".sg-drawer-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const drawer = e.target.dataset.drawer;
        this.toggleDrawer(drawer);
      });
    });

    // Close popups when clicking overlay
    this.gameContainer
      .querySelector("#sg-beg-overlay")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("sg-overlay")) {
          this.hideBegPopup();
        }
      });

    this.gameContainer
      .querySelector("#sg-paytable-overlay")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("sg-overlay")) {
          this.hidePaytablePopup();
        }
      });
  }

  toggleDrawer(drawerName) {
    const drawer = this.gameContainer.querySelector(`#sg-${drawerName}-drawer`);
    drawer.classList.toggle("sg-drawer-open");
  }

  showBegPopup() {
    const overlay = this.gameContainer.querySelector("#sg-beg-overlay");
    overlay.classList.add("sg-overlay-show");
  }

  hideBegPopup() {
    const overlay = this.gameContainer.querySelector("#sg-beg-overlay");
    overlay.classList.remove("sg-overlay-show");
  }

  showPaytablePopup() {
    const overlay = this.gameContainer.querySelector("#sg-paytable-overlay");
    overlay.classList.add("sg-overlay-show");
  }

  hidePaytablePopup() {
    const overlay = this.gameContainer.querySelector("#sg-paytable-overlay");
    overlay.classList.remove("sg-overlay-show");
  }

  async spin() {
    if (this.sg_state.isSpinning) return;

    const betAmount =
      this.sg_config.betting.betAmounts[this.sg_state.currentBet];
    if (this.sg_state.gold < betAmount) {
      this.showToast("Not enough gold!", "error");
      this.checkBegButton();
      return;
    }

    this.sg_state.isSpinning = true;
    this.sg_state.gold -= betAmount;
    this.sg_state.totalSpins++;

    // Add EXP
    this.sg_state.exp += this.sg_config.leveling.expPerSpin;
    this.checkLevelUp();

    // Animate reels
    await this.animateReels();

    // Generate symbols
    const symbols = this.generateSymbols();
    this.displaySymbols(symbols);

    // Check for wins
    const winResult = this.checkWin(symbols);

    if (winResult.isWin) {
      const totalPayout = this.calculatePayout(winResult.payout, betAmount);
      this.sg_state.gold += totalPayout;
      this.sg_state.totalEarned += totalPayout;
      this.sg_state.winStreak++;
      this.sg_state.loseStreak = 0;

      this.showWinAmount(totalPayout);
      this.showToast(this.getRandomToast("win"), "neutral");
      this.checkAchievements(symbols, winResult);
    } else {
      this.sg_state.winStreak = 0;
      this.sg_state.loseStreak++;
      this.showToast(this.getRandomToast("neutral"), "neutral");
    }

    this.checkStreakAchievements();
    this.checkMoneyAchievements();
    this.updateDisplay();
    this.checkBegButton();
    this.sg_state.isSpinning = false;
  }

  generateSymbols() {
    const symbols = [];
    for (let i = 0; i < this.sg_config.mechanics.reelCount; i++) {
      const rand = Math.random();
      let cumulative = 0;

      for (const symbol of this.sg_config.symbols) {
        cumulative += symbol.rarity;
        if (rand <= cumulative) {
          symbols.push(symbol);
          break;
        }
      }
    }
    return symbols;
  }

  async animateReels() {
    const reels = this.gameContainer.querySelectorAll(".sg-reel");
    const symbols = this.sg_config.symbols.map((s) => s.name);

    // Animate each reel
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      reel.classList.add("sg-spinning");

      // Rapid symbol changes
      const animationDuration =
        this.sg_config.ui.animations.spinDuration +
        i * this.sg_config.ui.animations.reelStaggerDelay;
      const interval = setInterval(() => {
        reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      }, this.sg_config.ui.animations.reelSpinInterval);

      setTimeout(() => {
        clearInterval(interval);
        reel.classList.remove("sg-spinning");
      }, animationDuration);
    }

    return new Promise((resolve) =>
      setTimeout(resolve, this.sg_config.ui.animations.spinDuration + 200)
    );
  }

  displaySymbols(symbols) {
    symbols.forEach((symbol, index) => {
      this.gameContainer.querySelector(`#sg-reel-${index}`).textContent =
        symbol.name;
    });
  }

  checkWin(symbols) {
    // Check for 3 in a row (positions 0,1,2 or 1,2,3 or 2,3,4)
    for (let i = 0; i <= 2; i++) {
      if (
        symbols[i].name === symbols[i + 1].name &&
        symbols[i + 1].name === symbols[i + 2].name
      ) {
        return {
          isWin: true,
          payout: symbols[i].payout * 3,
          count: 3,
          symbol: symbols[i],
        };
      }
    }

    // Check for 2 in a row (positions 0,1 or 1,2 or 2,3 or 3,4)
    for (let i = 0; i <= 3; i++) {
      if (symbols[i].name === symbols[i + 1].name) {
        return {
          isWin: true,
          payout: symbols[i].payout,
          count: 2,
          symbol: symbols[i],
        };
      }
    }

    return { isWin: false };
  }

  calculatePayout(basePayout, betAmount) {
    let multiplier = 1;

    // RTP adjustment
    multiplier *= this.sg_config.mechanics.baseRTP;

    // Level bonus
    multiplier *=
      1 + this.sg_state.level * this.sg_config.leveling.bonusPerLevel;

    // Prestige bonus
    multiplier *=
      1 + this.sg_state.prestige * this.sg_config.prestige.bonusPerPrestige;

    // Bet multiplier
    multiplier *= betAmount;

    return Math.floor(basePayout * multiplier);
  }

  checkAchievements(symbols, winResult) {
    if (!winResult.isWin) return;

    const achievementKey = `${winResult.symbol.name}_${winResult.count}`;
    const achievement = this.sg_state.achievements[achievementKey];

    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      this.sg_state.gold += achievement.reward;
      this.createAchievementParticles(achievement);
      this.updateAchievementsDisplay();
    }
  }

  checkStreakAchievements() {
    // Check win streak achievements
    this.sg_config.achievements.winStreakTargets.forEach((streakCount) => {
      const key = `win_streak_${streakCount}`;
      const achievement = this.sg_state.achievements[key];

      if (
        this.sg_state.winStreak >= streakCount &&
        achievement &&
        !achievement.unlocked
      ) {
        achievement.unlocked = true;
        this.sg_state.gold += achievement.reward;
        this.createAchievementParticles(achievement);
      }
    });

    // Check lose streak achievements
    this.sg_config.achievements.loseStreakTargets.forEach((streakCount) => {
      const key = `lose_streak_${streakCount}`;
      const achievement = this.sg_state.achievements[key];

      if (
        this.sg_state.loseStreak >= streakCount &&
        achievement &&
        !achievement.unlocked
      ) {
        achievement.unlocked = true;
        this.sg_state.gold += achievement.reward;
        this.createAchievementParticles(achievement);
      }
    });

    this.updateAchievementsDisplay();
  }

  checkMoneyAchievements() {
    this.sg_config.achievements.moneyMilestones.forEach((amount) => {
      const key = `earned_${amount}`;
      const achievement = this.sg_state.achievements[key];

      if (
        this.sg_state.totalEarned >= amount &&
        achievement &&
        !achievement.unlocked
      ) {
        achievement.unlocked = true;
        this.sg_state.gold += achievement.reward;
        this.createAchievementParticles(achievement);
      }
    });

    this.updateAchievementsDisplay();
  }

  checkLevelUp() {
    const expNeeded = this.calculateExpNeeded(this.sg_state.level);
    if (this.sg_state.exp >= expNeeded) {
      this.sg_state.level++;
      this.sg_state.exp = 0;
      this.sg_state.expNeeded = this.calculateExpNeeded(this.sg_state.level);
      this.showToast(`Level Up! Level ${this.sg_state.level}`, "neutral");
    }
  }

  calculateExpNeeded(level) {
    // Formula: level * 3 + 1
    return level * 3 + 1;
  }

  beg() {
    const rand = Math.random();
    let cumulative = 0;
    let result = null;

    for (const chance of this.sg_config.begging.chances) {
      cumulative += chance.chance;
      if (rand <= cumulative) {
        result = chance;
        break;
      }
    }

    const message =
      this.sg_config.begging.messages[
        Math.floor(Math.random() * this.sg_config.begging.messages.length)
      ];
    const resultDiv = this.gameContainer.querySelector("#sg-beg-result");

    if (result.amount > 0) {
      this.sg_state.gold += result.amount;
      resultDiv.innerHTML = `<p class="sg-beg-success">"${message}"<br>You received $${result.amount}!</p>`;
    } else {
      resultDiv.innerHTML = `<p class="sg-beg-fail">"${message}"<br>Nobody cares...</p>`;
    }

    this.updateDisplay();
    this.checkBegButton();
  }

  prestige() {
    const cost = this.getPrestigeCost();
    if (this.sg_state.gold < cost) {
      return;
    }

    this.sg_state.gold -= cost;
    this.sg_state.prestige++;

    // Reset achievements and level on prestige
    this.sg_state.level = 0;
    this.sg_state.exp = 0;
    this.sg_state.expNeeded = 1;
    this.initializeAchievements(); // Reset all achievements

    this.updateDisplay();
    this.updateAchievementsDisplay();
  }

  getPrestigeCost() {
    if (this.sg_state.prestige < this.sg_config.prestige.baseCosts.length) {
      return this.sg_config.prestige.baseCosts[this.sg_state.prestige];
    } else {
      const baseIndex = this.sg_config.prestige.baseCosts.length - 1;
      const baseCost = this.sg_config.prestige.baseCosts[baseIndex];
      const extraLevels = this.sg_state.prestige - baseIndex;
      return (
        baseCost * Math.pow(this.sg_config.prestige.costMultiplier, extraLevels)
      );
    }
  }

  checkBegButton() {
    const begBtn = this.gameContainer.querySelector("#sg-beg-btn");
    const canAffordSpin =
      this.sg_state.gold >=
      this.sg_config.betting.betAmounts[this.sg_state.currentBet];
    begBtn.style.display = canAffordSpin ? "none" : "block";
  }

  updateSpinButton() {
    const spinBtn = this.gameContainer.querySelector("#sg-spin-btn");
    const betLabel = this.sg_config.betting.betLabels[this.sg_state.currentBet];
    spinBtn.textContent = `SPIN (${betLabel})`;
  }

  updateDisplay() {
    this.gameContainer.querySelector("#sg-gold-amount").textContent =
      this.sg_state.gold.toFixed(2);
    this.gameContainer.querySelector("#sg-level").textContent =
      this.sg_state.level;
    this.gameContainer.querySelector("#sg-prestige").textContent =
      this.sg_state.prestige;

    // Update bonus displays
    const levelBonus = (
      this.sg_state.level *
      this.sg_config.leveling.bonusPerLevel *
      100
    ).toFixed(0);
    const prestigeBonus = (
      this.sg_state.prestige *
      this.sg_config.prestige.bonusPerPrestige *
      100
    ).toFixed(0);
    this.gameContainer.querySelector("#sg-level-bonus").textContent =
      levelBonus;
    this.gameContainer.querySelector("#sg-prestige-bonus").textContent =
      prestigeBonus;

    // Update EXP bar
    const expFill = this.gameContainer.querySelector("#sg-exp-fill");
    const expText = this.gameContainer.querySelector("#sg-exp-text");
    this.sg_state.expNeeded = this.calculateExpNeeded(this.sg_state.level);
    const expPercent = (this.sg_state.exp / this.sg_state.expNeeded) * 100;
    expFill.style.width = `${expPercent}%`;
    expText.textContent = `EXP: ${this.sg_state.exp}/${this.sg_state.expNeeded}`;

    // Update prestige button
    const prestigeBtn = this.gameContainer.querySelector("#sg-prestige-btn");
    const prestigeCost = this.getPrestigeCost();
    prestigeBtn.textContent = `PRESTIGE ($${prestigeCost})`;
    prestigeBtn.disabled = this.sg_state.gold < prestigeCost;

    this.updateSpinButton();
    this.checkBegButton();
  }

  updateAchievementsDisplay() {
    const achievementsList = this.gameContainer.querySelector(
      "#sg-achievements-list"
    );
    achievementsList.innerHTML = "";

    Object.entries(this.sg_state.achievements).forEach(([key, achievement]) => {
      const div = document.createElement("div");
      div.className = `sg-achievement ${
        achievement.unlocked ? "sg-unlocked" : "sg-locked"
      }`;
      div.innerHTML = `
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <span class="sg-reward">Reward: ${achievement.reward} gold</span>
            `;
      achievementsList.appendChild(div);
    });
  }

  showToast(message, type = "neutral") {
    const toast = document.createElement("div");
    toast.className = `sg-toast`;
    toast.textContent = message;

    const container = this.gameContainer.querySelector("#sg-toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("sg-toast-show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("sg-toast-show");
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, this.sg_config.toasts.duration);
  }

  showWinAmount(amount) {
    const winDisplay = this.gameContainer.querySelector("#sg-win-display");
    winDisplay.textContent = `+${amount} GOLD!`;
    winDisplay.classList.add("sg-win-show");

    setTimeout(() => {
      winDisplay.classList.remove("sg-win-show");
    }, 2000);
  }

  createPaytableContent() {
    const content = this.gameContainer.querySelector("#sg-paytable-content");
    let html = '<div class="sg-paytable-grid">';

    this.sg_config.symbols.forEach((symbol) => {
      const match2Payout = symbol.payout;
      const match3Payout = symbol.payout * 3;

      html += `
                <div class="sg-paytable-row">
                    <div class="sg-symbol-display">${symbol.name}</div>
                    <div class="sg-payout-info">
                        <div>2 in a row: ${match2Payout}x</div>
                        <div>3 in a row: ${match3Payout}x</div>
                    </div>
                </div>
            `;
    });

    html += "</div>";
    content.innerHTML = html;
  }

  createAchievementParticles(achievement) {
    const container = this.gameContainer.querySelector(
      "#sg-particles-container"
    );
    const emoji = this.getAchievementEmoji(achievement);

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "sg-particle";
      particle.textContent = emoji;

      // Random position and animation
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = startY - Math.random() * 100;

      particle.style.left = startX + "%";
      particle.style.top = startY + "%";
      particle.style.setProperty("--end-x", endX + "%");
      particle.style.setProperty("--end-y", endY + "%");

      container.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 3000);
    }
  }

  getAchievementEmoji(achievement) {
    if (
      achievement.name.includes("Double") ||
      achievement.name.includes("Triple")
    ) {
      return achievement.name.includes("💎")
        ? "💎"
        : achievement.name.includes("👑")
        ? "👑"
        : achievement.name.includes("💰")
        ? "💰"
        : achievement.name.includes("🎰")
        ? "🎰"
        : achievement.name.includes("🔥")
        ? "🔥"
        : "⭐";
    } else if (achievement.name.includes("Collector")) {
      return "💰";
    } else if (achievement.name.includes("Streak")) {
      return "🔥";
    } else if (achievement.name.includes("Unlucky")) {
      return "💔";
    }
    return "🎉";
  }

  getRandomToast(type = "neutral") {
    let messages;
    if (type === "win") {
      messages = this.sg_config.toasts.bigWinMessages;
    } else if (type === "losing") {
      messages = this.sg_config.toasts.losingStreakMessages;
    } else {
      messages = this.sg_config.toasts.neutralMessages;
    }
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Public methods for external control
  destroy() {
    if (this.gameContainer && this.gameContainer.parentNode) {
      this.gameContainer.parentNode.removeChild(this.gameContainer);
    }
  }

  getState() {
    return { ...this.sg_state };
  }

  setState(newState) {
    this.sg_state = { ...this.sg_state, ...newState };
    this.updateDisplay();
  }
}

// Auto-initialize when DOM is ready (only if auto-init is enabled)
document.addEventListener("DOMContentLoaded", () => {
  // Only auto-initialize if explicitly enabled and not already instantiated
  if (
    window.SlotsGoldAutoInit !== false &&
    typeof window.slotsGoldInstance === "undefined"
  ) {
    try {
      window.slotsGoldInstance = new SlotsGold();
    } catch (error) {
      console.error("SlotsGold auto-initialization failed:", error.message);
    }
  }
});

// Global factory function for manual instantiation
window.createSlotsGold = function (targetContainer, config) {
  return new SlotsGold(targetContainer, config);
};
