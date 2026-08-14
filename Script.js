let applications = JSON.parse(localStorage.getItem("jobApplications")) || [];

const modal = document.getElementById("applicationModal");
const form = document.getElementById("applicationForm");
const applicationList = document.getElementById("applicationList");
const emptyState = document.getElementById("emptyState");


// Open Form
function openForm() {
    modal.style.display = "flex";
}


// Close Form
function closeForm() {
    modal.style.display = "none";
    form.reset();
}


// Close modal when clicking outside
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        closeForm();
    }
});


// Add Application
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const location = document.getElementById("location").value.trim();

    const application = {
        id: Date.now(),
        company: company,
        role: role,
        date: date,
        status: status,
        location: location
    };

    applications.push(application);

    saveApplications();

    displayApplications(applications);

    updateStatistics();

    closeForm();

});


// Save Applications
function saveApplications() {
    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );
}


// Display Applications
function displayApplications(list) {

    applicationList.innerHTML = "";

    if (list.length === 0) {

        applicationList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    💼
                </div>

                <h3>No applications found</h3>

                <p>
                    Add a new application or try another search.
                </p>

                <button onclick="openForm()">
                    + Add Application
                </button>
            </div>
        `;

        return;
    }


    list.forEach(function (application) {

        const card = document.createElement("div");

        card.className = "application-card";

        card.innerHTML = `
            <div class="application-info">

                <h3>${escapeHTML(application.role)}</h3>

                <p>
                    🏢 ${escapeHTML(application.company)}
                </p>

                <div class="application-details">

                    <p>
                        📍 ${escapeHTML(application.location || "Not specified")}
                    </p>

                    <p>
                        📅 ${formatDate(application.date)}
                    </p>

                </div>

            </div>


            <div class="application-details">

                <span class="status ${getStatusClass(application.status)}">
                    ${escapeHTML(application.status)}
                </span>

                <button
                    class="delete-button"
                    onclick="deleteApplication(${application.id})"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        applicationList.appendChild(card);

    });
}


// Delete Application
function deleteApplication(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
        return;
    }

    applications = applications.filter(function (application) {
        return application.id !== id;
    });

    saveApplications();

    displayApplications(applications);

    updateStatistics();
}


// Search Applications
function searchApplications() {

    const searchText =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const filteredApplications = applications.filter(function (application) {

        return (
            application.company.toLowerCase().includes(searchText) ||
            application.role.toLowerCase().includes(searchText) ||
            application.status.toLowerCase().includes(searchText) ||
            application.location.toLowerCase().includes(searchText)
        );

    });


    displayApplications(filteredApplications);
}


// Update Statistics
function updateStatistics() {

    document.getElementById("totalApplications").textContent =
        applications.length;


    const applied = applications.filter(function (application) {
        return application.status === "Applied";
    }).length;


    const interviews = applications.filter(function (application) {
        return application.status === "Interview";
    }).length;


    const selected = applications.filter(function (application) {
        return application.status === "Selected";
    }).length;


    document.getElementById("appliedCount").textContent = applied;

    document.getElementById("interviewCount").textContent = interviews;

    document.getElementById("selectedCount").textContent = selected;
}


// Get Status CSS Class
function getStatusClass(status) {

    if (status === "Applied") {
        return "status-applied";
    }

    if (status === "Interview") {
        return "status-interview";
    }

    if (status === "Selected") {
        return "status-selected";
    }

    if (status === "Rejected") {
        return "status-rejected";
    }

    return "";
}


// Format Date
function formatDate(date) {

    if (!date) {
        return "No date";
    }

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// Prevent HTML from being inserted into the page
function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Load saved applications when page opens
displayApplications(applications);

updateStatistics();
