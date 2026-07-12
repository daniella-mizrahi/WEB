'use strict';

/**
 * listing-detail.js — מסך 4: פרטי דירה
 *
 * JS REQUIREMENT #5: Data transfer between screens
 * Reads listing data from sessionStorage (saved by listings.js)
 * and populates the detail page elements.
 *
 * JS REQUIREMENT #2: Writing into elements
 * All detail fields are written dynamically by JS.
 *
 * VANILLA JS ONLY — no jQuery.
 */

/* ── DOM References ─────────────────────────────────────────────────── */
var noData        = document.getElementById('no-data');
var detailContent = document.getElementById('detail-content');
var toastContainer = document.getElementById('toast-container');

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

/* ── Load Listing from sessionStorage ───────────────────────────────── */
(function init() {
  var raw = sessionStorage.getItem('roomies_selected_listing');

  if (!raw) {
    noData.removeAttribute('hidden');
    return;
  }

  var listing = JSON.parse(raw);
  var pricePerPerson = Math.round(listing.total_rent / listing.room_count);

  /* JS REQ #2: Writing into elements */
  document.getElementById('detail-city').textContent = '📍 ' + listing.city;
  document.getElementById('detail-address').textContent = listing.address;
  document.getElementById('detail-description').textContent = listing.description;
  document.getElementById('detail-posted-by').textContent = listing.posted_by;

  // Phone
  var phoneEl = document.getElementById('detail-phone');
  if (listing.contact_phone) {
    phoneEl.textContent = listing.contact_phone;
    phoneEl.href = 'tel:' + listing.contact_phone;
  } else {
    document.getElementById('detail-contact-section').querySelector('p').textContent = 'לא צוין טלפון';
  }
  document.getElementById('detail-price-per-person').textContent = '₪' + formatPrice(pricePerPerson) + ' / חודש';
  document.getElementById('detail-total-rent').textContent = '₪' + formatPrice(listing.total_rent);
  document.getElementById('detail-rooms').textContent = listing.room_count;
  document.getElementById('detail-date').textContent = formatDate(listing.available_from);
  document.getElementById('detail-gender').textContent = genderLabel(listing.roommate_gender_pref);
  document.getElementById('detail-pets').textContent = listing.pet_friendly ? 'מותר' : 'לא מותר';

  // Build badges
  var badgesContainer = document.getElementById('detail-badges');
  var badges = [
    { text: '🛏 ' + listing.room_count + ' חדרים', cls: 'badge--primary' },
    { text: '👥 ' + genderLabel(listing.roommate_gender_pref), cls: 'badge--accent' },
    { text: '📅 מ-' + formatDate(listing.available_from), cls: 'badge--primary' }
  ];
  if (listing.pet_friendly) {
    badges.push({ text: '🐾 ידידותית לחיות', cls: 'badge--success' });
  }
  badges.forEach(function(b) {
    var span = document.createElement('span');
    span.className = 'badge ' + b.cls;
    span.textContent = b.text;
    badgesContainer.appendChild(span);
  });

  // Update page title
  document.title = 'Roomies | ' + listing.address;

  // Show content
  detailContent.removeAttribute('hidden');

  showToast('מציג פרטי דירה ב' + listing.city, 'info');
})();
