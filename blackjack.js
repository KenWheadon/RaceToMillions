// Blackjack game functionality
class BlackjackGame {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.gameState = null;
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById('deal-button').addEventListener('click', () => this.dealCards());
        document.getElementById('hit-button').addEventListener('click', () => this.hit());
        document.getElementById('stand-button').addEventListener('click', () => this.stand());
    }
    
    dealCards() {
        const bet = this.game.gameSettings.blackjackBet;
        
        if (!this.game.canAfford(bet)) {
            this.game.showMessage('Not enough money!');
            return;
        }
        
        // Initialize new game
        this.gameState = {
            playerCards: [this.drawCard(), this.drawCard()],
            dealerCards: [this.drawCard(), this.drawCard()],
            gamePhase: 'playing',
            bet: bet
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
        
        cards.forEach(card => {
            if (card === 1) { // Ace
                aces++;
                total += 11;
            } else if (card > 10) { // Face cards
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
        if (card === 1) return 'A';
        if (card === 11) return 'J';
        if (card === 12) return 'Q';
        if (card === 13) return 'K';
        return card.toString();
    }
    
    getCardSuit() {
        const suits = ['♠', '♥', '♦', '♣'];
        return suits[Math.floor(Math.random() * suits.length)];
    }
    
    updateDisplay() {
        if (!this.gameState) return;
        
        const playerTotal = this.calculateTotal(this.gameState.playerCards);
        const dealerTotal = this.calculateTotal(this.gameState.dealerCards);
        
        // Update totals
        document.getElementById('player-total').textContent = playerTotal;
        document.getElementById('dealer-total').textContent = 
            this.gameState.gamePhase === 'playing' ? this.calculateTotal([this.gameState.dealerCards[0]]) : dealerTotal;
        
        // Update cards display
        this.updateCardsDisplay('player-cards', this.gameState.playerCards);
        this.updateCardsDisplay('dealer-cards', this.gameState.dealerCards, this.gameState.gamePhase === 'playing');
        
        // Show/hide buttons
        document.getElementById('deal-button').style.display = this.gameState.gamePhase === 'playing' ? 'none' : 'block';
        document.getElementById('game-actions').style.display = this.gameState.gamePhase === 'playing' ? 'flex' : 'none';
    }
    
    updateCardsDisplay(containerId, cards, hideSecond = false) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'playing-card';
            
            if (hideSecond && index === 1) {
                // Hidden dealer card
                cardEl.innerHTML = `
                    <div class="card-back">
                        <div class="card-pattern"></div>
                    </div>
                `;
                cardEl.classList.add('hidden-card');
            } else {
                const suit = this.getCardSuit();
                const isRed = suit === '♥' || suit === '♦';
                cardEl.innerHTML = `
                    <div class="card-front ${isRed ? 'red' : 'black'}">
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
                this.endGame('push', 'Both have blackjack! Push!');
            } else {
                this.endGame('blackjack', 'BLACKJACK! You win!');
            }
        }
    }
    
    hit() {
        if (!this.gameState || this.gameState.gamePhase !== 'playing') return;
        
        const newCard = this.drawCard();
        this.gameState.playerCards.push(newCard);
        
        const playerTotal = this.calculateTotal(this.gameState.playerCards);
        
        this.updateDisplay();
        
        if (playerTotal > 21) {
            this.endGame('bust', `Bust! Lost ${this.game.formatMoney(this.gameState.bet)}`);
        } else if (playerTotal === 21) {
            this.stand(); // Auto-stand on 21
        }
    }
    
    stand() {
        if (!this.gameState || this.gameState.gamePhase !== 'playing') return;
        
        this.gameState.gamePhase = 'dealer';
        
        // Dealer plays
        while (this.calculateTotal(this.gameState.dealerCards) < 17) {
            this.gameState.dealerCards.push(this.drawCard());
        }
        
        this.updateDisplay();
        this.resolveGame();
    }
    
    resolveGame() {
        const playerTotal = this.calculateTotal(this.gameState.playerCards);
        const dealerTotal = this.calculateTotal(this.gameState.dealerCards);
        
        if (dealerTotal > 21) {
            this.endGame('win', `Dealer bust! Won ${this.game.formatMoney(this.gameState.bet)}!`);
        } else if (playerTotal > dealerTotal) {
            this.endGame('win', `You win! Won ${this.game.formatMoney(this.gameState.bet)}!`);
        } else if (playerTotal === dealerTotal) {
            this.endGame('push', 'Push! Bet returned.');
        } else {
            this.endGame('lose', `Dealer wins. Lost ${this.game.formatMoney(this.gameState.bet)}`);
        }
    }
    
    endGame(result, message) {
        this.gameState.gamePhase = 'ended';
        
        let winAmount = 0;
        
        switch (result) {
            case 'blackjack':
                winAmount = this.gameState.bet * 2.5; // Blackjack pays 2.5:1
                break;
            case 'win':
                winAmount = this.gameState.bet * 2; // Regular win pays 1:1 (return bet + winnings)
                break;
            case 'push':
                winAmount = this.gameState.bet; // Return bet only
                break;
            case 'lose':
            case 'bust':
                winAmount = 0; // Lose bet
                break;
        }
        
        // Deduct bet and add winnings
        this.game.spendMoney(this.gameState.bet);
        if (winAmount > 0) {
            this.game.winMoney(winAmount);
        }
        
        this.game.showMessage(message, 3000);
        
        // Reset game state after a delay
        setTimeout(() => {
            this.resetGame();
        }, 3000);
    }
    
    resetGame() {
        this.gameState = null;
        document.getElementById('player-cards').innerHTML = '';
        document.getElementById('dealer-cards').innerHTML = '';
        document.getElementById('player-total').textContent = '0';
        document.getElementById('dealer-total').textContent = '0';
        document.getElementById('deal-button').style.display = 'block';
        document.getElementById('game-actions').style.display = 'none';
    }
    
    // Method called when screen becomes active
    onShow() {
        // Update bet display
        const bet = this.game.gameSettings.blackjackBet;
        document.getElementById('blackjack-current-bet').textContent = bet;
        document.getElementById('deal-cost').textContent = bet;
        
        // Enable/disable deal button based on affordability
        const dealButton = document.getElementById('deal-button');
        dealButton.disabled = !this.game.canAfford(bet);
        
        if (!this.game.canAfford(bet)) {
            dealButton.textContent = `Deal Cards (Need $${bet})`;
        } else {
            dealButton.textContent = `Deal Cards ($${bet})`;
        }
    }
}

// Initialize blackjack when available
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.game) {
                window.blackjackGame = new BlackjackGame(window.game);
            }
        }, 100);
    });
}