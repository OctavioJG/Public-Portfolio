
const deliveryTabs = [...document.querySelectorAll('.delivery-tab')];
function selectDeliveryProject(tab) {
  deliveryTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
deliveryTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    selectDeliveryProject(tab);
    const panels = document.querySelector('.delivery-panels');
    if (matchMedia('(max-width:760px)').matches || panels.getBoundingClientRect().top < 95) {
      panels.scrollIntoView({block:'start', behavior:'auto'});
    }
  });
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % deliveryTabs.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + deliveryTabs.length) % deliveryTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = deliveryTabs.length - 1;
    else return;
    event.preventDefault();
    selectDeliveryProject(deliveryTabs[next]);
    deliveryTabs[next].focus();
  });
});
