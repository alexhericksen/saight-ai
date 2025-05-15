let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;

const trackedDomains = [
  "chatgpt.com", "claude.ai", "cursor.com", "grok.com",
  "replit.com", "superhuman.com", "lovable.dev",
  "perplexity.ai", "linear.app", "bolt.net", "notion.com", "notion.so"
];

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Saight-AI Tracker installed and active.");
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeTabId !== null && activeDomain) {
    const duration = (Date.now() - activeStartTime) / 1000;
    console.log(`Tracked: ${activeDomain} for ${duration.toFixed(3)} seconds`);
    saveSession(activeDomain, duration);
  }

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError || !tab.url || !tab.url.startsWith("http")) {
      activeDomain = null;
      return;
    }

    try {
      const url = new URL(tab.url);
      const matchedDomain = trackedDomains.find(domain =>
        url.hostname.endsWith(domain)
      );
      activeDomain = matchedDomain || null;
      activeStartTime = Date.now();
      activeTabId = activeInfo.tabId;
    } catch (err) {
      console.error("URL parse error:", err);
    }
  });
});

function saveSession(domain, duration) {
  const session = {
    tool: domain,
    duration: Math.round(duration),
    tag: null,
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get(["sessionLogs"], (result) => {
    const updatedLogs = [...(result.sessionLogs || []), session];
    chrome.storage.local.set({ sessionLogs: updatedLogs });
  });

  fetch("https://saight-ai-live.vercel.app/api/track-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: session.tool,
      duration: session.duration,
      tag: session.tag
    })
  })
  .then(res => {
    if (!res.ok) {
      console.error("❌ Failed to sync session to Supabase");
    } else {
      console.log("✅ Session sent to Supabase");
    }
  })
  .catch(err => {
    console.error("🚫 Network error while sending session:", err);
  });
}
