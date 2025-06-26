// Main game controller
class MillionaireCasinoGame {
    constructor() {
        this.playerMoney = 100;
        this.currentScreen = 'hub';
        this.aiPlayers = [
            { id: 1, name: 'Lucky Luke', money: 100, location: 'hub', style: 'conservative' },
            { id: 2, name: 'High Roller', money: 100, location: 'hub', style: 'aggressive' },
            { id: 3, name: 'Card Counter', money: 100, location: 'hub', style: 'moderate' }
        ];
        
        this.gameSettings = {
            slotsBet: 1,
            blackjackBet: 5,
            rouletteBet: 1000
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAiLoop();
        this.updateMoneyDisplays();
        this.updateHub();
    }
    
    bindEvents() {
        // Navigation events
        document.getElementById('play-slots').addEventListener('click', () => this.showScreen('slots'));
        document.getElementById('play-blackjack').addEventListener('click', () => this.showScreen('blackjack'));
        document.getElementById('play-roulette').addEventListener('click', () => this.showScreen('roulette'));
        
        // Back buttons
        document.getElementById('slots-back').addEventListener('click', () => this.showScreen('hub'));
        document.getElementById('blackjack-back').addEventListener('click', () => this.showScreen('hub'));
        document.getElementById('roulette-back').addEventListener('click', () => this.showScreen('hub'));
        
        // Bet selectors
        document.getElementById('slots-bet').addEventListener('change', (e) => {
            this.gameSettings.slotsBet = Number(e.target.value);
            this.updateBetDisplays();
        });
        
        document.getElementById('blackjack-bet').addEventListener('change', (e) => {
            this.gameSettings.blackjackBet = Number(e.target.value);
            this.updateBetDisplays();
        });
        
        document.getElementById('roulette-bet').addEventListener('change', (e) => {
            this.gameSettings.rouletteBet = Number(e.target.value);
            this.updateBetDisplays();
        });
        
        // Trash search
        document.getElementById('search-trash').addEventListener('click', () => this.searchTrash());
        
        // Play again
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
        
        // Update money displays when switching screens
        this.updateMoneyDisplays();
        this.updateBetDisplays();
    }
    
    updateMoneyDisplays() {
        const moneyStr = this.formatMoney(this.playerMoney);
        document.getElementById('player-money').textContent = moneyStr;
        document.getElementById('hub-player-money').textContent = moneyStr;
        document.getElementById('slots-money').textContent = moneyStr;
        document.getElementById('blackjack-money').textContent = moneyStr;
        document.getElementById('roulette-money').textContent = moneyStr;
    }
    
    updateBetDisplays() {
        document.getElementById('slots-current-bet').textContent = this.gameSettings.slotsBet;
        document.getElementById('spin-cost').textContent = this.gameSettings.slotsBet;
        document.getElementById('blackjack-current-bet').textContent = this.gameSettings.blackjackBet;
        document.getElementById('deal-cost').textContent = this.gameSettings.blackjackBet;
        document.getElementById('roulette-current-bet').textContent = this.gameSettings.rouletteBet.toLocaleString();
    }
    
    formatMoney(amount) {
        return `$${amount.toFixed(2)}`;
    }
    
    searchTrash() {
        this.playerMoney += 0.1;
        this.updateMoneyDisplays();
        this.showMessage('Found $0.10 in the trash!');
    }
    
    showMessage(text, duration = 2000) {
        const messageEl = document.getElementById('message-display');
        messageEl.textContent = text;
        messageEl.classList.add('show');
        
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, duration);
    }
    
    updateHub() {
        const playersList = document.getElementById('players-list');
        
        // Clear existing AI players
        const aiRows = playersList.querySelectorAll('.player-row:not(.player-self)');
        aiRows.forEach(row => row.remove());
        
        // Add AI players
        this.aiPlayers.forEach(ai => {
            const playerRow = document.createElement('div');
            playerRow.className = 'player-row';
            playerRow.innerHTML = `
                <span class="player-name">${ai.name}</span>
                <span class="player-money">${this.formatMoney(ai.money)}</span>
                <span class="player-location">${this.getLocationDisplay(ai.location)}</span>
            `;
            playersList.appendChild(playerRow);
        });
    }
    
    getLocationDisplay(location) {
        switch(location) {
            case 'hub': return 'In Hub';
            case 'slots': return 'Playing Slots';
            case 'blackjack': return 'Playing Blackjack';
            case 'roulette': return 'Playing Roulette';
            case 'trash': return 'Searching Trash';
            default: return 'Unknown';
        }
    }
    
    startAiLoop() {
        setInterval(() => {
            this.updateAiPlayers();
            this.updateHub();
            this.checkWinner();
        }, 2000);
    }
    
    updateAiPlayers() {
        this.aiPlayers.forEach(ai => {
            if (Math.random() < 0.3) { // 30% chance to change activity
                const locations = ['hub', 'slots', 'blackjack', 'roulette', 'trash'];
                const newLocation = locations[Math.floor(Math.random() * locations.length)];
                let moneyChange = 0;
                
                if (newLocation === 'trash') {
                    moneyChange = 0.1;
                } else if (newLocation === 'slots') {
                    const bet = ai.style === 'aggressive' ? 100 : ai.style === 'moderate' ? 10 : 1;
                    if (ai.money >= bet) {
                        if (Math.random() < 0.4) { // 40% win rate for AI
                            moneyChange = Math.random() < 0.1 ? bet * 4 : bet * 1.5;
                        } else {
                            moneyChange = -bet;
                        }
                    }
                } else if (newLocation === 'blackjack') {
                    const bet = ai.style === 'aggressive' ? 500 : ai.style === 'moderate' ? 50 : 5;
                    if (ai.money >= bet) {
                        if (Math.random() < 0.45) { // 45% win rate for AI
                            moneyChange = bet;
                        } else {
                            moneyChange = -bet;
                        }
                    }
                } else if (newLocation === 'roulette') {
                    const bet = ai.style === 'aggressive' ? 25000 : ai.style === 'moderate' ? 5000 : 1000;
                    if (ai.money >= bet) {
                        if (Math.random() < 0.4) { // 40% win rate for AI
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
        const allPlayers = [{ name: 'You', money: this.playerMoney }, ...this.aiPlayers];
        const winner = allPlayers.find(p => p.money >= 1000000);
        
        if (winner) {
            this.showWinner(winner);
        }
    }
    
    showWinner(winner) {
        document.getElementById('winner-name').textContent = `${winner.name} reached $1,000,000!`;
        document.getElementById('winner-amount').textContent = `Final amount: ${this.formatMoney(winner.money)}`;
        this.showScreen('winner');
    }
    
    resetGame() {
        this.playerMoney = 100;
        this.aiPlayers.forEach(ai => {
            ai.money = 100;
            ai.location = 'hub';
        });
        this.gameSettings = {
            slotsBet: 1,
            blackjackBet: 5,
            rouletteBet: 1000
        };
        
        // Reset bet selectors
        document.getElementById('slots-bet').value = 1;
        document.getElementById('blackjack-bet').value = 5;
        document.getElementById('roulette-bet').value = 1000;
        
        this.updateMoneyDisplays();
        this.updateBetDisplays();
        this.updateHub();
        this.showScreen('hub');
    }
    
    // Utility methods for games
    canAfford(amount) {
        return this.playerMoney >= amount;
    }
    
    spendMoney(amount) {
        this.playerMoney -= amount;
        this.updateMoneyDisplays();
    }
    
    winMoney(amount) {
        this.playerMoney += amount;
        this.updateMoneyDisplays();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MillionaireCasinoGame();
});