'use strict';

/**
 * expenses.js — מסך 5: לוח מטלות והוצאות
 *
 * JS REQUIREMENT #2: Writing into element (DOM)
 *   → renderRows() builds the table dynamically.
 *   → updateOpenCounter() writes "נשארו עוד X מטלות פתוחות" into the header
 *     live, whenever a task is marked done — no page reload.
 *
 * JS REQUIREMENT: Dynamic styling via CSS classes
 *   → markOverdue() adds the .overdue class to rows whose due_date has
 *     passed and are still open, coloring them red.
 *
 * JS REQUIREMENT: Element responding to an event
 *   → checkbox 'change' marks a record done and re-renders counters/styles.
 *   → filter chips 'click' filter the visible rows.
 *
 * VANILLA JS ONLY — no jQuery.
 */

/* ── DOM References ─────────────────────────────────────────────────── */
var tableWrap     = document.getElementById('expenses-table-wrap');
var openCounter   = document.getElementById('open-counter');
var filterChips   = document.querySelectorAll('.filter-chip');
var toastContainer = document.getElementById('toast-container');

/* ── State ──────────────────────────────────────────────────────────── */
var allRecords    = [];
var currentFilter = 'all';

/* ── Seed Data (fallback if PHP endpoint is unavailable) ─────────────── */
var SEED_RECORDS = [
  { id: 1, record_type: 'expense', title: 'קניות סופר שבועיות', amount: 240, urgency: 'medium', status: 'open', assigned_to_username: 'noakk24', due_date: '2026-07-15', split_count: 3 },
  { id: 2, record_type: 'task',    title: 'הוצאת זבל וניקיון מטבח', amount: 0, urgency: 'high', status: 'open', assigned_to_username: 'noakk24', due_date: '2026-07-11', split_count: 1 },
  { id: 3, record_type: 'expense', title: 'חשבון חשמל דו-חודשי', amount: 380, urgency: 'high', status: 'open', assigned_to_username: 'shira_r', due_date: '2026-06-20', split_count: 3 },
  { id: 4, record_type: 'task',    title: 'החלפת נורה במסדרון', amount: 0, urgency: 'low', status: 'done', assigned_to_username: 'shira_r', due_date: '2026-07-08', split_count: 1 },
  { id: 5, record_type: 'expense', title: 'אינטרנט וכבלים', amount: 120, urgency: 'medium', status: 'done', assigned_to_username: 'noakk24', due_date: '2026-07-05', split_count: 3 }
];

/* ── Toast Helper ───────────────────────────────────────────────────── */
function showToast(message, type) {
  var toast = document.createElement('p');
  toast.className = 'toast toast--' + type;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3000);
}

/* ── Formatting Helpers ─────────────────────────────────────────────── */
function formatPrice(price) {
  return Number(price).toLocaleString('he-IL');
}
function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}
function urgencyLabel(u) {
  var map = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };
  return map[u] || u;
}
function isOverdue(record) {
  if (record.status !== 'open') { return false; }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(record.due_date) < today;
}

/* ── JS REQUIREMENT #2 (DOM write): Open counter in header ───────────── */
function updateOpenCounter() {
  var open = allRecords.filter(function (r) { return r.status === 'open'; }).length;
  openCounter.textContent = 'נשארו עוד ' + open + ' מטלות פתוחות';
}

/* ── Build one table row ────────────────────────────────────────────── */
function createRow(record) {
  var row = document.createElement('tr');
  row.className = 'record-row';
  row.setAttribute('data-id', record.id);
  row.setAttribute('data-type', record.record_type);
  if (record.status === 'done') { row.classList.add('row-done'); }
  // Dynamic styling via class: overdue rows colored red
  if (isOverdue(record)) { row.classList.add('overdue'); }

  var amountCell = record.record_type === 'expense'
    ? '₪' + formatPrice(record.amount)
    : '—';

  row.innerHTML =
    '<td class="col-check">' +
      '<input type="checkbox" class="done-check" ' + (record.status === 'done' ? 'checked' : '') +
      ' aria-label="סימון כבוצע"></td>' +
    '<td class="col-title">' + record.title + '</td>' +
    '<td><span class="badge badge--' + (record.record_type === 'expense' ? 'accent' : 'primary') + '">' +
      (record.record_type === 'expense' ? 'הוצאה' : 'מטלה') + '</span></td>' +
    '<td>' + amountCell + '</td>' +
    '<td><span class="urgency urgency--' + record.urgency + '">' + urgencyLabel(record.urgency) + '</span></td>' +
    '<td>' + record.assigned_to_username + '</td>' +
    '<td class="col-due">' + formatDate(record.due_date) + '</td>';

  /* Element responding to event: checkbox toggles done status */
  var check = row.querySelector('.done-check');
  check.addEventListener('change', function () {
    var newStatus = check.checked ? 'done' : 'open';
    record.status = newStatus;
    row.classList.toggle('row-done', check.checked);
    row.classList.toggle('overdue', isOverdue(record));

    updateOpenCounter();        // DOM write
    saveStatus(record.id, newStatus);
  });

  return row;
}

/* ── Render the table ───────────────────────────────────────────────── */
function renderRows() {
  var records = currentFilter === 'all'
    ? allRecords
    : allRecords.filter(function (r) { return r.record_type === currentFilter; });

  if (records.length === 0) {
    tableWrap.innerHTML =
      '<div class="empty-state">' +
        '<p class="empty-state__icon">🗂️</p>' +
        '<h3>אין רשומות להצגה</h3>' +
        '<p>הוסיפי מטלה או הוצאה חדשה כדי להתחיל</p>' +
      '</div>';
    return;
  }

  var table = document.createElement('table');
  table.className = 'records-table';
  table.innerHTML =
    '<thead><tr>' +
      '<th>בוצע</th><th>תיאור</th><th>סוג</th><th>סכום</th>' +
      '<th>דחיפות</th><th>אחראית</th><th>מועד יעד</th>' +
    '</tr></thead>';

  var tbody = document.createElement('tbody');
  records.forEach(function (record) { tbody.appendChild(createRow(record)); });
  table.appendChild(tbody);

  tableWrap.innerHTML = '';
  tableWrap.appendChild(table);
}

/* ── Save status change to PHP (fetch) ──────────────────────────────── */
function saveStatus(id, status) {
  var fd = new FormData();
  fd.append('id', id);
  fd.append('status', status);
  fetch('Includes/update_status.php', { method: 'POST', body: fd })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.success) { showToast('עדכון הסטטוס נכשל', 'error'); }
    })
    .catch(function () { /* offline / seed mode — silent */ });
}

/* ── Filter chips (event → re-render) ───────────────────────────────── */
filterChips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    filterChips.forEach(function (c) { c.classList.remove('active'); });
    chip.classList.add('active');
    currentFilter = chip.getAttribute('data-filter');
    renderRows();
  });
});

/* ── Load records from PHP (database) with seed fallback ────────────── */
function loadRecords() {
  fetch('Includes/get_expenses.php')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success && data.records.length > 0) {
        allRecords = data.records;
      } else {
        allRecords = SEED_RECORDS;
      }
      renderRows();
      updateOpenCounter();
    })
    .catch(function () {
      allRecords = SEED_RECORDS;
      renderRows();
      updateOpenCounter();
    });
}

/* ── Init ───────────────────────────────────────────────────────────── */
loadRecords();
