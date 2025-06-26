// Enhanced Slots game functionality - FIXED VERSION
class SlotsGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.config = GameConfig.SLOTS;
    this.spinning = false;
    this.reels = ["?", "?", "?"];
    this.reelElements = [];
    this.spinHistory = [];
    this.autoSpinActive = false;
    this.autoSpinCount = 0;
    this.screenElement = null;
    this.init();
  }

  init() {
    this.initializeAnimations();
  }

  // HTML template for the slots screen
  getHTMLTemplate() {
    return `
      <div id="slots-screen" class="screen">
        <div class="container">
          <button id="slots-back" class="back-button">← Back to Hub</button>
          <div class="game-header">
            <h1>🎰 Slots</h1>
            <p>Money: <span id="slots-money">${this.game.formatMoney(
              this.game.playerMoney
            )}</span> | Bet: $<span id="slots-current-bet">${
      this.game.gameSettings.slotsBet
    }</span></p>
          </div>
          
          <div class="slots-machine">
            <div class="slots-reels">
              <div class="reel">?</div>
              <div class="reel">?</div>
              <div class="reel">?</div>
            </div>
            <button id="spin-button" class="spin-button">SPIN ($<span id="spin-cost">${
              this.game.gameSettings.slotsBet
            }</span>)</button>
            
            <div class="auto-spin-controls">
              <h4>Auto Spin</h4>
              <button class="auto-spin-button" data-spins="5">5x</button>
              <button class="auto-spin-button" data-spins="10">10x</button>
              <button class="auto-spin-button" data-spins="25">25x</button>
              <button class="auto-spin-button" data-spins="50">50x</button>
            </div>
          </div>
          
          <div class="spin-history" id="spin-history-container">
            <h4>📊 Recent Spins</h4>
            <div id="spin-history"></div>
          </div>
          
          <div class="payouts-info">
            <h3>💰 Payouts 💰</h3>
            <div class="payout-tier mega">
              <p>7️⃣ 7️⃣ 7️⃣ Lucky Sevens: <span class="multiplier">100x</span></p>
              <p>💎 💎 💎 Diamond Jackpot: <span class="multiplier">50x</span></p>
              <p>💰 💰 💰 Money Bags: <span class="multiplier">25x</span></p>
            </div>
            <div class="payout-tier high">
              <p>⭐ ⭐ ⭐ Triple Stars: <span class="multiplier">15x</span></p>
              <p>🍊 🍊 🍊 Orange Burst: <span class="multiplier">8x</span></p>
              <p>Mixed Jackpot Symbols: <span class="multiplier">12x</span></p>
            </div>
            <div class="payout-tier pairs">
              <p>💎 💎 Diamond Pair: <span class="multiplier">5x</span></p>
              <p>7️⃣7️⃣ Lucky Pair: <span class="multiplier">4x</span></p>
              <p>Any Pair: <span class="multiplier">1.5x</span></p>
            </div>
            <div class="payout-tier bonus">
              <p>💎 Diamond Bonus: <span class="multiplier">0.5x</span></p>
              <p>7️⃣ Lucky Seven: <span class="multiplier">0.25x</span></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create and inject the HTML
  createScreen() {
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
      gameContainer.innerHTML = this.getHTMLTemplate();
      this.screenElement = document.getElementById("slots-screen");
      this.bindEvents();
      this.updateDisplay();
    }
  }

  // Remove the screen
  destroyScreen() {
    this.clearPreviousAnimations();
    this.stopAutoSpin();
    if (this.screenElement) {
      this.screenElement.remove();
      this.screenElement = null;
    }
  }

  // Show the screen
  show() {
    this.createScreen();
    if (this.screenElement) {
      this.screenElement.classList.add("active");
      this.onShow();
    }
  }

  // Hide the screen
  hide() {
    if (this.screenElement) {
      this.screenElement.classList.remove("active");
      // Small delay before destroying to allow transition
      setTimeout(() => {
        this.destroyScreen();
      }, 100);
    }
  }

  initializeAnimations() {
    // Initialize CSS animations if not already done
    if (window.AnimationUtils) {
      window.AnimationUtils.initializeCSS();
    }
  }

  bindEvents() {
    const spinButton = document.getElementById("spin-button");
    if (spinButton) {
      spinButton.addEventListener("click", () => this.spin());
    }

    // Add auto-spin controls
    const autoSpinContainer = document.querySelector(".auto-spin-controls");
    if (autoSpinContainer) {
      autoSpinContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("auto-spin-button")) {
          const count = parseInt(e.target.dataset.spins);
          this.startAutoSpin(count);
        }
      });
    }

    // Add keyboard support
    document.addEventListener("keydown", (e) => {
      if (this.game.currentScreen === "slots") {
        if (e.code === "Space" || e.code === "Enter") {
          e.preventDefault();
          this.spin();
        }
      }
    });
  }

  spin() {
    if (this.spinning) return;

    const bet = this.game.gameSettings.slotsBet;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage("Not enough money!", 2000);
      this.stopAutoSpin();
      return;
    }

    this.spinning = true;
    this.updateSpinButton();
    this.clearPreviousAnimations();

    // Enhanced spinning animation with staggered timing
    this.startEnhancedSpinAnimation();

    // Generate results with realistic timing
    setTimeout(() => {
      this.generateResult(bet);
    }, 2500);
  }

  startEnhancedSpinAnimation() {
    this.reelElements = document.querySelectorAll(".reel");

    // Add spinning effects to each reel with different timings
    this.reelElements.forEach((reel, index) => {
      reel.classList.add("spinning");

      // Add blur effect during spin
      reel.style.filter = "blur(2px)";
      reel.style.transform = "scale(0.95)";

      // Rapid symbol changes with acceleration/deceleration
      let spinSpeed = 50; // Start fast
      const maxSpeed = 200; // Slow down to this
      let currentSpeed = spinSpeed;

      const spinInterval = setInterval(() => {
        if (this.spinning) {
          reel.textContent = this.getRandomSymbol();

          // Gradually slow down the spin
          if (currentSpeed < maxSpeed) {
            currentSpeed += 2;
          }
        } else {
          clearInterval(spinInterval);
        }
      }, currentSpeed);

      // Stop each reel at different times for realistic cascade effect
      const stopDelay = 1800 + index * 300;
      setTimeout(() => {
        if (reel) {
          reel.classList.remove("spinning");
          reel.style.filter = "";
          reel.style.transform = "";

          // Add landing animation
          reel.style.animation = "reelLand 0.3s ease-out";
          setTimeout(() => {
            if (reel) {
              reel.style.animation = "";
            }
          }, 300);
        }
      }, stopDelay);
    });
  }

  getRandomSymbol() {
    // Use weighted random selection for more realistic feel
    const symbols = this.config.SYMBOLS;
    const weights = this.config.WEIGHTS;

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < symbols.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return symbols[i];
      }
    }

    return symbols[0]; // Fallback
  }

  generateResult(bet) {
    // Generate final reel results using weighted probability
    this.reels = [
      this.getRandomSymbol(),
      this.getRandomSymbol(),
      this.getRandomSymbol(),
    ];

    // Update display with dramatic reveal
    this.revealResults();

    // Calculate winnings with enhanced logic
    const result = this.calculateEnhancedWin(bet);

    // Add to history
    this.spinHistory.push({
      reels: [...this.reels],
      result: result,
      bet: bet,
      timestamp: Date.now(),
    });

    // Process the result with enhanced effects
    this.processEnhancedResult(result, bet);

    this.spinning = false;

    // Continue auto-spin if active
    if (this.autoSpinActive && this.autoSpinCount > 0) {
      this.autoSpinCount--;
      if (this.autoSpinCount > 0 && this.game.canAfford(bet)) {
        setTimeout(
          () => {
            if (this.autoSpinActive) {
              this.spin();
            }
          },
          result.tier === "mega" ? 4000 : result.tier === "high" ? 3000 : 2000
        );
      } else {
        this.stopAutoSpin();
      }
    }

    this.updateSpinButton();
  }

  revealResults() {
    this.reelElements.forEach((reel, index) => {
      setTimeout(() => {
        if (reel) {
          reel.textContent = this.reels[index];

          // Add symbol-specific effects
          this.addSymbolEffects(reel, this.reels[index]);

          // Animate the reveal
          reel.style.animation = "symbolReveal 0.5s ease-out";
          setTimeout(() => {
            if (reel) {
              reel.style.animation = "";
            }
          }, 500);
        }
      }, index * 200);
    });
  }

  addSymbolEffects(reel, symbol) {
    // Remove previous symbol classes
    reel.className = reel.className.replace(/symbol-\w+/g, "");

    // Add symbol-specific styling
    const symbolClasses = {
      "💎": "symbol-diamond",
      "7️⃣": "symbol-seven",
      "💰": "symbol-money",
      "🎰": "symbol-slot",
      "⭐": "symbol-star",
    };

    if (symbolClasses[symbol]) {
      reel.classList.add(symbolClasses[symbol]);
    }
  }

  calculateEnhancedWin(bet) {
    const [reel1, reel2, reel3] = this.reels;
    const payouts = this.config.PAYOUTS;

    // Check for exact three-of-a-kind matches
    const threeOfAKindKey = `${reel1}${reel2}${reel3}`;
    if (payouts[threeOfAKindKey]) {
      return {
        type: "exact_match",
        key: threeOfAKindKey,
        ...payouts[threeOfAKindKey],
        winAmount: bet * payouts[threeOfAKindKey].multiplier,
        bet: bet,
      };
    }

    // Check for mixed jackpot symbols
    const jackpotSymbols = this.config.JACKPOT_SYMBOLS;
    const jackpotCount = this.reels.filter((symbol) =>
      jackpotSymbols.includes(symbol)
    ).length;

    if (
      jackpotCount === 3 &&
      reel1 !== reel2 &&
      reel2 !== reel3 &&
      reel1 !== reel3
    ) {
      return {
        type: "jackpot_mix",
        key: "JACKPOT_MIX",
        ...payouts.JACKPOT_MIX,
        winAmount: bet * payouts.JACKPOT_MIX.multiplier,
        bet: bet,
      };
    }

    // Check for premium pairs
    const pairChecks = [
      {
        pattern: "💎💎_",
        check: () =>
          (reel1 === "💎" && reel2 === "💎") ||
          (reel2 === "💎" && reel3 === "💎") ||
          (reel1 === "💎" && reel3 === "💎"),
      },
      {
        pattern: "7️⃣7️⃣_",
        check: () =>
          (reel1 === "7️⃣" && reel2 === "7️⃣") ||
          (reel2 === "7️⃣" && reel3 === "7️⃣") ||
          (reel1 === "7️⃣" && reel3 === "7️⃣"),
      },
      {
        pattern: "💰💰_",
        check: () =>
          (reel1 === "💰" && reel2 === "💰") ||
          (reel2 === "💰" && reel3 === "💰") ||
          (reel1 === "💰" && reel3 === "💰"),
      },
      {
        pattern: "🎰🎰_",
        check: () =>
          (reel1 === "🎰" && reel2 === "🎰") ||
          (reel2 === "🎰" && reel3 === "🎰") ||
          (reel1 === "🎰" && reel3 === "🎰"),
      },
      {
        pattern: "⭐⭐_",
        check: () =>
          (reel1 === "⭐" && reel2 === "⭐") ||
          (reel2 === "⭐" && reel3 === "⭐") ||
          (reel1 === "⭐" && reel3 === "⭐"),
      },
    ];

    for (const pairCheck of pairChecks) {
      if (pairCheck.check()) {
        return {
          type: "premium_pair",
          key: pairCheck.pattern,
          ...payouts[pairCheck.pattern],
          winAmount: bet * payouts[pairCheck.pattern].multiplier,
          bet: bet,
        };
      }
    }

    // Check for regular two of a kind
    if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      return {
        type: "two_of_a_kind",
        key: "TWO_OF_A_KIND",
        ...payouts.TWO_OF_A_KIND,
        winAmount: bet * payouts.TWO_OF_A_KIND.multiplier,
        bet: bet,
      };
    }

    // Check for single symbol bonuses
    if (this.reels.includes("💎")) {
      return {
        type: "single_bonus",
        key: "SINGLE_DIAMOND",
        ...payouts.SINGLE_DIAMOND,
        winAmount: bet * payouts.SINGLE_DIAMOND.multiplier,
        bet: bet,
      };
    }

    if (this.reels.includes("7️⃣")) {
      return {
        type: "single_bonus",
        key: "SINGLE_SEVEN",
        ...payouts.SINGLE_SEVEN,
        winAmount: bet * payouts.SINGLE_SEVEN.multiplier,
        bet: bet,
      };
    }

    // No match
    return {
      type: "no_match",
      key: "NO_MATCH",
      name: "No match",
      multiplier: 0,
      tier: "none",
      winAmount: 0,
      bet: bet,
    };
  }

  processEnhancedResult(result, bet) {
    // Deduct bet first
    this.game.spendMoney(bet);

    // Add winnings and show appropriate animations
    if (result.winAmount > 0) {
      this.game.winMoney(result.winAmount);
      this.showEnhancedWinAnimation(result);
    } else {
      this.showEnhancedLoseAnimation();
    }

    // Show contextual message
    const message =
      result.winAmount > 0
        ? `${result.name} - Won ${this.game.formatMoney(result.winAmount)}!`
        : "No match this time - Try again!";

    const messageDuration =
      result.tier === "mega" ? 4000 : result.tier === "high" ? 3000 : 2000;
    this.game.showMessage(message, messageDuration);

    // Update advanced displays
    this.updatePayoutDisplay(result);
    this.updateSpinHistory();
  }

  showEnhancedWinAnimation(result) {
    const slotsContainer = document.querySelector(".slots-machine");
    if (!slotsContainer) return;

    // Remove any existing animation classes
    slotsContainer.classList.remove(
      "big-win",
      "mega-win",
      "small-win",
      "bonus-win"
    );

    switch (result.tier) {
      case "mega":
        slotsContainer.classList.add("mega-win");
        this.showMegaJackpotEffects(result);
        break;
      case "high":
        slotsContainer.classList.add("big-win");
        this.showBigWinEffects(result);
        break;
      case "medium":
        slotsContainer.classList.add("small-win");
        this.showMediumWinEffects(result);
        break;
      case "low":
        slotsContainer.classList.add("small-win");
        this.showSmallWinEffects(result);
        break;
      case "bonus":
        slotsContainer.classList.add("bonus-win");
        this.showBonusEffects(result);
        break;
    }

    // Highlight winning symbols
    this.highlightWinningSymbols(result);

    // Remove animation classes after animation
    setTimeout(
      () => {
        if (slotsContainer) {
          slotsContainer.classList.remove(
            "mega-win",
            "big-win",
            "small-win",
            "bonus-win"
          );
        }
      },
      result.tier === "mega" ? 4000 : 3000
    );
  }

  showMegaJackpotEffects(result) {
    // Massive confetti explosion
    if (window.AnimationUtils) {
      window.AnimationUtils.createConfetti(document.body, 100);
    }

    // Screen flash effect
    this.createScreenFlash("#ffd700");

    // Floating jackpot text
    this.createFloatingJackpotText(result.name);

    // Fireworks
    this.showFireworks(8);
  }

  showBigWinEffects(result) {
    if (window.AnimationUtils) {
      const slotsContainer = document.querySelector(".slots-machine");
      if (slotsContainer) {
        window.AnimationUtils.createConfetti(slotsContainer, 50);
      }
    }
    this.showFireworks(4);
    this.createFloatingText("BIG WIN!", "#28a745");
  }

  showMediumWinEffects(result) {
    if (window.AnimationUtils) {
      const slotsContainer = document.querySelector(".slots-machine");
      if (slotsContainer) {
        window.AnimationUtils.createConfetti(slotsContainer, 25);
      }
    }
    this.createFloatingText("NICE WIN!", "#ffc107");
  }

  showSmallWinEffects(result) {
    // Subtle sparkle effect
    const reelsContainer = document.querySelector(".slots-reels");
    if (reelsContainer) {
      this.createSparkles(reelsContainer, 10);
    }
    this.createFloatingText("WIN!", "#17a2b8");
  }

  showBonusEffects(result) {
    // Gentle pulse effect
    const reels = document.querySelector(".slots-reels");
    if (reels) {
      reels.style.animation = "bonusPulse 1s ease-in-out";
      setTimeout(() => {
        if (reels) {
          reels.style.animation = "";
        }
      }, 1000);
    }
  }

  showEnhancedLoseAnimation() {
    const slotsContainer = document.querySelector(".slots-machine");
    if (slotsContainer) {
      slotsContainer.classList.add("lose-spin");

      // Subtle shake effect
      if (window.AnimationUtils) {
        window.AnimationUtils.shakeElement(slotsContainer, 300);
      }

      setTimeout(() => {
        if (slotsContainer) {
          slotsContainer.classList.remove("lose-spin");
        }
      }, 1000);
    }
  }

  highlightWinningSymbols(result) {
    if (result.winAmount <= 0) return;

    this.reelElements.forEach((reel, index) => {
      if (!reel) return;

      const symbol = this.reels[index];

      // Determine if this symbol contributed to the win
      let isWinning = false;

      if (result.type === "exact_match") {
        isWinning = true;
      } else if (
        result.type === "jackpot_mix" &&
        this.config.JACKPOT_SYMBOLS.includes(symbol)
      ) {
        isWinning = true;
      } else if (
        result.type === "premium_pair" ||
        result.type === "two_of_a_kind"
      ) {
        // Check if this symbol is part of the pair
        isWinning = this.reels.filter((s) => s === symbol).length >= 2;
      } else if (result.type === "single_bonus") {
        isWinning =
          (result.key === "SINGLE_DIAMOND" && symbol === "💎") ||
          (result.key === "SINGLE_SEVEN" && symbol === "7️⃣");
      }

      if (isWinning) {
        reel.classList.add("winning-symbol");

        // Add tier-specific glow
        const glowClass = `glow-${result.tier}`;
        reel.classList.add(glowClass);

        setTimeout(() => {
          if (reel) {
            reel.classList.remove("winning-symbol", glowClass);
          }
        }, 3000);
      }
    });
  }

  createScreenFlash(color) {
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${color};
      opacity: 0.7;
      z-index: 9999;
      pointer-events: none;
      animation: screenFlash 0.5s ease-out;
    `;

    document.body.appendChild(flash);

    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 500);
  }

  createFloatingJackpotText(text) {
    const jackpotText = document.createElement("div");
    jackpotText.textContent = text;
    jackpotText.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      z-index: 9998;
      pointer-events: none;
      animation: jackpotText 3s ease-out forwards;
    `;

    document.body.appendChild(jackpotText);

    setTimeout(() => {
      if (jackpotText.parentNode) {
        jackpotText.parentNode.removeChild(jackpotText);
      }
    }, 3000);
  }

  createFloatingText(text, color) {
    if (window.AnimationUtils) {
      const reelsContainer = document.querySelector(".slots-reels");
      if (reelsContainer) {
        const rect = reelsContainer.getBoundingClientRect();
        window.AnimationUtils.floatingText(
          text,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          color,
          2000
        );
      }
    }
  }

  createSparkles(container, count) {
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = "✨";
      sparkle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: 1rem;
        pointer-events: none;
        animation: sparkle 1s ease-out forwards;
      `;

      container.style.position = "relative";
      container.appendChild(sparkle);

      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 1000);
    }
  }

  showFireworks(count = 4) {
    const container = document.querySelector(".slots-machine");
    if (!container) return;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.createSingleFirework(container);
      }, i * 300);
    }
  }

  createSingleFirework(container) {
    if (!container) return;

    const firework = document.createElement("div");
    firework.className = "firework-burst";
    firework.style.cssText = `
      position: absolute;
      left: ${20 + Math.random() * 60}%;
      top: ${20 + Math.random() * 60}%;
      width: 4px;
      height: 4px;
    `;

    // Create particles
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffeaa7",
      "#dda0dd",
      "#ff9ff3",
      "#54a0ff",
    ];
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        animation: fireworkParticle 1.5s ease-out forwards;
        transform: rotate(${i * 30}deg);
      `;
      firework.appendChild(particle);
    }

    container.style.position = "relative";
    container.appendChild(firework);

    setTimeout(() => {
      if (firework.parentNode) {
        firework.parentNode.removeChild(firework);
      }
    }, 1500);
  }

  clearPreviousAnimations() {
    // Remove any existing animation classes
    document
      .querySelectorAll(
        ".winning-symbol, .glow-mega, .glow-high, .glow-medium, .glow-low, .glow-bonus"
      )
      .forEach((el) => {
        el.classList.remove(
          "winning-symbol",
          "glow-mega",
          "glow-high",
          "glow-medium",
          "glow-low",
          "glow-bonus"
        );
      });

    // Clear any floating elements
    document.querySelectorAll(".firework-burst, .sparkle").forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  updateDisplay() {
    const reelElements = document.querySelectorAll(".reel");
    reelElements.forEach((reel, index) => {
      if (reel) {
        reel.textContent = this.reels[index];
      }
    });
  }

  updateSpinButton() {
    const spinButton = document.getElementById("spin-button");
    if (!spinButton) return;

    const bet = this.game.gameSettings.slotsBet;

    if (this.spinning) {
      spinButton.textContent = "SPINNING...";
      spinButton.disabled = true;
      spinButton.classList.add("spinning-state");
    } else {
      spinButton.classList.remove("spinning-state");
      const canAfford = this.game.canAfford(bet);
      spinButton.disabled = !canAfford;

      if (this.autoSpinActive) {
        spinButton.textContent = `AUTO (${this.autoSpinCount} left)`;
      } else if (canAfford) {
        spinButton.textContent = `SPIN ($${bet})`;
      } else {
        spinButton.textContent = `SPIN (Need $${bet})`;
      }
    }
  }

  updatePayoutDisplay(result) {
    let payoutInfo = document.getElementById("last-payout");
    if (!payoutInfo) {
      payoutInfo = document.createElement("div");
      payoutInfo.id = "last-payout";
      payoutInfo.className = "payout-info";
      const slotsContainer = document.querySelector(".slots-machine");
      if (slotsContainer) {
        slotsContainer.appendChild(payoutInfo);
      }
    }

    if (result.winAmount > 0) {
      payoutInfo.innerHTML = `
        <div class="payout-text win ${result.tier}">
          <div class="win-amount">${this.game.formatMoney(
            result.winAmount
          )}</div>
          <div class="win-name">${result.name}</div>
          <div class="win-multiplier">${result.multiplier}x</div>
        </div>
      `;
    } else {
      payoutInfo.innerHTML = `
        <div class="payout-text lose">
          <div class="lose-message">No match this spin</div>
          <div class="lose-encouragement">Keep trying!</div>
        </div>
      `;
    }

    // Show with animation
    payoutInfo.style.opacity = "1";
    payoutInfo.style.transform = "scale(1)";

    // Fade out after delay
    setTimeout(() => {
      if (payoutInfo) {
        payoutInfo.style.opacity = "0.7";
        payoutInfo.style.transform = "scale(0.95)";
      }
    }, 3000);
  }

  updateSpinHistory() {
    // Keep only last 10 spins
    if (this.spinHistory.length > 10) {
      this.spinHistory = this.spinHistory.slice(-10);
    }

    // Update history display if it exists
    const historyEl = document.getElementById("spin-history");
    if (historyEl) {
      historyEl.innerHTML = this.spinHistory
        .slice(-5)
        .reverse()
        .map(
          (spin) => `
            <div class="history-item ${spin.result.tier}">
              <div class="history-reels">${spin.reels.join(" ")}</div>
              <div class="history-result">${
                spin.result.winAmount > 0
                  ? "+" + this.game.formatMoney(spin.result.winAmount)
                  : "No win"
              }</div>
            </div>
          `
        )
        .join("");
    }
  }

  startAutoSpin(count) {
    if (this.spinning || count <= 0) return;

    this.autoSpinCount = count;
    this.autoSpinActive = true;

    // Update button text
    this.updateSpinButton();

    // Start auto-spinning
    if (!this.spinning) {
      this.spin();
    }
  }

  stopAutoSpin() {
    this.autoSpinActive = false;
    this.autoSpinCount = 0;
    this.updateSpinButton();
  }

  // Method called when screen becomes active
  onShow() {
    // Update bet display
    const bet = this.game.gameSettings.slotsBet;
    const elements = [
      { id: "slots-current-bet", value: bet },
      { id: "spin-cost", value: bet },
    ];

    elements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    // Update money display
    const moneyElement = document.getElementById("slots-money");
    if (moneyElement) {
      moneyElement.textContent = this.game.formatMoney(this.game.playerMoney);
    }

    // Update spin button
    this.updateSpinButton();

    // Reset reels display
    this.updateDisplay();

    // Clear any existing animations
    this.clearPreviousAnimations();
  }
}

// Make SlotsGame available globally
if (typeof window !== "undefined") {
  window.SlotsGame = SlotsGame;
}
