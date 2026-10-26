/* 案件だけの動き：さつき土木有限会社（骨格の swipe.js は直さない）
 * 0. 募集要項の職種タブ：HTML は版ごとの section（文言照合のため）。開いたら現場作業員版を施工管理版のページの中へ移し、普通のタブで切り替える
 * 0.5 メニュー（Canva「メニューがふわっと広がる感じ」）
 * 0.7 見出しを1文字ずつ落とす・p3 の数字を数え上げる
 * 1. 流れる帯（細い帯・特大の帯・フィルムの帯。PC の帯は CSS の疑似要素で 52秒）：1周の秒数を「半分の長さ ÷ px/秒」で決める（tokens.css の --pxs-band／--pxs-thin。AGENTS.md 2.8）
 * 2. ペイント（p3・p6 の見出し・p5 の帯）：PC はカーソルを重ねたときにも書き直す（Canva「カーソルを重ねた時にもペイントがかかる動き」）
 * 3. 参考の動きに寄せる（りょうさん 10/26）：読み込みの幕を取り除く／フィルムを2本にして交差／面の色が変わるページに工具の形の幕
 */
(() => {
  const r1 = document.getElementById('requirements');
  const r2 = document.getElementById('requirements2');
  if (r1 && r2) {
    const tabs = r1.querySelector('.jobtabs');
    const panel = (job, from) => {
      const d = document.createElement('div');
      d.className = 'jobpanel'; d.dataset.job = job; d.setAttribute('role', 'tabpanel');
      from.querySelectorAll(':scope .page__inner > .req').forEach((el) => d.appendChild(el));
      return d;
    };
    const p1 = panel('1', r1), p2 = panel('2', r2);
    p2.hidden = true;
    tabs.after(p1, p2);
    r2.remove();
    tabs.querySelectorAll('.jobtabs__btn').forEach((b, k, all) => b.addEventListener('click', () => {
      all.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', String(x === b)); });
      p1.hidden = b.dataset.job !== '1'; p2.hidden = b.dataset.job !== '2';
    }));
  }

  const mbtn = document.querySelector('.menu-btn'), gmenu = document.getElementById('gmenu');
  if (mbtn && gmenu) {
    const setOpen = (open) => {
      gmenu.classList.toggle('is-open', open);
      gmenu.setAttribute('aria-hidden', String(!open));
      mbtn.setAttribute('aria-expanded', String(open));
      mbtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    mbtn.addEventListener('click', () => setOpen(!gmenu.classList.contains('is-open')));
    gmenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  document.querySelectorAll('.hd').forEach((hd) => {
    let i = 0;
    const tw = document.createTreeWalker(hd, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n = tw.nextNode(); n; n = tw.nextNode()) if (n.data.trim() && !n.parentElement.closest('.spray, .vh')) nodes.push(n);
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment();
      [...n.data].forEach((c) => { const sp = document.createElement('span'); sp.className = 'ch'; sp.style.setProperty('--i', i++); sp.textContent = c; frag.appendChild(sp); });
      n.replaceWith(frag);
    });
  });
  document.addEventListener('pagechange', (e) => {
    e.detail.page.querySelectorAll('.cnt').forEach((el) => {
      const to = Number(el.dataset.to), t0 = performance.now(), dur = 900;
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      el.textContent = '0'; requestAnimationFrame(tick);
    });
  });

  document.querySelectorAll('.film').forEach((film) => {
    const box = document.createElement('div');
    box.className = 'films page__label';
    box.setAttribute('aria-hidden', 'true');
    box.setAttribute('data-bleed', '');
    film.replaceWith(box);
    const rev = film.cloneNode(true);
    rev.classList.add('film--rev');
    box.append(rev, film);
  });

  const root = getComputedStyle(document.documentElement);
  const pxs = (name, fallback) => Number(root.getPropertyValue(name)) || fallback;
  const tracks = [...document.querySelectorAll('.thin__track, .band__track, .film__track')];
  const fit = () => tracks.forEach((track) => {
    const half = track.scrollWidth / 2;
    if (half < 50) return;
    const speed = track.classList.contains('thin__track') ? pxs('--pxs-thin', 110) : track.classList.contains('film__track') ? pxs('--pxs-film', 90) : pxs('--pxs-band', 220);
    track.style.setProperty('--t', `${(half / speed).toFixed(1)}s`);
  });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 200); });

  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.hd--paint, .band').forEach((hd) => {
      const spray = hd.querySelector('.spray');
      hd.addEventListener('mouseenter', () => {
        spray.classList.remove('is-repaint');
        void spray.offsetWidth;
        spray.classList.add('is-repaint');
      });
    });
  }

  const intro = document.querySelector('.intro');
  if (intro) setTimeout(() => intro.remove(), 3100);

  const allPages = [...document.querySelectorAll('#slider > .page')];
  const tools = {
    p3: { cls: 'wipe__tool wipe__tool--helmet', d: 'M26 58 Q26 30 50 28 Q74 30 74 58 Z M20 58 H80 V65 Q80 67 78 67 H22 Q20 67 20 65 Z' },
    p4: { cls: 'wipe__tool wipe__tool--wrench', d: 'M46 43.31 A12 12 0 0 1 46 20.69 L46 30 L54 30 L54 20.69 A12 12 0 0 1 54 43.31 L54 70 A4 4 0 0 1 46 70 Z' },
    p6: { cls: 'wipe__tool wipe__tool--hammer', d: 'M30 30 H70 Q72 30 72 32 V40 Q72 42 70 42 H55 V72 Q55 74 53 74 H47 Q45 74 45 72 V42 H30 Q28 42 28 40 V32 Q28 30 30 30 Z' },
    company: { cls: 'wipe__tool wipe__tool--shovel', d: 'M42 18 H58 V24 H53 V52 H60 V64 Q60 76 50 80 Q40 76 40 64 V52 H47 V24 H42 Z' },
    requirements: { cls: 'wipe__tool wipe__tool--gear', d: (() => { let d = ''; for (let t = 0; t < 8; t++) { const a = (t / 8) * Math.PI * 2; [[-0.2, 15], [-0.12, 21], [0.12, 21], [0.2, 15]].forEach(([o, r], n) => { const x = 50 + r * Math.cos(a + o), y = 50 + r * Math.sin(a + o); d += `${t === 0 && n === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `; }); } return `${d}Z`; })() },
  };
  const wiped = allPages.filter((p, k) => {
    if (k < 2 || p.id === 'p7') return false;
    const c = getComputedStyle(p).backgroundColor, prev = getComputedStyle(allPages[k - 1]).backgroundColor;
    if (c === prev) return false;
    const box = document.createElement('div');
    box.className = 'wipe-box page__label';
    box.setAttribute('aria-hidden', 'true');
    box.setAttribute('data-bleed', '');
    const tool = tools[p.id] || tools.p4;
    box.innerHTML = `<svg class="wipe" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><mask id="wipe-m${k}"><rect x="-100" y="-100" width="300" height="300" fill="white"/><path class="${tool.cls}" d="${tool.d}" fill="black"/></mask><rect class="wipe__fill" x="-100" y="-100" width="300" height="300" mask="url(#wipe-m${k})"/></svg>`;
    box.style.setProperty('--wipe-c', prev);
    p.prepend(box);
    return true;
  });
  let now = -1, armTimer = 0;
  const arm = () => wiped.forEach((p) => p.classList.toggle('is-armed', allPages.indexOf(p) > now));
  document.addEventListener('pagechange', (e) => {
    now = allPages.indexOf(e.detail.page);
    e.detail.page.classList.remove('is-armed');
    clearTimeout(armTimer);
    armTimer = setTimeout(arm, 700);
  });
  arm();
})();
