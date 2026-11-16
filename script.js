const menu = document.querySelector('.menu-toggle');
const closeMenu = () => {document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');};
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);});
document.querySelector('.backdrop').addEventListener('click',closeMenu);
document.querySelectorAll('nav a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
matchMedia('(min-width: 761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
const cases = [...document.querySelectorAll('.gallery .case')];
let selected = 0;

function selectCase(index) {
  selected = (index + cases.length) % cases.length;
  cases.forEach((card, i) => {
    const position = (i - selected + cases.length) % cases.length;
    card.dataset.galleryPosition = String(position);
    card.classList.toggle('active', position === 0);
    card.setAttribute('aria-pressed', String(position === 0));
  });

  const card = cases[selected];
  document.querySelector('#case-title').textContent = card.dataset.title || `Case ${selected + 1}`;
  document.querySelector('#case-description').textContent = card.dataset.description || 'Case study content and imagery to be selected.';
  const link = document.querySelector('#featured-case-link');
  link.hidden = !card.dataset.url;
  if (card.dataset.url) link.setAttribute('href', card.dataset.url);
  else link.removeAttribute('href');
  const formatNumber = number => String(number).padStart(2, '0');
  document.querySelector('#case-count').textContent = `${formatNumber(selected + 1)} / ${formatNumber(cases.length)}`;
}
document.querySelector('#prev')?.addEventListener('click',()=>selectCase(selected-1));document.querySelector('#next')?.addEventListener('click',()=>selectCase(selected+1));cases.forEach((card,i)=>card.addEventListener('click',()=>selectCase(i)));
document.querySelector('.gallery')?.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();selectCase(selected+(event.key==='ArrowRight'?1:-1));cases[selected].focus();}});
let touchX=0;const gallery=document.querySelector('.gallery');gallery?.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX;},{passive:true});gallery?.addEventListener('touchend',event=>{const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>45)selectCase(selected+(delta<0?1:-1));},{passive:true});
const dialog=document.querySelector('#area-dialog');document.querySelectorAll('.planned').forEach(button=>button.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent=button.dataset.area;dialog.showModal();}));document.querySelectorAll('.dialog-close,.dialog-done').forEach(button=>button.addEventListener('click',()=>dialog.close()));dialog?.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
