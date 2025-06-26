// Blackjack game functionality - FIXED VERSION
class BlackjackGame {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.gameState = null;
    this.screenElement = null;
    this.init();
  }

  init() {
    // Initialize without binding events yet
  }

  // HTML template for the blackjack screen
  getHTMLTemplate() {
    return `
      <div id="blackjack-screen" class="screen">
        <div class="container">
          <button id="blackjack-back" class="back-button">← Back to Hub</button>
          <div class="game-header">
            <h1>🃏 Blackjack</h1>
            <p>Money: <span id="blackjack-money">${this.game.formatMoney(
              this.game.playerMoney
            )}</span> | Bet: $<span id="blackjack-current-bet">${
      this.game.gameSettings.blackjackBet
    }</span></p>
          </div>
          
          <div id="blackjack-table" class="blackjack-table">
            <div class="dealer-section">
              <h3>Dealer (<span id="dealer-total">0</span>)</h3>
              <div id="dealer-cards" class="card-area"></div>
            </div>
            
            <div class="player-section">
              <h3>You (<span id="player-total">0</span>)</h3>
              <div id="player-cards" class="card-area"></div>
            </div>
            
            <div class="game-controls">
              <button id="deal-button" class="deal-button">Deal Cards ($<span id="deal-cost">${
                this.game.gameSettings.blackjackBet
              }</span>)</button>
              <div id="game-actions" class="game-actions" style="display: none;">
                <button id="hit-button" class="action-button">HIT</button>
                <button id="stand-button" class="action-button">STAND</button>
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
      this.screenElement = document.getElementById("blackjack-screen");
      this.bindEvents();
    }
  }

  // Remove the screen
  destroyScreen() {
    if (this.screenElement) {
      this.screenElement.remove();
      this.screenElement = null;
    }
    this.gameState = null;
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
    const dealButton = document.getElementById("deal-button");
    const hitButton = document.getElementById("hit-button");
    const standButton = document.getElementById("stand-button");

    if (dealButton) {
      dealButton.addEventListener("click", () => this.dealCards());
    }
    if (hitButton) {
      hitButton.addEventListener("click", () => this.hit());
    }
    if (standButton) {
      standButton.addEventListener("click", () => this.stand());
    }
  }

  dealCards() {
    const bet = this.game.gameSettings.blackjackBet;

    if (!this.game.canAfford(bet)) {
      this.game.showMessage("Not enough money!");
      return;
    }

    // Initialize new game
    this.gameState = {
      playerCards: [this.drawCard(), this.drawCard()],
      dealerCards: [this.drawCard(), this.drawCard()],
      gamePhase: "playing",
      bet: bet,
    };

    this.updateDisplay();
    this.checkInitialBlackjack();
  }

  drawCard() {
    return Math.floor(Math.random() * 13) + 1; // 1-13 (Ace to King)
  }

  calculateTotal(cards) {
    let total = 0;
    let aces = 0;

    cards.forEach((card) => {
      if (card === 1) {
        // Ace
        aces++;
        total += 11;
      } else if (card > 10) {
        // Face cards
        total += 10;
      } else {
        total += card;
      }
    });

    // Adjust for aces
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

  updateDisplay() {
    if (!this.gameState) return;

    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    // Update totals
    const playerTotalElement = document.getElementById("player-total");
    const dealerTotalElement = document.getElementById("dealer-total");

    if (playerTotalElement) {
      playerTotalElement.textContent = playerTotal;
    }

    if (dealerTotalElement) {
      dealerTotalElement.textContent =
        this.gameState.gamePhase === "playing"
          ? this.calculateTotal([this.gameState.dealerCards[0]])
          : dealerTotal;
    }

    // Update cards display
    this.updateCardsDisplay("player-cards", this.gameState.playerCards);
    this.updateCardsDisplay(
      "dealer-cards",
      this.gameState.dealerCards,
      this.gameState.gamePhase === "playing"
    );

    // Show/hide buttons
    const dealButton = document.getElementById("deal-button");
    const gameActions = document.getElementById("game-actions");

    if (dealButton) {
      dealButton.style.display =
        this.gameState.gamePhase === "playing" ? "none" : "block";
    }

    if (gameActions) {
      gameActions.style.display =
        this.gameState.gamePhase === "playing" ? "flex" : "none";
    }
  }

  updateCardsDisplay(containerId, cards, hideSecond = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "playing-card";

      if (hideSecond && index === 1) {
        // Hidden dealer card
        cardEl.innerHTML = `
          <div class="card-back">
            <div class="card-pattern"></div>
          </div>
        `;
        cardEl.classList.add("hidden-card");
      } else {
        const suit = this.getCardSuit();
        const isRed = suit === "♥" || suit === "♦";
        cardEl.innerHTML = `
          <div class="card-front ${isRed ? "red" : "black"}">
            <div class="card-value">${this.getCardDisplay(card)}</div>
            <div class="card-suit">${suit}</div>
          </div>
        `;
      }

      container.appendChild(cardEl);
    });
  }

  checkInitialBlackjack() {
    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    if (playerTotal === 21) {
      if (dealerTotal === 21) {
        this.endGame("push", "Both have blackjack! Push!");
      } else {
        this.endGame("blackjack", "BLACKJACK! You win!");
      }
    }
  }

  hit() {
    if (!this.gameState || this.gameState.gamePhase !== "playing") return;

    const newCard = this.drawCard();
    this.gameState.playerCards.push(newCard);

    const playerTotal = this.calculateTotal(this.gameState.playerCards);

    this.updateDisplay();

    if (playerTotal > 21) {
      this.endGame(
        "bust",
        `Bust! Lost ${this.game.formatMoney(this.gameState.bet)}`
      );
    } else if (playerTotal === 21) {
      this.stand(); // Auto-stand on 21
    }
  }

  stand() {
    if (!this.gameState || this.gameState.gamePhase !== "playing") return;

    this.gameState.gamePhase = "dealer";

    // Dealer plays
    while (
      this.calculateTotal(this.gameState.dealerCards) <
      GameConfig.BLACKJACK.DEALER_STANDS_ON
    ) {
      this.gameState.dealerCards.push(this.drawCard());
    }

    this.updateDisplay();
    this.resolveGame();
  }

  resolveGame() {
    const playerTotal = this.calculateTotal(this.gameState.playerCards);
    const dealerTotal = this.calculateTotal(this.gameState.dealerCards);

    if (dealerTotal > 21) {
      this.endGame(
        "win",
        `Dealer bust! Won ${this.game.formatMoney(this.gameState.bet)}!`
      );
    } else if (playerTotal > dealerTotal) {
      this.endGame(
        "win",
        `You win! Won ${this.game.formatMoney(this.gameState.bet)}!`
      );
    } else if (playerTotal === dealerTotal) {
      this.endGame("push", "Push! Bet returned.");
    } else {
      this.endGame(
        "lose",
        `Dealer wins. Lost ${this.game.formatMoney(this.gameState.bet)}`
      );
    }
  }

  endGame(result, message) {
    this.gameState.gamePhase = "ended";

    let winAmount = 0;

    switch (result) {
      case "blackjack":
        winAmount = this.gameState.bet * GameConfig.BLACKJACK.BLACKJACK_PAYOUT; // Blackjack pays 2.5:1
        break;
      case "win":
        winAmount =
          this.gameState.bet * GameConfig.BLACKJACK.REGULAR_WIN_PAYOUT; // Regular win pays 1:1 (return bet + winnings)
        break;
      case "push":
        winAmount = this.gameState.bet; // Return bet only
        break;
      case "lose":
      case "bust":
        winAmount = 0; // Lose bet
        break;
    }

    // Deduct bet and add winnings
    this.game.spendMoney(this.gameState.bet);
    if (winAmount > 0) {
      this.game.winMoney(winAmount);
    }

    this.game.showMessage(message, GameConfig.UI.LONG_MESSAGE_DURATION);

    // Add visual effects for wins/losses
    const table = document.getElementById("blackjack-table");
    if (table) {
      if (result === "win" || result === "blackjack") {
        table.classList.add("table-win");
        setTimeout(() => {
          table.classList.remove("table-win");
        }, 1000);
      } else if (result === "lose" || result === "bust") {
        table.classList.add("table-lose");
        setTimeout(() => {
          table.classList.remove("table-lose");
        }, 1000);
      }
    }

    // Reset game state after a delay
    setTimeout(() => {
      this.resetGame();
    }, GameConfig.UI.LONG_MESSAGE_DURATION);
  }

  resetGame() {
    this.gameState = null;

    const elements = [
      { id: "player-cards", content: "" },
      { id: "dealer-cards", content: "" },
      { id: "player-total", content: "0" },
      { id: "dealer-total", content: "0" },
    ];

    elements.forEach(({ id, content }) => {
      const element = document.getElementById(id);
      if (element) {
        if (content === "") {
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
    });

    const dealButton = document.getElementById("deal-button");
    const gameActions = document.getElementById("game-actions");

    if (dealButton) {
      dealButton.style.display = "block";
    }
    if (gameActions) {
      gameActions.style.display = "none";
    }
  }

  // Method called when screen becomes active
  onShow() {
    // Update bet display
    const bet = this.game.gameSettings.blackjackBet;
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

    // Update money display
    const moneyElement = document.getElementById("blackjack-money");
    if (moneyElement) {
      moneyElement.textContent = this.game.formatMoney(this.game.playerMoney);
    }

    // Enable/disable deal button based on affordability
    const dealButton = document.getElementById("deal-button");
    if (dealButton) {
      dealButton.disabled = !this.game.canAfford(bet);

      if (!this.game.canAfford(bet)) {
        const dealCostElement = document.getElementById("deal-cost");
        if (dealCostElement) {
          dealButton.innerHTML = `Deal Cards (Need ${bet})`;
        }
      } else {
        dealButton.innerHTML = `Deal Cards ($<span id="deal-cost">${bet}</span>)`;
      }
    }
  }
}

// Make BlackjackGame available globally
if (typeof window !== "undefined") {
  window.BlackjackGame = BlackjackGame;
}
