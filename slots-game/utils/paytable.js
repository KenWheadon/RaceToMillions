/**
 * Generic Paytable Manager
 * Handles paytable display, rules, and probability information
 */
export class Paytable {
  constructor(config, gameContainer) {
    this.config = {
      // Default configuration
      title: "Pay Table",
      rtp: 0.95,
      currency: "$",
      symbols: [],
      rules: [],
      ui: {
        buttonSelector: "#paytable-btn",
        sidebarSelector: "#paytable-sidebar",
        overlaySelector: "#overlay",
        contentSelector: "#paytable-content",
        closeSelector: "#paytable-close",
        classes: {
          button: "sg-paytable-btn",
          sidebar: "sg-paytable-sidebar",
          overlay: "sg-overlay",
          content: "sg-paytable-content",
          header: "sg-paytable-header",
          close: "sg-paytable-close",
          grid: "sg-paytable-grid",
          row: "sg-paytable-row",
          latestWin: "sg-latest-win",
          symbol: "sg-symbol-display",
          payout: "sg-payout-info",
          rtp: "sg-rtp-info",
        },
      },
      highlighting: {
        enabled: true,
        duration: 5000,
      },
      ...config,
    };

    this.gameContainer = gameContainer;
    this.latestWin = null;

    this.injectStyles();
    this.createUI();
    this.bindEvents();
    this.updateContent();
  }

  injectStyles() {
    // Check if styles are already injected
    if (document.getElementById("sg-paytable-styles")) return;

    const style = document.createElement("style");
    style.id = "sg-paytable-styles";
    style.textContent = `
      .sg-paytable-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .sg-paytable-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 215, 0, 0.1);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #ffd700;
        box-sizing: border-box;
      }

      .sg-paytable-row.sg-latest-win {
        background: rgba(255, 215, 0, 0.3);
        border-color: #00ff00;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      }

      .sg-symbol-display {
        font-size: 1.8em;
        margin-right: 15px;
      }

      .sg-payout-info {
        text-align: right;
      }

      .sg-payout-info div {
        margin-bottom: 3px;
        color: #ffd700;
        font-size: 0.9em;
      }

      .sg-rules-section {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 215, 0, 0.1);
        border-radius: 8px;
        border: 1px solid #ffd700;
      }

      .sg-rules-section h4 {
        margin: 0 0 10px 0;
        color: #ffd700;
      }

      .sg-rules-section ul {
        margin: 0;
        padding-left: 20px;
        color: #cccccc;
      }

      .sg-rules-section li {
        margin-bottom: 5px;
        font-size: 0.9em;
      }
    `;
    document.head.appendChild(style);
  }

  createUI() {
    // Create paytable button
    const buttonHtml = `
      <button id="${this.config.ui.buttonSelector.replace("#", "")}" class="${
      this.config.ui.classes.button
    }">
        📊
      </button>
    `;

    // Create paytable sidebar
    const sidebarHtml = `
      <div id="${this.config.ui.sidebarSelector.replace("#", "")}" class="${
      this.config.ui.classes.sidebar
    }">
        <div class="${this.config.ui.classes.header}">
          <h3>📊 ${this.config.title}</h3>
          <button id="${this.config.ui.closeSelector.replace(
            "#",
            ""
          )}" class="${this.config.ui.classes.close}">✕</button>
        </div>
        <div id="${this.config.ui.contentSelector.replace("#", "")}" class="${
      this.config.ui.classes.content
    }"></div>
        <div class="${this.config.ui.classes.rtp}">
          <strong>Return to Player: ${(this.config.rtp * 100).toFixed(
            1
          )}%</strong>
        </div>
      </div>
    `;

    this.gameContainer.insertAdjacentHTML("beforeend", buttonHtml);
    this.gameContainer.insertAdjacentHTML("beforeend", sidebarHtml);
  }

  bindEvents() {
    const button = this.gameContainer.querySelector(
      this.config.ui.buttonSelector
    );
    const close = this.gameContainer.querySelector(
      this.config.ui.closeSelector
    );

    button?.addEventListener("click", () => this.show());
    close?.addEventListener("click", () => this.hide());

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const sidebar = this.gameContainer.querySelector(
        this.config.ui.sidebarSelector
      );
      if (
        sidebar?.classList.contains("sg-sidebar-open") &&
        !sidebar.contains(e.target) &&
        !button?.contains(e.target)
      ) {
        this.hide();
      }
    });
  }

  show() {
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );
    const overlay = this.gameContainer.querySelector(
      this.config.ui.overlaySelector
    );

    sidebar?.classList.add("sg-sidebar-open");
    overlay?.classList.add("sg-overlay-show");

    // Update content when shown
    this.updateContent();
  }

  hide() {
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );
    const overlay = this.gameContainer.querySelector(
      this.config.ui.overlaySelector
    );

    sidebar?.classList.remove("sg-sidebar-open");
    overlay?.classList.remove("sg-overlay-show");
  }

  updateContent() {
    const content = this.gameContainer.querySelector(
      this.config.ui.contentSelector
    );
    if (!content) return;

    let html = `<div class="${this.config.ui.classes.grid}">`;

    // Render symbols and their payouts
    this.config.symbols.forEach((symbol) => {
      const isLatestWin =
        this.config.highlighting.enabled &&
        this.latestWin &&
        this.latestWin.symbol === symbol.symbol;

      html += `
        <div class="${this.config.ui.classes.row} ${
        isLatestWin ? this.config.ui.classes.latestWin : ""
      }">
          <div class="${this.config.ui.classes.symbol}">${symbol.symbol}</div>
          <div class="${this.config.ui.classes.payout}">
            ${this.renderPayouts(symbol.payouts)}
          </div>
        </div>
      `;
    });

    html += "</div>";

    // Add rules section if provided
    if (this.config.rules && this.config.rules.length > 0) {
      html += '<div class="sg-rules-section"><h4>Game Rules:</h4><ul>';
      this.config.rules.forEach((rule) => {
        html += `<li>${rule}</li>`;
      });
      html += "</ul></div>";
    }

    content.innerHTML = html;
  }

  renderPayouts(payouts) {
    let html = "";
    Object.entries(payouts).forEach(([condition, payout]) => {
      html += `<div>${condition}: ${this.config.currency}${payout}</div>`;
    });
    return html;
  }

  setLatestWin(symbol, count) {
    this.latestWin = { symbol, count };
    this.updateContent();

    // Clear highlighting after duration
    if (this.config.highlighting.enabled) {
      setTimeout(() => {
        this.latestWin = null;
        this.updateContent();
      }, this.config.highlighting.duration);
    }
  }

  updateSymbol(symbolName, newPayouts) {
    const symbol = this.config.symbols.find((s) => s.symbol === symbolName);
    if (symbol) {
      symbol.payouts = { ...symbol.payouts, ...newPayouts };
      this.updateContent();
    }
  }

  updateRTP(newRTP) {
    this.config.rtp = newRTP;
    const rtpElement = this.gameContainer.querySelector(
      `.${this.config.ui.classes.rtp}`
    );
    if (rtpElement) {
      rtpElement.innerHTML = `<strong>Return to Player: ${(
        newRTP * 100
      ).toFixed(1)}%</strong>`;
    }
  }

  destroy() {
    this.hide();
    const button = this.gameContainer.querySelector(
      this.config.ui.buttonSelector
    );
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );

    if (button && button.parentNode) {
      button.parentNode.removeChild(button);
    }
    if (sidebar && sidebar.parentNode) {
      sidebar.parentNode.removeChild(sidebar);
    }
  }
}
