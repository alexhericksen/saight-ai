document.addEventListener("DOMContentLoaded", () => {
    const detailOptions = {
        work: ["Emails", "Programming", "Meetings", "Research", "Finance", "Product", "Sales", "Marketing", "Design", "Presentation",],
        school: ["Homework", "Studying", "Papers", "Group Project", "Presentation",],
        personal: ["Emails","Finances", "Planning", "Therapy", "Journaling", "Project", "Relationships", "Family"],
        hobby: ["Art", "Music", "Gaming", "Writing", "Sports", "Entertainment"]
    };
    
    const categorySelect = document.getElementById("category");
    const detailSelect = document.getElementById("detail");
    const saveButton = document.getElementById("save");
    
    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        detailSelect.innerHTML = '<option value="">--Select--</option>';
    
        if (detailOptions[selectedCategory]) {
        detailOptions[selectedCategory].forEach(option => {
            const el = document.createElement("option");
            el.value = option.toLowerCase();
            el.textContent = option;
            detailSelect.appendChild(el);
        });
        }
    });
    
    saveButton.addEventListener("click", () => {
        const tagCategory = categorySelect.value;
        const tagDetail = detailSelect.value;
    
        if (!tagCategory || !tagDetail) {
        alert("Please select both category and specific use.");
        return;
        }
    
        chrome.storage.local.get(["sessionLogs"], (result) => {
        const updatedLogs = (result.sessionLogs || []).map((session, index) => {
            if (index === result.sessionLogs.length - 1) {
            return { ...session, tag_category: tagCategory, tag_detail: tagDetail };
            }
            return session;
        });
        chrome.storage.local.set({ sessionLogs: updatedLogs }, () => {
            alert("Tag saved!");
        });
        });
    });
});