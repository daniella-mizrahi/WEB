'use strict';

/**
 * about.js — מסך 5: אודות
 *
 * JS REQUIREMENT #1: Event response — click on FAQ question toggles answer
 * JS REQUIREMENT #3: Dynamic CSS class — .faq-item--open added/removed
 * JS REQUIREMENT #2: Write to element — icon text changed (+ / -)
 *
 * VANILLA JS ONLY — no jQuery.
 */

/* ── FAQ Accordion ──────────────────────────────────────────────────── */
var faqList = document.getElementById('faq-list');
var faqItems = faqList.querySelectorAll('.faq-item');

faqItems.forEach(function(item) {
  var btn    = item.querySelector('.faq-item__question');
  var icon   = item.querySelector('.faq-item__icon');

  /* JS REQ #1: Event response — click toggles the answer */
  btn.addEventListener('click', function() {
    var isOpen = item.classList.contains('faq-item--open');

    // Close all other items first
    faqItems.forEach(function(other) {
      other.classList.remove('faq-item--open');
      other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      /* JS REQ #2: Write to element — update icon text */
      other.querySelector('.faq-item__icon').textContent = '+';
    });

    if (!isOpen) {
      /* JS REQ #3: Dynamic CSS class */
      item.classList.add('faq-item--open');
      btn.setAttribute('aria-expanded', 'true');
      icon.textContent = '−';
    }
  });
});
