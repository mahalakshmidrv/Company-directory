const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'http://localhost:5000/api';
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const companyForm = document.getElementById('companyForm');
const searchInput = document.getElementById('searchInput');
const industryFilter = document.getElementById('industryFilter');
const refreshBtn = document.getElementById('refreshBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messageBox = document.getElementById('messageBox');
const companyList = document.getElementById('companyList');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const totalCompanies = document.getElementById('totalCompanies');
const totalEmployees = document.getElementById('totalEmployees');
const averageEmployees = document.getElementById('averageEmployees');
const industryTypes = document.getElementById('industryTypes');
const loadingIndicator = document.getElementById('loadingIndicator');

let authToken = localStorage.getItem('companyDirectoryToken');
let companiesCache = [];

function showPanel(isDashboard) {
  loginSection.classList.toggle('active-panel', !isDashboard);
  dashboardSection.classList.toggle('active-panel', isDashboard);
}

function showMessage(message, type = 'success') {
  messageBox.textContent = message;
  messageBox.style.color = type === 'error' ? '#b91c1c' : '#064e3b';
  messageBox.style.background = type === 'error' ? '#fee2e2' : '#ecfccb';
}

function clearMessage() {
  messageBox.textContent = '';
}

function setLoading(isLoading) {
  if (!loadingIndicator) return;
  loadingIndicator.style.display = isLoading ? 'block' : 'none';
}

async function apiRequest(path, options = {}) {
  const headers = options.headers || {};
  options.headers = { ...headers, 'Content-Type': 'application/json' };

  if (authToken) {
    options.headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || 'Server error. Please retry.';
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect to the backend server. Make sure it is running on port 5000.');
    }
    throw error;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  clearMessage();

  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (!email || !password) {
    showMessage('Please fill in both email and password.', 'error');
    return;
  }

  if (!email.includes('@')) {
    showMessage('Please enter a valid email address.', 'error');
    return;
  }

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    authToken = data.token;
    localStorage.setItem('companyDirectoryToken', authToken);
    showPanel(true);
    loginForm.reset();
    await refreshDashboard();
    showMessage('Login successful. Welcome back!');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function resetForm() {
  companyForm.reset();
  document.getElementById('companyId').value = '';
  formTitle.textContent = 'Add Company';
  submitBtn.textContent = 'Save Company';
  cancelEditBtn.classList.add('hidden');
}

function validateCompanyForm(payload) {
  if (!payload.companyName || !payload.location || !payload.industry) {
    return 'Company name, location and industry are required.';
  }

  if (payload.companyName.length < 2) {
    return 'Company name must be at least 2 characters long.';
  }

  if (Number.isNaN(payload.employeeCount) || payload.employeeCount < 0) {
    return 'Employee count must be zero or greater.';
  }

  if (!payload.email || !payload.email.includes('@')) {
    return 'Enter a valid email address.';
  }

  if (!payload.website || !payload.website.startsWith('http')) {
    return 'Enter a valid website URL starting with http or https.';
  }

  if (!payload.contactNumber || payload.contactNumber.length < 7) {
    return 'Enter a valid contact number.';
  }

  return null;
}

async function handleCompanySubmit(event) {
  event.preventDefault();
  clearMessage();

  const companyId = document.getElementById('companyId').value;
  const payload = {
    companyName: document.getElementById('companyName').value.trim(),
    location: document.getElementById('location').value.trim(),
    industry: document.getElementById('industry').value.trim(),
    employeeCount: Number(document.getElementById('employeeCount').value),
    email: document.getElementById('email').value.trim(),
    website: document.getElementById('website').value.trim(),
    contactNumber: document.getElementById('contactNumber').value.trim()
  };

  const validationError = validateCompanyForm(payload);
  if (validationError) {
    showMessage(validationError, 'error');
    return;
  }

  try {
    const method = companyId ? 'PUT' : 'POST';
    const path = companyId ? `/companies/${companyId}` : '/companies';
    const response = await apiRequest(path, {
      method,
      body: JSON.stringify(payload)
    });

    showMessage(response.message || 'Company saved successfully.');
    resetForm();
    await refreshDashboard();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function loadCompanies() {
  clearMessage();
  setLoading(true);
  const searchTerm = searchInput.value.trim();
  const filterIndustry = industryFilter.value;
  const query = new URLSearchParams();

  if (searchTerm) query.append('search', searchTerm);
  if (filterIndustry) query.append('industry', filterIndustry);

  try {
    const companies = await apiRequest(`/companies?${query.toString()}`);
    companiesCache = companies;
    renderCompanyList(companies);
    updateIndustryFilterOptions(companies);
  } catch (error) {
    showMessage(error.message, 'error');
    if (error.message.toLowerCase().includes('token')) {
      logout();
    }
  } finally {
    setLoading(false);
  }
}

function updateIndustryFilterOptions(companies) {
  const industries = Array.from(
    new Set(companies.map((company) => company.industry).filter(Boolean))
  ).sort();

  industryFilter.innerHTML = '<option value="">All Industries</option>';

  industries.forEach((industry) => {
    const option = document.createElement('option');
    option.value = industry;
    option.textContent = industry;
    industryFilter.appendChild(option);
  });
}

function renderCompanyList(companies) {
  if (!companies.length) {
    companyList.innerHTML = '<p class="info-text">No companies found. Add the first company to start the directory.</p>';
    return;
  }

  companyList.innerHTML = companies
    .map((company) => {
      return `
        <article class="company-card">
          <div>
            <h4>${company.companyName}</h4>
            <div class="company-meta">
              <span>${company.industry}</span>
              <span>${company.location}</span>
              <span>${company.employeeCount} employees</span>
            </div>
          </div>
          <p>${company.website}</p>
          <p><strong>Contact:</strong> ${company.email} • ${company.contactNumber}</p>
          <div class="card-actions">
            <button class="button secondary-button" onclick="editCompany('${company._id}')">Edit</button>
            <button class="button danger-button" onclick="deleteCompany('${company._id}')">Delete</button>
          </div>
        </article>
      `;
    })
    .join('');
}

window.editCompany = async function (companyId) {
  const company = companiesCache.find((item) => item._id === companyId);

  if (!company) {
    showMessage('Company data not found for edit.', 'error');
    return;
  }

  document.getElementById('companyId').value = company._id;
  document.getElementById('companyName').value = company.companyName;
  document.getElementById('location').value = company.location;
  document.getElementById('industry').value = company.industry;
  document.getElementById('employeeCount').value = company.employeeCount;
  document.getElementById('email').value = company.email;
  document.getElementById('website').value = company.website;
  document.getElementById('contactNumber').value = company.contactNumber;

  formTitle.textContent = 'Edit Company';
  submitBtn.textContent = 'Update Company';
  cancelEditBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

async function deleteCompany(companyId) {
  if (!confirm('Delete this company record? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await apiRequest(`/companies/${companyId}`, { method: 'DELETE' });
    showMessage(response.message || 'Company deleted successfully.');
    await refreshDashboard();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function loadStats() {
  try {
    const stats = await apiRequest('/companies/stats');

    totalCompanies.textContent = stats.totalCompanies;
    totalEmployees.textContent = stats.employeeStats.totalEmployees;
    averageEmployees.textContent = Math.round(stats.employeeStats.averageEmployees || 0);
    industryTypes.textContent = stats.industryStats.length;
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function refreshDashboard() {
  await Promise.all([loadStats(), loadCompanies()]);
}

function logout() {
  authToken = null;
  localStorage.removeItem('companyDirectoryToken');
  showPanel(false);
  resetForm();
  showMessage('You have been logged out.', 'success');
}

cancelEditBtn.addEventListener('click', () => {
  resetForm();
  clearMessage();
});

logoutBtn.addEventListener('click', () => {
  logout();
});

searchInput.addEventListener('input', () => {
  loadCompanies();
});

industryFilter.addEventListener('change', () => {
  loadCompanies();
});

refreshBtn.addEventListener('click', () => {
  refreshDashboard();
});

companyForm.addEventListener('submit', handleCompanySubmit);
loginForm.addEventListener('submit', handleLogin);

(async function init() {
  if (authToken) {
    showPanel(true);
    refreshDashboard().catch(() => logout());
  } else {
    showPanel(false);
    showMessage('Please sign in to use the company directory dashboard.', 'success');
  }
})();
