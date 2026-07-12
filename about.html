'use strict';

/**
 * home.js — מסך 1: דף הבית
 *
 * JS REQUIREMENTS IMPLEMENTATION:
 * #1 Event response:    'input' event on city search field filters suggestions
 * #2 Write to element:  suggestions list populated dynamically via innerHTML
 * #3 Dynamic CSS class: .city-suggestion--highlighted toggled on click
 * #4 User input capture: reading search input value and acting on it
 * #5 Data transfer:     selected city → sessionStorage → read by listings.html
 *
 * VANILLA JS ONLY — no jQuery.
 */

/* ── Israeli Cities List ────────────────────────────────────────────── */
var ISRAELI_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'נתניה', 'חולון', 'בני ברק',
  'רמת גן', 'אשקלון', 'בת ים', 'הרצליה', 'כפר סבא',
  'רעננה', 'מודיעין', 'לוד', 'רמלה', 'נצרת',
  'עכו', 'קריית אתא', 'רחובות', 'גבעתיים', 'הוד השרון'
];

/* ── DOM References ─────────────────────────────────────────────────── */
var cityInput       = document.getElementById('city-search-input');
var suggestionsList = document.getElementById('city-suggestions');
var selectedBanner  = document.getElementById('city-selected-banner');
var selectedName    = document.getElementById('city-selected-name');
var toastContainer  = document.getElementById('toast-container');

/* ── Toast Notifications ────────────────────────────────────────────── */
function showToast(message, type) {
  var toast = document.createElement('p');
  toast.className = 'toast toast--' + type;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}

/* ── JS REQ #1 & #4: Event + User Input Capture ─────────────────────── */
cityInput.addEventListener('input', function() {
  var query = this.value.trim();
  suggestionsList.innerHTML = '';

  if (query.length < 1) {
    return;
  }

  var matches = ISRAELI_CITIES.filter(function(city) {
    return city.indexOf(query) !== -1;
  });

  if (matches.length === 0) {
    /* JS REQ #2: Writing into an element */
    var noResult = document.createElement('li');
    noResult.className = 'city-suggestion city-suggestion--empty';
    noResult.textContent = 'לא נמצאו ערים תואמות';
    suggestionsList.appendChild(noResult);
    return;
  }

  /* JS REQ #2: Writing into element — render suggestion items */
  matches.forEach(function(city) {
    var li = document.createElement('li');
    li.className = 'city-suggestion';
    li.textContent = city;
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'option');

    /* JS REQ #1 & #3: Click event + Dynamic CSS class */
    li.addEventListener('click', function() {
      selectCity(city, li);
    });
    li.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') selectCity(city, li);
    });

    suggestionsList.appendChild(li);
  });
});

/* ── JS REQ #3 & #5: CSS Class Toggle + Data Transfer ───────────────── */
function selectCity(cityName, element) {
  var allItems = suggestionsList.querySelectorAll('.city-suggestion');
  for (var i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove('city-suggestion--highlighted');
  }

  /* JS REQ #3: Dynamic CSS class */
  element.classList.add('city-suggestion--highlighted');

  /* JS REQ #5: Data transfer between screens via sessionStorage */
  sessionStorage.setItem('roomies_selected_city', cityName);

  selectedName.textContent = cityName;
  selectedBanner.removeAttribute('hidden');
  cityInput.value = cityName;

  showToast('בחרת: ' + cityName + ' — לחצי על הכפתור למטה', 'success');
}

/* ── Restore previous selection on page load ────────────────────────── */
(function init() {
  var saved = sessionStorage.getItem('roomies_selected_city');
  if (saved) {
    cityInput.value = saved;
    selectedName.textContent = saved;
    selectedBanner.removeAttribute('hidden');
  }
})();
