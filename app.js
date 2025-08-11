async function load() {
  const res = await fetch('data.json', { cache: 'no-store' });
  const data = await res.json();

  // Brand + footer
  const brand = document.getElementById('brand-text');
  if (brand && data.site?.brand) brand.textContent = data.site.brand;
  const footer = document.getElementById('footer-text');
  if (footer && data.site?.footer) footer.textContent = data.site.footer;

  // HERO
  const hTitle = document.querySelector('.hero h1');
  const hSub = document.querySelector('.hero-sub');
  const heroImg = document.getElementById('hero-image');
  const ctaPrimary = document.getElementById('cta-primary');
  const ctaSecondary = document.getElementById('cta-secondary');

  if (hTitle) hTitle.textContent = data.hero.title || '';
  if (hSub) hSub.textContent = data.hero.subhead || '';
  if (heroImg && data.hero.hero_image) heroImg.src = data.hero.hero_image;
  if (ctaPrimary && data.hero.cta_primary) {
    ctaPrimary.textContent = data.hero.cta_primary.label || '';
    ctaPrimary.href = data.hero.cta_primary.href || '#';
  }
  if (ctaSecondary && data.hero.cta_secondary) {
    ctaSecondary.textContent = data.hero.cta_secondary.label || '';
    ctaSecondary.href = data.hero.cta_secondary.href || '#';
  }

  // PEOPLE titles + intro
  const peopleTitle = document.getElementById('people-title');
  const peopleIntro = document.getElementById('people-intro');
  if (peopleTitle) peopleTitle.textContent = data.people.title || '';
  if (peopleIntro) peopleIntro.textContent = data.people.intro || '';

  // PEOPLE cards
  const card = (p) => {
    const el = document.createElement('article');
    el.className = 'person';
    el.innerHTML = `
      <img class="avatar" src="${p.avatar}" alt="${p.name} portrait">
      <div class="meta">
        <div class="name">${p.name}</div>
        <div class="muted">${[p.blurb, p.level ? `${p.level}` : null, (p.zeros !== undefined ? `${p.zeros} strong zeros` : null)].filter(Boolean).join(' • ')}</div>
        ${p.level ? `<span class="pill">Level: ${p.level}</span>` : ''}
      </div>`;
    return el;
  };

  const spot = document.getElementById('crew-spotlight');
  const more = document.getElementById('crew-more');
  if (spot && Array.isArray(data.people.spotlight)) {
    spot.innerHTML = '';
    data.people.spotlight.forEach(p => spot.appendChild(card(p)));
  }
  if (more && Array.isArray(data.people.more)) {
    more.innerHTML = '';
    data.people.more.forEach(p => more.appendChild(card(p)));
  }

  // Toggle label text from JSON
  const toggleBtn = document.getElementById('toggleCrew');
  if (toggleBtn) toggleBtn.textContent = data.people.toggle_more_closed || 'Show all';

  // CALENDAR
  const calTitle = document.getElementById('cal-title');
  if (calTitle) calTitle.textContent = data.calendar.title || '';
  const acc = document.querySelector('#calendar .accordion');
  if (acc && Array.isArray(data.calendar.days)) {
    acc.innerHTML = '';
    data.calendar.days.forEach(day => {
      const d = document.createElement('details');
      d.innerHTML = `<summary>${day.title}</summary><div class="day-body">${day.body}</div>`;
      acc.appendChild(d);
    });
  }

  // GEAR
  const gearTitle = document.getElementById('gear-title');
  if (gearTitle) gearTitle.textContent = data.gear.title || '';
  const list = document.querySelector('#gear .list');
  if (list && Array.isArray(data.gear.items)) {
    list.innerHTML = '';
    data.gear.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
}

// Toggle extra riders
function initToggle() {
  const btn = document.getElementById('toggleCrew');
  const more = document.getElementById('crew-more');
  if (!btn || !more) return;
  btn.addEventListener('click', () => {
    const open = !more.hasAttribute('hidden');
    if (open) {
      more.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
      btn.textContent = btn.dataset.closed || 'And more legends — show all';
    } else {
      more.removeAttribute('hidden');
      btn.setAttribute('aria-expanded','true');
      btn.textContent = btn.dataset.open || 'Show less';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await load();
  // Store toggle labels for quick swap
  const btn = document.getElementById('toggleCrew');
  fetch('data.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(d => {
      if (btn && d.people) {
        btn.dataset.closed = d.people.toggle_more_closed || 'Show all';
        btn.dataset.open = d.people.toggle_more_open || 'Show less';
      }
    })
    .finally(initToggle);
});
