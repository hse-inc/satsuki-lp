/* 案件だけの動き：さつき土木有限会社（骨格の swipe.js は直さない）
 * 1. 流れる帯（細い帯・特大の帯・PC の帯・フィルムの帯）：1周の秒数を「半分の長さ ÷ px/秒」で決める（tokens.css の --pxs-band／--pxs-thin。AGENTS.md 2.8）
 * 2. ペイント（p6 の見出し）：PC はカーソルを重ねたときにも書き直す（Canva 8）
 */
(() => {
  const root = getComputedStyle(document.documentElement);
  const pxs = (name, fallback) => Number(root.getPropertyValue(name)) || fallback;
  const tracks = [...document.querySelectorAll('.thin__track, .band__track, .railband__track, .film__track')];
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
    document.querySelectorAll('.hd--paint').forEach((hd) => {
      const spray = hd.querySelector('.spray');
      hd.addEventListener('mouseenter', () => {
        spray.classList.remove('is-repaint');
        void spray.offsetWidth;
        spray.classList.add('is-repaint');
      });
    });
  }
})();
