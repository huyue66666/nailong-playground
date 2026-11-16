import './style.css';

const speechBubble = document.querySelector('#speech-bubble');
const nailong = document.querySelector('#nailong');
const moodEmoji = document.querySelector('#mood-emoji');
const moodName = document.querySelector('#mood-name');
const moodCopy = document.querySelector('#mood-copy');
const energyFill = document.querySelector('#energy-fill');
const energyValue = document.querySelector('#energy-value');
const energyGain = document.querySelector('#energy-gain');
const happyCount = document.querySelector('#happy-count');
const toast = document.querySelector('#toast');
const startGameBtn = document.querySelector('#start-game');
const heroPlayBtn = document.querySelector('#hero-play-btn');
const heroTapBtn = document.querySelector('#hero-tap-btn');
const skyBoard = document.querySelector('#sky-board');
const skyIntro = document.querySelector('#sky-intro');
const starTarget = document.querySelector('#star-target');
const scoreEl = document.querySelector('#score');
const timeEl = document.querySelector('#time');
const bestScoreEl = document.querySelector('#best-score');
const quoteText = document.querySelector('#quote-text');
const newQuote = document.querySelector('#new-quote');

let energy = 76;
let taps = 0;
let gameTimer;
let gameActive = false;
let score = 0;
let bestScore = Number(localStorage.getItem('nailong-best-score') || 0);
let quoteIndex = 0;

const interactions = [
  ['🥰', '开心冒泡', '今天的空气里都是甜甜的！', '你一来，奶龙就开心 +1'],
  ['😋', '想吃点点', '奶龙闻到了香香的好心情～', '好吃的要和好朋友分享！'],
  ['🤩', '闪闪发光', '收到你的能量啦，眼睛都亮了！', '这一击，把快乐打包带走！'],
  ['😴', '软软想睡', '玩累了也没关系，抱抱自己吧。', '奶龙建议：休息一下再出发'],
  ['😎', '酷酷出场', '今天的奶龙也有一点点帅！', '收到你的掌声啦！'],
];
const quotes = [
  '今天也要记得，对自己温柔一点点。',
  '慢慢来，奶龙会在这里等你。',
  '每一颗小星星，都是你努力过的证明。',
  '你已经做得很好啦，给自己一个抱抱！',
];

bestScoreEl.textContent = `BEST ${bestScore}`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1900);
}

function updateState() {
  energy = Math.max(0, Math.min(100, energy));
  energyFill.style.width = `${energy}%`;
  energyValue.textContent = `${energy}%`;
  energyGain.textContent = `+${taps} 今日互动`;
}

function interact() {
  const state = interactions[taps % interactions.length];
  taps += 1;
  energy += 2;
  moodEmoji.textContent = state[0];
  moodName.textContent = state[1];
  moodCopy.textContent = state[2];
  speechBubble.textContent = state[3];
  happyCount.textContent = String(128 + taps);
  nailong.classList.remove('is-tapped');
  void nailong.offsetWidth;
  nailong.classList.add('is-tapped');
  updateState();
  showToast(`奶龙收到啦！快乐能量 +2`);
}

nailong.addEventListener('click', interact);
heroTapBtn.addEventListener('click', () => {
  interact();
  nailong.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
heroPlayBtn.addEventListener('click', () => {
  document.querySelector('#game').scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(startGame, 550);
});

function moveStar() {
  const boardWidth = skyBoard.clientWidth - 65;
  const boardHeight = skyBoard.clientHeight - 92;
  starTarget.style.left = `${12 + Math.random() * Math.max(10, boardWidth)}px`;
  starTarget.style.top = `${18 + Math.random() * Math.max(10, boardHeight)}px`;
}

function endGame() {
  gameActive = false;
  window.clearInterval(gameTimer);
  starTarget.style.display = 'none';
  skyIntro.style.display = 'flex';
  skyIntro.querySelector('span').textContent = score >= 8 ? '🏆' : score >= 4 ? '✨' : '🌙';
  skyIntro.querySelector('strong').textContent = score === 0 ? '再试一次吧！' : `接到 ${score} 颗星星！`;
  skyIntro.querySelector('small').textContent = score >= bestScore && score > 0 ? '新纪录！奶龙为你鼓掌' : '准备好就再来一局';
  startGameBtn.innerHTML = '再玩一局 <span>★</span>';
  energy += Math.min(8, score);
  updateState();
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('nailong-best-score', String(bestScore));
    bestScoreEl.textContent = `BEST ${bestScore}`;
  }
  showToast(score > 0 ? `本局完成！奶龙收到了 ${score} 颗星星` : '星星在等你，再试一次！');
}

function startGame() {
  if (gameActive) return;
  gameActive = true;
  score = 0;
  let timeLeft = 12;
  scoreEl.textContent = '0';
  timeEl.textContent = String(timeLeft);
  skyIntro.style.display = 'none';
  starTarget.style.display = 'block';
  startGameBtn.innerHTML = '游戏进行中 <span>⌁</span>';
  moveStar();
  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = String(timeLeft);
    if (timeLeft <= 0) endGame();
  }, 1000);
}

starTarget.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!gameActive) return;
  score += 1;
  scoreEl.textContent = String(score);
  energy += 1;
  updateState();
  moveStar();
  starTarget.animate([{ transform: 'scale(.72) rotate(-12deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 170, easing: 'ease-out' });
});

startGameBtn.addEventListener('click', startGame);
newQuote.addEventListener('click', () => {
  quoteIndex = (quoteIndex + 1) % quotes.length;
  quoteText.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220 });
  quoteText.textContent = quotes[quoteIndex];
});

updateState();
