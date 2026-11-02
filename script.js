"use strict";

/* ==========================================
   OPPORTUNITY COMPASS
   Internship and Scholarship Finder
========================================== */

/* 1. SAMPLE OPPORTUNITIES */

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechStart India",
    type: "Internship",
    work: "Remote",
    location: "Remote, India",
    stipend: "₹10,000/month",
    deadline: "2026-12-15",
    description:
      "Build responsive websites using HTML, CSS, and JavaScript.",
    skills: ["HTML", "CSS", "JavaScript"],
    link: "https://internshala.com/"
  },
  {
    id: 2,
    title: "Python Developer Intern",
    company: "CodeWorks",
    type: "Internship",
    work: "Hybrid",
    location: "Bengaluru, India",
    stipend: "₹12,000/month",
    deadline: "2026-12-20",
    description:
      "Learn Python development and help build practical software projects.",
    skills: ["Python", "Programming", "Git"],
    link: "https://internshala.com/"
  },
  {
    id: 3,
    title: "Web Development Intern",
    company: "Digital Labs",
    type: "Internship",
    work: "On-site",
    location: "Dehradun, India",
    stipend: "₹8,000/month",
    deadline: "2026-12-25",
    description:
      "Work on web development tasks and improve your frontend skills.",
    skills: ["HTML", "CSS", "JavaScript"],
    link: "https://internshala.com/"
  },
  {
    id: 4,
    title: "National Scholarship Programme",
    company: "Scholarship Opportunity",
    type: "Scholarship",
    work: "Online",
    location: "India",
    stipend: "Varies",
    deadline: "2027-01-15",
    description:
      "Explore scholarship opportunities that may help support your education.",
    skills: ["Students", "Education", "Financial Support"],
    link: "https://scholarships.gov.in/"
  },
  {
    id: 5,
    title: "Junior UI/UX Design Intern",
    company: "Creative Studio",
    type: "Internship",
    work: "Remote",
    location: "Remote, India",
    stipend: "₹9,000/month",
    deadline: "2027-01-10",
    description:
      "Learn user interface design and create simple, user-friendly experiences.",
    skills: ["UI Design", "Figma", "Prototyping"],
    link: "https://internshala.com/"
  },
  {
    id: 6,
    title: "Data Analyst Intern",
    company: "Insight Analytics",
    type: "Internship",
    work: "Hybrid",
    location: "Delhi, India",
    stipend: "₹15,000/month",
    deadline: "2027-01-20",
    description:
      "Explore data analysis, spreadsheets, and basic data visualization.",
    skills: ["Excel", "SQL", "Data Analysis"],
    link: "https://internshala.com/"
  }
];


/* 2. APPLICATION STATE */

const STORAGE_KEYS = {
  saved: "opportunityCompassSaved",
  applications: "opportunityCompassApplications"
};

function loadFromStorage(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return fallback;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.warn("Could not load saved data:", error);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save data:", error);
  }
}

let savedOpportunities = loadFromStorage(
  STORAGE_KEYS.saved,
  []
);

let applications = loadFromStorage(
  STORAGE_KEYS.applications,
  {}
);

let currentView = "all";


/* 3. FIND HTML ELEMENTS */

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const workFilter = document.getElementById("workFilter");
const resetFiltersButton = document.getElementById("resetFilters");

const opportunityGrid = document.getElementById("opportunityGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");

const totalCount = document.getElementById("totalCount");
const savedCount = document.getElementById("savedCount");
const appliedCount = document.getElementById("appliedCount");

const applicationList = document.getElementById("applicationList");


/* 4. HELPER FUNCTIONS */

function isSaved(id) {
  return savedOpportunities.includes(id);
}

function getApplicationStatus(id) {
  return applications[id] || "";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not specified";
  }

  const date = new Date(dateString + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


/* 5. FILTER OPPORTUNITIES */

function getFilteredOpportunities() {
  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedType = typeFilter
    ? typeFilter.value
    : "all";

  const selectedWork = workFilter
    ? workFilter.value
    : "all";

  return opportunities.filter(function (opportunity) {
    const searchableText = [
      opportunity.title,
      opportunity.company,
      opportunity.type,
      opportunity.work,
      opportunity.location,
      opportunity.description,
      ...opportunity.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesType =
      selectedType === "all" ||
      opportunity.type.toLowerCase() === selectedType.toLowerCase();

    const matchesWork =
      selectedWork === "all" ||
      opportunity.work.toLowerCase() === selectedWork.toLowerCase();

    const matchesSaved =
      currentView !== "saved" || isSaved(opportunity.id);

    return (
      matchesSearch &&
      matchesType &&
      matchesWork &&
      matchesSaved
    );
  });
}


/* 6. CREATE OPPORTUNITY CARDS */

function createOpportunityCard(opportunity) {
  const saved = isSaved(opportunity.id);
  const status = getApplicationStatus(opportunity.id);

  const skillsHTML = opportunity.skills
    .map(function (skill) {
      return `<span class="skill-tag">${escapeHTML(skill)}</span>`;
    })
    .join("");

  const safeLink = /^https:\/\/[^\s"'<>]+$/i.test(opportunity.link)
    ? opportunity.link
    : "https://internshala.com/";

  return `
    <article class="opportunity-card">

      <div class="card-top">
        <span class="opportunity-type">
          ${escapeHTML(opportunity.type)}
        </span>

        <button
          type="button"
          class="save-button"
          data-action="save"
          data-id="${opportunity.id}"
          aria-label="${saved ? "Remove saved opportunity" : "Save opportunity"}"
        >
          ${saved ? "♥ Saved" : "♡ Save"}
        </button>
      </div>

      <h3>${escapeHTML(opportunity.title)}</h3>

      <p class="company-name">
        ${escapeHTML(opportunity.company)}
      </p>

      <p class="opportunity-description">
        ${escapeHTML(opportunity.description)}
      </p>

      <div class="opportunity-details">
        <span>📍 ${escapeHTML(opportunity.location)}</span>
        <span>💼 ${escapeHTML(opportunity.work)}</span>
        <span>💰 ${escapeHTML(opportunity.stipend)}</span>
        <span>📅 Deadline: ${formatDate(opportunity.deadline)}</span>
      </div>

      <div class="skills-list">
        ${skillsHTML}
      </div>

      <div class="card-actions">
        <a
          class="apply-button"
          href="${safeLink}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View opportunity ↗
        </a>

        <button
          type="button"
          class="track-button"
          data-action="apply"
          data-id="${opportunity.id}"
        >
          ${status ? "✓ " + escapeHTML(status) : "Track application"}
        </button>
      </div>

    </article>
  `;
}


/* 7. DISPLAY OPPORTUNITIES */

function renderOpportunities() {
  if (!opportunityGrid) {
    console.error('Missing HTML element: "opportunityGrid".');
    return;
  }

  const filteredOpportunities = getFilteredOpportunities();

  opportunityGrid.innerHTML = filteredOpportunities
    .map(createOpportunityCard)
    .join("");

  if (resultsCount) {
    const count = filteredOpportunities.length;

    resultsCount.textContent =
      count === 1
        ? "1 opportunity found"
        : `${count} opportunities found`;
  }

  if (emptyState) {
    emptyState.hidden = filteredOpportunities.length !== 0;
  }
}


/* 8. UPDATE DASHBOARD STATISTICS */

function renderStatistics() {
  if (totalCount) {
    totalCount.textContent = opportunities.length;
  }

  if (savedCount) {
    savedCount.textContent = savedOpportunities.length;
  }

  if (appliedCount) {
    appliedCount.textContent = Object.keys(applications).length;
  }
}


/* 9. DISPLAY APPLICATION TRACKER */

function renderApplications() {
  if (!applicationList) {
    return;
  }

  const trackedApplications = opportunities.filter(function (opportunity) {
    return Boolean(getApplicationStatus(opportunity.id));
  });

  if (trackedApplications.length === 0) {
    applicationList.innerHTML = `
      <p class="empty-applications">
        No applications tracked yet. Find an opportunity and click
        "Track application" to get started.
      </p>
    `;
    return;
  }

  applicationList.innerHTML = trackedApplications
    .map(function (opportunity) {
      const status = getApplicationStatus(opportunity.id);

      return `
        <div class="application-item">

          <div class="application-info">
            <h4>${escapeHTML(opportunity.title)}</h4>
            <p>${escapeHTML(opportunity.company)}</p>
          </div>

          <label class="status-label">
            <span>Status</span>

            <select
              class="status-select"
              data-action="status"
              data-id="${opportunity.id}"
            >
              <option value="Applied" ${status === "Applied" ? "selected" : ""}>
                Applied
              </option>

              <option value="Interview" ${status === "Interview" ? "selected" : ""}>
                Interview
              </option>

              <option value="Offer" ${status === "Offer" ? "selected" : ""}>
                Offer
              </option>

              <option value="Rejected" ${status === "Rejected" ? "selected" : ""}>
                Rejected
              </option>
            </select>
          </label>

          <button
            type="button"
            class="remove-application"
            data-action="remove-application"
            data-id="${opportunity.id}"
          >
            Remove
          </button>

        </div>
      `;
    })
    .join("");
}


/* 10. SAVE OR UNSAVE OPPORTUNITIES */

function toggleSavedOpportunity(id) {
  if (isSaved(id)) {
    savedOpportunities = savedOpportunities.filter(function (savedId) {
      return savedId !== id;
    });
  } else {
    savedOpportunities.push(id);
  }

  saveToStorage(STORAGE_KEYS.saved, savedOpportunities);

  renderOpportunities();
  renderStatistics();
}


/* 11. TRACK APPLICATIONS */

function trackApplication(id) {
  if (applications[id]) {
    delete applications[id];
  } else {
    applications[id] = "Applied";
  }

  saveToStorage(STORAGE_KEYS.applications, applications);

  renderOpportunities();
  renderApplications();
  renderStatistics();
}


/* 12. CHANGE APPLICATION STATUS */

function updateApplicationStatus(id, status) {
  const validStatuses = [
    "Applied",
    "Interview",
    "Offer",
    "Rejected"
  ];

  if (!validStatuses.includes(status)) {
    return;
  }

  applications[id] = status;

  saveToStorage(STORAGE_KEYS.applications, applications);

  renderApplications();
  renderStatistics();
}


/* 13. HANDLE CARD BUTTONS */

if (opportunityGrid) {
  opportunityGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (!Number.isInteger(id)) {
      return;
    }

    if (action === "save") {
      toggleSavedOpportunity(id);
    }

    if (action === "apply") {
      trackApplication(id);
    }
  });
}


/* 14. HANDLE APPLICATION TRACKER */

if (applicationList) {
  applicationList.addEventListener("change", function (event) {
    const select = event.target.closest('[data-action="status"]');

    if (!select) {
      return;
    }

    const id = Number(select.dataset.id);

    updateApplicationStatus(id, select.value);
  });

  applicationList.addEventListener("click", function (event) {
    const button = event.target.closest(
      '[data-action="remove-application"]'
    );

    if (!button) {
      return;
    }

    const id = Number(button.dataset.id);

    if (!Number.isInteger(id)) {
      return;
    }

    delete applications[id];

    saveToStorage(STORAGE_KEYS.applications, applications);

    renderApplications();
    renderStatistics();
    renderOpportunities();
  });
}


/* 15. SEARCH AND FILTER EVENTS */

if (searchInput) {
  searchInput.addEventListener("input", renderOpportunities);
}

if (typeFilter) {
  typeFilter.addEventListener("change", renderOpportunities);
}

if (workFilter) {
  workFilter.addEventListener("change", renderOpportunities);
}

if (resetFiltersButton) {
  resetFiltersButton.addEventListener("click", function () {
    if (searchInput) {
      searchInput.value = "";
    }

    if (typeFilter) {
      typeFilter.value = "all";
    }

    if (workFilter) {
      workFilter.value = "all";
    }

    currentView = "all";

    renderOpportunities();
  });
}


/* 16. NAVIGATION */

document.querySelectorAll("a[href^='#']").forEach(function (link) {
  link.addEventListener("click", function () {
    const destination = link.getAttribute("href");

    if (destination === "#saved") {
      currentView = "saved";
      renderOpportunities();
    } else if (destination === "#explore") {
      currentView = "all";
      renderOpportunities();
    }
  });
});


/* 17. INITIALIZE THE WEBSITE */

function initializeApp() {
  renderOpportunities();
  renderStatistics();
  renderApplications();
}

initializeApp();