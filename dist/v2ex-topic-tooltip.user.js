// ==UserScript==
// @name       v2ex-topic-tooltip
// @namespace  npm/vite-plugin-monkey
// @version    0.0.0
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      *://v2ex.com/*
// @match      *://*.v2ex.com/*
// ==/UserScript==

(function() {
  "use strict";
  const tooltipEl = document.createElement("div");
  const CLOSE_TIMEOUT = 100;
  let timer = 0;
  let isTooltipShow = false;
  function createTooltip() {
    tooltipEl.style.cssText = `
    position: absolute;
    width: 500px;
    min-height: 100px;
    max-height: 400px;
    background: #fff;
    padding: 20px;
    border: 1px solid #e4e7ed;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    overflow: auto;
    z-index: 100;
    border-radius: 4px;
    top: 0;
    display: none;
  `;
    tooltipEl.addEventListener("mouseover", () => {
      clearTimeout(timer);
    });
    tooltipEl.addEventListener("mouseout", () => {
      hideTooltip();
    });
    document.body.appendChild(tooltipEl);
  }
  function hideTooltip() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      tooltipEl.style.display = "none";
      isTooltipShow = false;
    }, CLOSE_TIMEOUT);
  }
  function showTooltip() {
    tooltipEl.style.display = "block";
    isTooltipShow = true;
  }
  function main() {
    document.querySelectorAll(".item_title").forEach((el) => {
      el.addEventListener("mouseover", (event) => {
        var _a;
        if (!isTooltipShow) {
          const pageX = event.pageX;
          const pageY = event.pageY;
          tooltipEl.style.transform = `translate(${pageX}px, ${pageY}px)`;
          const href = (_a = el.querySelector("a")) == null ? void 0 : _a.getAttribute("href");
          const tid = href == null ? void 0 : href.match(/\d+/g)[0];
          fetch(`https://www.v2ex.com/t/${tid}`).then((response) => {
            response.text().then((res) => {
              const domParser = new DOMParser();
              const dom = domParser.parseFromString(res, "text/html");
              const content = dom.querySelector(".topic_content");
              tooltipEl.innerHTML = "";
              tooltipEl.append(content);
            });
          });
          clearTimeout(timer);
          showTooltip();
        }
      });
      el.addEventListener("mouseout", () => {
        hideTooltip();
      });
    });
    createTooltip();
  }
  main();
})();
