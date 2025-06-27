import { Achievements } from "./utils/achievements.js";
import { Toasts } from "./utils/toasts.js";
import { Paytable } from "./utils/paytable.js";

class SlotsGold {
  constructor(targetContainer = null, config = null) {
    this.sg_config =
      config || (typeof SG_CONFIG !== "undefined" ? SG_CONFIG : null);
    if (!this.sg_config) {
      throw new Error(
        "SlotsGold: Configuration not found. Please load slots-gold-config.js first."
      );
    }
    this.targetContainer = targetContainer;
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
      latestWin: null, // Track latest win for paytable highlighting
    };
    this.initializeAchievements();
    this.createGameElements();
    this.bindEvents();
    this.updateDisplay();
  }

  initializeAchievements() {
    const achievements = {};
    this.sg_config.symbols.forEach((symbol) => {
      [3, 4, 5].forEach((count) => {
        achievements[`${symbol.name}_${count}`] = {
          name: `${count} ${symbol.name}`,
          description: `Get ${count} ${symbol.name} in a row`,
          reward:
            symbol.payout *
            this.sg_config.achievements[`match${count}Multiplier`],
          unlocked: false,
        };
      });
    });
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
        <button id="sg-paytable-btn" class="sg-paytable-btn">📊</button>
        <button id="sg-achievements-toggle" class="sg-achievements-toggle">🏆</button>
        <h1>🎰 Golden Slots 🎰</h1>
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
        <div class="sg-progression">
          <div class="sg-level-info">
            <span class="sg-level-display">⭐ Lv.<span id="sg-level">${
              this.sg_state.level
            }</span></span>
            <span class="sg-level-bonus">+<span id="sg-level-bonus">0</span>% Bonus</span>
          </div>
          <div class="sg-exp-bar">
            <div class="sg-exp-fill" id="sg-exp-fill"></div>
            <span class="sg-exp-text" id="sg-exp-text">EXP: 0/1</span>
          </div>
        </div>
      </div>
      <div class="sg-spin-section">
        <button id="sg-spin-btn" class="sg-spin-btn">SPIN (${
          this.sg_config.betting.betLabels[this.sg_state.currentBet]
        })</button>
        <div class="sg-prestige-section">
          <button id="sg-prestige-btn" class="sg-prestige-btn">PRESTIGE ($${this.getPrestigeCost()})</button>
          <div class="sg-prestige-bonus-display">👑 +<span id="sg-prestige-bonus">0</span>% Bonus</div>
        </div>
      </div>
      <div class="sg-controls">
        <div class="sg-betting-section">
          <div class="sg-money-display">
            <span class="sg-gold-label">💰 Balance:</span>
            <span class="sg-gold-amount" id="sg-gold-amount">${
              this.sg_state.gold
            }</span>
          </div>
          <div class="sg-bet-controls">
            <label>Bet:</label>
            <select id="sg-bet-select">
              ${this.sg_config.betting.betLabels
                .map(
                  (label, index) =>
                    `<option value="${index}" ${
                      index === this.sg_state.currentBet ? "selected" : ""
                    }>${label}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>
        <div class="sg-action-buttons">
          <button id="sg-beg-btn" class="sg-beg-btn" style="display: none;">BEG</button>
        </div>
      </div>
      <div id="sg-achievements-sidebar" class="sg-achievements-sidebar">
        <div class="sg-achievements-header">
          <h3>🏆 Achievements</h3>
          <button id="sg-achievements-close" class="sg-achievements-close">✕</button>
        </div>
        <div id="sg-achievements-list" class="sg-achievements-list"></div>
      </div>
      <div id="sg-paytable-sidebar" class="sg-paytable-sidebar">
        <div class="sg-paytable-header">
          <h3>📊 Pay Table</h3>
          <button id="sg-paytable-close" class="sg-paytable-close">✕</button>
        </div>
        <div id="sg-paytable-content" class="sg-paytable-content"></div>
        <div class="sg-rtp-info">
          <strong>Return to Player: ${(
            this.sg_config.mechanics.baseRTP * 100
          ).toFixed(1)}%</strong>
        </div>
      </div>
      <div id="sg-overlay" class="sg-overlay"></div>
      <div id="sg-beg-overlay" class="sg-overlay">
        <div class="sg-beg-popup">
          <h3>💸 Begging Corner</h3>
          <p>When all hope is lost...</p>
          <button id="sg-beg-action" class="sg-beg-action">Ask for Charity</button>
          <div id="sg-beg-result"></div>
          <button id="sg-beg-close" class="sg-close-btn">Close</button>
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
      .addEventListener("click", () => this.showPaytableSidebar());
    this.gameContainer
      .querySelector("#sg-paytable-close")
      .addEventListener("click", () => this.hidePaytableSidebar());
    this.gameContainer
      .querySelector("#sg-achievements-toggle")
      .addEventListener("click", () => this.showAchievementsSidebar());
    this.gameContainer
      .querySelector("#sg-achievements-close")
      .addEventListener("click", () => this.hideAchievementsSidebar());
    this.gameContainer
      .querySelector("#sg-bet-select")
      .addEventListener("change", (e) => {
        this.sg_state.currentBet = parseInt(e.target.value);
        this.updateSpinButton();
      });
    this.gameContainer
      .querySelector("#sg-beg-overlay")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("sg-overlay")) {
          this.hideBegPopup();
        }
      });
    document.addEventListener("click", (e) => {
      const achievementsSidebar = this.gameContainer.querySelector(
        "#sg-achievements-sidebar"
      );
      const achievementsToggle = this.gameContainer.querySelector(
        "#sg-achievements-toggle"
      );
      const paytableSidebar = this.gameContainer.querySelector(
        "#sg-paytable-sidebar"
      );
      const paytableBtn = this.gameContainer.querySelector("#sg-paytable-btn");
      if (
        achievementsSidebar.classList.contains("sg-sidebar-open") &&
        !achievementsSidebar.contains(e.target) &&
        !achievementsToggle.contains(e.target)
      ) {
        this.hideAchievementsSidebar();
      }
      if (
        paytableSidebar.classList.contains("sg-sidebar-open") &&
        !paytableSidebar.contains(e.target) &&
        !paytableBtn.contains(e.target)
      ) {
        this.hidePaytableSidebar();
      }
    });
  }

  showAchievementsSidebar() {
    const sidebar = this.gameContainer.querySelector(
      "#sg-achievements-sidebar"
    );
    const toggle = this.gameContainer.querySelector("#sg-achievements-toggle");
    const overlay = this.gameContainer.querySelector("#sg-overlay");
    sidebar.classList.add("sg-sidebar-open");
    toggle.classList.add("sg-toggle-hidden");
    overlay.classList.add("sg-overlay-show");
  }

  hideAchievementsSidebar() {
    const sidebar = this.gameContainer.querySelector(
      "#sg-achievements-sidebar"
    );
    const toggle = this.gameContainer.querySelector("#sg-achievements-toggle");
    const overlay = this.gameContainer.querySelector("#sg-overlay");
    sidebar.classList.remove("sg-sidebar-open");
    toggle.classList.remove("sg-toggle-hidden");
    overlay.classList.remove("sg-overlay-show");
  }

  showPaytableSidebar() {
    const sidebar = this.gameContainer.querySelector("#sg-paytable-sidebar");
    const overlay = this.gameContainer.querySelector("#sg-overlay");
    sidebar.classList.add("sg-sidebar-open");
    overlay.classList.add("sg-overlay-show");
  }

  hidePaytableSidebar() {
    const sidebar = this.gameContainer.querySelector("#sg-paytable-sidebar");
    const overlay = this.gameContainer.querySelector("#sg-overlay");
    sidebar.classList.remove("sg-sidebar-open");
    overlay.classList.remove("sg-overlay-show");
  }

  showBegPopup() {
    const overlay = this.gameContainer.querySelector("#sg-beg-overlay");
    overlay.classList.add("sg-overlay-show");
  }

  hideBegPopup() {
    const overlay = this.gameContainer.querySelector("#sg-beg-overlay");
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
    this.clearWinLoseMessage(); // Clear previous win/lose message
    this.sg_state.exp += this.sg_config.leveling.expPerSpin;
    this.checkLevelUp();
    await this.animateReelsProgressive();
    const symbols = this.generateSymbols();
    this.displaySymbols(symbols);
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
      this.showLoseMessage();
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

  async animateReelsProgressive() {
    const reels = this.gameContainer.querySelectorAll(".sg-reel");
    const symbols = this.sg_config.symbols.map((s) => s.name);
    reels.forEach((reel) => {
      reel.classList.remove("sg-revealed", "sg-win-highlight");
    });
    const finalSymbols = this.generateSymbols();
    const potentialWin = this.checkWin(finalSymbols);
    const hasPotentialBigWin = potentialWin.isWin && potentialWin.payout >= 20;
    const revealTiming = [
      { delay: 0, duration: 600 },
      { delay: 200, duration: 700 },
      { delay: 500, duration: 800 },
      { delay: 1500, duration: 400 },
      { delay: hasPotentialBigWin ? 3500 : 2200, duration: 500 },
    ];
    this.pendingSymbols = finalSymbols;
    const animationPromises = [];
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      const timing = revealTiming[i];
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          reel.classList.add("sg-spinning");
          const interval = setInterval(() => {
            reel.textContent =
              symbols[Math.floor(Math.random() * symbols.length)];
          }, 50);
          setTimeout(() => {
            clearInterval(interval);
            reel.classList.remove("sg-spinning");
            reel.classList.add("sg-revealed");
            reel.textContent = finalSymbols[i].name;
            if (i >= 3) {
              reel.style.transform = "scale(1.1)";
              setTimeout(() => {
                reel.style.transform = "scale(1)";
              }, 200);
            }
            resolve();
          }, timing.duration);
        }, timing.delay);
      });
      animationPromises.push(promise);
    }
    await Promise.all(animationPromises);
    if (hasPotentialBigWin) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  displaySymbols(symbols) {
    const symbolsToDisplay = this.pendingSymbols || symbols;
    const winResult = this.checkWin(symbolsToDisplay);
    symbolsToDisplay.forEach((symbol, index) => {
      const reel = this.gameContainer.querySelector(`#sg-reel-${index}`);
      reel.textContent = symbol.name;
      if (winResult.isWin && winResult.winningIndices.includes(index)) {
        reel.classList.add("sg-win-highlight");
      } else {
        reel.classList.remove("sg-win-highlight");
      }
    });
    this.pendingSymbols = null;
  }

  checkWin(symbols) {
    for (let i = 0; i <= 2; i++) {
      // Check 5 matches
      if (
        i === 0 &&
        symbols[0].name === symbols[1].name &&
        symbols[1].name === symbols[2].name &&
        symbols[2].name === symbols[3].name &&
        symbols[3].name === symbols[4].name
      ) {
        this.sg_state.latestWin = { symbol: symbols[0].name, count: 5 };
        return {
          isWin: true,
          payout: symbols[0].payout * symbols[0].multipliers[5],
          count: 5,
          symbol: symbols[0],
          winningIndices: [0, 1, 2, 3, 4],
        };
      }
      // Check 4 matches
      if (
        i <= 1 &&
        symbols[i].name === symbols[i + 1].name &&
        symbols[i + 1].name === symbols[i + 2].name &&
        symbols[i + 2].name === symbols[i + 3].name
      ) {
        this.sg_state.latestWin = { symbol: symbols[i].name, count: 4 };
        return {
          isWin: true,
          payout: symbols[i].payout * symbols[i].multipliers[4],
          count: 4,
          symbol: symbols[i],
          winningIndices: [i, i + 1, i + 2, i + 3],
        };
      }
      // Check 3 matches
      if (
        symbols[i].name === symbols[i + 1].name &&
        symbols[i + 1].name === symbols[i + 2].name
      ) {
        this.sg_state.latestWin = { symbol: symbols[i].name, count: 3 };
        return {
          isWin: true,
          payout: symbols[i].payout * symbols[i].multipliers[3],
          count: 3,
          symbol: symbols[i],
          winningIndices: [i, i + 1, i + 2],
        };
      }
    }
    this.sg_state.latestWin = null;
    return { isWin: false };
  }

  calculatePayout(basePayout, betAmount) {
    let multiplier = 1;
    multiplier *= this.sg_config.mechanics.baseRTP;
    multiplier *=
      1 + this.sg_state.level * this.sg_config.leveling.bonusPerLevel;
    multiplier *=
      1 + this.sg_state.prestige * this.sg_config.prestige.bonusPerPrestige;
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
    this.sg_state.level = 0;
    this.sg_state.exp = 0;
    this.sg_state.expNeeded = 1;
    this.initializeAchievements();
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
      return Math.floor(
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
    const expFill = this.gameContainer.querySelector("#sg-exp-fill");
    const expText = this.gameContainer.querySelector("#sg-exp-text");
    this.sg_state.expNeeded = this.calculateExpNeeded(this.sg_state.level);
    const expPercent = (this.sg_state.exp / this.sg_state.expNeeded) * 100;
    expFill.style.width = `${expPercent}%`;
    expText.textContent = `${this.sg_state.exp}/${this.sg_state.expNeeded}`;
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
  }

  showLoseMessage() {
    const winDisplay = this.gameContainer.querySelector("#sg-win-display");
    winDisplay.textContent = `NO WIN`;
    winDisplay.classList.add("sg-lose-show");
  }

  clearWinLoseMessage() {
    const winDisplay = this.gameContainer.querySelector("#sg-win-display");
    winDisplay.textContent = "";
    winDisplay.classList.remove("sg-win-show", "sg-lose-show");
  }

  createPaytableContent() {
    const content = this.gameContainer.querySelector("#sg-paytable-content");
    let html = '<div class="sg-paytable-grid">';
    this.sg_config.symbols.forEach((symbol) => {
      const match3Payout = symbol.payout * symbol.multipliers[3];
      const match4Payout = symbol.payout * symbol.multipliers[4];
      const match5Payout = symbol.payout * symbol.multipliers[5];
      const isLatestWin =
        this.sg_state.latestWin &&
        this.sg_state.latestWin.symbol === symbol.name &&
        this.sg_state.latestWin.count >= 3;
      html += `
        <div class="sg-paytable-row ${isLatestWin ? "sg-latest-win" : ""}">
          <div class="sg-symbol-display">${symbol.name}</div>
          <div class="sg-payout-info">
            <div>3 in a row: ${match3Payout}x</div>
            <div>4 in a row: ${match4Payout}x</div>
            <div>5 in a row: ${match5Payout}x</div>
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
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = startY - Math.random() * 100;
      particle.style.left = startX + "%";
      particle.style.top = startY + "%";
      particle.style.setProperty("--end-x", endX + "%");
      particle.style.setProperty("--end-y", endY + "%");
      container.appendChild(particle);
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 3000);
    }
  }

  getAchievementEmoji(achievement) {
    if (
      achievement.name.includes("3") ||
      achievement.name.includes("4") ||
      achievement.name.includes("5")
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

document.addEventListener("DOMContentLoaded", () => {
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

window.createSlotsGold = function (targetContainer, config) {
  return new SlotsGold(targetContainer, config);
};

export function createSlotsGold(targetContainer, config) {
  return new SlotsGold(targetContainer, config);
}
