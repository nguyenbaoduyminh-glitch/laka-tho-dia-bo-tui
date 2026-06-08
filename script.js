const state = {
  name: localStorage.getItem('laka_name') || '',
  destination: 'Đà Lạt',
  vibe: 'Chill',
  days: 3,
  budget: '3.000.000đ - 5.000.000đ',
  stamps: JSON.parse(localStorage.getItem('laka_stamps') || '[]')
};

const cities = [
  { name: 'Đà Lạt', tag: 'Chill · Cafe · Săn mây', image: 'linear-gradient(135deg,#2d6a4f,#95d5b2)' },
  { name: 'Đà Nẵng', tag: 'Biển · Thành phố · Food', image: 'linear-gradient(135deg,#0077b6,#90e0ef)' },
  { name: 'Hà Nội', tag: 'Văn hóa · Foodie · Nightlife', image: 'linear-gradient(135deg,#7f5539,#ddb892)' },
  { name: 'Phú Quốc', tag: 'Resort · Biển · Premium', image: 'linear-gradient(135deg,#f77f00,#fcbf49)' },
  { name: 'Nha Trang', tag: 'Biển · Đảo · Năng động', image: 'linear-gradient(135deg,#118ab2,#06d6a0)' },
  { name: 'Huế', tag: 'Di sản · Chậm · Ẩm thực', image: 'linear-gradient(135deg,#6a4c93,#c77dff)' }
];

const vibes = [
  { name: 'Chill', desc: 'Lịch trình nhẹ nhàng, cafe đẹp, cảnh chill, ít di chuyển.' },
  { name: 'Foodie', desc: 'Tập trung món ngon địa phương, quán nổi bật và trải nghiệm ẩm thực.' },
  { name: 'Indie', desc: 'Điểm ít đại trà, góc ảnh lạ, trải nghiệm bản địa hơn.' },
  { name: 'Nightlife', desc: 'Nhiều hoạt động buổi tối, bar, phố đi bộ, khu vui chơi.' },
  { name: 'Premium', desc: 'Resort, nhà hàng đẹp, dịch vụ thoải mái, trải nghiệm cao cấp.' }
];

const budgets = [
  { name: 'Tiết kiệm', range: '1.000.000đ - 3.000.000đ' },
  { name: 'Vừa đủ', range: '3.000.000đ - 5.000.000đ' },
  { name: 'Thoải mái', range: '5.000.000đ - 8.000.000đ' },
  { name: 'Premium', range: '8.000.000đ+' }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function goTo(screenId) {
  $$('.screen').forEach(screen => screen.classList.remove('active'));
  $('#' + screenId).classList.add('active');
  $$('.tabbar button').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screenId));
}

function getInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase() || '?';
}

function setName(name) {
  state.name = name.trim() || 'Minh';
  localStorage.setItem('laka_name', state.name);
  $('#displayName').textContent = state.name;
  $('#passportName').textContent = state.name;
  $('#homeAvatar').textContent = getInitial(state.name);
  $('#passportAvatar').textContent = getInitial(state.name);
}

function setGreeting() {
  const hour = new Date().getHours();
  const text = hour < 11 ? 'Chào buổi sáng ☀️' : hour < 18 ? 'Chào buổi chiều 🌤️' : 'Chào buổi tối 🌙';
  $('#greetingText').textContent = text;
}

function renderCities() {
  $('#cityGrid').innerHTML = cities.map(city => `
    <button class="city-card ${city.name === state.destination ? 'active' : ''}" style="background:${city.image}" data-city="${city.name}">
      <b>${city.name}</b><small>${city.tag}</small>
    </button>
  `).join('');
}

function renderVibes() {
  $('#vibeList').innerHTML = vibes.map(vibe => `
    <button class="vibe-card ${vibe.name === state.vibe ? 'active' : ''}" data-vibe="${vibe.name}">
      <b>${vibe.name}</b><small>${vibe.desc}</small>
    </button>
  `).join('');
}

function renderDays() {
  $('#dayRow').innerHTML = [1,2,3,4,5,6,7].map(day => `
    <button class="${day === state.days ? 'active' : ''}" data-day="${day}">${day}</button>
  `).join('');
}

function renderBudgets() {
  $('#budgetGrid').innerHTML = budgets.map(item => `
    <button class="budget-card ${item.range === state.budget ? 'active' : ''}" data-budget="${item.range}">
      <b>${item.name}</b><small>${item.range}</small>
    </button>
  `).join('');
}

function fallbackPlan() {
  const activities = {
    morning: ['Ăn sáng địa phương', 'Tham quan điểm nổi bật', 'Chụp ảnh tại khu trung tâm'],
    afternoon: ['Dùng bữa trưa tại quán được đánh giá tốt', 'Ghé cafe hoặc điểm check-in', 'Khám phá khu văn hóa địa phương'],
    evening: ['Ăn tối đặc sản', 'Dạo phố hoặc chợ đêm', 'Nghỉ ngơi và lưu lại kỷ niệm']
  };

  return Array.from({ length: state.days }, (_, index) => ({
    day: index + 1,
    title: `Ngày ${index + 1} tại ${state.destination}`,
    morning: `${activities.morning[index % activities.morning.length]} ở ${state.destination}`,
    afternoon: `${activities.afternoon[index % activities.afternoon.length]} theo vibe ${state.vibe}`,
    evening: `${activities.evening[index % activities.evening.length]}`,
    estimatedCost: state.budget
  }));
}

function cleanJSON(text) {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

async function generateAIPlan() {
  goTo('screen-loading');
  $('#loadingText').textContent = 'Đang gọi AI để tạo lịch trình preview...';

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: state.destination,
        vibe: state.vibe,
        days: state.days,
        budget: state.budget
      })
    });

    if (!response.ok) throw new Error('API chưa sẵn sàng');
    const data = await response.json();
    const parsed = JSON.parse(cleanJSON(data.result));
    renderResult(parsed);
  } catch (error) {
    console.warn('Dùng dữ liệu demo vì AI API chưa sẵn sàng:', error.message);
    renderResult(fallbackPlan());
  }
}

function renderResult(plan) {
  $('#summaryCard').innerHTML = `
    <h3>${state.destination} · ${state.days} ngày</h3>
    <p>Vibe: ${state.vibe} · Ngân sách: ${state.budget}</p>
  `;

  $('#itineraryList').innerHTML = plan.map(day => `
    <article class="day-card">
      <h3>${day.title || `Ngày ${day.day}`}</h3>
      <p><b>Sáng:</b> ${day.morning}</p>
      <p><b>Chiều:</b> ${day.afternoon}</p>
      <p><b>Tối:</b> ${day.evening}</p>
      <p><b>Chi phí dự kiến:</b> ${day.estimatedCost || state.budget}</p>
    </article>
  `).join('');

  goTo('screen-result');
}

function renderPassport() {
  const stamps = state.stamps.length ? state.stamps : ['Đà Lạt'];
  $('#passportStamps').innerHTML = [
    ...stamps.map(city => `<div class="passport-stamp">✓<br>${city}</div>`),
    '<div class="passport-stamp locked">LOCKED</div>',
    '<div class="passport-stamp locked">LOCKED</div>',
    '<div class="passport-stamp locked">LOCKED</div>'
  ].join('');
}

function finishTrip() {
  if (!state.stamps.includes(state.destination)) {
    state.stamps.push(state.destination);
    localStorage.setItem('laka_stamps', JSON.stringify(state.stamps));
  }
  $('#stampCity').textContent = state.destination.toUpperCase();
  renderPassport();
  goTo('screen-stamp');
}

function bindEvents() {
  $('#userName').addEventListener('input', event => {
    $('#avatarPreview').textContent = getInitial(event.target.value);
  });

  $('#startBtn').addEventListener('click', () => {
    setName($('#userName').value);
    goTo('screen-home');
  });

  $('#newTripBtn').addEventListener('click', () => goTo('screen-plan'));
  $('#toVibeBtn').addEventListener('click', () => {
    const typed = $('#destination').value.trim();
    if (typed) state.destination = typed;
    renderCities();
    goTo('screen-vibe');
  });
  $('#toBudgetBtn').addEventListener('click', () => goTo('screen-budget'));
  $('#generateBtn').addEventListener('click', generateAIPlan);
  $('#finishTripBtn').addEventListener('click', finishTrip);

  document.body.addEventListener('click', event => {
    const navTarget = event.target.closest('[data-screen]');
    if (navTarget) goTo(navTarget.dataset.screen);

    const cityCard = event.target.closest('[data-city]');
    if (cityCard) {
      state.destination = cityCard.dataset.city;
      $('#destination').value = state.destination;
      renderCities();
    }

    const vibeCard = event.target.closest('[data-vibe]');
    if (vibeCard) {
      state.vibe = vibeCard.dataset.vibe;
      renderVibes();
      $$('#quickVibes button').forEach(btn => btn.classList.toggle('active', btn.dataset.vibe === state.vibe));
    }

    const dayBtn = event.target.closest('[data-day]');
    if (dayBtn) {
      state.days = Number(dayBtn.dataset.day);
      renderDays();
    }

    const budgetCard = event.target.closest('[data-budget]');
    if (budgetCard) {
      state.budget = budgetCard.dataset.budget;
      renderBudgets();
    }
  });
}

function init() {
  $('#userName').value = state.name;
  setName(state.name || 'Minh');
  setGreeting();
  renderCities();
  renderVibes();
  renderDays();
  renderBudgets();
  renderPassport();
  bindEvents();
}

init();
