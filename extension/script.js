const DEFAULT_BASE_URL = 'https://app-commit-ten.vercel.app';

function getApiBaseUrl() {
  const custom = localStorage.getItem("commitflow_custom_api");
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
}

function buildApiUrl(path) {
  const base = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  return `${base}${cleanPath}`;
}

// Intercept fetch calls in extension to include credentials cross-origin
const originalFetch = window.fetch;
window.fetch = async function () {
  let [resource, config] = arguments;
  if (typeof resource === 'string' && resource.startsWith('/api')) {
    resource = buildApiUrl(resource);
    config = config || {};
    config.credentials = 'include';
  }
  return originalFetch(resource, config);
};

const authPanel = document.getElementById("authPanel");
const schedulerPanel = document.getElementById("schedulerPanel");
const authStatus = document.getElementById("authStatus");
const userSummary = document.getElementById("userSummary");
const githubLoginBtn = document.getElementById("githubLoginBtn");
const signOutBtn = document.getElementById("signOutBtn");
const form = document.getElementById("commitForm");
const resultBox = document.getElementById("result");
const filterMode = document.getElementById("filterMode");
const selectedDaysPanel = document.getElementById("selectedDays");
const repoOwnerInput = document.getElementById("repoOwner");
const repoNameInput = document.getElementById("repoName");
const submitBtn = form?.querySelector("button[type='submit']");

// API Config & Modal Elements
const apiConfigBtn = document.getElementById("apiConfigBtn");
const apiConfigModal = document.getElementById("apiConfigModal");
const closeApiModalBtn = document.getElementById("closeApiModalBtn");
const saveApiUrlBtn = document.getElementById("saveApiUrlBtn");
const resetApiUrlBtn = document.getElementById("resetApiUrlBtn");
const customApiUrlInput = document.getElementById("customApiUrlInput");

// Realism & Preset Elements
const timeJitter = document.getElementById("timeJitter");
const jitterVal = document.getElementById("jitterVal");
const commitMessagePattern = document.getElementById("commitMessagePattern");
const customMessagesWrapper = document.getElementById("customMessagesWrapper");
const customMessagesList = document.getElementById("customMessagesList");
const targetFilePath = document.getElementById("targetFilePath");
const exportPresetBtn = document.getElementById("exportPresetBtn");
const importPresetFile = document.getElementById("importPresetFile");

// Heatmap Elements
const hmTotalCommits = document.getElementById("hmTotalCommits");
const hmActiveDays = document.getElementById("hmActiveDays");
const hmPeakCommits = document.getElementById("hmPeakCommits");
const heatmapGrid = document.getElementById("heatmapGrid");

let currentUser = null;
let userRepos = [];

// ─── Signed In / Out State Management ──────────────────────────────────────

function setSignedOutState(message) {
  currentUser = null;
  userRepos = [];
  if (signOutBtn) signOutBtn.style.display = 'none';
  authPanel.classList.remove('hidden');
  schedulerPanel.classList.add('hidden');

  if (message && !message.includes('Unexpected') && !message.includes('JSON') && !message.includes('Failed') && message !== 'Not authenticated.' && message !== 'GitHub sign-in is required.') {
    authStatus.textContent = message;
    authStatus.classList.remove('success');
    authStatus.classList.add('danger');
  } else {
    authStatus.innerHTML = '<i class="ph-bold ph-info"></i> Connect your GitHub account to begin.';
    authStatus.classList.remove('danger');
    authStatus.classList.remove('success');
  }

  githubLoginBtn.disabled = false;
  githubLoginBtn.innerHTML = '<i class="ph-bold ph-github-logo"></i> Continue with GitHub';
}

function setSignedInState(user) {
  currentUser = user;
  if (signOutBtn) signOutBtn.style.display = 'inline-flex';
  authPanel.classList.add('hidden');
  schedulerPanel.classList.remove('hidden');
  userSummary.textContent = user.login || 'GitHub account';
  authStatus.textContent = 'GitHub account connected.';
  authStatus.classList.remove('danger');
  authStatus.classList.add('success');

  if (repoOwnerInput && !repoOwnerInput.value) {
    repoOwnerInput.value = user.login || '';
    repoOwnerInput.placeholder = user.login || 'your GitHub username';
  }

  fetchRepos();
  initDefaultDates();
  updateHeatmapPreview();
}

// ─── Default Date Helper ────────────────────────────────────────────────────

function initDefaultDates() {
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  if (startInput && !startInput.value) {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    startInput.value = d.toISOString().split('T')[0];
  }
  if (endInput && !endInput.value) {
    endInput.value = new Date().toISOString().split('T')[0];
  }
}

async function fetchRepos() {
  if (!repoNameInput || repoNameInput.tagName !== 'SELECT') return;

  repoNameInput.innerHTML = '<option value="" disabled selected>Loading repositories...</option>';
  try {
    const response = await fetch('/api/repos');
    const data = await response.json();
    if (data.success && data.repos) {
      userRepos = data.repos;
      repoNameInput.innerHTML = '<option value="" disabled selected>Select a repository</option>';
      userRepos.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.name;
        option.textContent = repo.name + (repo.private ? ' (Private)' : '');
        repoNameInput.appendChild(option);
      });
    } else {
      repoNameInput.innerHTML = '<option value="" disabled selected>Failed to load repos</option>';
    }
  } catch (err) {
    repoNameInput.innerHTML = '<option value="" disabled selected>Error loading repos</option>';
  }
}

if (repoNameInput && repoNameInput.tagName === 'SELECT') {
  repoNameInput.addEventListener('change', () => {
    const selected = userRepos.find(r => r.name === repoNameInput.value);
    if (selected && selected.defaultBranch) {
      document.getElementById('branch').value = selected.defaultBranch;
    }
  });
}

function showInlineMessage(message, type = 'danger') {
  authStatus.textContent = message;
  authStatus.classList.toggle('success', type === 'success');
  authStatus.classList.toggle('danger', type === 'danger');
}

async function checkGitHubConfig() {
  try {
    const response = await fetch('/api/auth/configured');
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { configured: false, missing: [] };
    }
    return { configured: data.configured, missing: data.missing || [] };
  } catch {
    return { configured: false, missing: [] };
  }
}

async function checkGitHubAuth() {
  try {
    const response = await fetch(buildApiUrl('/api/auth/status'));
    if (!response.ok) {
      setSignedOutState();
      return;
    }
    const data = await response.json().catch(() => null);

    if (data && data.success && data.user) {
      setSignedInState(data.user);
    } else {
      setSignedOutState();
    }
  } catch {
    setSignedOutState();
  }
}

async function initializeApp() {
  if (customApiUrlInput) {
    customApiUrlInput.value = localStorage.getItem("commitflow_custom_api") || "";
  }
  const customClientIdInput = document.getElementById("customClientIdInput");
  if (customClientIdInput) {
    customClientIdInput.value = localStorage.getItem("commitflow_custom_client_id") || "";
  }
  initDefaultDates();
  initThemeSwitcher();
  initStrategyPresets();
  initTabControls();
  initVolumeModeControls();
  initTiltEffect();
  renderHeatmapMonthHeaders();

  githubLoginBtn.disabled = false;
  githubLoginBtn.innerHTML = '<i class="ph-bold ph-github-logo"></i> Continue with GitHub';

  await checkGitHubAuth();
}

if (githubLoginBtn) {
  githubLoginBtn.addEventListener('click', () => {
    const savedClientId = localStorage.getItem("commitflow_custom_client_id");
    const loginPath = savedClientId ? `/api/auth/login?client_id=${encodeURIComponent(savedClientId)}` : '/api/auth/login';
    window.location.href = buildApiUrl(loginPath);
  });
}

if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    try {
      await fetch(buildApiUrl('/api/auth/logout'));
      setSignedOutState('Signed out. Connect your GitHub account to continue.');
    } catch {
      showInlineMessage('Unable to sign out at this time.', 'danger');
    }
  });
}

// ─── PAT Auth Handlers ──────────────────────────────────────────────────────

const patAuthToggleBtn = document.getElementById("patAuthToggleBtn");
const patAuthForm = document.getElementById("patAuthForm");
const patTokenInput = document.getElementById("patTokenInput");
const patSubmitBtn = document.getElementById("patSubmitBtn");

if (patAuthToggleBtn && patAuthForm) {
  patAuthToggleBtn.addEventListener('click', () => {
    patAuthForm.classList.toggle('hidden');
  });
}

if (patSubmitBtn && patTokenInput) {
  patSubmitBtn.addEventListener('click', async () => {
    const token = patTokenInput.value.trim();
    if (!token) {
      showInlineMessage('Please enter a valid GitHub Personal Access Token.', 'danger');
      return;
    }
    patSubmitBtn.disabled = true;
    patSubmitBtn.innerHTML = '<i class="ph-bold ph-spinner" style="animation: spin 1s linear infinite;"></i> Authenticating...';
    try {
      const response = await fetch(buildApiUrl('/api/auth/pat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Token authentication failed.');
      }
      setSignedInState(data.user);
    } catch (err) {
      showInlineMessage(err.message, 'danger');
    } finally {
      patSubmitBtn.disabled = false;
      patSubmitBtn.textContent = 'Connect Token';
    }
  });
}

// ─── Filter Mode & Weekday Input States ────────────────────────────────────

if (filterMode) {
  filterMode.addEventListener('change', () => {
    if (selectedDaysPanel) {
      selectedDaysPanel.classList.toggle('hidden', filterMode.value !== 'selected');
    }
    updateWeekdayInputsState();
    updateHeatmapPreview();
  });
}

const selectedDaysCheckboxes = document.querySelectorAll("#selectedDays input");
selectedDaysCheckboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    updateWeekdayInputsState();
    updateHeatmapPreview();
  });
});

function updateWeekdayInputsState() {
  const mode = filterMode ? filterMode.value : 'all';
  const weekdayInputs = document.querySelectorAll("[data-weekday]");

  const checkedDays = Array.from(selectedDaysCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  weekdayInputs.forEach(input => {
    const day = input.dataset.weekday;
    let enabled = true;

    if (mode === 'odd') enabled = ['monday', 'wednesday', 'friday', 'sunday'].includes(day);
    else if (mode === 'even') enabled = ['tuesday', 'thursday', 'saturday'].includes(day);
    else if (mode === 'weekends') enabled = ['saturday', 'sunday'].includes(day);
    else if (mode === 'weekdays') enabled = !['saturday', 'sunday'].includes(day);
    else if (mode === 'selected') enabled = checkedDays.includes(day);

    input.disabled = !enabled;
    if (input.parentElement) {
      input.parentElement.style.opacity = enabled ? '1' : '0.4';
    }
  });
}

// ─── Realism Controls Listeners ─────────────────────────────────────────────

if (timeJitter && jitterVal) {
  timeJitter.addEventListener('input', () => {
    jitterVal.textContent = timeJitter.value;
  });
}

if (commitMessagePattern && customMessagesWrapper) {
  commitMessagePattern.addEventListener('change', () => {
    customMessagesWrapper.classList.toggle('hidden', commitMessagePattern.value !== 'custom');
  });
}

// ─── Contribution Heatmap Preview Generator ─────────────────────────────────

function isDaySelectedForHeatmap(date, mode, checkedDays) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  const dayNum = date.getDate();

  if (mode === 'odd') return dayNum % 2 === 1;
  if (mode === 'even') return dayNum % 2 === 0;
  if (mode === 'weekends') return ['saturday', 'sunday'].includes(dayName);
  if (mode === 'weekdays') return !['saturday', 'sunday'].includes(dayName);
  if (mode === 'selected') return checkedDays.includes(dayName);
  return true;
}

function updateHeatmapPreview() {
  if (!heatmapGrid) return;

  const startDateVal = document.getElementById("startDate")?.value;
  const endDateVal = document.getElementById("endDate")?.value;

  if (!startDateVal || !endDateVal) return;

  const start = new Date(startDateVal);
  const end = new Date(endDateVal);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    heatmapGrid.innerHTML = '<div style="color:var(--text-muted); padding:10px;">Select a valid date window</div>';
    return;
  }

  const volMode = document.getElementById("volumeMode")?.value || 'fixed';
  const baseCount = Number(document.getElementById("dailyCount")?.value || 5);
  const minVal = Number(document.getElementById("minPerDay")?.value || 1);
  const maxVal = Number(document.getElementById("maxPerDay")?.value || 8);
  const mode = filterMode ? filterMode.value : 'all';
  const checkedDays = Array.from(selectedDaysCheckboxes).filter(c => c.checked).map(c => c.value);

  const weekdayInputs = document.querySelectorAll("[data-weekday]");
  const weekdayCounts = {};
  weekdayInputs.forEach(i => {
    weekdayCounts[i.dataset.weekday] = Number(i.value || 0);
  });

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  let totalCommits = 0;
  let activeDays = 0;
  let peakCommits = 0;

  const dailyData = [];
  let curr = new Date(start);

  while (curr <= end) {
    const dayName = dayNames[curr.getDay()];
    const selected = isDaySelectedForHeatmap(curr, mode, checkedDays);

    let count = 0;
    if (selected) {
      if (volMode === 'range') {
        count = Math.round((minVal + maxVal) / 2);
      } else if (volMode === 'weighted') {
        count = weekdayCounts[dayName] !== undefined ? weekdayCounts[dayName] : baseCount;
      } else {
        count = baseCount;
      }
    }

    if (count > 0) {
      activeDays += 1;
      totalCommits += count;
      if (count > peakCommits) peakCommits = count;
    }

    dailyData.push({
      dateStr: curr.toISOString().split('T')[0],
      dayOfWeek: curr.getDay(),
      count
    });

    curr.setDate(curr.getDate() + 1);
  }

  if (hmTotalCommits) hmTotalCommits.textContent = totalCommits.toLocaleString();
  if (hmActiveDays) hmActiveDays.textContent = activeDays.toLocaleString();
  if (hmPeakCommits) hmPeakCommits.textContent = peakCommits.toLocaleString();

  heatmapGrid.innerHTML = '';

  dailyData.forEach(item => {
    let level = 0;
    if (item.count > 0) {
      if (item.count <= 2) level = 1;
      else if (item.count <= 5) level = 2;
      else if (item.count <= 9) level = 3;
      else level = 4;
    }

    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.classList.add(`level-${level}`);
    cell.title = `${item.dateStr}: ${item.count} planned commit(s) — Click to inspect`;

    cell.addEventListener('click', () => {
      openDayInspector(item.dateStr, item.count);
    });

    heatmapGrid.appendChild(cell);
  });
}

// ─── Day Inspector Modal ───────────────────────────────────────────────────

function openDayInspector(dateStr, count) {
  const inspectModal = document.getElementById("cellInspectModal");
  const inspectDate = document.getElementById("inspectDate");
  const inspectWeekday = document.getElementById("inspectWeekday");
  const inspectCount = document.getElementById("inspectCount");
  const inspectSampleList = document.getElementById("inspectSampleList");

  if (!inspectModal) return;

  const dateObj = new Date(dateStr + 'T00:00:00');
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayName = weekdays[dateObj.getDay()];

  if (inspectDate) inspectDate.textContent = dateStr;
  if (inspectWeekday) inspectWeekday.textContent = weekdayName;
  if (inspectCount) inspectCount.textContent = count;

  if (inspectSampleList) {
    inspectSampleList.innerHTML = '';
    if (count === 0) {
      inspectSampleList.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding:12px;">No commits planned for this day.</div>';
    } else {
      for (let i = 1; i <= Math.min(count, 8); i++) {
        const hour = String(9 + Math.floor((i / Math.max(1, count)) * 10)).padStart(2, '0');
        const min = String((i * 17) % 60).padStart(2, '0');
        const row = document.createElement('div');
        row.className = 'inspect-item';
        row.innerHTML = `
          <span class="inspect-time">${hour}:${min}:00 UTC</span>
          <span class="inspect-msg">Auto commit ${i} — ${dateStr}</span>
        `;
        inspectSampleList.appendChild(row);
      }
    }
  }

  inspectModal.classList.remove('hidden');
}

const closeInspectModalBtn = document.getElementById("closeInspectModalBtn");
const closeInspectDoneBtn = document.getElementById("closeInspectDoneBtn");
const cellInspectModal = document.getElementById("cellInspectModal");

if (closeInspectModalBtn && cellInspectModal) {
  closeInspectModalBtn.addEventListener('click', () => cellInspectModal.classList.add('hidden'));
}
if (closeInspectDoneBtn && cellInspectModal) {
  closeInspectDoneBtn.addEventListener('click', () => cellInspectModal.classList.add('hidden'));
}

// ─── Theme Switcher & 1-Click Strategy Presets ─────────────────────────────

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem("gitpulse_theme") || "cyan";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeDots = document.querySelectorAll(".theme-dot");
  themeDots.forEach(dot => {
    dot.classList.toggle("active", dot.dataset.theme === savedTheme);
    dot.addEventListener("click", () => {
      const theme = dot.dataset.theme;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("gitpulse_theme", theme);
      themeDots.forEach(d => d.classList.toggle("active", d.dataset.theme === theme));
    });
  });
}

function initStrategyPresets() {
  const strategyCards = document.querySelectorAll(".strategy-card");
  strategyCards.forEach(card => {
    card.addEventListener("click", () => {
      const preset = card.dataset.preset;
      const dailyInput = document.getElementById("dailyCount");
      const maxInput = document.getElementById("maxPerDay");
      const randCheckbox = document.getElementById("randomize");

      if (preset === 'consistent') {
        if (filterMode) filterMode.value = 'all';
        if (dailyInput) dailyInput.value = 5;
        if (maxInput) maxInput.value = 5;
        if (randCheckbox) randCheckbox.checked = false;
      } else if (preset === 'weekday') {
        if (filterMode) filterMode.value = 'weekdays';
        if (dailyInput) dailyInput.value = 7;
        if (maxInput) maxInput.value = 7;
        if (randCheckbox) randCheckbox.checked = false;
      } else if (preset === 'weekend') {
        if (filterMode) filterMode.value = 'weekends';
        if (dailyInput) dailyInput.value = 10;
        if (maxInput) maxInput.value = 10;
        if (randCheckbox) randCheckbox.checked = false;
      } else if (preset === 'burst') {
        if (filterMode) filterMode.value = 'all';
        if (dailyInput) dailyInput.value = 1;
        if (maxInput) maxInput.value = 12;
        if (randCheckbox) randCheckbox.checked = true;
      }

      if (selectedDaysPanel) {
        selectedDaysPanel.classList.toggle('hidden', filterMode?.value !== 'selected');
      }
      updateWeekdayInputsState();
      updateHeatmapPreview();
    });
  });
}

function initTabControls() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle("active", b === btn));
      tabPanes.forEach(pane => pane.classList.toggle("hidden", pane.id !== targetId));
    });
  });
}

function initVolumeModeControls() {
  const volumeModeSelect = document.getElementById("volumeMode");
  const modeFixedWrapper = document.getElementById("modeFixedWrapper");
  const modeRangeWrapper = document.getElementById("modeRangeWrapper");
  const modeWeightedWrapper = document.getElementById("modeWeightedWrapper");
  const minPerDay = document.getElementById("minPerDay");
  const maxPerDay = document.getElementById("maxPerDay");
  const minHintVal = document.getElementById("minHintVal");
  const maxHintVal = document.getElementById("maxHintVal");

  function updateModeVisibility() {
    if (!volumeModeSelect) return;
    const val = volumeModeSelect.value;
    if (modeFixedWrapper) modeFixedWrapper.classList.toggle("hidden", val !== "fixed");
    if (modeRangeWrapper) modeRangeWrapper.classList.toggle("hidden", val !== "range");
    if (modeWeightedWrapper) modeWeightedWrapper.classList.toggle("hidden", val !== "weighted");
    updateHeatmapPreview();
  }

  function updateRangeHints() {
    if (minHintVal && minPerDay) minHintVal.textContent = minPerDay.value;
    if (maxHintVal && maxPerDay) maxHintVal.textContent = maxPerDay.value;
    updateHeatmapPreview();
  }

  if (volumeModeSelect) {
    volumeModeSelect.addEventListener("change", updateModeVisibility);
  }
  if (minPerDay) {
    minPerDay.addEventListener("input", updateRangeHints);
    minPerDay.addEventListener("change", updateRangeHints);
  }
  if (maxPerDay) {
    maxPerDay.addEventListener("input", updateRangeHints);
    maxPerDay.addEventListener("change", updateRangeHints);
  }

  updateModeVisibility();
}

function initTiltEffect() {
  const cards = document.querySelectorAll(".tilt-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 12}deg) rotateY(${x / 12}deg) translateY(-4px) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    });
  });
}

function renderHeatmapMonthHeaders() {
  const monthHeaderEl = document.getElementById("heatmapMonthHeader");
  if (!monthHeaderEl) return;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthHeaderEl.innerHTML = '';
  months.forEach(m => {
    const span = document.createElement('span');
    span.textContent = m;
    monthHeaderEl.appendChild(span);
  });
}

const formInputsToTrack = [
  "startDate", "endDate", "dailyCount", "maxPerDay", "filterMode", "randomize"
];
formInputsToTrack.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', updateHeatmapPreview);
    el.addEventListener('input', updateHeatmapPreview);
  }
});

document.querySelectorAll("[data-weekday]").forEach(el => {
  el.addEventListener('change', updateHeatmapPreview);
  el.addEventListener('input', updateHeatmapPreview);
});

updateWeekdayInputsState();

// ─── Preset Export & Import System ──────────────────────────────────────────

if (exportPresetBtn) {
  exportPresetBtn.addEventListener('click', () => {
    const weekdayInputs = document.querySelectorAll("[data-weekday]");
    const weekdayCounts = {};
    weekdayInputs.forEach((input) => {
      weekdayCounts[input.dataset.weekday] = Number(input.value || 0);
    });

    const selectedDays = Array.from(document.querySelectorAll("#selectedDays input:checked")).map((i) => i.value);

    const preset = {
      version: "1.0",
      startDate: document.getElementById("startDate")?.value || "",
      endDate: document.getElementById("endDate")?.value || "",
      dailyCount: Number(document.getElementById("dailyCount")?.value || 5),
      maxPerDay: Number(document.getElementById("maxPerDay")?.value || 5),
      randomize: document.getElementById("randomize")?.checked || false,
      filterMode: filterMode ? filterMode.value : "all",
      selectedDays,
      weekdayCounts,
      branch: document.getElementById("branch")?.value || "main",
      targetFilePath: targetFilePath?.value || "commit-log.json",
      timeJitterMinutes: Number(timeJitter?.value || 15),
      commitMessagePattern: commitMessagePattern?.value || "default",
      customMessagesList: customMessagesList?.value || "",
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(preset, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `commitflow-preset-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });
}

if (importPresetFile) {
  importPresetFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const preset = JSON.parse(event.target.result);

        if (preset.startDate) document.getElementById("startDate").value = preset.startDate;
        if (preset.endDate) document.getElementById("endDate").value = preset.endDate;
        if (preset.dailyCount !== undefined) document.getElementById("dailyCount").value = preset.dailyCount;
        if (preset.maxPerDay !== undefined) document.getElementById("maxPerDay").value = preset.maxPerDay;
        if (preset.randomize !== undefined) document.getElementById("randomize").checked = preset.randomize;
        if (preset.branch) document.getElementById("branch").value = preset.branch;
        if (preset.targetFilePath) targetFilePath.value = preset.targetFilePath;
        if (preset.timeJitterMinutes !== undefined) {
          timeJitter.value = preset.timeJitterMinutes;
          if (jitterVal) jitterVal.textContent = preset.timeJitterMinutes;
        }
        if (preset.commitMessagePattern) {
          commitMessagePattern.value = preset.commitMessagePattern;
          if (customMessagesWrapper) {
            customMessagesWrapper.classList.toggle('hidden', preset.commitMessagePattern !== 'custom');
          }
        }
        if (preset.customMessagesList) customMessagesList.value = preset.customMessagesList;

        if (preset.filterMode && filterMode) {
          filterMode.value = preset.filterMode;
          if (selectedDaysPanel) {
            selectedDaysPanel.classList.toggle('hidden', filterMode.value !== 'selected');
          }
        }

        if (Array.isArray(preset.selectedDays)) {
          selectedDaysCheckboxes.forEach(cb => {
            cb.checked = preset.selectedDays.includes(cb.value);
          });
        }

        if (preset.weekdayCounts) {
          Object.entries(preset.weekdayCounts).forEach(([day, count]) => {
            const input = document.querySelector(`[data-weekday="${day}"]`);
            if (input) input.value = count;
          });
        }

        updateWeekdayInputsState();
        updateHeatmapPreview();

        showInlineMessage("Preset imported successfully!", "success");
      } catch (err) {
        showInlineMessage("Failed to parse preset JSON file.", "danger");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
}

// ─── API Settings Modal Listeners ───────────────────────────────────────────

const apiConfigBtnTop = document.getElementById("apiConfigBtn");
if (apiConfigBtnTop && apiConfigModal) {
  apiConfigBtnTop.addEventListener('click', () => {
    apiConfigModal.classList.remove('hidden');
  });
}

if (closeApiModalBtn && apiConfigModal) {
  closeApiModalBtn.addEventListener('click', () => {
    apiConfigModal.classList.add('hidden');
  });
}

if (saveApiUrlBtn) {
  saveApiUrlBtn.addEventListener('click', () => {
    if (customApiUrlInput) {
      const val = customApiUrlInput.value.trim();
      if (val) {
        localStorage.setItem("commitflow_custom_api", val);
      } else {
        localStorage.removeItem("commitflow_custom_api");
      }
    }
    const customClientIdInput = document.getElementById("customClientIdInput");
    if (customClientIdInput) {
      const cid = customClientIdInput.value.trim();
      if (cid) {
        localStorage.setItem("commitflow_custom_client_id", cid);
      } else {
        localStorage.removeItem("commitflow_custom_client_id");
      }
    }
    if (apiConfigModal) apiConfigModal.classList.add('hidden');
    initializeApp();
  });
}

if (resetApiUrlBtn) {
  resetApiUrlBtn.addEventListener('click', () => {
    if (customApiUrlInput) customApiUrlInput.value = '';
    const customClientIdInput = document.getElementById("customClientIdInput");
    if (customClientIdInput) customClientIdInput.value = '';
    localStorage.removeItem("commitflow_custom_api");
    localStorage.removeItem("commitflow_custom_client_id");
    if (apiConfigModal) apiConfigModal.classList.add('hidden');
    initializeApp();
  });
}

// ─── Progress & Form Submission ─────────────────────────────────────────────

function formatETA(seconds) {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const secondsLeft = totalSeconds % 60;
  return `${minutes}m ${secondsLeft}s remaining`;
}

function estimateProgress(startAt, totalTasks, completedTasks) {
  if (completedTasks <= 0) return 'Estimating...';
  const elapsedSeconds = (Date.now() - startAt) / 1000;
  const averagePerTask = elapsedSeconds / completedTasks;
  const remaining = Math.max(0, totalTasks - completedTasks);
  const eta = averagePerTask * remaining;
  return formatETA(eta);
}

async function validateRepoBeforeSubmit(repoOwner, repoName) {
  try {
    const response = await fetch('/api/validate-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoOwner, repoName }),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      return { valid: false, message: data.message || 'Unable to validate repository.' };
    }

    if (!data.valid) {
      return { valid: false, message: data.message };
    }

    if (!data.canPush) {
      return { valid: false, message: `You don't have write access to "${repoOwner}/${repoName}".` };
    }

    return { valid: true, defaultBranch: data.defaultBranch };
  } catch (error) {
    return { valid: false, message: 'Unable to validate repository. Check your connection and try again.' };
  }
}

function setSubmitting(isSubmitting) {
  if (submitBtn) {
    submitBtn.disabled = isSubmitting;
    submitBtn.innerHTML = isSubmitting
      ? '<i class="ph-bold ph-spinner" style="animation: spin 1s linear infinite;"></i> Generating...'
      : '<i class="ph-bold ph-lightning"></i> Generate Schedule';
  }
}

if (!document.getElementById('spinKeyframe')) {
  const style = document.createElement('style');
  style.id = 'spinKeyframe';
  style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

function renderError(message) {
  resultBox.classList.remove('hidden');
  resultBox.className = 'result result-error';
  resultBox.innerHTML = `
    <div class="result-icon"><i class="ph-bold ph-x"></i></div>
    <div class="result-body">
      <strong>Error</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function renderSuccess(data) {
  resultBox.classList.remove('hidden');
  resultBox.className = 'result result-success';
  const pushNote = data.pushResult?.message || '';
  resultBox.innerHTML = `
    <div class="result-header">
      <div class="result-icon-badge"><i class="ph-bold ph-check-circle"></i></div>
      <div>
        <strong class="result-title">Execution Completed Successfully</strong>
        <p class="result-sub">Schedule generated and synchronized with GitHub</p>
      </div>
    </div>

    <div class="result-stats-grid">
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-folder"></i> Repository</span>
        <strong class="stat-value">${escapeHtml(data.repoOwner)}/${escapeHtml(data.repoName)}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-git-branch"></i> Branch</span>
        <strong class="stat-value">${escapeHtml(data.branch)}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-git-commit"></i> Commits</span>
        <strong class="stat-value highlight-cyan">${data.commitsCreated}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-calendar"></i> Date Range</span>
        <strong class="stat-value">${escapeHtml(data.startDate)} → ${escapeHtml(data.endDate)}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-hash"></i> Active Days</span>
        <strong class="stat-value">${data.selectedDays}</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label"><i class="ph-bold ph-cloud-arrow-up"></i> Remote Push</span>
        <strong class="stat-value highlight-green">${data.pushToRemote ? 'Pushed' : 'Dry-Run'}</strong>
      </div>
    </div>

    <div class="result-note-banner">
      <i class="ph-bold ph-info"></i> ${escapeHtml(pushNote)}
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const weekdayInputs = document.querySelectorAll("[data-weekday]");
    const weekdayCounts = {};
    weekdayInputs.forEach((input) => {
      weekdayCounts[input.dataset.weekday] = Number(input.value || 0);
    });

    const selectedDays = Array.from(document.querySelectorAll("#selectedDays input:checked")).map((input) => input.value);

    const repoOwner = repoOwnerInput.value.trim() || (currentUser ? currentUser.login : '');
    const repoName = repoNameInput.value.trim();
    const pushToRemote = document.getElementById("pushToRemote").checked;

    const volumeMode = document.getElementById("volumeMode")?.value || 'fixed';
    const minPerDay = Number(document.getElementById("minPerDay")?.value || 1);
    const maxPerDay = Number(document.getElementById("maxPerDay")?.value || 8);

    const payload = {
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      volumeMode,
      dailyCount: Number(document.getElementById("dailyCount")?.value || 5),
      minPerDay,
      maxPerDay,
      randomize: document.getElementById("randomize").checked,
      filterMode: filterMode.value,
      selectedDays,
      weekdayCounts,
      branch: document.getElementById("branch").value,
      pushToRemote,
      repoOwner,
      repoName,
      // Commit Realism parameters
      timeJitterMinutes: Number(timeJitter ? timeJitter.value : 15),
      commitMessagePattern: commitMessagePattern ? commitMessagePattern.value : "default",
      customMessagesList: customMessagesList ? customMessagesList.value : "",
      targetFilePath: targetFilePath ? targetFilePath.value.trim() : "commit-log.json"
    };

    if (!payload.startDate || !payload.endDate) {
      renderError('Please select both a start date and an end date.');
      return;
    }

    if (pushToRemote && !repoName) {
      renderError('Repository name is required when pushing to remote. Select a repository.');
      return;
    }

    setSubmitting(true);

    if (pushToRemote) {
      resultBox.classList.remove('hidden');
      resultBox.className = 'result';
      resultBox.innerHTML = 'Validating repository access...';

      const validation = await validateRepoBeforeSubmit(repoOwner, repoName);
      if (!validation.valid) {
        setSubmitting(false);
        renderError(validation.message);
        return;
      }
    }

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);
    const differenceDays = Math.max(1, Math.ceil((end - start) / 86400000) + 1);
    const estimatedTotal = Math.max(1, Math.round((payload.dailyCount || 1) * differenceDays));
    const startedAt = Date.now();
    let completed = 0;

    resultBox.classList.remove('hidden');
    resultBox.className = 'result';
    resultBox.innerHTML = "Generating commits... <span class='progress'>0/" + estimatedTotal + " · Estimating...</span>";

    const progressTimer = setInterval(() => {
      completed = Math.min(completed + 1, estimatedTotal);
      const eta = estimateProgress(startedAt, estimatedTotal, completed);
      const node = resultBox.querySelector(".progress");
      if (node) node.textContent = `${completed}/${estimatedTotal} · ${eta}`;
    }, 800);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textError = await response.text();
        throw new Error(`Server error (${response.status}): The request may have timed out.`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      clearInterval(progressTimer);
      renderSuccess(data);
    } catch (error) {
      clearInterval(progressTimer);
      renderError(error.message);
    } finally {
      setSubmitting(false);
      renderError(error.message);
    } finally {
      setSubmitting(false);
    }
  });

  initializeApp();
