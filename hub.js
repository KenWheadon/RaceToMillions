// Hub screen functionality - FIXED VERSION
class HubManager {
  constructor(game) {
    this.game = game;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Game navigation buttons are handled in main.js
    // This file handles hub-specific functionality
  }

  updatePlayersDisplay() {
    const playersList = document.getElementById("players-list");
    if (!playersList) return;

    // Update player's own money display
    const playerSelfRow = playersList.querySelector(
      ".player-self .player-money"
    );
    if (playerSelfRow) {
      playerSelfRow.textContent = this.game.formatMoney(this.game.playerMoney);
    }

    // Clear existing AI players
    const aiRows = playersList.querySelectorAll(
      ".player-row:not(.player-self)"
    );
    aiRows.forEach((row) => row.remove());

    // Add AI players
    this.game.aiPlayers.forEach((ai) => {
      const playerRow = document.createElement("div");
      playerRow.className = "player-row";
      playerRow.innerHTML = `
                <span class="player-name">${ai.name}</span>
                <span class="player-money">${this.game.formatMoney(
                  ai.money
                )}</span>
                <span class="player-location">${this.getLocationDisplay(
                  ai.location
                )}</span>
            `;
      playersList.appendChild(playerRow);
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

  updateGameButtons() {
    // Update button states based on player money
    const slotsButton = document.getElementById("play-slots");
    const blackjackButton = document.getElementById("play-blackjack");
    const rouletteButton = document.getElementById("play-roulette");

    // Check if player can afford minimum bets using GameConfig
    const canPlaySlots =
      this.game.playerMoney >= GameConfig.BALANCE.MIN_BETS.SLOTS;
    const canPlayBlackjack =
      this.game.playerMoney >= GameConfig.BALANCE.MIN_BETS.BLACKJACK;
    const canPlayRoulette =
      this.game.playerMoney >= GameConfig.BALANCE.MIN_BETS.ROULETTE;

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

  highlightTopPlayer() {
    // Find the player with the most money
    const allPlayers = [
      {
        name: "You",
        money: this.game.playerMoney,
        element: document.querySelector(".player-self"),
      },
      ...this.game.aiPlayers.map((ai) => ({
        name: ai.name,
        money: ai.money,
        element: null, // Will be set when we find the element
      })),
    ];

    // Find highest money amount
    const maxMoney = Math.max(...allPlayers.map((p) => p.money));

    // Remove existing highlights
    document.querySelectorAll(".player-row").forEach((row) => {
      row.classList.remove("leading-player");
    });

    // Highlight the leading player(s)
    allPlayers.forEach((player) => {
      if (player.money === maxMoney) {
        if (player.name === "You") {
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

  showProgressToGoal() {
    // Calculate progress towards the win goal
    const goal = GameConfig.WIN_GOAL;
    const progress = (this.game.playerMoney / goal) * 100;

    // Update progress display if it exists
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    const progressText = document.getElementById("progress-text");
    if (progressText) {
      progressText.textContent = `${progress.toFixed(2)}% to goal`;
    }
  }

  updateRankings() {
    // Create a sorted list of all players
    const allPlayers = [
      { name: "You", money: this.game.playerMoney },
      ...this.game.aiPlayers,
    ];

    allPlayers.sort((a, b) => b.money - a.money);

    // Find player's rank
    const playerRank = allPlayers.findIndex((p) => p.name === "You") + 1;

    // Update rank display if it exists
    const rankDisplay = document.getElementById("player-rank");
    if (rankDisplay) {
      rankDisplay.textContent = `Rank: ${playerRank}/${allPlayers.length}`;
    }
  }

  updateStatistics() {
    // Update various statistics displays if they exist
    const stats = {
      currentMoney: this.game.playerMoney,
      goalProgress: (this.game.playerMoney / GameConfig.WIN_GOAL) * 100,
      rank: this.calculatePlayerRank(),
      topPlayer: this.getTopPlayer(),
    };

    // Update individual stat displays
    const statElements = [
      {
        id: "current-money-stat",
        value: this.game.formatMoney(stats.currentMoney),
      },
      { id: "goal-progress-stat", value: `${stats.goalProgress.toFixed(1)}%` },
      {
        id: "player-rank-stat",
        value: `${stats.rank}/${this.game.aiPlayers.length + 1}`,
      },
      { id: "top-player-stat", value: stats.topPlayer.name },
    ];

    statElements.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });

    return stats;
  }

  calculatePlayerRank() {
    const allPlayers = [
      { name: "You", money: this.game.playerMoney },
      ...this.game.aiPlayers,
    ];

    allPlayers.sort((a, b) => b.money - a.money);
    return allPlayers.findIndex((p) => p.name === "You") + 1;
  }

  getTopPlayer() {
    const allPlayers = [
      { name: "You", money: this.game.playerMoney },
      ...this.game.aiPlayers,
    ];

    return allPlayers.reduce((top, player) =>
      player.money > top.money ? player : top
    );
  }

  // Method to be called when hub is shown
  onShow() {
    this.updatePlayersDisplay();
    this.updateGameButtons();
    this.highlightTopPlayer();
    this.showProgressToGoal();
    this.updateRankings();
    this.updateStatistics();
  }

  // Update displays when money changes
  onMoneyChange() {
    if (this.game.currentScreen === "hub") {
      this.updatePlayersDisplay();
      this.updateGameButtons();
      this.highlightTopPlayer();
      this.showProgressToGoal();
      this.updateStatistics();
    }
  }

  // Handle AI player updates
  onAiUpdate() {
    if (this.game.currentScreen === "hub") {
      this.updatePlayersDisplay();
      this.highlightTopPlayer();
      this.updateRankings();
      this.updateStatistics();
    }
  }
}

// Initialize hub manager when available
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Wait for game to be initialized
    setTimeout(() => {
      if (window.game) {
        window.hubManager = new HubManager(window.game);
      }
    }, 100);
  });
}
