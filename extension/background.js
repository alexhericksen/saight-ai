let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;

const trackedDomains = ["chatgpt.com", "claude.ai", "cursor.com", "grok.com"];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeTabId !== null && activeDomain) {
    const duration = (Date.now() - activeStartTime) / 1000;
    console.log(`Tracked: ${activeDomain} for ${duration} seconds`);
    saveSession(activeDomain, duration);
  }

  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab.url || !tab.url.startsWith("http")) {
      // Skip tabs without valid URLs (e.g. new tab, Chrome internal pages)
      activeDomain = null;
      return;
    }

    const url = new URL(tab.url);
    activeDomain = trackedDomains.includes(url.hostname) ? url.hostname : null;
    activeStartTime = Date.now();
    activeTabId = activeInfo.tabId;
  } catch (error) {
    console.error("Failed to get tab info:", error);
  }
});

function saveSession(domain, duration) {
  const entry = {
    tool: domain,
    timestamp: new Date().toISOString(),
    duration: Math.round(duration)
  };

  chrome.storage.local.get(["sessions"], function (result) {
    const sessions = result.sessions || [];
    sessions.push(entry);
    chrome.storage.local.set({ sessions });
  });
}

