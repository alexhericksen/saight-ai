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
    const session = {
      tool: domain,
      duration: Math.round(duration),
      tag: null, // or fetch from popup if available
      timestamp: new Date().toISOString()
    };
  
    // Save to local storage
    chrome.storage.local.get(["sessionLogs"], (result) => {
      const updatedLogs = [...(result.sessionLogs || []), session];
      chrome.storage.local.set({ sessionLogs: updatedLogs });
    });
  
    // POST to Supabase
    fetch("https://saight-ai-live.vercel.app/api/track-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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

