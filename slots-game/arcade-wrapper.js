// arcade-wrapper.js - Arcade machine wrapper functionality

import { createSlotsGold } from "./slots-gold.js";

class ArcadeWrapper {
  constructor() {
    this.gameLoaded = false;
    this.gameInstance = null;
    this.currentGame = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setGlobalHandlers();
  }

  bindEvents() {
    // Close popup when clicking overlay (outside the machine)
    const overlay = document.getElementById("arcadeOverlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeArcadeMachine();
        }
      });
    }

    // Close popup with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeArcadeMachine();
      }
    });

    // Handle machine wrapper click
    const machineWrapper = document.querySelector(".machine-wrapper");
    if (machineWrapper) {
      machineWrapper.addEventListener("click", () => {
        this.openArcadeMachine();
      });

      // Remove inline onclick if it exists
      machineWrapper.removeAttribute("onclick");
    }

    // Handle close button click
    const closeBtn = document.querySelector(".arcade-button.close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.closeArcadeMachine();
      });

      // Remove inline onclick if it exists
      closeBtn.removeAttribute("onclick");
    }
  }

  setGlobalHandlers() {
    // Make functions available globally for any remaining onclick handlers
    // This provides backward compatibility if needed
    window.openArcadeMachine = () => this.openArcadeMachine();
    window.closeArcadeMachine = () => this.closeArcadeMachine();
  }

  openArcadeMachine() {
    const overlay = document.getElementById("arcadeOverlay");
    if (!overlay) {
      console.error("Arcade overlay not found!");
      return;
    }

    overlay.classList.add("show");

    // Load game if not already loaded
    if (!this.gameLoaded) {
      this.loadSlotGame();
      this.gameLoaded = true;
    }

    // Prevent body scrolling when popup is open
    document.body.style.overflow = "hidden";

    // Focus management for accessibility
    overlay.focus();
  }

  closeArcadeMachine() {
    const overlay = document.getElementById("arcadeOverlay");
    if (!overlay) {
      console.error("Arcade overlay not found!");
      return;
    }

    overlay.classList.remove("show");

    // Restore body scrolling
    document.body.style.overflow = "auto";

    // Return focus to the machine wrapper
    const machineWrapper = document.querySelector(".machine-wrapper");
    if (machineWrapper) {
      machineWrapper.focus();
    }
  }

  loadSlotGame() {
    const gameScreen = document.getElementById("gameScreen");
    if (!gameScreen) {
      console.error("Game screen container not found!");
      return;
    }

    // Clear any existing content
    gameScreen.innerHTML = "";

    try {
      // Load the slots game
      this.gameInstance = createSlotsGold(gameScreen);
      this.currentGame = "slots";

      console.log("Slots game loaded successfully");
    } catch (error) {
      console.error("Error creating SlotsGold instance:", error);

      // Show user-friendly error message
      gameScreen.innerHTML = `
        <div style="color: #ffd700; text-align: center; padding: 50px;">
          <h3>🎰 Game Loading Error</h3>
          <p>Unable to load the slot machine game.</p>
          <p style="font-size: 0.9em; color: #ffaa00;">
            Error: ${error.message}
          </p>
          <button onclick="location.reload()" style="
            background: #ffd700; 
            color: #000; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            cursor: pointer;
            margin-top: 15px;
          ">
            Reload Page
          </button>
        </div>
      `;
    }
  }

  // Method to switch games in the future
  loadGame(gameType) {
    const gameScreen = document.getElementById("gameScreen");
    if (!gameScreen) {
      console.error("Game screen container not found!");
      return;
    }

    // Clean up current game if exists
    if (this.gameInstance && typeof this.gameInstance.destroy === "function") {
      this.gameInstance.destroy();
    }

    gameScreen.innerHTML = "";

    try {
      switch (gameType.toLowerCase()) {
        case "slots":
          this.gameInstance = createSlotsGold(gameScreen);
          this.currentGame = "slots";
          break;

        // Add other games here in the future
        // case 'blackjack':
        //   this.gameInstance = createBlackjack(gameScreen);
        //   this.currentGame = 'blackjack';
        //   break;

        default:
          throw new Error(`Unknown game type: ${gameType}`);
      }

      console.log(`${gameType} game loaded successfully`);
    } catch (error) {
      console.error(`Error loading ${gameType} game:`, error);
      gameScreen.innerHTML = `
        <div style="color: #ffd700; text-align: center; padding: 50px;">
          <h3>🎮 Game Loading Error</h3>
          <p>Unable to load the ${gameType} game.</p>
          <p style="font-size: 0.9em; color: #ffaa00;">
            Error: ${error.message}
          </p>
        </div>
      `;
    }
  }

  // Utility methods for game management
  getCurrentGame() {
    return this.currentGame;
  }

  getGameInstance() {
    return this.gameInstance;
  }

  isGameLoaded() {
    return this.gameLoaded && this.gameInstance !== null;
  }

  // Reset the wrapper (useful for testing)
  reset() {
    if (this.gameInstance && typeof this.gameInstance.destroy === "function") {
      this.gameInstance.destroy();
    }

    this.gameLoaded = false;
    this.gameInstance = null;
    this.currentGame = null;

    const gameScreen = document.getElementById("gameScreen");
    if (gameScreen) {
      gameScreen.innerHTML = "";
    }

    this.closeArcadeMachine();
  }
}

// Initialize the arcade wrapper when DOM is loaded
let arcadeWrapper = null;

document.addEventListener("DOMContentLoaded", () => {
  // Disable auto-initialization flag for the slot game
  window.SlotsGoldAutoInit = false;

  // Initialize the arcade wrapper
  arcadeWrapper = new ArcadeWrapper();

  // Make wrapper available globally for debugging/testing
  window.ArcadeWrapper = arcadeWrapper;

  console.log("Arcade wrapper initialized");
});

// Export for use in other modules
export { ArcadeWrapper };
