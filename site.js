/* 案件だけの動き：さつき土木有限会社（骨格の swipe.js は直さない）
 * 0. 募集要項の職種タブ：HTML は版ごとの section（文言照合のため）。開いたら現場作業員版を施工管理版のページの中へ移し、普通のタブで切り替える
 * 0.5 メニュー（Canva「メニューがふわっと広がる感じ」）
 * 1. 流れる帯（細い帯・特大の帯・フィルムの帯。PC の帯は CSS の疑似要素で 52秒）：1周の秒数を「半分の長さ ÷ px/秒」で決める（tokens.css の --pxs-band／--pxs-thin。AGENTS.md 2.8）
 * 2. ペイント（p3・p6 の見出し・p5 の帯）：PC はカーソルを重ねたときにも書き直す（Canva「カーソルを重ねた時にもペイントがかかる動き」）
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

  const root = getComputedStyle(document.documentElement);
  const pxs = (name, fallback) => Number(root.getPropertyValue(name)) || fallback;
  const tracks = [...document.querySelectorAll('.thin__track, .band__track, .film__track')];
  const fit = () => tracks.forEach((track) => {
    const half = track.scrollWidth / 2;
    if (half < 50) return;
    const speed = track.classList.contains('thin__track') ? pxs('--pxs-thin', 40) : pxs('--pxs-band', 60);
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
})();
