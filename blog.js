/**
 * HopeHand Blog Filtering & Search Engine (blog.js)
 */

document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.getElementById('blogSearch');
  var filterButtons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.blog-col');
  var noResults = document.getElementById('noResults');

  var activeFilter = 'all';

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    cards.forEach(function (card) {
      var category = (card.getAttribute('data-category') || '').toLowerCase();
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var fullText = card.textContent.toLowerCase();

      var matchesFilter = false;
      if (activeFilter === 'all') {
        matchesFilter = true;
      } else {
        var filterLow = activeFilter.toLowerCase();
        matchesFilter = (category === filterLow || title.indexOf(filterLow) !== -1 || fullText.indexOf(filterLow) !== -1);
      }

      var matchesSearch = query === '' || title.indexOf(query) !== -1 || fullText.indexOf(query) !== -1;

      if (matchesFilter && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        filterButtons.forEach(function (btn) {
          btn.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = button.getAttribute('data-filter') || button.textContent.trim().toLowerCase();
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
});
