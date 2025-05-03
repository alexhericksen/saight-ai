let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;

const trackedDomains = ["chatgpt.com", "claude.ai", "cursor.sh"];

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (activeTabId !== null && activeDomain) {
    const duration = (Date.now() - activeStartTime) / 1000;
    console.log(`Tracked: ${activeDomain} for ${duration} seconds`);
    saveSession(activeDomain, duration);
  }

  const tab = await chrome.tabs.get(activeInfo.tabId);
  const url = new URL(tab.url);
  activeDomain = trackedDomains.includes(url.hostname) ? url.hostname : null;
  activeStartTime = Date.now();
  activeTabId = activeInfo.tabId;
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
