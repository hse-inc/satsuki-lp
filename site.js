/* 案件だけの動き：さつき土木有限会社（骨格の swipe.js は直さない）
 * 0. 募集要項の職種タブ：HTML は版ごとの section（文言照合のため）。開いたら現場作業員版を施工管理版のページの中へ移し、普通のタブで切り替える
 * 0.5 メニュー（Canva「メニューがふわっと広がる感じ」）
 * 0.7 見出しを1文字ずつ落とす・p3 の数字を数え上げる
 * 1. 流れる帯（細い帯・特大の帯・フィルムの帯。PC の帯は CSS の疑似要素で 52秒）：1周の秒数を「半分の長さ ÷ px/秒」で決める（tokens.css の --pxs-band／--pxs-thin。AGENTS.md 2.8）
 * 2. ペイント（p3・p6 の見出し・p5 の帯）：PC はカーソルを重ねたときにも書き直す（Canva「カーソルを重ねた時にもペイントがかかる動き」）
 * 3. 参考の動きに寄せる（りょうさん 10/26）：読み込みの幕を取り除く／フィルムを2本にして交差／面の色が変わるページに耳の形の幕
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

  const slider = document.getElementById('slider');
  const filmPages = [...document.querySelectorAll('.films')].map((box) => [box, box.closest('.page')]);
  if (slider && filmPages.length) {
    let ft = false;
    const scrub = () => { ft = false; filmPages.forEach(([box, pg]) => box.style.setProperty('--scrub', Math.max(-1, Math.min(1, (pg.offsetTop - slider.scrollTop) / slider.clientHeight)).toFixed(3))); };
    slider.addEventListener('scroll', () => { if (!ft) { ft = true; requestAnimationFrame(scrub); } }, { passive: true });
    scrub();
  }

  const intro = document.querySelector('.intro');
  if (intro) setTimeout(() => intro.remove(), 1600);

  const allPages = [...document.querySelectorAll('#slider > .page')];
  const ears = '<svg class="wipe__ears" viewBox="0 0 200 44" preserveAspectRatio="none"><path class="wipe__fill" fill-rule="evenodd" d="M0 0 H200 V40 H0 Z M44 1.69 L44 12 L52 12 L52 1.69 A12 12 0 0 1 52 24.31 L52 40 L44 40 L44 24.31 A12 12 0 0 1 44 1.69 Z M128 5 Q128 3 130 3 L170 3 Q172 3 172 5 L172 13 Q172 15 170 15 L155 15 L155 40 L145 40 L145 15 L130 15 Q128 15 128 13 Z"/></svg>';
  const wiped = allPages.filter((p, k) => {
    if (k < 2 || p.id === 'p7' || p.querySelector('.films')) return false;
    const c = getComputedStyle(p).backgroundColor, prev = getComputedStyle(allPages[k - 1]).backgroundColor;
    if (c === prev) return false;
    const box = document.createElement('div');
    box.className = 'wipe-box page__label';
    box.setAttribute('aria-hidden', 'true');
    box.setAttribute('data-bleed', '');
    box.innerHTML = `<div class="wipe">${ears}</div>`;
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
