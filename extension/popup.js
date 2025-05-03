document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("sessions", (result) => {
      const sessions = result.sessions || [];
      const lastSession = sessions[sessions.length - 1];
  
      if (!lastSession) {
        document.getElementById("session-summary").innerText = "No sessions yet.";
        return;
      }
  
      document.getElementById("session-summary").innerText =
        `${lastSession.tool} (${lastSession.duration} sec)`;
  
      document.getElementById("save").addEventListener("click", () => {
        const tag = document.getElementById("use-case").value;
        lastSession.tag = tag;
        sessions[sessions.length - 1] = lastSession;
        chrome.storage.local.set({ sessions }, () => {
          document.getElementById("session-summary").innerText = "Tagged!";
          document.getElementById("use-case").value = "";
        });
      });
    });
  });
  