const API_BASE_URL = "http://localhost:3000"; // Use Vercel URL for production

let activeTabId = null;
let activeStartTime = null;
let activeDomain = null;
let trackedDomains = []; // Will be populated from API
let userToken = null; // Store user's authentication token

// Function to fetch tracked domains from the API
async function fetchTrackedDomains() {
  try {
    // Prepare headers with authentication if available
    const headers = {};
    if (userToken) {
      headers["Authorization"] = `Bearer ${userToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/tracked-domains`, {
      headers: headers
    });
    
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

// Function to get user token from the web app
async function getUserToken() {
  try {
    // Try to get token from the web app's localStorage
    const tabs = await chrome.tabs.query({ url: `${API_BASE_URL}/*` });
    if (tabs.length > 0) {
      // Inject script to get token from localStorage
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Try multiple possible storage keys for Supabase auth
          const keys = [
            'sb-twovflwtsauwsaaogoxl-auth-token',
            'supabase.auth.token',
            'sb-auth-token'
          ];
          
          for (const key of keys) {
            const token = localStorage.getItem(key);
            if (token) {
              try {
                const parsed = JSON.parse(token);
                if (parsed.access_token) {
                  return token;
                }
              } catch (e) {
                // Continue to next key
              }
            }
          }
          
          // Also try sessionStorage
          for (const key of keys) {
            const token = sessionStorage.getItem(key);
            if (token) {
              try {
                const parsed = JSON.parse(token);
                if (parsed.access_token) {
                  return token;
                }
              } catch (e) {
                // Continue to next key
              }
            }
          }
          
          return null;
        }
      });
      
      if (results && results[0] && results[0].result) {
        const tokenData = JSON.parse(results[0].result);
        userToken = tokenData.access_token;
        console.log("✅ Retrieved user token from web app");
      } else {
        console.log("ℹ️ No user token found in web app storage");
      }
    } else {
      console.log("ℹ️ No web app tabs found");
    }
  } catch (error) {
    console.log("ℹ️ Error getting user token:", error.message);
  }
}

// Fetch domains every hour to stay updated
setInterval(fetchTrackedDomains, 60 * 60 * 1000);

// Try to get user token every 5 minutes
setInterval(getUserToken, 5 * 60 * 1000);

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
    tag_category: null,
    tag_detail: null,
    timestamp: new Date().toISOString()
  };

  chrome.storage.local.get(["sessionLogs"], (result) => {
    const updatedLogs = [...(result.sessionLogs || []), session];
    chrome.storage.local.set({ sessionLogs: updatedLogs });
  });

  // Prepare headers with authentication if available
  const headers = { "Content-Type": "application/json" };
  if (userToken) {
    headers["Authorization"] = `Bearer ${userToken}`;
  }

  fetch(`${API_BASE_URL}/api/track-session`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      tool: session.tool,
      duration: session.duration,
      tag_category: session.tag_category,
      tag_detail: session.tag_detail
    })
  })
  .then(async res => {
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Failed to sync session to Supabase:", res.status, errorText);
    } else {
      console.log("✅ Session sent to Supabase");
    }
  })
  .catch(err => {
    if (err.message.includes('Failed to fetch')) {
      console.log("ℹ️ Dev server not running - session stored locally only");
    } else {
      console.error("🚫 Network error while sending session:", err);
    }
  });
}
