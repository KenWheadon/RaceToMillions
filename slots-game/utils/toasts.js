/**
 * Generic Toast Notification System
 * Handles temporary message display with animations and queuing
 */
export class Toasts {
  constructor(config, gameContainer) {
    this.config = {
      // Default configuration
      maxVisible: 5,
      duration: 3000,
      animationDuration: 300,
      position: "top-right", // top-right, top-left, bottom-right, bottom-left, center
      containerSelector: "#toast-container",
      classes: {
        container: "sg-toast-container",
        toast: "sg-toast",
        show: "sg-toast-show",
      },
      types: {
        neutral: {
          color: "#ffd700",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #ffd700",
        },
        success: {
          color: "#00ff00",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #00ff00",
        },
        error: {
          color: "#ff6b6b",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #ff6b6b",
        },
        info: {
          color: "#00ffff",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #00ffff",
        },
        warning: {
          color: "#ffaa00",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "2px solid #ffaa00",
        },
      },
      ...config,
    };

    this.gameContainer = gameContainer;
    this.toastQueue = [];
    this.activeToasts = [];

    this.createContainer();
  }

  createContainer() {
    const container = document.createElement("div");
    container.id = this.config.containerSelector.replace("#", "");
    container.className = this.config.classes.container;

    // Position the container
    const positions = {
      "top-right": { position: "fixed", top: "20px", right: "20px" },
      "top-left": { position: "fixed", top: "20px", left: "20px" },
      "bottom-right": { position: "fixed", bottom: "20px", right: "20px" },
      "bottom-left": { position: "fixed", bottom: "20px", left: "20px" },
      center: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      },
    };

    const positionStyles =
      positions[this.config.position] || positions["top-right"];
    Object.assign(container.style, positionStyles);
    container.style.zIndex = "1000";

    this.gameContainer.appendChild(container);
    this.container = container;
  }

  show(message, type = "neutral", duration = null) {
    const toastConfig = {
      message,
      type,
      duration: duration || this.config.duration,
      timestamp: Date.now(),
    };

    if (this.activeToasts.length >= this.config.maxVisible) {
      this.toastQueue.push(toastConfig);
    } else {
      this.createToast(toastConfig);
    }
  }

  createToast(toastConfig) {
    const toast = document.createElement("div");
    toast.className = this.config.classes.toast;
    toast.textContent = toastConfig.message;

    // Apply type styling
    const typeStyle =
      this.config.types[toastConfig.type] || this.config.types.neutral;
    Object.assign(toast.style, {
      color: typeStyle.color,
      backgroundColor: typeStyle.backgroundColor,
      border: typeStyle.border,
      padding: "12px 18px",
      borderRadius: "8px",
      marginBottom: "8px",
      opacity: "0",
      transform: "translateX(100%)",
      transition: `all ${this.config.animationDuration}ms ease`,
      minWidth: "180px",
      textAlign: "center",
      fontSize: "0.9em",
    });

    this.container.appendChild(toast);
    this.activeToasts.push({ element: toast, config: toastConfig });

    // Trigger show animation
    setTimeout(() => {
      toast.classList.add(this.config.classes.show);
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 100);

    // Schedule removal
    setTimeout(() => {
      this.removeToast(toast);
    }, toastConfig.duration);
  }

  removeToast(toastElement) {
    const toastIndex = this.activeToasts.findIndex(
      (t) => t.element === toastElement
    );
    if (toastIndex === -1) return;

    const toast = this.activeToasts[toastIndex];

    // Hide animation
    toast.element.classList.remove(this.config.classes.show);
    toast.element.style.opacity = "0";
    toast.element.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (this.container.contains(toast.element)) {
        this.container.removeChild(toast.element);
      }

      this.activeToasts.splice(toastIndex, 1);

      // Process queue
      if (this.toastQueue.length > 0) {
        const nextToast = this.toastQueue.shift();
        this.createToast(nextToast);
      }
    }, this.config.animationDuration);
  }

  // Convenience methods
  success(message, duration) {
    this.show(message, "success", duration);
  }

  error(message, duration) {
    this.show(message, "error", duration);
  }

  info(message, duration) {
    this.show(message, "info", duration);
  }

  warning(message, duration) {
    this.show(message, "warning", duration);
  }

  clear() {
    this.activeToasts.forEach((toast) => {
      if (this.container.contains(toast.element)) {
        this.container.removeChild(toast.element);
      }
    });
    this.activeToasts = [];
    this.toastQueue = [];
  }
}
