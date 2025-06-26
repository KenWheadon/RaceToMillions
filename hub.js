// Hub screen functionality
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
        const playersList = document.getElementById('players-list');
        
        // Update player's own money display
        const playerSelfRow = playersList.querySelector('.player-self .player-money');
        if (playerSelfRow) {
            playerSelfRow.textContent = this.game.formatMoney(this.game.playerMoney);
        }
        
        // Clear existing AI players
        const aiRows = playersList.querySelectorAll('.player-row:not(.player-self)');
        aiRows.forEach(row => row.remove());
        
        // Add AI players
        this.game.aiPlayers.forEach(ai => {
            const playerRow = document.createElement('div');
            playerRow.className = 'player-row';
            playerRow.innerHTML = `
                <span class="player-name">${ai.name}</span>
                <span class="player-money">${this.game.formatMoney(ai.money)}</span>
                <span class="player-location">${this.getLocationDisplay(ai.location)}</span>
            `;
            playersList.appendChild(playerRow);
        });
    }
    
    getLocationDisplay(location) {
        const locationMap = {
            'hub': 'In Hub',
            'slots': 'Playing Slots',
            'blackjack': 'Playing Blackjack',
            'roulette': 'Playing Roulette',
            'trash': 'Searching Trash'
        };
        return locationMap[location] || 'Unknown';
    }
    
    updateGameButtons() {
        // Update button states based on player money
        const slotsButton = document.getElementById('play-slots');
        const blackjackButton = document.getElementById('play-blackjack');
        const rouletteButton = document.getElementById('play-roulette');
        
        // Check if player can afford minimum bets
        const canPlaySlots = this.game.playerMoney >= 1;
        const canPlayBlackjack = this.game.playerMoney >= 5;
        const canPlayRoulette = this.game.playerMoney >= 1000;
        
        slotsButton.disabled = !canPlaySlots;
        blackjackButton.disabled = !canPlayBlackjack;
        rouletteButton.disabled = !canPlayRoulette;
        
        // Update button text to show affordability
        if (!canPlaySlots) {
            slotsButton.textContent = 'Play Slots (Need $1)';
        } else {
            slotsButton.textContent = 'Play Slots';
        }
        
        if (!canPlayBlackjack) {
            blackjackButton.textContent = 'Play Blackjack (Need $5)';
        } else {
            blackjackButton.textContent = 'Play Blackjack';
        }
        
        if (!canPlayRoulette) {
            rouletteButton.textContent = 'Play Roulette (Need $1K)';
        } else {
            rouletteButton.textContent = 'Play Roulette';
        }
    }
    
    highlightTopPlayer() {
        // Find the player with the most money
        const allPlayers = [
            { name: 'You', money: this.game.playerMoney, element: document.querySelector('.player-self') },
            ...this.game.aiPlayers.map(ai => ({
                name: ai.name,
                money: ai.money,
                element: null // Will be set when we find the element
            }))
        ];
        
        // Find highest money amount
        const maxMoney = Math.max(...allPlayers.map(p => p.money));
        
        // Remove existing highlights
        document.querySelectorAll('.player-row').forEach(row => {
            row.classList.remove('leading-player');
        });
        
        // Highlight the leading player(s)
        allPlayers.forEach(player => {
            if (player.money === maxMoney) {
                if (player.name === 'You') {
                    document.querySelector('.player-self').classList.add('leading-player');
                } else {
                    // Find the AI player row by name
                    const aiRows = document.querySelectorAll('.player-row:not(.player-self)');
                    aiRows.forEach(row => {
                        if (row.querySelector('.player-name').textContent === player.name) {
                            row.classList.add('leading-player');
                        }
                    });
                }
            }
        });
    }
    
    showProgressToGoal() {
        // Calculate progress towards $1,000,000
        const goal = 1000000;
        const progress = (this.game.playerMoney / goal) * 100;
        
        // Update progress display if it exists
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            progressText.textContent = `${progress.toFixed(2)}% to goal`;
        }
    }
    
    updateRankings() {
        // Create a sorted list of all players
        const allPlayers = [
            { name: 'You', money: this.game.playerMoney },
            ...this.game.aiPlayers
        ];
        
        allPlayers.sort((a, b) => b.money - a.money);
        
        // Find player's rank
        const playerRank = allPlayers.findIndex(p => p.name === 'You') + 1;
        
        // Update rank display if it exists
        const rankDisplay = document.getElementById('player-rank');
        if (rankDisplay) {
            rankDisplay.textContent = `Rank: ${playerRank}/${allPlayers.length}`;
        }
    }
    
    // Method to be called when hub is shown
    onShow() {
        this.updatePlayersDisplay();
        this.updateGameButtons();
        this.highlightTopPlayer();
        this.showProgressToGoal();
        this.updateRankings();
    }
}

// Initialize hub manager when available
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for game to be initialized
        setTimeout(() => {
            if (window.game) {
                window.hubManager = new HubManager(window.game);
            }
        }, 100);
    });
}