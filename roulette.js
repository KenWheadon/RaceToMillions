// Enhanced Roulette game with own configuration
class RouletteGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.spinning = false;
    this.redNumbers = RouletteConfig.RED_NUMBERS;
    this.screenElement = null;
    this.gameHistory = [];
    this.sessionStats = {
      spinsPlayed: 0,
      totalWon: 0,
      totalLost: 0,
      biggestWin: 0,
      favoriteColor: null,
    };
    this.init();
  }

  init() {
    // Initialize without binding events yet
  }

  // Enhanced HTML template with better UI
  getHTMLTemplate() {
    const currentBet =
      this.game.gameSettings?.rouletteBet || RouletteConfig.MIN_BET;
    const playerMoney = this.game.playerMoney || 0;

    return `
      <div id="roulette-screen" class="screen">
        <div class="container">
          <button id="roulette-back" class="back-button">← Back to Hub</button>
          
          <!-- Enhanced Header -->
          <div class="game-header">
            <div class="game-info">
              <h1>🎯 European Roulette</h1>
              <p class="game-subtitle">Place your bets and spin the wheel!</p>
            </div>
            <div class="player-stats">
              <p class="money-display">Money: <span id="roulette-money">$${playerMoney.toFixed(
                2
              )}</span></p>
              <p class="bet-display">Bet: $<span id="roulette-current-bet">${currentBet.toLocaleString()}</span></p>
              <p class="session-display">Spins: <span id="spins-played">0</span> | Biggest Win: $<span id="biggest-win">0</span></p>
            </div>
          </div>
          
          <div class="roulette-table">
            <!-- Wheel Display Area -->
            <div class="wheel-section">
              <div id="roulette-wheel" class="roulette-wheel">
                <div class="wheel-center">
                  <div class="wheel-logo">🎰</div>
                </div>
                <div class="wheel-rim"></div>
              </div>
              <div id="last-numbers" class="last-numbers">
                <h4>Last Numbers:</h4>
                <div class="number-history"></div>
              </div>
            </div>
            
            <!-- Betting Section -->
            <div class="betting-section">
              <div class="bet-amount-display">
                <div class="current-bet-amount">Current Bet: $${currentBet.toLocaleString()}</div>
                <div class="potential-wins">
                  <span>Red/Black: $${(
                    currentBet * RouletteConfig.PAYOUTS.EVEN_MONEY
                  ).toLocaleString()}</span>
                  <span>Dozens: $${(
                    currentBet * RouletteConfig.PAYOUTS.DOZENS
                  ).toLocaleString()}</span>
                </div>
              </div>
              
              <div class="betting-grid">
                <div class="even-money-bets">
                  <button class="bet-button red-bet glow-on-hover" data-bet="red">
                    <span class="bet-icon">🔴</span>
                    <span class="bet-label">RED</span>
                    <span class="bet-payout">(1:1)</span>
                  </button>
                  <button class="bet-button black-bet glow-on-hover" data-bet="black">
                    <span class="bet-icon">⚫</span>
                    <span class="bet-label">BLACK</span>
                    <span class="bet-payout">(1:1)</span>
                  </button>
                  <button class="bet-button odd-bet glow-on-hover" data-bet="odd">
                    <span class="bet-icon">🔢</span>
                    <span class="bet-label">ODD</span>
                    <span class="bet-payout">(1:1)</span>
                  </button>
                  <button class="bet-button even-bet glow-on-hover" data-bet="even">
                    <span class="bet-icon">⚖️</span>
                    <span class="bet-label">EVEN</span>
                    <span class="bet-payout">(1:1)</span>
                  </button>
                </div>
                
                <div class="dozen-bets">
                  <button class="bet-button dozen-bet glow-on-hover" data-bet="1-12">
                    <span class="bet-label">1st DOZEN</span>
                    <span class="bet-range">(1-12)</span>
                    <span class="bet-payout">(2:1)</span>
                  </button>
                  <button class="bet-button dozen-bet glow-on-hover" data-bet="13-24">
                    <span class="bet-label">2nd DOZEN</span>
                    <span class="bet-range">(13-24)</span>
                    <span class="bet-payout">(2:1)</span>
                  </button>
                  <button class="bet-button dozen-bet glow-on-hover" data-bet="25-36">
                    <span class="bet-label">3rd DOZEN</span>
                    <span class="bet-range">(25-36)</span>
                    <span class="bet-payout">(2:1)</span>
                  </button>
                </div>
              </div>
              
              <!-- Strategy Tips -->
              <div class="strategy-tips">
                <div id="current-tip" class="tip-display">
                  ${RouletteConfig.getRandomTip()}
                </div>
              </div>
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
      this.screenElement = document.getElementById("roulette-screen");
      this.bindEvents();
    }
  }

  // Remove the screen
  destroyScreen() {
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
      setTimeout(() => {
        this.destroyScreen();
      }, 100);
    }
  }

  bindEvents() {
    // Bind all betting buttons with enhanced feedback
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        if (!this.spinning) {
          const betType = e.target.closest(".bet-button").dataset.bet;
          AnimationUtils.rippleEffect(button, e);
          this.placeBet(betType);
        }
      });

      // Add hover sound effect
      button.addEventListener("mouseenter", () => {
        this.playSound("BUTTON_HOVER");
      });
    });

    // Update tips periodically
    setInterval(() => {
      this.updateTips();
    }, RouletteConfig.UI.ANIMATION_SPEED * 20);
  }

  placeBet(betType) {
    const bet = this.game.gameSettings?.rouletteBet || RouletteConfig.MIN_BET;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage(
        "Not enough money! You need $" + bet.toLocaleString(),
        GameConfig.UI.LONG_MESSAGE_DURATION
      );
      return;
    }

    this.spinning = true;
    this.disableButtons();
    this.sessionStats.spinsPlayed++;

    // Play sound and show spinning animation
    this.playSound("WHEEL_SPIN");
    this.showSpinAnimation();

    // Update status
    this.updateGameStatus(`Spinning... You bet ${betType.toUpperCase()}`);

    // Simulate roulette spin delay
    setTimeout(() => {
      this.spinRoulette(betType, bet);
    }, RouletteConfig.SPIN_DURATION);
  }

  spinRoulette(betType, bet) {
    const number = Math.floor(Math.random() * 37); // 0-36
    const won = RouletteConfig.checkWin(betType, null, number);
    let payout = 0;
    let payoutMultiplier = 1;

    // Determine payout multiplier
    switch (betType) {
      case "red":
      case "black":
      case "odd":
      case "even":
        payoutMultiplier = RouletteConfig.PAYOUTS.EVEN_MONEY;
        break;
      case "1-12":
      case "13-24":
      case "25-36":
        payoutMultiplier = RouletteConfig.PAYOUTS.DOZENS;
        break;
    }

    if (won) {
      payout = bet * payoutMultiplier;
      this.sessionStats.totalWon += payout - bet; // Net winnings
      if (payout - bet > this.sessionStats.biggestWin) {
        this.sessionStats.biggestWin = payout - bet;
      }
    } else {
      this.sessionStats.totalLost += bet;
    }

    // Add to history
    this.gameHistory.unshift({
      number: number,
      color: RouletteConfig.getNumberColor(number),
      timestamp: Date.now(),
    });

    // Keep only last 10 spins
    if (this.gameHistory.length > 10) {
      this.gameHistory = this.gameHistory.slice(0, 10);
    }

    // Show result with enhanced effects
    this.showResult(number, betType, won, bet, payout);

    // Update money
    this.game.spendMoney(bet);
    if (won) {
      this.game.winMoney(payout); // Player gets payout
    }

    this.spinning = false;
    this.enableButtons();

    // Update displays
    this.updateSessionStats();
    this.updateNumberHistory();

    // Highlight winning bets after result is shown
    setTimeout(() => {
      this.highlightWinningBets(number);
    }, 1000);

    // Update tip after spin
    setTimeout(() => {
      this.updateTips();
    }, 3000);
  }

  showSpinAnimation() {
    const wheel = document.getElementById("roulette-wheel");
    if (wheel) {
      wheel.classList.add("spinning");

      // Add spinning ball animation
      const ball = document.createElement("div");
      ball.className = "spinning-ball";
      wheel.appendChild(ball);

      // Generate wheel numbers if not already there
      if (!wheel.querySelector(".wheel-numbers")) {
        const numbersDiv = document.createElement("div");
        numbersDiv.className = "wheel-numbers";
        numbersDiv.innerHTML = this.generateWheelNumbers();
        wheel.appendChild(numbersDiv);
      }
    }

    // Update spin status
    const statusElement = document.querySelector(".current-bet-amount");
    if (statusElement) {
      statusElement.textContent = "🎲 Spinning the wheel...";
      statusElement.classList.add("spinning-text");
    }
  }

  generateWheelNumbers() {
    return RouletteConfig.WHEEL_ORDER.map((num, index) => {
      const color = RouletteConfig.getNumberColor(num);
      const rotation = index * (360 / RouletteConfig.WHEEL_ORDER.length);

      return `
          <div class="wheel-number ${color}" style="transform: rotate(${rotation}deg) translateY(-90px) rotate(-${rotation}deg);">
            ${num}
          </div>
        `;
    }).join("");
  }

  showResult(number, betType, won, bet, payout) {
    const color = RouletteConfig.getNumberColor(number);
    const colorName = color.charAt(0).toUpperCase() + color.slice(1);

    // Stop wheel animation
    const wheel = document.getElementById("roulette-wheel");
    if (wheel) {
      wheel.classList.remove("spinning");
      const ball = wheel.querySelector(".spinning-ball");
      if (ball) ball.remove();
    }

    // Create result display
    this.createResultDisplay(number, color, won, bet, payout);

    // Play appropriate sound
    this.playSound(won ? "WIN" : "LOSE");

    // Show message with enhanced formatting
    const winAmount = payout - bet;
    const message = won
      ? `🎉 ${colorName} ${number}! Won $${winAmount.toLocaleString()}!`
      : `😔 ${colorName} ${number}. Lost $${bet.toLocaleString()}`;

    this.game.showMessage(message, GameConfig.UI.LONG_MESSAGE_DURATION);

    // Update game status
    this.updateGameStatus(
      won
        ? `Winner! +$${winAmount.toLocaleString()}`
        : `Lost $${bet.toLocaleString()}`
    );

    // Celebration effects for big wins
    if (won && winAmount >= bet * 2) {
      this.showCelebrationEffects(winAmount);
    }
  }

  createResultDisplay(number, color, won, bet, payout) {
    let resultDisplay = document.getElementById("result-display");
    if (!resultDisplay) {
      resultDisplay = document.createElement("div");
      resultDisplay.id = "result-display";
      resultDisplay.className = "result-display";
      const wheelSection = document.querySelector(".wheel-section");
      if (wheelSection) {
        wheelSection.appendChild(resultDisplay);
      }
    }

    const winAmount = payout - bet;
    resultDisplay.innerHTML = `
      <div class="winning-number ${color}">
        <div class="number-value">${number}</div>
        <div class="number-color">${color.toUpperCase()}</div>
      </div>
      <div class="result-text ${won ? "win" : "lose"}">
        ${
          won
            ? `WON $${winAmount.toLocaleString()}!`
            : `LOST $${bet.toLocaleString()}`
        }
      </div>
    `;

    resultDisplay.classList.add(won ? "win-result" : "lose-result");
    resultDisplay.classList.add("show");

    // Auto-hide after delay
    setTimeout(() => {
      resultDisplay.classList.remove("show");
      setTimeout(() => {
        if (resultDisplay && resultDisplay.parentNode) {
          resultDisplay.parentNode.removeChild(resultDisplay);
        }
      }, 500);
    }, RouletteConfig.RESULT_DISPLAY_TIME);
  }

  showCelebrationEffects(winAmount) {
    const wheelSection = document.querySelector(".wheel-section");
    if (wheelSection) {
      AnimationUtils.createConfetti(wheelSection, 30);
    }

    // Screen flash effect
    const screen = document.getElementById("roulette-screen");
    if (screen) {
      screen.classList.add("big-win-flash");
      setTimeout(() => {
        screen.classList.remove("big-win-flash");
      }, 1000);
    }
  }

  updateGameStatus(message) {
    const statusElement = document.querySelector(".current-bet-amount");
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.classList.remove("spinning-text");
    }
  }

  updateSessionStats() {
    const spinsElement = document.getElementById("spins-played");
    const biggestWinElement = document.getElementById("biggest-win");

    if (spinsElement) {
      spinsElement.textContent = this.sessionStats.spinsPlayed;
    }
    if (biggestWinElement) {
      biggestWinElement.textContent =
        this.sessionStats.biggestWin.toLocaleString();
    }
  }

  updateNumberHistory() {
    const historyContainer = document.querySelector(".number-history");
    if (historyContainer) {
      historyContainer.innerHTML = this.gameHistory
        .slice(0, 5) // Show last 5 numbers
        .map(
          (spin) => `
          <div class="history-number ${spin.color}">
            ${spin.number}
          </div>
        `
        )
        .join("");
    }
  }

  updateTips() {
    const tipElement = document.getElementById("current-tip");
    if (tipElement) {
      tipElement.textContent = RouletteConfig.getRandomTip();
    }
  }

  disableButtons() {
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled");
    });
  }

  enableButtons() {
    const bet = this.game.gameSettings?.rouletteBet || RouletteConfig.MIN_BET;
    const canAfford = this.game.canAfford(bet);

    document.querySelectorAll(".bet-button").forEach((button) => {
      button.disabled = !canAfford;
      button.classList.remove("disabled");

      if (!canAfford) {
        button.classList.add("cant-afford");
      } else {
        button.classList.remove("cant-afford");
      }
    });
  }

  // Method called when screen becomes active
  onShow() {
    // Update bet display
    const bet = this.game.gameSettings?.rouletteBet || RouletteConfig.MIN_BET;
    const rouletteCurrentBet = document.getElementById("roulette-current-bet");
    if (rouletteCurrentBet) {
      rouletteCurrentBet.textContent = bet.toLocaleString();
    }

    // Update current bet amount display
    const currentBetAmount = document.querySelector(".current-bet-amount");
    if (currentBetAmount) {
      currentBetAmount.textContent = `Current Bet: ${bet.toLocaleString()}`;
    }

    // Update potential wins display
    const potentialWins = document.querySelector(".potential-wins");
    if (potentialWins) {
      potentialWins.innerHTML = `
        <span>Red/Black: ${(
          bet * RouletteConfig.PAYOUTS.EVEN_MONEY
        ).toLocaleString()}</span>
        <span>Dozens: ${(
          bet * RouletteConfig.PAYOUTS.DOZENS
        ).toLocaleString()}</span>
      `;
    }

    // Update money display
    const moneyElement = document.getElementById("roulette-money");
    if (moneyElement) {
      const formattedMoney = this.game.formatMoney
        ? this.game.formatMoney(this.game.playerMoney)
        : `${this.game.playerMoney.toFixed(2)}`;
      moneyElement.textContent = formattedMoney;
    }

    // Update button affordability
    this.enableButtons();

    // Update session stats
    this.updateSessionStats();

    // Clean up any existing displays
    const existingResultDisplay = document.getElementById("result-display");
    if (existingResultDisplay && existingResultDisplay.parentNode) {
      existingResultDisplay.parentNode.removeChild(existingResultDisplay);
    }

    // Initialize number history if empty
    if (this.gameHistory.length === 0) {
      this.updateNumberHistory();
    }
  }

  // Enhanced button highlights based on previous wins
  highlightWinningBets(number) {
    // Remove existing highlights
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.classList.remove("recent-winner", "hot-bet");
    });

    // Determine which bets would have won
    const winningBets = [];

    if (RouletteConfig.isRed(number)) {
      winningBets.push('[data-bet="red"]');
    }
    if (RouletteConfig.isBlack(number)) {
      winningBets.push('[data-bet="black"]');
    }
    if (number % 2 === 1 && number !== 0) {
      winningBets.push('[data-bet="odd"]');
    }
    if (number % 2 === 0 && number !== 0) {
      winningBets.push('[data-bet="even"]');
    }

    // Check dozens
    if (number >= 1 && number <= 12) {
      winningBets.push('[data-bet="1-12"]');
    } else if (number >= 13 && number <= 24) {
      winningBets.push('[data-bet="13-24"]');
    } else if (number >= 25 && number <= 36) {
      winningBets.push('[data-bet="25-36"]');
    }

    // Apply highlights with staggered animation
    winningBets.forEach((selector, index) => {
      const button = document.querySelector(selector);
      if (button) {
        setTimeout(() => {
          button.classList.add("recent-winner");
        }, index * 200);
      }
    });

    // Remove highlights after delay
    setTimeout(() => {
      document.querySelectorAll(".recent-winner").forEach((button) => {
        button.classList.remove("recent-winner");
      });
    }, RouletteConfig.HIGHLIGHT_DURATION);
  }

  // Show hot/cold number analysis
  analyzeNumberPatterns() {
    const numberCounts = {};

    // Count occurrences of each number
    this.gameHistory.forEach((spin) => {
      numberCounts[spin.number] = (numberCounts[spin.number] || 0) + 1;
    });

    // Find hot and cold numbers
    const hotNumbers = [];
    const coldNumbers = [];

    for (let i = 0; i <= 36; i++) {
      const count = numberCounts[i] || 0;
      if (count >= RouletteConfig.STATISTICS.HOT_NUMBER_THRESHOLD) {
        hotNumbers.push(i);
      }
      if (
        this.gameHistory.length >=
          RouletteConfig.STATISTICS.COLD_NUMBER_THRESHOLD &&
        count === 0
      ) {
        coldNumbers.push(i);
      }
    }

    return { hotNumbers, coldNumbers, numberCounts };
  }

  // Show betting statistics
  showBettingStats() {
    const stats = {
      totalSpins: this.sessionStats.spinsPlayed,
      totalWon: this.sessionStats.totalWon,
      totalLost: this.sessionStats.totalLost,
      netResult: this.sessionStats.totalWon - this.sessionStats.totalLost,
      biggestWin: this.sessionStats.biggestWin,
      winRate:
        this.sessionStats.spinsPlayed > 0
          ? (
              (this.sessionStats.totalWon /
                (this.sessionStats.totalWon + this.sessionStats.totalLost)) *
              100
            ).toFixed(1)
          : 0,
    };

    return stats;
  }

  // Color analysis of recent spins
  getColorTrends() {
    const recentSpins = this.gameHistory.slice(0, 10);
    const colorCounts = { red: 0, black: 0, green: 0 };

    recentSpins.forEach((spin) => {
      colorCounts[spin.color]++;
    });

    return colorCounts;
  }

  // Get streak information
  getCurrentStreak() {
    if (this.gameHistory.length === 0) return { type: "none", count: 0 };

    const lastColor = this.gameHistory[0].color;
    let count = 0;

    for (const spin of this.gameHistory) {
      if (spin.color === lastColor && spin.color !== "green") {
        count++;
      } else {
        break;
      }
    }

    return { type: lastColor, count };
  }

  // Play sound effects
  playSound(soundType) {
    if (!RouletteConfig.SOUNDS.ENABLED) return;

    // Placeholder for actual sound implementation
    console.log(`🔊 Playing sound: ${soundType}`);
  }

  // Reset session statistics
  resetSession() {
    this.sessionStats = {
      spinsPlayed: 0,
      totalWon: 0,
      totalLost: 0,
      biggestWin: 0,
      favoriteColor: null,
    };
    this.gameHistory = [];
    this.updateSessionStats();
    this.updateNumberHistory();
  }

  // Enhanced error handling
  handleError(error, context) {
    console.error(`Roulette Game Error in ${context}:`, error);
    this.game.showMessage(
      "An error occurred. Please try again.",
      GameConfig.UI.MESSAGE_DURATION
    );

    // Reset spinning state if error occurs during spin
    if (this.spinning) {
      this.spinning = false;
      this.enableButtons();
    }
  }

  // Get game state for debugging/analytics
  getGameState() {
    return {
      spinning: this.spinning,
      sessionStats: this.sessionStats,
      gameHistory: this.gameHistory.slice(0, 5), // Last 5 for privacy
      currentBet: this.game.gameSettings?.rouletteBet || RouletteConfig.MIN_BET,
      playerMoney: this.game.playerMoney,
    };
  }

  // Cleanup method
  cleanup() {
    // Clear any intervals/timeouts
    if (this.tipInterval) {
      clearInterval(this.tipInterval);
    }

    // Remove event listeners
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.replaceWith(button.cloneNode(true));
    });
  }

  // Destructor
  destroy() {
    this.cleanup();
    this.destroyScreen();
  }
}

// Make RouletteGame available globally
if (typeof window !== "undefined") {
  window.RouletteGame = RouletteGame;
}
