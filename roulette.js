// Roulette game functionality
class RouletteGame {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.spinning = false;
        this.redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // Bind all betting buttons
        document.querySelectorAll('.bet-button').forEach(button => {
            button.addEventListener('click', (e) => {
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
            this.game.showMessage('Not enough money!');
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
        switch(betType) {
            case 'red':
                won = isRed;
                payoutMultiplier = 1;
                break;
            case 'black':
                won = isBlack;
                payoutMultiplier = 1;
                break;
            case 'odd':
                won = isOdd;
                payoutMultiplier = 1;
                break;
            case 'even':
                won = isEven;
                payoutMultiplier = 1;
                break;
            case '1-12':
                won = number >= 1 && number <= 12;
                payoutMultiplier = 2;
                break;
            case '13-24':
                won = number >= 13 && number <= 24;
                payoutMultiplier = 2;
                break;
            case '25-36':
                won = number >= 25 && number <= 36;
                payoutMultiplier = 2;
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
    }
    
    showSpinAnimation() {
        // Create or update spinning wheel display
        let spinDisplay = document.getElementById('spin-display');
        if (!spinDisplay) {
            spinDisplay = document.createElement('div');
            spinDisplay.id = 'spin-display';
            spinDisplay.className = 'spin-display';
            document.querySelector('.roulette-table').appendChild(spinDisplay);
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
        const numbers = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
        return numbers.map((num, index) => {
            const isRed = this.redNumbers.includes(num);
            const isZero = num === 0;
            const color = isZero ? 'green' : isRed ? 'red' : 'black';
            const rotation = (index * (360 / numbers.length));
            
            return `
                <div class="wheel-number ${color}" style="transform: rotate(${rotation}deg) translateY(-80px) rotate(-${rotation}deg);">
                    ${num}
                </div>
            `;
        }).join('');
    }
    
    showResult(number, betType, won, bet, payout) {
        const color = number === 0 ? 'green' : this.redNumbers.includes(number) ? 'red' : 'black';
        
        // Update spin display with result
        const spinDisplay = document.getElementById('spin-display');
        if (spinDisplay) {
            spinDisplay.innerHTML = `
                <div class="result-display">
                    <div class="winning-number ${color}">
                        ${number}
                    </div>
                    <div class="result-text">
                        ${won ? `WON ${this.game.formatMoney(payout)}!` : `LOST ${this.game.formatMoney(bet)}`}
                    </div>
                </div>
            `;
            
            // Add result animation
            spinDisplay.classList.add(won ? 'win-result' : 'lose-result');
            
            // Remove result display after delay
            setTimeout(() => {
                if (spinDisplay) {
                    spinDisplay.remove();
                }
            }, 4000);
        }
        
        // Show message
        const message = `Number ${number} (${color})! ${won ? `Won ${this.game.formatMoney(payout)}!` : `Lost ${this.game.formatMoney(bet)}`}`;
        this.game.showMessage(message, 3000);
    }
    
    disableButtons() {
        document.querySelectorAll('.bet-button').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }
    
    enableButtons() {
        const bet = this.game.gameSettings.rouletteBet;
        const canAfford = this.game.canAfford(bet);
        
        document.querySelectorAll('.bet-button').forEach(button => {
            button.disabled = !canAfford;
            button.classList.remove('disabled');
            
            if (!canAfford) {
                button.classList.add('cant-afford');
            } else {
                button.classList.remove('cant-afford');
            }
        });
    }
    
    getColorClass(number) {
        if (number === 0) return 'green';
        return this.redNumbers.includes(number) ? 'red' : 'black';
    }
    
    // Method called when screen becomes active
    onShow() {
        // Update bet display
        const bet = this.game.gameSettings.rouletteBet;
        document.getElementById('roulette-current-bet').textContent = bet.toLocaleString();
        
        // Update button affordability
        this.enableButtons();
        
        // Clean up any existing spin displays
        const existingSpinDisplay = document.getElementById('spin-display');
        if (existingSpinDisplay) {
            existingSpinDisplay.remove();
        }
    }
    
    // Show betting history or statistics
    showBettingStats() {
        // Could implement betting history, hot/cold numbers, etc.
        const stats = {
            totalBets: 0,
            totalWon: 0,
            totalLost: 0,
            favoriteType: 'red'
        };
        
        return stats;
    }
    
    // Animate button highlights based on previous wins
    highlightWinningBets(number) {
        // Remove existing highlights
        document.querySelectorAll('.bet-button').forEach(button => {
            button.classList.remove('recent-winner');
        });
        
        // Highlight buttons that would have won
        const isRed = this.redNumbers.includes(number);
        const isBlack = number !== 0 && !isRed;
        const isOdd = number % 2 === 1 && number !== 0;
        const isEven = number % 2 === 0 && number !== 0;
        
        if (isRed) {
            document.querySelector('[data-bet="red"]').classList.add('recent-winner');
        }
        if (isBlack) {
            document.querySelector('[data-bet="black"]').classList.add('recent-winner');
        }
        if (isOdd) {
            document.querySelector('[data-bet="odd"]').classList.add('recent-winner');
        }
        if (isEven) {
            document.querySelector('[data-bet="even"]').classList.add('recent-winner');
        }
        
        // Check dozens
        if (number >= 1 && number <= 12) {
            document.querySelector('[data-bet="1-12"]').classList.add('recent-winner');
        } else if (number >= 13 && number <= 24) {
            document.querySelector('[data-bet="13-24"]').classList.add('recent-winner');
        } else if (number >= 25 && number <= 36) {
            document.querySelector('[data-bet="25-36"]').classList.add('recent-winner');
        }
        
        // Remove highlights after delay
        setTimeout(() => {
            document.querySelectorAll('.recent-winner').forEach(button => {
                button.classList.remove('recent-winner');
            });
        }, 3000);
    }
}

// Initialize roulette when available
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.game) {
                window.rouletteGame = new RouletteGame(window.game);
            }
        }, 100);
    });
}