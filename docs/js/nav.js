// Sidebar navigation toggle
document.querySelectorAll('.nav-section-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    btn.classList.toggle('expanded');
  });
});

// Mobile hamburger menu
var toggle = document.querySelector('.nav-toggle');
var sidebar = document.querySelector('.sidebar');
var overlay = document.querySelector('.nav-overlay');

if (toggle && sidebar && overlay) {
  toggle.addEventListener('click', function() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}
