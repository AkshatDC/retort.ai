chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    const source = request.source || "selection"; // "selection" or "fullpage"

    if (source === "selection") {
      const selection = window.getSelection()?.toString()?.trim();
      if (selection) {
        sendResponse({ text: selection });
      } else {
        sendResponse({ text: "No text selected on the page." });
      }
    } else {
      const isVisible = (element) => {
        const style = window.getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          element.offsetParent !== null
        );
      };

      const textElements = document.querySelectorAll(
        "p, div, span, h1, h2, h3, h4, h5, h6, li, article, section, main, blockquote"
      );

      let visibleText = "";
      textElements.forEach((element) => {
        if (isVisible(element) && element.textContent.trim()) {
          visibleText += element.textContent.trim() + "\n";
        }
      });

      visibleText = visibleText.replace(/\n+/g, "\n").trim();
      sendResponse({ text: visibleText || "No visible text found." });
    }

    return true; // async response
  }
});
