async function load() {
  const res = await fetch('data.json', { cache: 'no-store' });
  const data = await res.json();

  // Footer
  const footer = document.getElementById('footer-text');
  if (footer && data.site?.footer) footer.textContent = data.site.footer;

  // HERO
  const hTitle = document.querySelector('.hero h1');
  const hSub = document.querySelector('.hero-sub');
  const ctaPrimary = document.getElementById('cta-primary');
  const ctaSecondary = document.getElementById('cta-secondary');

  if (hTitle) hTitle.textContent = data.hero.title || '';
  if (hSub) hSub.textContent = data.hero.subhead || '';
  
  // Set hero background image via CSS custom property
  if (data.hero.hero_image) {
    document.documentElement.style.setProperty('--hero-bg-image', `url('${data.hero.hero_image}')`);
  }
  
  if (ctaPrimary && data.hero.cta_primary) {
    ctaPrimary.textContent = data.hero.cta_primary.label || '';
    ctaPrimary.href = data.hero.cta_primary.href || '#';
  }
  if (ctaSecondary && data.hero.cta_secondary) {
    ctaSecondary.textContent = data.hero.cta_secondary.label || '';
    ctaSecondary.href = data.hero.cta_secondary.href || '#';
  }

  // PEOPLE
  const peopleTitle = document.getElementById('people-title');
  const peopleIntro = document.getElementById('people-intro');
  const crewSpotlight = document.getElementById('crew-spotlight');

  if (peopleTitle) peopleTitle.textContent = data.people.title || '';
  if (peopleIntro) peopleIntro.textContent = data.people.intro || '';
  
  // People Section
  if (crewSpotlight && data.people.spotlight) {
    crewSpotlight.innerHTML = data.people.spotlight.map(person => {
      const levelClass = person.level === 'Beginner-Intermediate' ? 'beginner-intermediate' : 
                        person.level === 'Beginner' ? 'beginner' : '';
      return `
        <div class="person">
          <img src="${person.avatar}" alt="${person.name}" class="avatar">
          <div class="meta">
            <div class="name">${person.name}</div>
            <div class="muted">${person.blurb}</div>
            <div class="pill ${levelClass}">${person.level}</div>
            ${person.zeros !== undefined ? `<div class="muted small">${person.zeros} strong zeros</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // CALENDAR
  const calTitle = document.getElementById('cal-title');
  const calendarCards = document.querySelector('.calendar-cards');

  if (calTitle) calTitle.textContent = data.calendar.title || '';
  
  // Calendar Section
  if (calendarCards && data.calendar.phases) {
    console.log('Calendar phases data:', data.calendar.phases);
    calendarCards.innerHTML = data.calendar.phases.map((phase, index) => {
      const isVideo = phase.mediaType === 'video';
      console.log(`Phase ${index + 1}:`, { isVideo, photo: phase.photo, mediaType: phase.mediaType });
      
      const mediaElement = isVideo 
        ? `<div class="calendar-card-media">
             <video class="calendar-card-video" muted loop playsinline controls onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" onloadstart="console.log('Video loading started')" onloadeddata="console.log('Video data loaded')" oncanplay="this.muted=true; this.volume=0; console.log('Video ready to play - audio disabled')">
               <source src="${phase.photo}" type="video/quicktime">
               <source src="${phase.photo}" type="video/mp4">
               <source src="${phase.photo}" type="video/x-msvideo">
               Your browser does not support the video tag.
             </video>
             <div class="calendar-card-image" style="background-image: url('${phase.photoFallback || `https://picsum.photos/400/300?random=${index + 1}`}'); display: none;"></div>
           </div>`
        : `<div class="calendar-card-image" style="background-image: url('${phase.photo}')"></div>`;
      
      return `
        <div class="calendar-card" data-phase="${index}" data-media-type="${phase.mediaType}">
          ${mediaElement}
          <div class="calendar-card-content">
            <div class="calendar-card-header">
              <div class="calendar-card-meta">
                <div class="calendar-phase-location">${phase.phase} • ${phase.location}</div>
                <div class="calendar-date">${phase.date}</div>
              </div>
              <button class="calendar-card-toggle" aria-label="Toggle phase details">+</button>
            </div>
            <div class="calendar-card-title">
              <div class="calendar-title-main">${phase.title}</div>
              <div class="calendar-title-japanese">${phase.japanese}</div>
            </div>
            <div class="calendar-card-body">
              ${phase.body}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers for calendar cards
    const calendarCardToggles = document.querySelectorAll('.calendar-card-toggle');
    calendarCardToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const card = this.closest('.calendar-card');
        const body = card.querySelector('.calendar-card-body');
        const video = card.querySelector('.calendar-card-video');
        const isExpanded = body.style.display === 'block';
        
        if (isExpanded) {
          // Collapsing - hide body and change button
          body.style.display = 'none';
          this.textContent = '+';
          // Pause video if it exists
          if (video) {
            video.pause();
          }
        } else {
          // Expanding - show body and change button
          body.style.display = 'block';
          this.textContent = '−';
          // Start playing video if it exists
          if (video) {
            // Ensure video is completely muted before playing
            ensureVideoMuted(video);
            video.play().catch(e => console.log('Video autoplay failed:', e));
          }
        }
      });
    });
  }

  // GEAR
  const gearTitle = document.getElementById('gear-title');
  const gearIntro = document.getElementById('gear-intro');
  const gearList = document.getElementById('gear-list');
  
  if (gearTitle) gearTitle.textContent = data.gear.title || '';
  if (gearIntro) gearIntro.textContent = data.gear.intro || '';
  
  // Gear Section
  if (gearList && data.gear.items) {
    gearList.innerHTML = data.gear.items.map(item => `<li>${item}</li>`).join('');
  }
}

// Function to ensure video is completely muted
function ensureVideoMuted(video) {
  if (video) {
    video.muted = true;
    video.volume = 0;
    video.defaultMuted = true;
    // Remove any audio tracks if possible
    try {
      if (video.audioTracks && video.audioTracks.length > 0) {
        for (let i = 0; i < video.audioTracks.length; i++) {
          video.audioTracks[i].enabled = false;
        }
      }
    } catch (e) {
      console.log('Audio track manipulation not supported');
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await load();
});
