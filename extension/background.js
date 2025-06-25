const API_BASE_URL = "http://localhost:3000"; // Use Vercel URL for production

let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;
let trackedDomains = []; // Will be populated from API

// Function to fetch tracked domains from the API
async function fetchTrackedDomains() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tracked-domains`);
    if (response.ok) {
      const data = await response.json();
      trackedDomains = data.domains || [];
      console.log("✅ Fetched tracked domains:", trackedDomains);
    } else {
      console.error("❌ Failed to fetch tracked domains");
    }
  } catch (error) {
    console.error("🚫 Error fetching tracked domains:", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Saight-AI Tracker installed and active.");
  fetchTrackedDomains(); // Fetch domains on install
});

// Fetch domains every hour to stay updated
setInterval(fetchTrackedDomains, 60 * 60 * 1000);

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

  fetch(`${API_BASE_URL}/api/track-session`, {
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
