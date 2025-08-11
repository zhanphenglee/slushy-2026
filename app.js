async function load() {
  const res = await fetch('data.json', { cache: 'no-store' });
  const data = await res.json();

  // HERO
  const hTitle = document.querySelector('.hero h1');
  const hSub = document.querySelector('.hero-sub');
  const heroImg = document.querySelector('.hero-media img');
  const ctas = document.querySelectorAll('.cta-row a');
  if (hTitle) hTitle.textContent = data.hero.title;
  if (hSub) hSub.textContent = data.hero.subhead;
  if (heroImg) heroImg.src = data.hero.hero_image;
  if (ctas[0]) { ctas[0].textContent = data.hero.cta_primary.label; ctas[0].href = data.hero.cta_primary.href; }
  if (ctas[1]) { ctas[1].textContent = data.hero.cta_secondary.label; ctas[1].href = data.hero.cta_secondary.href; }

  // PEOPLE — helpers
  const card = (p) => {
    const el = document.createElement('article');
    el.className = 'person';
    el.innerHTML = `
      <img class="avatar" src="${p.avatar}" alt="${p.name} portrait">
      <div class="meta">
        <div class="name">${p.name}</div>
        <div class="muted">${p.blurb} ${p.level ? '' : ''}${p.zeros !== undefined ? `${p.zeros} strong zeros.` : ''}</div>
        ${p.level ? `<span class="pill">Level: ${p.level}</span>` : ''}
      </div>`;
    return el;
  };

  const spot = document.getElementById('crew-spotlight');
  const more = document.getElementById('crew-more');
  if (spot) {
    spot.innerHTML = '';
    data.people.spotlight.forEach(p => spot.appendChild(card(p)));
  }
  if (more) {
    more.innerHTML = '';
    data.people.more.forEach(p => more.appendChild(card(p)));
  }

  // Calendar
  const acc = document.querySelector('#calendar .accordion');
  if (acc) {
    acc.innerHTML = '';
    data.calendar.forEach(day => {
      const d = document.createElement('details');
      d.innerHTML = `<summary>${day.title}</summary><div class="day-body">${day.body}</div>`;
      acc.appendChild(d);
    });
  }

  // Gear
  const list = document.querySelector('#gear .list');
  if (list) {
    list.innerHTML = '';
    data.gear.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
  }
}

// Toggle extra riders (kept from before)
function initToggle() {
  const btn = document.getElementById('toggleCrew');
  const more = document.getElementById('crew-more');
  if (!btn || !more) return;
  btn.addEventListener('click', () => {
    const open = !more.hasAttribute('hidden');
    if (open) {
      more.setAttribute('hidden','');
      btn.setAttribute('aria-expanded','false');
      btn.textContent = 'And more legends — show all';
    } else {
      more.removeAttribute('hidden');
      btn.setAttribute('aria-expanded','true');
      btn.textContent = 'Show less';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => { load(); initToggle(); });
