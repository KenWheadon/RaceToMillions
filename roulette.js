// Roulette game functionality - FIXED VERSION
class RouletteGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.spinning = false;
    this.redNumbers = GameConfig.ROULETTE.RED_NUMBERS;
    this.screenElement = null;
    this.init();
  }

  init() {
    // Initialize without binding events yet
  }

  // HTML template for the roulette screen
  getHTMLTemplate() {
    return `
      <div id="roulette-screen" class="screen">
        <div class="container">
          <button id="roulette-back" class="back-button">← Back to Hub</button>
          <div class="game-header">
            <h1>🎯 Roulette</h1>
            <p>Money: <span id="roulette-money">${this.game.formatMoney(
              this.game.playerMoney
            )}</span> | Bet: $<span id="roulette-current-bet">${this.game.gameSettings.rouletteBet.toLocaleString()}</span></p>
          </div>
          
          <div class="roulette-table">
            <div class="bet-amount-display">
              <div class="current-bet-amount">Current Bet: $${this.game.gameSettings.rouletteBet.toLocaleString()}</div>
            </div>
            
            <div class="betting-grid">
              <div class="even-money-bets">
                <button class="bet-button red-bet" data-bet="red">RED (1:1)</button>
                <button class="bet-button black-bet" data-bet="black">BLACK (1:1)</button>
                <button class="bet-button odd-bet" data-bet="odd">ODD (1:1)</button>
                <button class="bet-button even-bet" data-bet="even">EVEN (1:1)</button>
              </div>
              
              <div class="dozen-bets">
                <button class="bet-button dozen-bet" data-bet="1-12">1-12 (2:1)</button>
                <button class="bet-button dozen-bet" data-bet="13-24">13-24 (2:1)</button>
                <button class="bet-button dozen-bet" data-bet="25-36">25-36 (2:1)</button>
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
    // Bind all betting buttons
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        if (!this.spinning) {
          const betType = e.target.dataset.bet;
          this.placeBet(betType);
        }
      });
    });
  }

  placeBet(betType) {
    const bet = this.game.gameSettings.rouletteBet;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage("Not enough money!");
      return;
    }

    this.spinning = true;
    this.disableButtons();

    // Show spinning animation
    this.showSpinAnimation();

    // Simulate roulette spin delay
    setTimeout(() => {
      this.spinRoulette(betType, bet);
    }, 2000);
  }

  spinRoulette(betType, bet) {
    const number = Math.floor(Math.random() * 37); // 0-36
    const isRed = this.redNumbers.includes(number);
    const isBlack = number !== 0 && !isRed;
    const isOdd = number % 2 === 1 && number !== 0;
    const isEven = number % 2 === 0 && number !== 0;

    let won = false;
    let payout = 0;
    let payoutMultiplier = 0;

    // Determine win/loss and payout
    switch (betType) {
      case "red":
        won = isRed;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.EVEN_MONEY;
        break;
      case "black":
        won = isBlack;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.EVEN_MONEY;
        break;
      case "odd":
        won = isOdd;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.EVEN_MONEY;
        break;
      case "even":
        won = isEven;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.EVEN_MONEY;
        break;
      case "1-12":
        won = number >= 1 && number <= 12;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.DOZENS;
        break;
      case "13-24":
        won = number >= 13 && number <= 24;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.DOZENS;
        break;
      case "25-36":
        won = number >= 25 && number <= 36;
        payoutMultiplier = GameConfig.ROULETTE.PAYOUTS.DOZENS;
        break;
    }

    if (won) {
      payout = bet * payoutMultiplier;
    }

    // Show result
    this.showResult(number, betType, won, bet, payout);

    // Update money
    this.game.spendMoney(bet);
    if (won) {
      this.game.winMoney(bet + payout); // Return bet + winnings
    }

    this.spinning = false;
    this.enableButtons();

    // Highlight winning bets after result is shown
    setTimeout(() => {
      this.highlightWinningBets(number);
    }, 2000);
  }

  showSpinAnimation() {
    // Create or update spinning wheel display
    let spinDisplay = document.getElementById("spin-display");
    if (!spinDisplay) {
      spinDisplay = document.createElement("div");
      spinDisplay.id = "spin-display";
      spinDisplay.className = "spin-display";
      const rouletteTable = document.querySelector(".roulette-table");
      if (rouletteTable) {
        rouletteTable.appendChild(spinDisplay);
      }
    }

    spinDisplay.innerHTML = `
      <div class="roulette-wheel spinning">
        <div class="wheel-center">
          <div class="ball"></div>
        </div>
        <div class="wheel-numbers">
          ${this.generateWheelNumbers()}
        </div>
      </div>
      <div class="spin-text">Spinning...</div>
    `;
  }

  generateWheelNumbers() {
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ];
    return numbers
      .map((num, index) => {
        const isRed = this.redNumbers.includes(num);
        const isZero = num === 0;
        const color = isZero ? "green" : isRed ? "red" : "black";
        const rotation = index * (360 / numbers.length);

        return `
          <div class="wheel-number ${color}" style="transform: rotate(${rotation}deg) translateY(-80px) rotate(-${rotation}deg);">
            ${num}
          </div>
        `;
      })
      .join("");
  }

  showResult(number, betType, won, bet, payout) {
    const color = this.getColorClass(number);

    // Update spin display with result
    const spinDisplay = document.getElementById("spin-display");
    if (spinDisplay) {
      spinDisplay.innerHTML = `
        <div class="result-display">
          <div class="winning-number ${color}">
            ${number}
          </div>
          <div class="result-text">
            ${
              won
                ? `WON ${this.game.formatMoney(payout)}!`
                : `LOST ${this.game.formatMoney(bet)}`
            }
          </div>
        </div>
      `;

      // Add result animation
      spinDisplay.classList.add(won ? "win-result" : "lose-result");

      // Remove result display after delay
      setTimeout(() => {
        if (spinDisplay && spinDisplay.parentNode) {
          spinDisplay.parentNode.removeChild(spinDisplay);
        }
      }, 4000);
    }

    // Show message
    const colorName =
      color === "green"
        ? "Green"
        : color.charAt(0).toUpperCase() + color.slice(1);
    const message = `Number ${number} (${colorName})! ${
      won
        ? `Won ${this.game.formatMoney(payout)}!`
        : `Lost ${this.game.formatMoney(bet)}`
    }`;
    this.game.showMessage(message, GameConfig.UI.LONG_MESSAGE_DURATION);
  }

  disableButtons() {
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled");
    });
  }

  enableButtons() {
    const bet = this.game.gameSettings.rouletteBet;
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

  getColorClass(number) {
    if (number === 0) return "green";
    return this.redNumbers.includes(number) ? "red" : "black";
  }

  // Method called when screen becomes active
  onShow() {
    // Update bet display
    const bet = this.game.gameSettings.rouletteBet;
    const rouletteCurrentBet = document.getElementById("roulette-current-bet");
    if (rouletteCurrentBet) {
      rouletteCurrentBet.textContent = bet.toLocaleString();
    }

    // Update current bet amount display
    const currentBetAmount = document.querySelector(".current-bet-amount");
    if (currentBetAmount) {
      currentBetAmount.textContent = `Current Bet: $${bet.toLocaleString()}`;
    }

    // Update money display
    const moneyElement = document.getElementById("roulette-money");
    if (moneyElement) {
      moneyElement.textContent = this.game.formatMoney(this.game.playerMoney);
    }

    // Update button affordability
    this.enableButtons();

    // Clean up any existing spin displays
    const existingSpinDisplay = document.getElementById("spin-display");
    if (existingSpinDisplay && existingSpinDisplay.parentNode) {
      existingSpinDisplay.parentNode.removeChild(existingSpinDisplay);
    }
  }

  // Animate button highlights based on previous wins
  highlightWinningBets(number) {
    // Remove existing highlights
    document.querySelectorAll(".bet-button").forEach((button) => {
      button.classList.remove("recent-winner");
    });

    // Highlight buttons that would have won
    const isRed = this.redNumbers.includes(number);
    const isBlack = number !== 0 && !isRed;
    const isOdd = number % 2 === 1 && number !== 0;
    const isEven = number % 2 === 0 && number !== 0;

    if (isRed) {
      const redButton = document.querySelector('[data-bet="red"]');
      if (redButton) {
        redButton.classList.add("recent-winner");
      }
    }
    if (isBlack) {
      const blackButton = document.querySelector('[data-bet="black"]');
      if (blackButton) {
        blackButton.classList.add("recent-winner");
      }
    }
    if (isOdd) {
      const oddButton = document.querySelector('[data-bet="odd"]');
      if (oddButton) {
        oddButton.classList.add("recent-winner");
      }
    }
    if (isEven) {
      const evenButton = document.querySelector('[data-bet="even"]');
      if (evenButton) {
        evenButton.classList.add("recent-winner");
      }
    }

    // Check dozens
    if (number >= 1 && number <= 12) {
      const dozenButton = document.querySelector('[data-bet="1-12"]');
      if (dozenButton) {
        dozenButton.classList.add("recent-winner");
      }
    } else if (number >= 13 && number <= 24) {
      const dozenButton = document.querySelector('[data-bet="13-24"]');
      if (dozenButton) {
        dozenButton.classList.add("recent-winner");
      }
    } else if (number >= 25 && number <= 36) {
      const dozenButton = document.querySelector('[data-bet="25-36"]');
      if (dozenButton) {
        dozenButton.classList.add("recent-winner");
      }
    }

    // Remove highlights after delay
    setTimeout(() => {
      document.querySelectorAll(".recent-winner").forEach((button) => {
        button.classList.remove("recent-winner");
      });
    }, 3000);
  }

  // Show betting history or statistics
  showBettingStats() {
    // Could implement betting history, hot/cold numbers, etc.
    const stats = {
      totalBets: 0,
      totalWon: 0,
      totalLost: 0,
      favoriteType: "red",
    };

    return stats;
  }
}

// Make RouletteGame available globally
if (typeof window !== "undefined") {
  window.RouletteGame = RouletteGame;
}
