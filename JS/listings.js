'use strict';

/**
 * listings.js — מסך 2: לוח דירות
 *
 * JS REQUIREMENT #2: Writing into element — cards rendered dynamically
 * JS REQUIREMENT #5: Data transfer between screens
 *   → Reads selected city from sessionStorage (from home.js)
 *   → On card click, saves listing data to sessionStorage
 *     and navigates to listing-detail.html
 *
 * VANILLA JS ONLY — no jQuery.
 */

/* ── DOM References ─────────────────────────────────────────────────── */
var listingsGrid    = document.getElementById('listings-grid');
var filterBanner    = document.getElementById('city-filter-banner');
var filterCityName  = document.getElementById('filter-city-name');
var btnClearFilter  = document.getElementById('btn-clear-filter');
var toastContainer  = document.getElementById('toast-container');

/* ── All listings (filled by fetch or fallback seed) ────────────────── */
var allListings = [];

/* ── Seed Data (fallback if PHP endpoint is unavailable) ─────────────── */
var SEED_LISTINGS = [
  {
    listing_id: 1,
    city: 'תל אביב',
    address: 'רחוב דיזנגוף 55, דירה 4',
    total_rent: 5800,
    room_count: 3,
    available_from: '2026-08-01',
    description: 'דירה מרווחת ובהירה בלב הצפון, 2 דקות מהים. מרפסת שמש, חניה, ממ"ד. שותפה נוכחית מחפשת שותפה חדשה.',
    roommate_gender_pref: 'female_only',
    pet_friendly: 1,
    posted_by: 'noakk24',
    contact_phone: '0501234567'
  },
  {
    listing_id: 2,
    city: 'ירושלים',
    address: 'רחוב יפו 120, דירה 2',
    total_rent: 4200,
    room_count: 4,
    available_from: '2026-09-01',
    description: 'דירה מסורתית ושקטה ליד שוק מחנה יהודה. קרובה לאוניברסיטה העברית ולמרכז העיר.',
    roommate_gender_pref: 'any',
    pet_friendly: 0,
    posted_by: 'meitalli',
    contact_phone: '0527654321'
  },
  {
    listing_id: 3,
    city: 'חיפה',
    address: 'שדרות הנשיא 12, דירה 7',
    total_rent: 3600,
    room_count: 3,
    available_from: '2026-07-15',
    description: 'נוף לים מהסלון! דירה מעוצבת בכרמל, רגועה, עם חניה וממ"ד. מחפשות שותפה נוספת.',
    roommate_gender_pref: 'female_only',
    pet_friendly: 1,
    posted_by: 'shira_r',
    contact_phone: '0541112233'
  },
  {
    listing_id: 4,
    city: 'תל אביב',
    address: 'רחוב אלנבי 80, דירה 1',
    total_rent: 6400,
    room_count: 4,
    available_from: '2026-08-15',
    description: 'דירה ענקית ומושקעת בדרום תל אביב. קרובה לשוק הכרמל ולים. שתי שותפות קיימות מחפשות שלישית.',
    roommate_gender_pref: 'any',
    pet_friendly: 0,
    posted_by: 'dana_t',
    contact_phone: '0509876543'
  },
  {
    listing_id: 5,
    city: 'באר שבע',
    address: 'שדרות רגר 22, דירה 3',
    total_rent: 2800,
    room_count: 3,
    available_from: '2026-10-01',
    description: 'דירה קרובה לאוניברסיטת בן גוריון, מתאימה לסטודנטיות. שקטה, מרווחת, עם מרפסת.',
    roommate_gender_pref: 'female_only',
    pet_friendly: 0,
    posted_by: 'yael_m',
    contact_phone: '0583334455'
  }
];

/* ── Toast Helper ───────────────────────────────────────────────────── */
function showToast(message, type) {
  var toast = document.createElement('p');
  toast.className = 'toast toast--' + type;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}

/* ── Formatting Helpers ─────────────────────────────────────────────── */
function formatPrice(price) {
  return Number(price).toLocaleString('he-IL');
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function genderLabel(pref) {
  var map = { female_only: 'נשים בלבד', male_only: 'גברים בלבד', any: 'ללא העדפה' };
  return map[pref] || pref;
}

/* ── Card Renderer ──────────────────────────────────────────────────── */
function createListingCard(listing) {
  var pricePerPerson = Math.round(listing.total_rent / listing.room_count);

  var card = document.createElement('article');
  card.className = 'listing-card';
  card.setAttribute('data-listing-id', listing.listing_id);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  card.setAttribute('aria-label', 'דירה ב' + listing.address + ' — לחצי לפרטים');

  var petBadge = listing.pet_friendly
    ? '<li><span class="badge badge--success">🐾 ידידותית לחיות</span></li>'
    : '';

  /* JS REQ #2: Writing into element — card HTML built dynamically */
  card.innerHTML =
    '<div class="listing-card__accent-bar" aria-hidden="true"></div>' +
    '<div class="listing-card__body">' +
      '<p class="listing-card__city">📍 ' + listing.city + '</p>' +
      '<h2 class="listing-card__address">' + listing.address + '</h2>' +
      '<ul class="listing-card__meta" aria-label="פרטי הדירה">' +
        '<li><span class="badge badge--primary">🛏 ' + listing.room_count + ' חדרים</span></li>' +
        '<li><span class="badge badge--accent">👥 ' + genderLabel(listing.roommate_gender_pref) + '</span></li>' +
        petBadge +
        '<li><span class="badge badge--primary">📅 מ-' + formatDate(listing.available_from) + '</span></li>' +
      '</ul>' +
      '<p class="listing-card__desc">' + listing.description + '</p>' +
      '<footer class="listing-card__footer">' +
        '<div class="listing-card__price">' +
          '₪' + formatPrice(pricePerPerson) +
          '<small>/ לאדם / חודש</small>' +
        '</div>' +
        '<span class="btn-apply">צפייה בפרטים →</span>' +
      '</footer>' +
    '</div>';

  /* JS REQ #5: Data transfer — save listing to sessionStorage on click */
  card.addEventListener('click', function() {
    sessionStorage.setItem('roomies_selected_listing', JSON.stringify(listing));
    window.location.href = 'listing-detail.html';
  });

  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      sessionStorage.setItem('roomies_selected_listing', JSON.stringify(listing));
      window.location.href = 'listing-detail.html';
    }
  });

  return card;
}

/* ── Render Listings ────────────────────────────────────────────────── */
function renderListings(listings) {
  listingsGrid.innerHTML = '';

  if (listings.length === 0) {
    listingsGrid.innerHTML =
      '<div class="empty-state">' +
        '<p class="empty-state__icon">🏠</p>' +
        '<h3>אין דירות זמינות בעיר זו</h3>' +
        '<p>נסי לחפש בעיר אחרת או הצגי את כל הדירות</p>' +
      '</div>';
    return;
  }

  listings.forEach(function(listing) {
    var card = createListingCard(listing);
    listingsGrid.appendChild(card);
  });
}

/* ── Apply city filter and render ───────────────────────────────────── */
function applyFilterAndRender() {
  var selectedCity = sessionStorage.getItem('roomies_selected_city');

  if (selectedCity) {
    filterCityName.textContent = selectedCity;
    filterBanner.removeAttribute('hidden');

    var filtered = allListings.filter(function(l) {
      return l.city === selectedCity;
    });
    renderListings(filtered);

    if (filtered.length > 0) {
      showToast('מציג ' + filtered.length + ' דירות ב' + selectedCity, 'info');
    }
  } else {
    renderListings(allListings);
  }
}

/* ── Load listings from PHP (database) with seed fallback ───────────── */
function loadListings() {
  fetch('Includes/get_listings.php')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.success && data.listings.length > 0) {
        allListings = data.listings;
      } else {
        // DB is empty or error — use seed data
        allListings = SEED_LISTINGS;
      }
      applyFilterAndRender();
    })
    .catch(function() {
      // PHP endpoint unavailable — use seed data as fallback
      allListings = SEED_LISTINGS;
      applyFilterAndRender();
    });
}

/* ── Clear Filter ───────────────────────────────────────────────────── */
btnClearFilter.addEventListener('click', function() {
  sessionStorage.removeItem('roomies_selected_city');
  filterBanner.setAttribute('hidden', '');
  renderListings(allListings);
  showToast('מציג את כל הדירות', 'info');
});

/* ── Init ───────────────────────────────────────────────────────────── */
loadListings();
