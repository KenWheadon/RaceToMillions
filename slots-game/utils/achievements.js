/**
 * Generic Achievement System
 * Handles achievement tracking, unlocking, rewards, and UI display
 */
export class Achievements {
  constructor(config, gameContainer) {
    this.config = {
      // Default configuration
      achievements: {},
      ui: {
        containerSelector: "#achievements-container",
        sidebarSelector: "#achievements-sidebar",
        toggleSelector: "#achievements-toggle",
        overlaySelector: "#overlay",
        listSelector: "#achievements-list",
        headerSelector: "#achievements-header",
        closeSelector: "#achievements-close",
        classes: {
          sidebar: "sg-achievements-sidebar",
          toggle: "sg-achievements-toggle",
          overlay: "sg-overlay",
          list: "sg-achievements-list",
          achievement: "sg-achievement",
          unlocked: "sg-unlocked",
          locked: "sg-locked",
          header: "sg-achievements-header",
          close: "sg-achievements-close",
        },
      },
      particles: {
        enabled: true,
        count: 15,
        duration: 3000,
        containerSelector: "#particles-container",
      },
      ...config,
    };

    this.gameContainer = gameContainer;
    this.achievements = this.initializeAchievements();
    this.onRewardCallback = null;
    this.onUnlockCallback = null;

    this.injectStyles();
    this.createUI();
    this.bindEvents();
  }

  injectStyles() {
    // Check if styles are already injected
    if (document.getElementById("sg-achievements-styles")) return;

    const style = document.createElement("style");
    style.id = "sg-achievements-styles";
    style.textContent = `
      .sg-achievement {
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid #ffd700;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      .sg-achievement.sg-unlocked {
        background: rgba(255, 215, 0, 0.2);
        border-color: #00ff00;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
      }

      .sg-achievement.sg-locked {
        opacity: 0.6;
      }

      .sg-achievement h4 {
        margin: 0 0 8px 0;
        color: #ffd700;
        font-size: 1.1em;
      }

      .sg-achievement p {
        margin: 0 0 8px 0;
        color: #cccccc;
        font-size: 0.9em;
      }

      .sg-reward {
        color: #00ff00;
        font-weight: bold;
        font-size: 0.9em;
      }

      .sg-rarity {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: bold;
        margin-left: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: #ffd700;
      }

      .sg-particle {
        position: absolute;
        font-size: 1.5em;
        animation: sg-particle-float 3s ease-out forwards;
        pointer-events: none;
      }

      @keyframes sg-particle-float {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(var(--end-x, 0), var(--end-y, -100px)) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }

  initializeAchievements() {
    const achievements = {};

    // Process achievement definitions from config
    Object.entries(this.config.achievements).forEach(
      ([key, achievementDef]) => {
        achievements[key] = {
          name: achievementDef.name,
          description: achievementDef.description,
          reward: achievementDef.reward,
          unlocked: false,
          category: achievementDef.category || "general",
          icon: achievementDef.icon || "🏆",
          rarity: achievementDef.rarity || "common",
          ...achievementDef,
        };
      }
    );

    return achievements;
  }

  createUI() {
    // Create achievement toggle button
    const toggleHtml = `
      <button id="${this.config.ui.toggleSelector.replace("#", "")}" class="${
      this.config.ui.classes.toggle
    }">
        🏆
      </button>
    `;

    // Create achievement sidebar
    const sidebarHtml = `
      <div id="${this.config.ui.sidebarSelector.replace("#", "")}" class="${
      this.config.ui.classes.sidebar
    }">
        <div class="${this.config.ui.classes.header}">
          <h3>🏆 Achievements</h3>
          <button id="${this.config.ui.closeSelector.replace(
            "#",
            ""
          )}" class="${this.config.ui.classes.close}">✕</button>
        </div>
        <div id="${this.config.ui.listSelector.replace("#", "")}" class="${
      this.config.ui.classes.list
    }"></div>
      </div>
    `;

    // Add to game container
    this.gameContainer.insertAdjacentHTML("beforeend", toggleHtml);
    this.gameContainer.insertAdjacentHTML("beforeend", sidebarHtml);

    this.updateDisplay();
  }

  bindEvents() {
    const toggle = this.gameContainer.querySelector(
      this.config.ui.toggleSelector
    );
    const close = this.gameContainer.querySelector(
      this.config.ui.closeSelector
    );
    const overlay = this.gameContainer.querySelector(
      this.config.ui.overlaySelector
    );

    toggle?.addEventListener("click", () => this.show());
    close?.addEventListener("click", () => this.hide());

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      const sidebar = this.gameContainer.querySelector(
        this.config.ui.sidebarSelector
      );
      if (
        sidebar?.classList.contains("sg-sidebar-open") &&
        !sidebar.contains(e.target) &&
        !toggle?.contains(e.target)
      ) {
        this.hide();
      }
    });
  }

  show() {
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );
    const toggle = this.gameContainer.querySelector(
      this.config.ui.toggleSelector
    );
    const overlay = this.gameContainer.querySelector(
      this.config.ui.overlaySelector
    );

    sidebar?.classList.add("sg-sidebar-open");
    toggle?.classList.add("sg-toggle-hidden");
    overlay?.classList.add("sg-overlay-show");
  }

  hide() {
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );
    const toggle = this.gameContainer.querySelector(
      this.config.ui.toggleSelector
    );
    const overlay = this.gameContainer.querySelector(
      this.config.ui.overlaySelector
    );

    sidebar?.classList.remove("sg-sidebar-open");
    toggle?.classList.remove("sg-toggle-hidden");
    overlay?.classList.remove("sg-overlay-show");
  }

  updateDisplay() {
    const list = this.gameContainer.querySelector(this.config.ui.listSelector);
    if (!list) return;

    list.innerHTML = "";

    // Group achievements by category if specified
    const categories = {};
    Object.entries(this.achievements).forEach(([key, achievement]) => {
      const category = achievement.category || "general";
      if (!categories[category]) categories[category] = [];
      categories[category].push({ key, ...achievement });
    });

    // Render achievements by category
    Object.entries(categories).forEach(
      ([categoryName, categoryAchievements]) => {
        if (Object.keys(categories).length > 1) {
          const categoryHeader = document.createElement("h4");
          categoryHeader.textContent =
            categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
          categoryHeader.style.color = "#ffd700";
          categoryHeader.style.marginTop = "20px";
          categoryHeader.style.marginBottom = "10px";
          list.appendChild(categoryHeader);
        }

        categoryAchievements.forEach((achievement) => {
          const div = document.createElement("div");
          div.className = `${this.config.ui.classes.achievement} ${
            achievement.unlocked
              ? this.config.ui.classes.unlocked
              : this.config.ui.classes.locked
          }`;

          div.innerHTML = `
          <h4>${achievement.icon} ${achievement.name}</h4>
          <p>${achievement.description}</p>
          <span class="sg-reward">Reward: ${achievement.reward} ${
            this.config.rewardUnit || "points"
          }</span>
          ${
            achievement.rarity !== "common"
              ? `<span class="sg-rarity">${achievement.rarity}</span>`
              : ""
          }
        `;

          list.appendChild(div);
        });
      }
    );
  }

  checkAchievement(achievementKey, currentValue, targetValue = null) {
    const achievement = this.achievements[achievementKey];
    if (!achievement || achievement.unlocked) return false;

    let shouldUnlock = false;

    if (targetValue !== null) {
      shouldUnlock = currentValue >= targetValue;
    } else if (achievement.condition) {
      shouldUnlock = achievement.condition(currentValue);
    } else {
      shouldUnlock = true; // Simple trigger
    }

    if (shouldUnlock) {
      return this.unlockAchievement(achievementKey);
    }

    return false;
  }

  unlockAchievement(achievementKey) {
    const achievement = this.achievements[achievementKey];
    if (!achievement || achievement.unlocked) return false;

    achievement.unlocked = true;

    // Trigger callbacks
    if (this.onUnlockCallback) {
      this.onUnlockCallback(achievement, achievementKey);
    }

    if (this.onRewardCallback && achievement.reward > 0) {
      this.onRewardCallback(achievement.reward, achievement);
    }

    // Create particles if enabled
    if (this.config.particles.enabled) {
      this.createParticles(achievement);
    }

    this.updateDisplay();
    return true;
  }

  createParticles(achievement) {
    const container = this.gameContainer.querySelector(
      this.config.particles.containerSelector
    );
    if (!container) return;

    const emoji = achievement.icon || "🏆";

    for (let i = 0; i < this.config.particles.count; i++) {
      const particle = document.createElement("div");
      particle.className = "sg-particle";
      particle.textContent = emoji;

      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = startY - Math.random() * 100;

      particle.style.left = startX + "%";
      particle.style.top = startY + "%";
      particle.style.setProperty("--end-x", endX + "%");
      particle.style.setProperty("--end-y", endY + "%");

      container.appendChild(particle);

      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, this.config.particles.duration);
    }
  }

  // Public API methods
  setRewardCallback(callback) {
    this.onRewardCallback = callback;
  }

  setUnlockCallback(callback) {
    this.onUnlockCallback = callback;
  }

  getAchievements() {
    return { ...this.achievements };
  }

  getUnlockedCount() {
    return Object.values(this.achievements).filter((a) => a.unlocked).length;
  }

  getTotalCount() {
    return Object.keys(this.achievements).length;
  }

  reset() {
    Object.values(this.achievements).forEach((achievement) => {
      achievement.unlocked = false;
    });
    this.updateDisplay();
  }

  destroy() {
    this.hide();
    const toggle = this.gameContainer.querySelector(
      this.config.ui.toggleSelector
    );
    const sidebar = this.gameContainer.querySelector(
      this.config.ui.sidebarSelector
    );

    if (toggle && toggle.parentNode) {
      toggle.parentNode.removeChild(toggle);
    }
    if (sidebar && sidebar.parentNode) {
      sidebar.parentNode.removeChild(sidebar);
    }
  }
}
