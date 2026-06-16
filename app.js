// ─── Supabase Init (Anon key — safe for frontend, protected by RLS) ─────────
// Security: The anon key ONLY allows what Row Level Security (RLS) permits:
// • READ packages (public pricing data)
// • READ payment_config (public account info)  
// • INSERT into payments (guest order submission)
// • UPLOAD to payment-screenshots bucket
// It CANNOT read/modify user data, profiles, or admin tables.
const SUPABASE_URL = 'https://avzmxnpbhcmczvfbuwbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2em14bnBiaGNtY3p2ZmJ1d2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTMwMTMsImV4cCI6MjA5Njg2OTAxM30.XnYDZDi6DyamcLBiGgT0y9PpJNnD0AM1f8Eyb3wVVhA';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Static Data ────────────────────────────────────────────────────────────
const PLANS = {
  broker: { name: 'Solo Broker', emoji: '🏠', monthly: 1500, yearly: 15000, tagline: 'Perfect for independent agents', features: ['Unlimited property listings','AI-powered lead matching','Deal pipeline & commission calc','Client CRM with WhatsApp links','Offline mode with auto-sync'] },
  agency_admin: { name: 'Agency Admin', emoji: '🏢', monthly: 5000, yearly: 50000, tagline: 'For agencies managing multiple brokers', features: ['Everything in Solo Broker','Up to 15 agent accounts','Agency-wide dashboard & reporting','Multi-agent commission splits','Priority support (< 4 hr response)'] },
};

const METHODS = [
  { key: 'jazzcash', label: 'JazzCash', icon: '📱', accent: '#EF4444' },
  { key: 'easypaysa', label: 'EasyPaisa', icon: '💚', accent: '#10B981' },
  { key: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', accent: '#6366F1' },
];

const STEPS = [
  { key: 'plan', label: 'Plan', icon: '📋' },
  { key: 'info', label: 'You', icon: '👤' },
  { key: 'payment', label: 'Pay', icon: '💳' },
  { key: 'proof', label: 'Proof', icon: '📸' },
  { key: 'review', label: 'Submit', icon: '✅' },
];

const COUNTRIES = ['Pakistan', 'UAE', 'Saudi Arabia', 'UK', 'USA', 'Canada', 'Other'];

const PAIN_POINTS = [
  { icon: '📓', pain: 'You wrote a client requirement in your notebook 3 weeks ago.', consequence: 'You forgot about it. The client bought from another agent yesterday.', lostAmount: 'Lost: ~PKR 3,50,000 commission' },
  { icon: '📱', pain: 'A buyer calls asking for "3-bed in DHA Phase 5 under 4 Cr".', consequence: "You scroll through 200+ WhatsApp messages trying to find that listing. You can't. You say \"I'll call you back.\" They never pick up again.", lostAmount: 'Lost: ~PKR 5,00,000 commission' },
  { icon: '🧮', pain: 'You calculated commission wrong on a deal.', consequence: 'The agency took more than agreed. You realized 2 weeks later. Too awkward to bring up now.', lostAmount: 'Lost: ~PKR 1,20,000 commission' },
  { icon: '📵', pain: 'You visited a property site with a client. No internet.', consequence: "You couldn't show them your other listings. They went to a competitor agent who had everything on his phone.", lostAmount: 'Lost: the entire client relationship' },
  { icon: '🔄', pain: 'You showed the same property to 2 different buyers at the same time.', consequence: 'One buyer got angry and felt cheated. Word spread. You lost trust in your area.', lostAmount: 'Lost: reputation + future referrals' },
  { icon: '🧾', pain: 'Client claims you never showed the property. No proof of visit.', consequence: 'Deal closed through another agent. You did all the work but have no record to prove it.', lostAmount: 'Lost: ~PKR 4,00,000 commission' },
  { icon: '🏚️', pain: 'You pitched a property to a buyer — but it was already sold 2 weeks ago.', consequence: 'You looked unprofessional. The buyer stopped trusting your inventory.', lostAmount: 'Lost: the buyer permanently' },
];

const FEATURES = [
  { icon: '🧠', title: 'AI Match Engine', without: 'Without this, you manually remember which property fits which buyer. You forget. You lose deals.', withDG: 'DealGuru instantly scores every property against buyer requirements. 96% match? You call the client in 10 seconds.', color: '#A855F7' },
  { icon: '🔍', title: 'Deep Property Search', without: 'Without this, searching your 200+ listings means scrolling through WhatsApp groups or a messy Excel sheet.', withDG: '"3-bed, DHA Phase 5, under 4 Cr, corner plot" — found in 0.3 seconds. Every time.', color: '#6366F1' },
  { icon: '📊', title: 'Deal Pipeline', without: 'Without this, you have no idea which deals are at what stage. You forget to follow up. Deals die silently.', withDG: 'Visual Kanban board: Lead → Viewing → Offer → Token → Closed. Nothing falls through the cracks.', color: '#EC4899' },
  { icon: '💰', title: 'Commission Tracker', without: 'Without this, you guess your commission. The agency calculates differently. You never know your real take-home.', withDG: 'Auto-split: Agency 60%, You 35%, Referral 5%. Know your exact PKR before the deal closes.', color: '#F59E0B' },
  { icon: '📴', title: 'Offline Mode', without: 'Without this, no internet = no access to your inventory. Clients walk away at the site visit.', withDG: 'Your entire inventory lives on your phone. Search, add, share — even in a basement with zero signal.', color: '#10B981' },
  { icon: '📅', title: 'Visit & Follow-up Tracker', without: "Without this, you promise to call back and forget. The client assumes you don't care. They switch agents.", withDG: 'Every visit logged. Every follow-up scheduled. Automated reminders. Clients feel valued. They stay.', color: '#0EA5E9' },
];

const TESTIMONIALS = [
  { quote: "A buyer called. I typed '3-bed DHA-5' and had 4 matches before he finished his sentence. He said 'you are the fastest agent I have ever talked to.' I closed that deal the same week.", name: 'Hassan Raza', role: 'DHA Broker, Lahore', result: 'Closed PKR 3.8 Cr deal in 6 days', emoji: '⚡' },
  { quote: "I used to lose 2-3 deals every month because I forgot to follow up. DealGuru reminds me of everything. Last month I closed 7 deals. My personal record.", name: 'Zoya Malik', role: 'Senior Agent, Elite Spaces', result: '7 deals closed in one month (personal best)', emoji: '📈' },
  { quote: "My agency owner was taking 70% commission and I had no proof. Now DealGuru calculates everything transparently. I showed him the screen. Now I get 40%. That extra 5% is PKR 2 Lac per deal.", name: 'Kamran Bhatti', role: 'Independent Broker, Karachi', result: 'Earned PKR 2 Lac more per deal', emoji: '💰' },
];

const FAQ_DATA = [
  { q: "What if I'm not tech-savvy? Is this complicated?", a: "If you can use WhatsApp, you can use DealGuru. We designed it specifically for agents who hate complicated apps. Add a property in 60 seconds. Search in 1 tap. Share via WhatsApp with 1 button. Over 80% of our agents are 35+ and had never used a CRM before." },
  { q: 'How is this different from just using WhatsApp and Excel?', a: "WhatsApp is for chatting, not for running a business. Can WhatsApp score-match a buyer to 200 properties in 0.3 seconds? Can Excel remind you to follow up with a client? Can either work when you have no internet? DealGuru replaces the chaos with a system that actually makes you money." },
  { q: 'What happens to my data if I cancel?', a: "Your data is yours. You can export everything (properties, contacts, deals) as Excel/CSV anytime. We'll never hold your data hostage. But honestly? Nobody cancels after the first week." },
  { q: 'Can my agency see my personal client list?', a: "No. Your contacts are YOUR contacts. Agency admins can see deal pipeline and commission data, but your personal client relationships are private. We built this for agents, not for agencies to spy on you." },
  { q: 'Is it really free for 30 days? What is the catch?', a: "No catch. Full access to every feature for 30 days. No credit card required. After that, you get 50% off for your first 6 months. We do this because we know that once you use the matching engine to close one deal, the app pays for itself 10x over." },
];

// ─── Dark Psychology: Activity Feed Data ─────────────────────────────────────
const ACTIVITY_FEED = [
  { name: 'Usman A.', city: 'Lahore', action: 'just ordered Solo Broker plan', time: '2 min ago', initials: 'UA' },
  { name: 'Fatima K.', city: 'Karachi', action: 'closed a PKR 4.2 Cr deal using DealGuru', time: '5 min ago', initials: 'FK' },
  { name: 'Ali H.', city: 'Islamabad', action: 'matched 5 properties in 0.3 seconds', time: '8 min ago', initials: 'AH' },
  { name: 'Sara M.', city: 'Lahore', action: 'just started her 30-day free trial', time: '11 min ago', initials: 'SM' },
  { name: 'Bilal R.', city: 'Faisalabad', action: 'upgraded to Agency Admin plan', time: '14 min ago', initials: 'BR' },
  { name: 'Ayesha G.', city: 'Rawalpindi', action: 'closed 3 deals this week with DealGuru', time: '18 min ago', initials: 'AG' },
  { name: 'Kamran S.', city: 'Multan', action: 'just ordered Solo Broker plan', time: '22 min ago', initials: 'KS' },
  { name: 'Nadia P.', city: 'Peshawar', action: 'earned PKR 3.5 Lac commission today', time: '25 min ago', initials: 'NP' },
  { name: 'Zain Q.', city: 'Sialkot', action: 'just started his 30-day free trial', time: '29 min ago', initials: 'ZQ' },
  { name: 'Hira B.', city: 'Gujranwala', action: 'matched buyer to perfect property in 0.2s', time: '33 min ago', initials: 'HB' },
];

// ─── State ──────────────────────────────────────────────────────────────────
let dbPackages = [];
let paymentConfig = null;
let pricingPeriod = 'yearly';
let activeShowcaseTab = 'matching';
let exitPopupShown = false;
let toastIndex = 0;

let wizState = {
  planKey: 'broker', step: 0, period: 'monthly', method: 'jazzcash',
  name: '', email: '', whatsapp: '', cnic: '', city: '', country: 'Pakistan', address: '',
  screenshot: null, screenshotFile: null, errors: {}, submitting: false,
};
let submittedOrderNumber = '';  // Stores order_number after successful submission
let complaintSubmitting = false;

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initTicker();
  initPainPoints();
  initFeatures();
  initShowcase();
  initTestimonials();
  initFAQ();
  initScrollReveal();
  initScrollProgress();
  initNavScroll();
  initCountdown();
  initParticles();
  initActivityToast();
  initExitIntent();
  initStickyCta();
  await fetchPackages();
  await fetchPaymentConfig();
  renderPricing();
});

async function fetchPackages() {
  try {
    const { data } = await sb.from('packages').select('*').order('price_pkr', { ascending: true });
    if (data) dbPackages = data;
  } catch (e) { console.warn('Packages fetch (RLS may block):', e.message); }
}

async function fetchPaymentConfig() {
  try {
    const { data } = await sb.from('payment_config')
      .select('jazzcash_number,jazzcash_name,easypaysa_number,easypaysa_name,bank_name,bank_account_number,bank_account_title,bank_iban')
      .limit(1).maybeSingle();
    paymentConfig = data;
  } catch (e) { console.warn('Config fetch (RLS may block):', e.message); }
  if (!paymentConfig) {
    paymentConfig = { jazzcash_number: 'Contact admin', jazzcash_name: 'DealGuru Technologies', easypaysa_number: 'Contact admin', easypaysa_name: 'DealGuru Technologies', bank_name: 'Contact admin', bank_account_number: 'Contact admin', bank_account_title: 'DealGuru Technologies', bank_iban: 'Contact admin' };
  }
}

// ─── Pricing Helpers ────────────────────────────────────────────────────────
function getDbPkg(key) {
  return dbPackages.find(p => { if (key === 'agency_admin') return p.name.toLowerCase().includes('agency'); return p.name.toLowerCase().includes('broker'); });
}

function calcPricing(key, period) {
  const plan = PLANS[key]; const pkg = getDbPkg(key);
  if (!pkg) { const b = period === 'yearly' ? plan.yearly : plan.monthly; return { original: b, final: b, savings: 0, discountPct: 0, yearlyDiscountPct: 0, hasDiscount: false, perMonth: b, trialDays: 0, dailyCost: Math.round(b / 30) }; }
  const base = Number(pkg.price_pkr) || 0;
  const promoPct = (pkg.discount_active && pkg.discount_percentage) ? Number(pkg.discount_percentage) : 0;
  const yearlyPct = Number(pkg.yearly_discount_percentage) || 0;
  const trialDays = Number(pkg.trial_days) || 0;
  let orig = base, fin = base;
  if (promoPct > 0) fin = base * (1 - promoPct / 100);
  if (period === 'yearly') { orig = base * 12; fin = fin * 12 * (1 - yearlyPct / 100); }
  const sv = Math.round(orig - fin); const pct = orig > 0 ? Math.round((1 - fin / orig) * 100) : 0;
  const pm = period === 'yearly' ? Math.round(fin / 12) : Math.round(fin);
  return { original: Math.round(orig), final: Math.round(fin), savings: sv, discountPct: pct, yearlyDiscountPct: yearlyPct, hasDiscount: sv > 0, perMonth: pm, trialDays, dailyCost: Math.round(pm / 30), promoActive: promoPct > 0, promoPct };
}

// ─── Scroll Reveal (Intersection Observer) ──────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

// ─── Scroll Progress Bar ────────────────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    bar.style.width = percent + '%';
  });
}

// ─── Navbar Scroll Behavior ─────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// ─── Countdown Timer (Dark Psychology: Urgency) ─────────────────────────────
function initCountdown() {
  // Set deadline to 3 days from now (resets each visit — urgency illusion)
  const stored = localStorage.getItem('dg_countdown_end');
  let endTime;
  if (stored && Number(stored) > Date.now()) {
    endTime = Number(stored);
  } else {
    endTime = Date.now() + (3 * 24 * 60 * 60 * 1000); // 3 days
    localStorage.setItem('dg_countdown_end', endTime);
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, endTime - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    // Hero countdown
    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');
    if (cdDays) cdDays.textContent = pad(days);
    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMins) cdMins.textContent = pad(mins);
    if (cdSecs) cdSecs.textContent = pad(secs);
    // Final CTA countdown
    const cdDays2 = document.getElementById('cdDays2');
    const cdHours2 = document.getElementById('cdHours2');
    const cdMins2 = document.getElementById('cdMins2');
    const cdSecs2 = document.getElementById('cdSecs2');
    if (cdDays2) cdDays2.textContent = pad(days);
    if (cdHours2) cdHours2.textContent = pad(hours);
    if (cdMins2) cdMins2.textContent = pad(mins);
    if (cdSecs2) cdSecs2.textContent = pad(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ─── Particle Canvas Background ─────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 50;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.3 + 0.1,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ─── Activity Toast Notifications (Dark Psychology: FOMO) ───────────────────
function initActivityToast() {
  // Show first toast after 8 seconds, then every 15-25 seconds
  setTimeout(showNextToast, 8000);
}

function showNextToast() {
  const activity = ACTIVITY_FEED[toastIndex % ACTIVITY_FEED.length];
  const toast = document.getElementById('activityToast');
  const avatar = document.getElementById('toastAvatar');
  const message = document.getElementById('toastMessage');
  const time = document.getElementById('toastTime');

  avatar.textContent = activity.initials;
  message.innerHTML = `<strong>${activity.name}</strong> from ${activity.city} ${activity.action}`;
  time.textContent = activity.time;

  toast.style.display = 'flex';
  toast.classList.remove('toast-exit');
  toast.classList.add('toast-enter');

  toastIndex++;

  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-exit');
    setTimeout(() => { toast.style.display = 'none'; }, 400);
  }, 5000);

  // Schedule next toast
  const delay = 15000 + Math.random() * 10000; // 15-25 seconds
  setTimeout(showNextToast, delay);
}

function hideToast() {
  const toast = document.getElementById('activityToast');
  toast.classList.remove('toast-enter');
  toast.classList.add('toast-exit');
  setTimeout(() => { toast.style.display = 'none'; }, 400);
}

// ─── Exit Intent Popup (Dark Psychology: Loss Aversion) ─────────────────────
function initExitIntent() {
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 5 && !exitPopupShown) {
      exitPopupShown = true;
      document.getElementById('exitPopup').style.display = 'flex';
    }
  });

  // For mobile: trigger on back button / scroll up fast
  let lastScrollY = 0;
  let scrollUpCount = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY < lastScrollY - 100) {
      scrollUpCount++;
      if (scrollUpCount > 3 && !exitPopupShown && window.scrollY > 500) {
        exitPopupShown = true;
        document.getElementById('exitPopup').style.display = 'flex';
      }
    } else {
      scrollUpCount = 0;
    }
    lastScrollY = window.scrollY;
  });
}

function closeExitPopup() {
  document.getElementById('exitPopup').style.display = 'none';
}

// ─── Sticky Bottom CTA (Dark Psychology: Constant Conversion Pressure) ──────
function initStickyCta() {
  const stickyCta = document.getElementById('stickyCta');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
      stickyCta.style.display = 'block';
    } else {
      stickyCta.style.display = 'none';
    }
  });
}

// ─── Pain Points ────────────────────────────────────────────────────────────
function initPainPoints() {
  const g = document.getElementById('painGrid');
  g.innerHTML = PAIN_POINTS.map(p => `
    <div class="pain-card reveal">
      <div class="pain-emoji">${p.icon}</div>
      <div class="pain-desc">${p.pain}</div>
      <div class="pain-arrow">↓ What happened</div>
      <div class="pain-consequence">${p.consequence}</div>
      <div class="pain-lost-badge"><span class="pain-lost-text">${p.lostAmount}</span></div>
    </div>
  `).join('');
}

// ─── Features (Before vs After) ─────────────────────────────────────────────
function initFeatures() {
  const g = document.getElementById('featureGrid');
  g.innerHTML = FEATURES.map(f => `
    <div class="feature-card reveal">
      <div class="feature-card-header">
        <div class="feature-icon-box" style="background:${f.color}12;border-color:${f.color}25;"><span>${f.icon}</span></div>
        <div class="feature-card-title">${f.title}</div>
      </div>
      <div class="feature-without-box">
        <div class="feature-without-label">❌ WITHOUT DealGuru</div>
        <div class="feature-without-text">${f.without}</div>
      </div>
      <div class="feature-with-box">
        <div class="feature-with-label">✅ WITH DealGuru</div>
        <div class="feature-with-text">${f.withDG}</div>
      </div>
    </div>
  `).join('');
}

// ─── Interactive Showcase ───────────────────────────────────────────────────
function switchTab(tab) {
  activeShowcaseTab = tab;
  document.querySelectorAll('.showcase-tab').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  initShowcase();
}

function initShowcase() {
  const el = document.getElementById('showcasePreview');
  if (activeShowcaseTab === 'matching') {
    el.innerHTML = `
      <div class="showcase-header"><span class="showcase-header-title">AI Match Engine</span><div class="live-badge"><div class="live-dot"></div><span class="live-text">Live</span></div></div>
      <div class="match-buyer-box">
        <div class="match-buyer-label">📞 Buyer call just came in:</div>
        <div class="match-buyer-quote">"I need a 3-bed DD in DHA Phase 5, under 4 Crore, corner preferred"</div>
        <div class="match-chip-row">
          <span class="match-chip">DHA Phase 5</span><span class="match-chip">3-Bed DD</span><span class="match-chip">120 SqYd</span><span class="match-chip">Budget: 4 Cr</span>
          <span class="match-chip" style="border-color:rgba(245,158,11,0.25);color:#F59E0B;">Corner ★</span>
        </div>
      </div>
      <div class="match-timer-row">
        <span class="match-timer-label">⚡ Results in</span>
        <span class="match-timer-badge"><span class="match-timer-value">0.3s</span></span>
        <span class="match-timer-compare">vs 15+ minutes scrolling WhatsApp</span>
      </div>
      ${[
        { score: 96, tier: 'PERFECT', color: '#10B981', property: 'DHA Ph-5, Block J, 120 SqYd, 3-Bed DD, Corner', price: '3.8 Cr', tags: '✅ Location ✅ Size ✅ Beds ✅ Budget ✅ Corner' },
        { score: 82, tier: 'GOOD', color: '#F59E0B', property: 'DHA Ph-5, Block D, 150 SqYd, 3-Bed DD', price: '4.5 Cr', tags: '✅ Location ✅ Beds ⚠️ Over Budget +12%' },
        { score: 61, tier: 'MAYBE', color: '#F97316', property: 'Zamzama, 100 SqYd, 2-Bed DD', price: '3.2 Cr', tags: '⚠️ Different area ❌ Fewer beds ❌ Not corner' },
      ].map(m => `
        <div class="match-result-card">
          <div>
            <div class="match-score-circle" style="border-color:${m.color};">
              <span class="match-score-text" style="color:${m.color};">${m.score}%</span>
              <span class="match-tier-text" style="color:${m.color};">${m.tier}</span>
            </div>
          </div>
          <div>
            <div class="match-property-title">${m.property}</div>
            <div class="match-property-price" style="color:${m.color};">PKR ${m.price}</div>
            <div class="match-property-tags">${m.tags}</div>
          </div>
        </div>
      `).join('')}
      <div class="match-callout"><div class="match-callout-text">💡 Without DealGuru, this agent would have said "let me check and call you back." The buyer would have called 3 other agents by then.</div></div>
    `;
  } else if (activeShowcaseTab === 'pipeline') {
    el.innerHTML = `
      <div class="showcase-header"><span class="showcase-header-title">Deal Pipeline</span><div class="live-badge"><div class="live-dot"></div><span class="live-text">Live</span></div></div>
      <div class="pipeline-row">
        ${[
          { stage: 'Lead', emoji: '📥', count: 3, color: '#6366F1', client: 'Usman Ali', property: '5 Marla, DHA Ph-6', value: '1.2 Cr', days: '2d' },
          { stage: 'Viewing', emoji: '👁️', count: 2, color: '#F59E0B', client: 'Sara Ahmed', property: '1 Kanal, Bahria', value: '5.5 Cr', days: '5d' },
          { stage: 'Offer', emoji: '📝', count: 1, color: '#EC4899', client: 'Kamran Shah', property: '10 Marla Corner', value: '3.8 Cr', days: '8d' },
          { stage: 'Closed', emoji: '🎉', count: 4, color: '#10B981', client: 'Ayesha Gul', property: 'Penthouse, Clifton', value: '12.5 Cr', days: '✓' },
        ].map(c => `
          <div>
            <div class="pipeline-col-header" style="border-bottom-color:${c.color};">
              <span>${c.emoji} ${c.stage}</span>
              <span class="pipeline-count-badge" style="background:${c.color}20;color:${c.color};">${c.count}</span>
            </div>
            <div class="mock-deal-card" style="border-left-color:${c.color};">
              <div class="mock-deal-client">${c.client}</div>
              <div class="mock-deal-property">${c.property}</div>
              <div class="mock-deal-footer"><span class="mock-deal-value">PKR ${c.value}</span><span style="color:${c.color};">${c.days}</span></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="match-callout"><div class="match-callout-text">💡 Without a pipeline, these 10 deals would be "somewhere in your head." You would forget to follow up on at least 3 of them.</div></div>
    `;
  } else {
    el.innerHTML = `
      <div class="showcase-header"><span class="showcase-header-title">Commission Calculator</span><div class="live-badge"><div class="live-dot"></div><span class="live-text">Live</span></div></div>
      <div class="commission-deal-header">
        <div class="commission-deal-title">Deal: 1 Kanal House, DHA Phase 5</div>
        <div class="commission-deal-value">PKR 5,00,00,000</div>
      </div>
      <div class="commission-row"><span class="commission-label">Total Commission (2%)</span><span class="commission-amount">PKR 10,00,000</span></div>
      ${[
        { label: 'Agency Share (60%)', value: '6,00,000', color: '#6366F1', width: '60%' },
        { label: 'YOUR Take-Home (35%)', value: '3,50,000', color: '#10B981', width: '35%', highlight: true },
        { label: 'Referral Fee (5%)', value: '50,000', color: '#F59E0B', width: '5%' },
      ].map(s => `
        <div class="commission-split ${s.highlight ? 'highlight' : ''}">
          <div class="commission-bar" style="background:${s.color};width:${s.width};"></div>
          <div class="commission-split-label" ${s.highlight ? 'style="color:#F8FAFC;"' : ''}>${s.label}</div>
          <div class="commission-split-value" style="color:${s.color};">PKR ${s.value}</div>
        </div>
      `).join('')}
      <div class="match-callout"><div class="match-callout-text">💡 Without DealGuru, you would guess your commission. Or worse — accept whatever the agency tells you. Know your numbers before the deal closes.</div></div>
    `;
  }
}

// ─── Testimonials ───────────────────────────────────────────────────────────
function initTestimonials() {
  const g = document.getElementById('testimonialsGrid');
  g.innerHTML = TESTIMONIALS.map(t => {
    const initials = t.name.split(' ').map(n => n[0]).join('');
    return `
      <div class="testimonial-card reveal">
        <div class="stars-row">★★★★★</div>
        <div class="quote-text">"${t.quote}"</div>
        <div class="testimonial-result-badge"><span class="emoji">${t.emoji}</span><span class="result-text">${t.result}</span></div>
        <div class="quote-author-row">
          <div class="testimonial-avatar">${initials}</div>
          <div><div class="quote-author-name">${t.name}</div><div class="quote-author-role">${t.role}</div></div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Ticker ─────────────────────────────────────────────────────────────────
function initTicker() {
  const items = [
    '🎉 Broker in Lahore just closed a 1 Kanal deal — 2 min ago',
    '🧠 Agent matched 3 properties for a buyer in DHA Ph-6 — 5 min ago',
    '🚀 New agent from Islamabad joined DealGuru — 8 min ago',
    '💰 Commission of PKR 4.2 Lac auto-calculated — 12 min ago',
    '⚡ Agent found perfect match in 0.3 seconds — 15 min ago',
    '🔥 3 new agents signed up in the last hour',
    '📊 Agent in Karachi tracked 12 deals in pipeline today',
  ];
  let idx = 0; const el = document.getElementById('tickerText');
  el.textContent = items[0];
  setInterval(() => { el.style.opacity = 0; setTimeout(() => { idx = (idx + 1) % items.length; el.textContent = items[idx]; el.style.opacity = 1; }, 400); }, 3500);
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function initFAQ() {
  const list = document.getElementById('faqList');
  list.innerHTML = FAQ_DATA.map((item, i) => `
    <div class="faq-item reveal" id="faqItem${i}">
      <button class="faq-q" onclick="toggleFaq(${i})">${item.q}<span class="faq-toggle">+</span></button>
      <div class="faq-a" id="faqA${i}">${item.a}</div>
    </div>
  `).join('');
}
function toggleFaq(i) {
  const item = document.getElementById(`faqItem${i}`);
  const a = document.getElementById(`faqA${i}`);
  const isOpen = a.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) { a.classList.add('open'); item.classList.add('open'); }
}

// ─── Pricing ────────────────────────────────────────────────────────────────
function setPricingPeriod(p) {
  pricingPeriod = p;
  document.getElementById('toggleMonthly').classList.toggle('active', p === 'monthly');
  document.getElementById('toggleYearly').classList.toggle('active', p === 'yearly');
  renderPricing();
}

function renderPricing() {
  const solo = calcPricing('broker', pricingPeriod);
  const agency = calcPricing('agency_admin', pricingPeriod);
  const soloPkg = getDbPkg('broker'); const agencyPkg = getDbPkg('agency_admin');

  // Update save badge
  const saveBadgeEl = document.getElementById('saveBadge');
  if (solo.yearlyDiscountPct > 0) { saveBadgeEl.textContent = `Save ${solo.yearlyDiscountPct}%`; saveBadgeEl.style.display = 'inline-block'; }
  else { saveBadgeEl.style.display = 'none'; }

  const grid = document.getElementById('pricingGrid');
  grid.innerHTML = `
    <!-- Solo Broker -->
    <div class="price-card reveal">
      <div>
        ${solo.promoActive ? `<span class="discount-badge">🔥 ${solo.promoPct}% OFF</span>` : ''}
        ${solo.trialDays > 0 ? `<span class="trial-badge">🎁 ${solo.trialDays}-Day Free Trial</span>` : ''}
      </div>
      <div class="price-name">${soloPkg?.name || 'Solo Broker'}</div>
      ${solo.hasDiscount ? `<div class="price-original-row"><span class="price-original">PKR ${solo.original.toLocaleString()}</span>${solo.promoActive ? `<span class="discount-chip">${solo.promoPct}% OFF</span>` : ''}${pricingPeriod === 'yearly' && solo.yearlyDiscountPct > 0 ? `<span class="discount-chip" style="margin-left:4px;">+${solo.yearlyDiscountPct}% YEARLY</span>` : ''}</div>` : ''}
      <div class="price-amount"><span class="currency">PKR</span>${solo.final.toLocaleString()}<span class="period">/${pricingPeriod === 'yearly' ? 'yr' : 'mo'}</span></div>
      <div class="pricing-roi">= PKR ${solo.dailyCost.toLocaleString()}/day — less than a chai ☕</div>
      ${solo.trialDays > 0 ? `<div class="pricing-trial-note">First ${solo.trialDays} days completely FREE</div>` : ''}
      <ul class="price-features">
        ${(soloPkg?.features || PLANS.broker.features).map(f => `<li><span class="check">✓</span>${f}</li>`).join('')}
      </ul>
      <button class="pricing-btn default" onclick="openOrderWizard('broker')">Get Started — Order Now</button>
    </div>

    <!-- Agency Admin -->
    <div class="price-card popular reveal">
      <div class="popular-badge">BEST VALUE</div>
      <div>
        ${agency.promoActive ? `<span class="discount-badge" style="background:linear-gradient(135deg,#A855F7,#6366F1);">🔥 ${agency.promoPct}% OFF</span>` : ''}
        ${agency.trialDays > 0 ? `<span class="trial-badge">🎁 ${agency.trialDays}-Day Free Trial</span>` : ''}
      </div>
      <div class="price-name" style="color:#A78BFA;">${agencyPkg?.name || 'Agency Admin'}</div>
      ${agency.hasDiscount ? `<div class="price-original-row"><span class="price-original">PKR ${agency.original.toLocaleString()}</span>${agency.promoActive ? `<span class="discount-chip" style="background:rgba(168,85,247,0.12);color:#A78BFA;">${agency.promoPct}% OFF</span>` : ''}${pricingPeriod === 'yearly' && agency.yearlyDiscountPct > 0 ? `<span class="discount-chip" style="background:rgba(168,85,247,0.12);color:#A78BFA;margin-left:4px;">+${agency.yearlyDiscountPct}% YEARLY</span>` : ''}</div>` : ''}
      <div class="price-amount"><span class="currency">PKR</span>${agency.final.toLocaleString()}<span class="period">/${pricingPeriod === 'yearly' ? 'yr' : 'mo'}</span></div>
      <div class="pricing-roi">= PKR ${Math.round(agency.perMonth / 10).toLocaleString()}/agent/mo for a 10-agent team</div>
      ${agency.trialDays > 0 ? `<div class="pricing-trial-note">First ${agency.trialDays} days completely FREE</div>` : ''}
      <ul class="price-features">
        ${(agencyPkg?.features || PLANS.agency_admin.features).map(f => `<li><span class="check" style="color:#A78BFA;">✓</span>${f}</li>`).join('')}
      </ul>
      <button class="pricing-btn gradient" onclick="openOrderWizard('agency_admin')">Order Agency Plan</button>
    </div>

    <!-- Enterprise -->
    <div class="price-card reveal">
      <div class="price-name">Enterprise</div>
      <div class="price-amount">Custom</div>
      <div class="pricing-roi">For large brokerages with 20+ agents</div>
      <ul class="price-features">
        ${['Everything in Agency Admin','Unlimited agents','Multi-branch support','Custom integrations','Dedicated account manager','SLA guarantees','On-premise option'].map(f => `<li><span class="check">✓</span>${f}</li>`).join('')}
      </ul>
      <button class="pricing-btn outline" onclick="window.open('https://wa.me/923000000000?text=${encodeURIComponent("Hello DealGuru Team! I am interested in the Enterprise Plan.")}','_blank')">💬 Contact Our Team</button>
    </div>
  `;

  // Re-observe new reveal elements
  initScrollReveal();
}

// ─── Nav Helpers ─────────────────────────────────────────────────────────────
function toggleMobileNav() { document.getElementById('navLinks').classList.toggle('open'); }
function showLanding() { document.getElementById('landingPage').style.display = 'block'; document.getElementById('orderWizard').style.display = 'none'; }

// ═══ ORDER WIZARD (same as before — kept intact) ═══════════════════════════
function openOrderWizard(planKey) {
  wizState = { planKey: planKey || 'broker', step: 0, period: 'monthly', method: 'jazzcash', name: '', email: '', whatsapp: '', cnic: '', city: '', country: 'Pakistan', address: '', screenshot: null, screenshotFile: null, errors: {}, submitting: false };
  document.getElementById('orderWizard').style.display = 'flex';
  renderWizard();
}
function closeOrderWizard() { document.getElementById('orderWizard').style.display = 'none'; }
function renderWizard() { renderStepper(); renderWizardBody(); renderWizardNav(); }

function renderStepper() {
  document.getElementById('wizardStepper').innerHTML = STEPS.map((s, i) => {
    const done = i < wizState.step, active = i === wizState.step;
    return `<div class="step-item"><div class="step-circle ${done ? 'done' : ''} ${active ? 'active' : ''}">${done ? '✓' : s.icon}</div><div class="step-label ${active ? 'active' : ''}">${s.label}</div></div>${i < STEPS.length - 1 ? `<div class="step-line ${done ? 'done' : ''}"></div>` : ''}`;
  }).join('');
}

function renderWizardBody() {
  const el = document.getElementById('wizardBody');
  switch (wizState.step) { case 0: el.innerHTML = renderStep0(); break; case 1: el.innerHTML = renderStep1(); break; case 2: el.innerHTML = renderStep2(); break; case 3: el.innerHTML = renderStep3(); break; case 4: el.innerHTML = renderStep4(); break; }
}

function renderStep0() {
  const plan = PLANS[wizState.planKey]; const pricing = calcPricing(wizState.planKey, wizState.period); const pkg = getDbPkg(wizState.planKey);
  const name = pkg?.name || plan.name; const features = pkg?.features || plan.features;
  return `<div class="wiz-plan-card ${wizState.planKey === 'agency_admin' ? 'agency' : ''}">${pricing.hasDiscount ? `<div class="discount-badge-abs">🔥 ${pricing.discountPct}% OFF</div>` : ''}${pricing.trialDays > 0 ? `<div class="trial-badge-inline">🎁 ${pricing.trialDays}-Day Free Trial</div>` : ''}<div class="wiz-plan-emoji">${plan.emoji}</div><div class="wiz-plan-name">${name}</div><div class="wiz-plan-tagline">${pkg?.description || plan.tagline}</div><div class="wiz-period-toggle"><button class="wiz-period-btn ${wizState.period === 'monthly' ? 'active' : ''}" onclick="setWizPeriod('monthly')">Monthly</button><button class="wiz-period-btn ${wizState.period === 'yearly' ? 'active' : ''}" onclick="setWizPeriod('yearly')">🏷️ Yearly${pricing.yearlyDiscountPct > 0 ? ` −${pricing.yearlyDiscountPct}%` : ''}</button></div>${pricing.hasDiscount ? `<div class="wiz-original-price">Regular price: PKR ${pricing.original.toLocaleString()}</div>` : ''}<div class="wiz-price-row"><span class="wiz-price-currency">PKR</span><span class="wiz-price-amount">${pricing.final.toLocaleString()}</span><span class="wiz-price-period">/${wizState.period === 'yearly' ? 'yr' : 'mo'}</span></div>${wizState.period === 'yearly' ? `<div class="wiz-per-month">That's just PKR ${pricing.perMonth.toLocaleString()}/month</div>` : ''}${pricing.hasDiscount && pricing.savings > 0 ? `<div class="wiz-savings-banner">✨ You save PKR ${pricing.savings.toLocaleString()}${wizState.period === 'yearly' ? ' per year' : ''}</div>` : ''}<div class="wiz-divider"></div>${features.map(f => `<div class="wiz-feature">${f}</div>`).join('')}</div><div class="wiz-plan-switcher"><div class="wiz-switcher-label">Switch Plan</div><div class="wiz-switcher-row"><button class="wiz-switcher-btn ${wizState.planKey === 'broker' ? 'active' : ''}" onclick="setWizPlan('broker')">🏠 Solo Broker</button><button class="wiz-switcher-btn ${wizState.planKey === 'agency_admin' ? 'active' : ''}" onclick="setWizPlan('agency_admin')">🏢 Agency Admin</button></div></div><div class="wiz-notice"><span class="icon">💡</span><span class="text">You will pay manually via JazzCash, EasyPaisa, or Bank Transfer and upload a screenshot for admin verification.</span></div>`;
}

function renderStep1() { const e = wizState.errors; return `<h3 class="wiz-heading">Your Details</h3><p class="wiz-sub">We use this info to verify your identity and notify you via WhatsApp after approval.</p><div><label class="wiz-label">Full Name <span class="req">*</span></label><input class="wiz-input ${e.name?'error':''}" value="${esc(wizState.name)}" placeholder="e.g. Ali Hassan Khan" oninput="wizState.name=this.value" />${e.name?`<div class="wiz-error">⚠ ${e.name}</div>`:''}<label class="wiz-label">Email Address <span class="req">*</span></label><input class="wiz-input ${e.email?'error':''}" type="email" value="${esc(wizState.email)}" placeholder="your@email.com" oninput="wizState.email=this.value" />${e.email?`<div class="wiz-error">⚠ ${e.email}</div>`:''}<label class="wiz-label">WhatsApp Number <span class="req">*</span></label><input class="wiz-input ${e.whatsapp?'error':''}" value="${esc(wizState.whatsapp)}" placeholder="03XX-XXXXXXX" oninput="wizState.whatsapp=this.value" />${e.whatsapp?`<div class="wiz-error">⚠ ${e.whatsapp}</div>`:''}<label class="wiz-label">CNIC</label><input class="wiz-input" value="${esc(wizState.cnic)}" placeholder="00000-0000000-0" oninput="wizState.cnic=this.value" /><div style="font-size:0.78rem;color:#64748B;margin-top:-12px;margin-bottom:12px;">Recommended for identity verification</div><label class="wiz-label">City <span class="req">*</span></label><input class="wiz-input ${e.city?'error':''}" value="${esc(wizState.city)}" placeholder="e.g. Lahore, Karachi" oninput="wizState.city=this.value" />${e.city?`<div class="wiz-error">⚠ ${e.city}</div>`:''}<label class="wiz-label">Country <span class="req">*</span></label><div class="wiz-country-row">${COUNTRIES.map(c=>`<button class="wiz-country-chip ${wizState.country===c?'active':''}" onclick="wizState.country='${c}';renderWizard()">${c}</button>`).join('')}</div><label class="wiz-label">Full Address <span class="req">*</span></label><textarea class="wiz-input ${e.address?'error':''}" rows="2" placeholder="Street, Area, City" oninput="wizState.address=this.value">${esc(wizState.address)}</textarea>${e.address?`<div class="wiz-error">⚠ ${e.address}</div>`:''}</div><div style="text-align:center;margin-top:8px;font-size:0.82rem;color:#64748B;">🔒 Stored securely · used only for verification & support</div>`; }

function renderStep2() { const pricing = calcPricing(wizState.planKey, wizState.period); const cfg = paymentConfig || {}; const m = wizState.method; let acct = ''; if (m==='jazzcash') { acct = `<div class="wiz-account-header"><span class="icon">📱</span><span class="title">JazzCash Instructions</span></div><div class="wiz-account-instr">Open JazzCash → Send Money → enter number → transfer PKR ${pricing.final.toLocaleString()}</div>${accountRow('Mobile Number',cfg.jazzcash_number,'jc_num')}${accountRow('Account Name',cfg.jazzcash_name,'jc_name')}`; } else if (m==='easypaysa') { acct = `<div class="wiz-account-header"><span class="icon">💚</span><span class="title">EasyPaisa Instructions</span></div><div class="wiz-account-instr">Open EasyPaisa → Send Money → enter number → transfer PKR ${pricing.final.toLocaleString()}</div>${accountRow('Mobile Number',cfg.easypaysa_number,'ep_num')}${accountRow('Account Name',cfg.easypaysa_name,'ep_name')}`; } else { acct = `<div class="wiz-account-header"><span class="icon">🏦</span><span class="title">Bank Transfer Instructions</span></div><div class="wiz-account-instr">Transfer PKR ${pricing.final.toLocaleString()} to the account below.</div>${accountRow('Bank',cfg.bank_name,'bk_name')}${accountRow('Account Number',cfg.bank_account_number,'bk_acc')}${accountRow('Account Title',cfg.bank_account_title,'bk_title')}${accountRow('IBAN',cfg.bank_iban,'bk_iban')}`; } return `<h3 class="wiz-heading">Payment Method</h3><p class="wiz-sub">Select your payment method, then transfer the exact amount.</p><div class="wiz-fraud-warning"><span class="icon">⚠️</span><span class="text"><strong>Important:</strong> Transfer the <strong>exact</strong> amount shown. Any fraudulent payment is a criminal offence.</span></div><div class="wiz-amount-badge"><span class="wiz-amount-label">Transfer exactly</span><span class="wiz-amount-value">PKR ${pricing.final.toLocaleString()}</span></div><div class="wiz-method-tabs">${METHODS.map(mt=>`<div class="wiz-method-tab ${m===mt.key?'active':''}" onclick="wizState.method='${mt.key}';renderWizard()" style="${m===mt.key?`border-color:${mt.accent};background:${mt.accent}0a`:''}"><div class="method-icon">${mt.icon}</div><div class="method-label" style="${m===mt.key?`color:${mt.accent}`:''}">${mt.label}</div></div>`).join('')}</div><div class="wiz-account-card">${acct}</div>`; }

function renderStep3() { const e = wizState.errors; if (wizState.screenshot) return `<h3 class="wiz-heading">Upload Payment Proof</h3><p class="wiz-sub">Your screenshot is ready.</p><div class="wiz-upload-zone has-file" style="cursor:default;"><img src="${wizState.screenshot}" class="wiz-preview-img" /><div style="margin-top:8px;"><button class="wiz-remove-btn" onclick="wizState.screenshot=null;wizState.screenshotFile=null;renderWizard()">✕ Remove</button></div></div>`; return `<h3 class="wiz-heading">Upload Payment Proof</h3><p class="wiz-sub">Take a clear screenshot of your payment confirmation.</p>${e.screenshot?`<div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.2);border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:0.85rem;color:#EF4444;">📸 ${e.screenshot}</div>`:''}<div class="wiz-upload-zone ${e.screenshot?'error':''}" onclick="document.getElementById('fileInput').click()"><div class="wiz-upload-icon">📸</div><div class="wiz-upload-title">No screenshot yet</div><div class="wiz-upload-sub">JPG · PNG · HEIC · max 10 MB</div><div><button class="wiz-upload-btn" type="button">🖼️ Choose File</button></div></div><input type="file" id="fileInput" accept="image/*" style="display:none" onchange="handleFileSelect(event)" />`; }

function renderStep4() { const plan = PLANS[wizState.planKey]; const pricing = calcPricing(wizState.planKey, wizState.period); const pkg = getDbPkg(wizState.planKey); const methodLabel = METHODS.find(m=>m.key===wizState.method)?.label||wizState.method; return `<h3 class="wiz-heading">Review & Confirm</h3><p class="wiz-sub">Double-check all details before submitting.</p><div class="wiz-review-section"><div class="wiz-review-title">📋 Plan</div><div class="wiz-review-row"><span class="label">Plan</span><span class="value">${plan.emoji} ${pkg?.name||plan.name}</span></div><div class="wiz-review-row"><span class="label">Period</span><span class="value">${wizState.period==='yearly'?'📅 Yearly':'🗓️ Monthly'}</span></div><div class="wiz-review-row"><span class="label">Amount</span><span class="value highlight">PKR ${pricing.final.toLocaleString()}</span></div></div><div class="wiz-review-section"><div class="wiz-review-title">👤 Your Details</div><div class="wiz-review-row"><span class="label">Name</span><span class="value">${esc(wizState.name)||'—'}</span></div><div class="wiz-review-row"><span class="label">Email</span><span class="value">${esc(wizState.email)||'—'}</span></div><div class="wiz-review-row"><span class="label">WhatsApp</span><span class="value">${esc(wizState.whatsapp)||'—'}</span></div><div class="wiz-review-row"><span class="label">City</span><span class="value">${esc(wizState.city)}${wizState.country?', '+wizState.country:''}</span></div></div><div class="wiz-review-section"><div class="wiz-review-title">💳 Payment</div><div class="wiz-review-row"><span class="label">Method</span><span class="value">${methodLabel}</span></div></div><div class="wiz-review-section"><div class="wiz-review-title">📸 Proof</div>${wizState.screenshot?`<img src="${wizState.screenshot}" style="max-height:160px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);" />`:'<div style="color:#F59E0B;">⚠️ No screenshot</div>'}</div><div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-top:8px;"><div style="font-weight:700;margin-bottom:8px;">⚖️ Legal Declaration</div><div style="font-size:0.85rem;color:#94A3B8;line-height:1.6;">By clicking "Submit Order" you declare that the payment screenshot is authentic and all info is accurate. <strong style="color:#F87171;">Fraudulent submissions are criminal offences under PECA 2016.</strong></div></div>`; }

// ─── Helpers ────────────────────────────────────────────────────────────────
function accountRow(l, v, k) { if (!v) return ''; return `<div class="wiz-account-row"><div><div class="wiz-account-label">${l}</div><div class="wiz-account-value">${v}</div></div><button class="wiz-copy-btn" id="copy_${k}" onclick="copyText('${esc(v)}','${k}')">📋 Copy</button></div>`; }
function copyText(t, k) { navigator.clipboard.writeText(t).then(()=>{const b=document.getElementById('copy_'+k);if(b){b.textContent='✓ Copied';b.classList.add('copied');setTimeout(()=>{b.textContent='📋 Copy';b.classList.remove('copied');},2000);}}); }
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function handleFileSelect(e) { const f=e.target.files[0];if(!f)return;wizState.screenshotFile=f;const r=new FileReader();r.onload=ev=>{wizState.screenshot=ev.target.result;wizState.errors.screenshot='';renderWizard();};r.readAsDataURL(f); }
function setWizPeriod(p) { wizState.period = p; renderWizard(); }
function setWizPlan(k) { wizState.planKey = k; renderWizard(); }

function renderWizardNav() {
  const el = document.getElementById('wizardNav'); let html = '';
  if (wizState.step > 0) html += `<button class="btn-back" onclick="wizGoBack()">← Back</button>`;
  if (wizState.step < 4) { const labels = ['Continue — Enter Your Details', 'Continue — Choose Payment', "I've Paid — Upload Screenshot →", 'Review My Order →']; html += `<button class="btn-next" onclick="wizGoNext()">${labels[wizState.step]}</button>`; }
  else html += `<button class="btn-submit" onclick="wizSubmit()" ${!wizState.screenshot||wizState.submitting?'disabled':''}>${wizState.submitting?'Submitting...':'✅ Submit Order'}</button>`;
  el.innerHTML = html;
}
function wizGoBack() { if (wizState.step>0) { wizState.step--; renderWizard(); } }
function wizGoNext() { if (!validateWizStep()) return; wizState.step++; renderWizard(); document.querySelector('.wizard-body').scrollTop=0; }
function validateWizStep() {
  const errors = {};
  if (wizState.step===1) { if(!wizState.name.trim()) errors.name='Required'; if(!wizState.email.trim()) errors.email='Required'; else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wizState.email)) errors.email='Invalid email'; const c=wizState.whatsapp.trim().replace(/[\s\-()]/g,''); if(!wizState.whatsapp.trim()) errors.whatsapp='Required'; else if(!/^\+?[0-9]{10,15}$/.test(c)) errors.whatsapp='Invalid number'; if(!wizState.city.trim()) errors.city='Required'; if(!wizState.address.trim()) errors.address='Required'; }
  if (wizState.step===3 && !wizState.screenshot) errors.screenshot='Payment screenshot is required';
  wizState.errors=errors; if(Object.keys(errors).length>0){renderWizard();return false;} return true;
}

async function wizSubmit() {
  if (!wizState.screenshot||wizState.submitting) return; wizState.submitting=true; renderWizardNav();
  try {
    const pricing=calcPricing(wizState.planKey,wizState.period); const pkg=getDbPkg(wizState.planKey);
    let url='';
    if (wizState.screenshot) {
      // Convert base64 data URL to Blob (fixes ArrayBufferView error)
      const blob = dataURLtoBlob(wizState.screenshot);
      const ext = (wizState.screenshotFile?.name?.split('.').pop() || 'jpg').toLowerCase();
      const fname=`guest/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const {data:up,error:upErr}=await sb.storage.from('payment-screenshots').upload(fname, blob, {contentType: blob.type || 'image/jpeg', upsert:false});
      if(upErr) throw upErr;
      if(up){const{data:u}=sb.storage.from('payment-screenshots').getPublicUrl(fname);url=u?.publicUrl||'';}
    }
    const {data:insertedRows, error}=await sb.from('payments').insert([{profile_id:null,package_id:pkg?.id||null,amount_pkr:pricing.final,status:'pending',payment_method:wizState.method,payment_method_detail:wizState.method,billing_period:wizState.period,screenshot_url:url,customer_name:wizState.name.trim(),customer_email:wizState.email.trim(),customer_whatsapp:wizState.whatsapp.trim(),customer_cnic:wizState.cnic.trim()||null}]).select('order_number');
    if(error) throw error;
    // Store the order number for display
    submittedOrderNumber = insertedRows?.[0]?.order_number || '';
    closeOrderWizard();
    // Update the success modal with order number
    const orderNumEl = document.getElementById('successOrderNumber');
    if (orderNumEl) orderNumEl.textContent = submittedOrderNumber || 'Processing...';
    const orderNumBox = document.getElementById('successOrderBox');
    if (orderNumBox) orderNumBox.style.display = submittedOrderNumber ? 'block' : 'none';
    document.getElementById('successModal').style.display='flex';
  } catch(err) { alert('Submission failed: '+(err.message||'Unknown error')); }
  finally { wizState.submitting=false; renderWizardNav(); }
}

// Convert a base64 data URL string to a Blob
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const isBase64 = parts[0].indexOf('base64') >= 0;
  if (isBase64) {
    const bstr = atob(parts[1]);
    const u8 = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
    return new Blob([u8], { type: mime });
  }
  // Fallback for non-base64 data URLs
  return new Blob([decodeURIComponent(parts[1])], { type: mime });
}
function closeSuccessModal() { document.getElementById('successModal').style.display='none'; }

// ─── Complaint / Contact Form ───────────────────────────────────────────────
function openComplaintForm() {
  document.getElementById('complaintModal').style.display = 'flex';
  // Pre-fill order number if available
  const orderInput = document.getElementById('complaintOrderId');
  if (orderInput && submittedOrderNumber) orderInput.value = submittedOrderNumber;
}
function closeComplaintForm() {
  document.getElementById('complaintModal').style.display = 'none';
}
async function submitComplaint() {
  if (complaintSubmitting) return;
  const name = document.getElementById('complaintName')?.value?.trim() || '';
  const email = document.getElementById('complaintEmail')?.value?.trim() || '';
  const whatsapp = document.getElementById('complaintWhatsapp')?.value?.trim() || '';
  const orderId = document.getElementById('complaintOrderId')?.value?.trim() || '';
  const subject = document.getElementById('complaintSubject')?.value?.trim() || '';
  const message = document.getElementById('complaintMessage')?.value?.trim() || '';

  // Validation
  const errEl = document.getElementById('complaintError');
  if (!name || !message || !subject) {
    errEl.textContent = '⚠ Name, subject, and message are required.';
    errEl.style.display = 'block';
    return;
  }
  if (!email && !whatsapp) {
    errEl.textContent = '⚠ Please provide at least an email or WhatsApp number so we can respond.';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  complaintSubmitting = true;
  const btn = document.getElementById('complaintSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

  try {
    const { error } = await sb.from('support_tickets').insert([{
      profile_id: null,
      subject: subject,
      description: message,
      priority: 'medium',
      status: 'open',
      guest_name: name,
      guest_email: email || null,
      guest_whatsapp: whatsapp || null,
      guest_order_number: orderId || null
    }]);
    if (error) throw error;

    // Show success state
    document.getElementById('complaintFormInner').style.display = 'none';
    document.getElementById('complaintSuccess').style.display = 'block';
  } catch (err) {
    errEl.textContent = '❌ Failed to submit: ' + (err.message || 'Unknown error');
    errEl.style.display = 'block';
  } finally {
    complaintSubmitting = false;
    if (btn) { btn.disabled = false; btn.textContent = '📨 Submit Complaint'; }
  }
}
function closeComplaintSuccess() {
  document.getElementById('complaintFormInner').style.display = 'block';
  document.getElementById('complaintSuccess').style.display = 'none';
  // Clear form
  ['complaintName','complaintEmail','complaintWhatsapp','complaintOrderId','complaintSubject','complaintMessage'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  closeComplaintForm();
}
