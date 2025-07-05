// Log installation for debugging
chrome.runtime.onInstalled.addListener(() => {
  console.log("retort.ai extension installed.");
});

// Context Menu for selection-based context
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "retort-highlight",
    title: "Send to Retort AI",
    contexts: ["selection"]
  });
});

// Handle selection context and save for popup
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "retort-highlight" && info.selectionText) {
    chrome.storage.local.set({ retortContext: info.selectionText }, () => {
      console.log("Highlighted context saved.");
    });

    // Optionally: open popup or notify user
    chrome.action.openPopup();
  }
});
