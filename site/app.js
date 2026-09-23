// Reduce to the max — vanilla renderer. Content lives in mantras.json.
(function () {
  var STORE_ROLE = 'rttm_role';
  var STORE_THEME = 'rttm_theme';
  var data = null;
  var activeRole = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // Theme --------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var t = document.querySelector('.theme-toggle');
    if (t) t.title = (theme === 'dark' ? 'switch to light' : 'switch to dark') + ' (t)';
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORE_THEME, next); } catch (e) {}
  }

  // Rendering ----------------------------------------------------------
  function roleMeta(id) {
    return data.roles.filter(function (r) { return r.id === id; })[0] || data.roles[0];
  }

  function renderRoles() {
    var bar = document.getElementById('rolebar');
    bar.innerHTML = '';
    bar.appendChild(el('span', 'prompt', '>'));
    bar.appendChild(el('span', 'lead', "I'm a"));
    data.roles.forEach(function (r) {
      var chip = el('button', 'chip' + (r.id === activeRole ? ' on' : ''), r.label);
      chip.type = 'button';
      chip.setAttribute('aria-pressed', r.id === activeRole ? 'true' : 'false');
      chip.addEventListener('click', function () { setRole(r.id); });
      bar.appendChild(chip);
    });
  }

  function renderIntro() {
    var node = document.getElementById('intro');
    node.innerHTML = '';
    var word = roleMeta(activeRole).word;
    var parts = data.intro.split('{roleWord}');
    node.appendChild(document.createTextNode(parts[0]));
    if (parts.length > 1) {
      node.appendChild(el('span', 'role', word));
      node.appendChild(document.createTextNode(parts.slice(1).join('{roleWord}')));
    }
  }

  function diffRow(kind, sign, text) {
    var row = el('div', 'row ' + kind);
    row.appendChild(el('span', 'sign', sign));
    row.appendChild(el('span', 'text', text));
    return row;
  }

  function renderMantras() {
    var host = document.getElementById('mantras');
    host.innerHTML = '';
    data.mantras.forEach(function (m) {
      var pair = m.roles[activeRole] || {};
      var wrap = el('div', 'mantra');

      var head = el('div', 'head');
      head.appendChild(el('span', 'num', '#' + m.num));
      head.appendChild(el('span', 'title', m.title));
      wrap.appendChild(head);

      var body = el('div', 'body');
      body.appendChild(el('div', 'sub', m.sub));
      var diff = el('div', 'diff');
      diff.appendChild(diffRow('add', '+', pair['do'] || ''));
      diff.appendChild(diffRow('del', '-', pair.dont || ''));
      body.appendChild(diff);
      wrap.appendChild(body);

      host.appendChild(wrap);
    });
  }

  function renderSignature() {
    document.getElementById('signature').textContent = '— ' + (data.signature || '');
  }

  function setRole(id) {
    activeRole = id;
    try { localStorage.setItem(STORE_ROLE, id); } catch (e) {}
    renderRoles();
    renderIntro();
    renderMantras();
  }

  // Step to the previous/next role, wrapping around at both ends.
  function moveRole(delta) {
    var ids = data.roles.map(function (r) { return r.id; });
    var i = ids.indexOf(activeRole);
    if (i < 0) i = 0;
    setRole(ids[(i + delta + ids.length) % ids.length]);
    var on = document.querySelector('.chip.on');
    if (on) on.focus();
  }

  // Boot ---------------------------------------------------------------
  function init(json) {
    data = json;
    var savedRole = null;
    try { savedRole = localStorage.getItem(STORE_ROLE); } catch (e) {}
    var valid = data.roles.some(function (r) { return r.id === savedRole; });
    activeRole = valid ? savedRole : data.roles[0].id;

    var savedTheme = null;
    try { savedTheme = localStorage.getItem(STORE_THEME); } catch (e) {}
    applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark');

    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    window.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (e.metaKey || e.ctrlKey || e.altKey || tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTheme(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); moveRole(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); moveRole(-1); }
    });

    renderRoles();
    renderIntro();
    renderMantras();
    renderSignature();
  }

  fetch('mantras.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(init)
    .catch(function (err) {
      document.getElementById('mantras').textContent =
        'Could not load mantras.json (' + err.message + '). Serve this page over HTTP, not the file:// protocol.';
    });
})();
