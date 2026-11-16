const stage = document.querySelector('#map-stage');
const image = document.querySelector('#map-image');
const lens = document.querySelector('#map-lens');
const toggle = document.querySelector('#map-toggle');
const instructions = document.querySelector('#map-instructions');
let enabled = false;
let x = .5;
let y = .5;

function showLens(nextX, nextY) {
  x = Math.max(0, Math.min(1, nextX));
  y = Math.max(0, Math.min(1, nextY));
  const { width, height } = image.getBoundingClientRect();
  if (!image.naturalWidth || !width || !height) return;
  lens.hidden = false;
  const radius = lens.offsetWidth / 2;
  const left = Math.max(radius, Math.min(width - radius, x * width));
  const top = Math.max(radius, Math.min(height - radius, y * height));
  const scale = Math.max(2, image.naturalWidth / width);
  lens.style.left = `${left}px`;
  lens.style.top = `${top}px`;
  lens.style.backgroundImage = `url("${image.currentSrc}")`;
  lens.style.backgroundSize = `${width * scale}px ${height * scale}px`;
  lens.style.backgroundPosition = `${radius - x * width * scale}px ${radius - y * height * scale}px`;
}

function setEnabled(next) {
  enabled = next;
  toggle.setAttribute('aria-pressed', String(enabled));
  stage.tabIndex = enabled ? 0 : -1;
  if (enabled) showLens(x, y);
  else lens.hidden = true;
}

function showPointer(event) {
  const rect = image.getBoundingClientRect();
  showLens((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
}

toggle.hidden = false;
instructions.hidden = false;
stage.setAttribute('aria-describedby', 'map-instructions');
toggle.addEventListener('click', () => setEnabled(!enabled));
stage.addEventListener('pointermove', event => {
  if (event.pointerType === 'mouse') showPointer(event);
});
stage.addEventListener('pointerup', event => {
  if (event.pointerType !== 'mouse' && enabled) showPointer(event);
});
stage.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') lens.hidden = true;
});
stage.addEventListener('focus', () => {
  if (enabled) showLens(x, y);
});
stage.addEventListener('blur', () => { lens.hidden = true; });
stage.addEventListener('keydown', event => {
  const steps = { ArrowLeft: [-.035, 0], ArrowRight: [.035, 0], ArrowUp: [0, -.035], ArrowDown: [0, .035] };
  const step = steps[event.key];
  if (!enabled || !step) return;
  event.preventDefault();
  showLens(x + step[0], y + step[1]);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || lens.hidden) return;
  if (document.activeElement === stage) toggle.focus();
  setEnabled(false);
});
new ResizeObserver(() => {
  if (!lens.hidden) showLens(x, y);
}).observe(stage);
