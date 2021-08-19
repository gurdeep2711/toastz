/**
 * Eg:
 * 
 * import Toast from '<Toast_Package>' or const Toast = window.Toast;
 * 
 * Usage:
 * // initialize on application load
 * Toast.init();
 * 
 * // call it, with or without options
 * const options = {
 *    dismissDelay: <number>; // default is 5000 in ms
 *    btnText: <string>; // default is empty, then cross will show, else to show button with text pass custom string
 *    icon: <boolean>; // default is false, show to "!" icon on front
 * }
 * Toast.createToast('<MSG_TO_SHOW>', options)
 */
const Toast = new (function () {
  try {
    const SELECTORS = {
      globalContainer: "#toast-global-container",
      globalCss: "#toast-global-css",
      toastContainer: ".toast-container",
    };

    function injectGlobalContainer() {
      const globalContainer = document.querySelector(SELECTORS.globalContainer);
      if (globalContainer) return;

      const globalContainerHtmlString = `<div id="toast-global-container"></div>`;
      document.body.insertAdjacentHTML("beforeend", globalContainerHtmlString);
    }

    function injectGlobalCss() {
      const globalCss = document.querySelector(SELECTORS.globalCss);
      if (globalCss) return;

      const globalCssHtmlString = `<style id="toast-global-css">#toast-global-container{position:fixed;left:16px;bottom:16px;width:calc(100% - 32px);max-width:480px;max-height:25%;z-index:999999999999;overflow:auto}#toast-global-container .toast-container{display:flex;align-items:center;padding:8px 8px 8px 16px;background-color:#393939;color:#fff;border-radius:8px;box-shadow:0 5px 10px rgba(106,112,121,.24);width:100%;height:auto;font-size:12px;font-weight:600;line-height:18px;margin-bottom:16px;transform:scale(0);opacity:1;transition:opacity .25s ease-in-out}#toast-global-container .toast-container:last-child{margin-bottom:0}#toast-global-container .toast-container.no-icon:before{content:unset}#toast-global-container .toast-container:before{content:'!';width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;background:#fff;border-radius:100%;margin-right:10px;font-weight:700;color:#393939}#toast-global-container .toast-container .toast-content{flex:1;font-size:14px;font-weight:700;overflow:hidden;flex-wrap:wrap}#toast-global-container .toast-container .toast-close{position:relative;height:24px;width:24px;font-size:14px;font-weight:700;color:#fff;margin-left:10px;padding:16px;border-radius:4px;cursor:pointer}#toast-global-container .toast-container .toast-close:after,#toast-global-container .toast-container .toast-close:before{content:'';position:absolute;left:50%;top:50%;height:calc(100% - 16px);width:2px;background-color:#fff;transform:translate(-50%,-50%) rotate(45deg)}#toast-global-container .toast-container .toast-close:before{transform:translate(-50%,-50%) rotate(-45deg)}#toast-global-container .toast-container .toast-close.only-text{height:unset;width:unset;padding:8px 16px;background-color:rgba(255,255,255,.12)}#toast-global-container .toast-container .toast-close.only-text:after,#toast-global-container .toast-container .toast-close.only-text:before{content:unset}#toast-global-container .toast-container.mount-active{animation-delay:50ms;animation:mount .25s cubic-bezier(.25,.8,.25,1) forwards}@keyframes mount{0%{transform:scale(0)}100%{transform:scale(1)}}</style>`;
      document.head.insertAdjacentHTML("beforeend", globalCssHtmlString);
    }

    function onClickHandler(uniqueId, onDismiss) {
      const element = document.getElementById(uniqueId);
      if (!element) return;

      // remove element with fade animation
      element.style.opacity = 0;
      (function (onDismiss) {
        setTimeout(function () {
          element.remove();
          if (typeof onDismiss === "function") onDismiss();
        }, 250);
      })(onDismiss);
    }

    // click listener of toast
    function addEventListener(uniqueId, dismissDelay, onDismiss) {
      const element = document.getElementById(uniqueId);
      if (!element || !element.lastElementChild) return;

      element.lastElementChild.onclick = function () {
        onClickHandler(uniqueId, onDismiss);
      };

      // dismiss scheduler
      (function (uniqueId, dismissDelay, onDismiss) {
        setTimeout(function () {
          onClickHandler(uniqueId, onDismiss);
        }, dismissDelay);
      })(uniqueId, dismissDelay, onDismiss);
    }

    // create toast
    this.createToast = function (toastMsg, options) {
      if (!options) options = {};
      const dismissDelay = (options && options.dismissDelay) || 5000;
      const btnText = (options && options.btnText) || "";
      const icon = (options && options.icon) || false;

      const globalContainer = document.querySelector(SELECTORS.globalContainer);
      if (!globalContainer) return;

      const uniqueId = `toast-container-${globalContainer.children.length + 1}`;
      const toastContainerHtmlString = `<div class="toast-container mount-active ${
        icon ? "" : "no-icon"
      }" id="${uniqueId}"><p class="toast-content">${toastMsg.toString()}</p><button class="toast-close ${
        btnText ? "only-text" : ""
      }">${btnText}</button></div>`;

      globalContainer.insertAdjacentHTML("beforeend", toastContainerHtmlString);
      const toastContainer = document.querySelector(`#${uniqueId}`);
      toastContainer.scrollIntoView();
      addEventListener(uniqueId, dismissDelay, options.onDismiss);
    };

    this.init = function () {
      injectGlobalContainer(); // create container where all toast will injected
      injectGlobalCss(); // inject css in head
    };
  } catch (error) {
    throw error;
  }
})();

window.Toast = Toast; // declare globally
module.exports = Toast;
