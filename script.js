(function () {
  var book = document.querySelector('.book');
  var btn = document.querySelector('.open-btn');
  var cover = document.querySelector('.cover');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openBook() {
    if (book.dataset.state !== 'closed') return;
    book.dataset.state = 'open';
    cover.setAttribute('aria-hidden', 'true');
    var firstLink = document.querySelector('.toc a');
    var done = function () {
      book.dataset.state = 'gone';
      if (firstLink) firstLink.focus({ preventScroll: true });
    };
    if (reduce) done(); else setTimeout(done, 1100);
  }
  btn.addEventListener('click', openBook);
  // jumping straight to a section opens the cover too
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.getAttribute('href') !== '#top') a.addEventListener('click', openBook);
  });

  // checklist: remember ticks and cheer when all are done
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.checklist input'));
  var note = document.querySelector('.check-note');
  var KEY = 'fo-selfcare-checks';
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    boxes.forEach(function (b, i) { b.checked = !!saved[i]; });
  } catch (e) {}

  function update() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    if (n === boxes.length) note.textContent = 'All done. Battery: 100%!';
    else if (n > 0) note.textContent = n + ' of ' + boxes.length + ' done, keep going.';
    else note.textContent = '';
    try { localStorage.setItem(KEY, JSON.stringify(boxes.map(function (b) { return b.checked; }))); } catch (e) {}
  }
  boxes.forEach(function (b) { b.addEventListener('change', update); });
  update();
})();
