// Main game controller - FIXED VERSION
class MillionaireCasinoGame {
  constructor() {
    this.playerMoney = GameConfig.STARTING_MONEY;
    this.currentScreen = "hub";
    this.aiPlayers = [
      {
        id: 1,
        name: "Lucky Luke",
        money: GameConfig.STARTING_MONEY,
        location: "hub",
        style: "conservative",
      },
      {
        id: 2,
        name: "High Roller",
        money: GameConfig.STARTING_MONEY,
        location: "hub",
        style: "aggressive",
      },
      {
        id: 3,
        name: "Card Counter",
        money: GameConfig.STARTING_MONEY,
        location: "hub",
        style: "moderate",
      },
    ];

    this.gameSettings = {
      slotsBet: GameConfig.SLOTS_BETS[0],
      blackjackBet: GameConfig.BLACKJACK_BETS[0],
      rouletteBet: GameConfig.ROULETTE_BETS[0],
    };

    // Game instances will be initialized after DOM is ready
    this.slotsGame = null;
    this.blackjackGame = null;
    this.rouletteGame = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeGameInstances();
    this.startAiLoop();
    this.updateMoneyDisplays();
    this.updateHub();
  }

  initializeGameInstances() {
    // Wait a moment for other scripts to load
    setTimeout(() => {
      if (window.SlotsGame) {
        this.slotsGame = new window.SlotsGame(this);
      }
      if (window.BlackjackGame) {
        this.blackjackGame = new window.BlackjackGame(this);
      }
      if (window.RouletteGame) {
        this.rouletteGame = new window.RouletteGame(this);
      }
    }, 50);
  }

  bindEvents() {
    // Navigation events - these elements exist in the initial DOM
    const playSlots = document.getElementById("play-slots");
    const playBlackjack = document.getElementById("play-blackjack");
    const playRoulette = document.getElementById("play-roulette");

    if (playSlots) {
      playSlots.addEventListener("click", () => this.showScreen("slots"));
    }
    if (playBlackjack) {
      playBlackjack.addEventListener("click", () =>
        this.showScreen("blackjack")
      );
    }
    if (playRoulette) {
      playRoulette.addEventListener("click", () => this.showScreen("roulette"));
    }

    // Use event delegation for back buttons since they're dynamically created
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("back-button") ||
        e.target.id === "slots-back" ||
        e.target.id === "blackjack-back" ||
        e.target.id === "roulette-back"
      ) {
        e.preventDefault();
        this.showScreen("hub");
      }
    });

    // Bet selectors - these exist in the initial DOM
    const slotsBet = document.getElementById("slots-bet");
    const blackjackBet = document.getElementById("blackjack-bet");
    const rouletteBet = document.getElementById("roulette-bet");

    if (slotsBet) {
      slotsBet.addEventListener("change", (e) => {
        this.gameSettings.slotsBet = Number(e.target.value);
        this.updateBetDisplays();
      });
    }

    if (blackjackBet) {
      blackjackBet.addEventListener("change", (e) => {
        this.gameSettings.blackjackBet = Number(e.target.value);
        this.updateBetDisplays();
      });
    }

    if (rouletteBet) {
      rouletteBet.addEventListener("change", (e) => {
        this.gameSettings.rouletteBet = Number(e.target.value);
        this.updateBetDisplays();
      });
    }

    // Trash search - exists in initial DOM
    const searchTrash = document.getElementById("search-trash");
    if (searchTrash) {
      searchTrash.addEventListener("click", () => this.searchTrash());
    }

    // Play again - exists in initial DOM
    const playAgain = document.getElementById("play-again");
    if (playAgain) {
      playAgain.addEventListener("click", () => this.resetGame());
    }
  }

  showScreen(screenName) {
    // Hide current game screen first if it exists
    if (this.currentScreen === "slots" && this.slotsGame) {
      this.slotsGame.hide();
    } else if (this.currentScreen === "blackjack" && this.blackjackGame) {
      this.blackjackGame.hide();
    } else if (this.currentScreen === "roulette" && this.rouletteGame) {
      this.rouletteGame.hide();
    }

    // Hide all static screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    // Show target screen
    if (screenName === "slots" && this.slotsGame) {
      this.slotsGame.show();
    } else if (screenName === "blackjack" && this.blackjackGame) {
      this.blackjackGame.show();
    } else if (screenName === "roulette" && this.rouletteGame) {
      this.rouletteGame.show();
    } else {
      // Handle static screens (hub, winner)
      const targetScreen = document.getElementById(`${screenName}-screen`);
      if (targetScreen) {
        targetScreen.classList.add("active");
      }
    }

    this.currentScreen = screenName;

    // Update displays when switching screens
    this.updateMoneyDisplays();
    this.updateBetDisplays();

    // Call screen-specific onShow methods
    if (screenName === "hub" && window.hubManager) {
      window.hubManager.onShow();
    } else if (screenName === "hub") {
      // Fallback if hubManager not available
      this.updateHub();
      this.updateGameButtons();
    }
  }

  updateMoneyDisplays() {
    const moneyStr = this.formatMoney(this.playerMoney);
    const moneyElements = [
      "player-money",
      "hub-player-money",
      "slots-money",
      "blackjack-money",
      "roulette-money",
    ];

    moneyElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = moneyStr;
      }
    });
  }

  updateBetDisplays() {
    const elements = [
      { id: "slots-current-bet", value: this.gameSettings.slotsBet },
      { id: "spin-cost", value: this.gameSettings.slotsBet },
      { id: "blackjack-current-bet", value: this.gameSettings.blackjackBet },
      { id: "deal-cost", value: this.gameSettings.blackjackBet },
      {
        id: "roulette-current-bet",
        value: this.gameSettings.rouletteBet.toLocaleString(),
      },
    ];

    elements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  updateGameButtons() {
    const canPlaySlots = this.playerMoney >= GameConfig.BALANCE.MIN_BETS.SLOTS;
    const canPlayBlackjack =
      this.playerMoney >= GameConfig.BALANCE.MIN_BETS.BLACKJACK;
    const canPlayRoulette =
      this.playerMoney >= GameConfig.BALANCE.MIN_BETS.ROULETTE;

    const slotsButton = document.getElementById("play-slots");
    const blackjackButton = document.getElementById("play-blackjack");
    const rouletteButton = document.getElementById("play-roulette");

    if (slotsButton) {
      slotsButton.disabled = !canPlaySlots;
      slotsButton.textContent = canPlaySlots
        ? "Play Slots"
        : `Play Slots (Need $${GameConfig.BALANCE.MIN_BETS.SLOTS})`;
    }

    if (blackjackButton) {
      blackjackButton.disabled = !canPlayBlackjack;
      blackjackButton.textContent = canPlayBlackjack
        ? "Play Blackjack"
        : `Play Blackjack (Need $${GameConfig.BALANCE.MIN_BETS.BLACKJACK})`;
    }

    if (rouletteButton) {
      rouletteButton.disabled = !canPlayRoulette;
      rouletteButton.textContent = canPlayRoulette
        ? "Play Roulette"
        : `Play Roulette (Need $${GameConfig.BALANCE.MIN_BETS.ROULETTE})`;
    }
  }

  formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
  }

  searchTrash() {
    this.playerMoney += GameConfig.TRASH_REWARD;
    this.updateMoneyDisplays();
    this.showMessage(
      `Found ${this.formatMoney(GameConfig.TRASH_REWARD)} in the trash!`
    );
  }

  showMessage(text, duration = GameConfig.UI.MESSAGE_DURATION) {
    const messageEl = document.getElementById("message-display");
    if (messageEl) {
      messageEl.textContent = text;
      messageEl.classList.add("show");

      setTimeout(() => {
        messageEl.classList.remove("show");
      }, duration);
    }
  }

  updateHub() {
    const playersList = document.getElementById("players-list");
    if (!playersList) return;

    // Update player's own money display in the hub
    const playerSelfMoney = playersList.querySelector(
      ".player-self .player-money"
    );
    if (playerSelfMoney) {
      playerSelfMoney.textContent = this.formatMoney(this.playerMoney);
    }

    // Clear existing AI players
    const aiRows = playersList.querySelectorAll(
      ".player-row:not(.player-self)"
    );
    aiRows.forEach((row) => row.remove());

    // Add AI players
    this.aiPlayers.forEach((ai) => {
      const playerRow = document.createElement("div");
      playerRow.className = "player-row";
      playerRow.innerHTML = `
        <span class="player-name">${ai.name}</span>
        <span class="player-money">${this.formatMoney(ai.money)}</span>
        <span class="player-location">${this.getLocationDisplay(
          ai.location
        )}</span>
      `;
      playersList.appendChild(playerRow);
    });

    this.highlightTopPlayer();
  }

  highlightTopPlayer() {
    const allPlayers = [
      { name: "You", money: this.playerMoney, isPlayer: true },
      ...this.aiPlayers.map((ai) => ({ ...ai, isPlayer: false })),
    ];

    const maxMoney = Math.max(...allPlayers.map((p) => p.money));

    // Remove existing highlights
    document.querySelectorAll(".player-row").forEach((row) => {
      row.classList.remove("leading-player");
    });

    // Highlight the leading player(s)
    allPlayers.forEach((player) => {
      if (player.money === maxMoney) {
        if (player.isPlayer) {
          const playerSelf = document.querySelector(".player-self");
          if (playerSelf) {
            playerSelf.classList.add("leading-player");
          }
        } else {
          // Find the AI player row by name
          const aiRows = document.querySelectorAll(
            ".player-row:not(.player-self)"
          );
          aiRows.forEach((row) => {
            const nameElement = row.querySelector(".player-name");
            if (nameElement && nameElement.textContent === player.name) {
              row.classList.add("leading-player");
            }
          });
        }
      }
    });
  }

  getLocationDisplay(location) {
    const locationMap = {
      hub: "In Hub",
      slots: "Playing Slots",
      blackjack: "Playing Blackjack",
      roulette: "Playing Roulette",
      trash: "Searching Trash",
    };
    return locationMap[location] || "Unknown";
  }

  startAiLoop() {
    setInterval(() => {
      this.updateAiPlayers();
      if (this.currentScreen === "hub") {
        this.updateHub();
      }
      this.checkWinner();
    }, 2000);
  }

  updateAiPlayers() {
    this.aiPlayers.forEach((ai) => {
      if (Math.random() < GameConfig.AI_BEHAVIOR.LOCATION_CHANGE_CHANCE) {
        const locations = ["hub", "slots", "blackjack", "roulette", "trash"];
        const newLocation =
          locations[Math.floor(Math.random() * locations.length)];
        let moneyChange = 0;

        if (newLocation === "trash") {
          moneyChange = GameConfig.TRASH_REWARD;
        } else if (newLocation === "slots") {
          const bet = GameConfig.getBetAmount("slots", ai.style);
          if (ai.money >= bet) {
            const winRate = GameConfig.getWinRate("slots");
            if (Math.random() < winRate) {
              moneyChange = Math.random() < 0.1 ? bet * 4 : bet * 1.5;
            } else {
              moneyChange = -bet;
            }
          }
        } else if (newLocation === "blackjack") {
          const bet = GameConfig.getBetAmount("blackjack", ai.style);
          if (ai.money >= bet) {
            const winRate = GameConfig.getWinRate("blackjack");
            if (Math.random() < winRate) {
              moneyChange = bet;
            } else {
              moneyChange = -bet;
            }
          }
        } else if (newLocation === "roulette") {
          const bet = GameConfig.getBetAmount("roulette", ai.style);
          if (ai.money >= bet) {
            const winRate = GameConfig.getWinRate("roulette");
            if (Math.random() < winRate) {
              moneyChange = bet;
            } else {
              moneyChange = -bet;
            }
          }
        }

        ai.location = newLocation;
        ai.money = Math.max(0, ai.money + moneyChange);
      }
    });
  }

  checkWinner() {
    const allPlayers = [
      { name: "You", money: this.playerMoney },
      ...this.aiPlayers,
    ];
    const winner = allPlayers.find((p) => p.money >= GameConfig.WIN_GOAL);

    if (winner) {
      this.showWinner(winner);
    }
  }

  showWinner(winner) {
    const winnerName = document.getElementById("winner-name");
    const winnerAmount = document.getElementById("winner-amount");

    if (winnerName) {
      winnerName.textContent = `${winner.name} reached ${this.formatMoney(
        GameConfig.WIN_GOAL
      )}!`;
    }
    if (winnerAmount) {
      winnerAmount.textContent = `Final amount: ${this.formatMoney(
        winner.money
      )}`;
    }

    this.showScreen("winner");
  }

  resetGame() {
    this.playerMoney = GameConfig.STARTING_MONEY;
    this.aiPlayers.forEach((ai) => {
      ai.money = GameConfig.STARTING_MONEY;
      ai.location = "hub";
    });
    this.gameSettings = {
      slotsBet: GameConfig.SLOTS_BETS[0],
      blackjackBet: GameConfig.BLACKJACK_BETS[0],
      rouletteBet: GameConfig.ROULETTE_BETS[0],
    };

    // Reset bet selectors
    const elements = [
      { id: "slots-bet", value: GameConfig.SLOTS_BETS[0] },
      { id: "blackjack-bet", value: GameConfig.BLACKJACK_BETS[0] },
      { id: "roulette-bet", value: GameConfig.ROULETTE_BETS[0] },
    ];

    elements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });

    this.updateMoneyDisplays();
    this.updateBetDisplays();
    this.updateHub();
    this.showScreen("hub");
  }

  // Utility methods for games
  canAfford(amount) {
    return this.playerMoney >= amount;
  }

  spendMoney(amount) {
    if (this.canAfford(amount)) {
      this.playerMoney -= amount;
      this.updateMoneyDisplays();
      return true;
    }
    return false;
  }

  winMoney(amount) {
    this.playerMoney += amount;
    this.updateMoneyDisplays();
  }
}

// Initialize game when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Ensure GameConfig is loaded first
  if (typeof GameConfig !== "undefined") {
    window.game = new MillionaireCasinoGame();
  } else {
    console.error("GameConfig not loaded!");
  }
});
