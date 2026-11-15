'use strict';

const consonants = 'БВГДЖЗКЛМНПРСТФХЦЧШЩ';
const vowels = 'АОУЫИЭЕЁЮЯ';
const boardSize = 12;
const minimumPool = 15;

// Учебный набор двухбуквенных слогов. Обратные сочетания перечислены отдельно.
const openGroups = {
 Б:'БА БО БУ БЫ БИ БЕ БЁ БЮ БЯ', В:'ВА ВО ВУ ВЫ ВИ ВЕ ВЁ ВЮ ВЯ',
 Г:'ГА ГО ГУ ГИ ГЕ ГЁ ГЮ ГЯ', Д:'ДА ДО ДУ ДЫ ДИ ДЕ ДЁ ДЮ ДЯ',
 Ж:'ЖА ЖО ЖУ ЖИ ЖЕ ЖЁ', З:'ЗА ЗО ЗУ ЗЫ ЗИ ЗЕ ЗЁ ЗЮ ЗЯ',
 К:'КА КО КУ КИ КЕ КЁ КЮ КЯ', Л:'ЛА ЛО ЛУ ЛЫ ЛИ ЛЕ ЛЁ ЛЮ ЛЯ',
 М:'МА МО МУ МЫ МИ МЕ МЁ МЮ МЯ', Н:'НА НО НУ НЫ НИ НЕ НЁ НЮ НЯ',
 П:'ПА ПО ПУ ПЫ ПИ ПЕ ПЁ ПЮ ПЯ', Р:'РА РО РУ РЫ РИ РЕ РЁ РЮ РЯ',
 С:'СА СО СУ СЫ СИ СЕ СЁ СЮ СЯ', Т:'ТА ТО ТУ ТЫ ТИ ТЕ ТЁ ТЮ ТЯ',
 Ф:'ФА ФО ФУ ФЫ ФИ ФЕ ФЁ ФЮ ФЯ', Х:'ХА ХО ХУ ХИ ХЕ ХЁ ХЮ',
 Ц:'ЦА ЦО ЦУ ЦИ ЦЫ ЦЕ', Ч:'ЧА ЧО ЧУ ЧИ ЧЕ ЧЁ',
 Ш:'ША ШО ШУ ШИ ШЕ ШЁ', Щ:'ЩА ЩУ ЩИ ЩЕ ЩЁ'
};
const reverseGroups = {
 А:'АБ АВ АГ АД АЖ АЗ АК АЛ АМ АН АП АР АС АТ АФ АХ АЦ АЧ АШ АЩ',
 О:'ОБ ОВ ОГ ОД ОЖ ОЗ ОК ОЛ ОМ ОН ОП ОР ОС ОТ ОФ ОХ ОЦ ОЧ ОШ ОЩ',
 У:'УБ УВ УГ УД УЖ УЗ УК УЛ УМ УН УП УР УС УТ УФ УХ УЧ УШ УЩ',
 Ы:'ЫБ ЫВ ЫГ ЫД ЫЖ ЫЗ ЫК ЫЛ ЫМ ЫН ЫП ЫР ЫС ЫТ ЫХ ЫШ',
 И:'ИБ ИВ ИГ ИД ИЖ ИЗ ИК ИЛ ИМ ИН ИП ИР ИС ИТ ИФ ИХ ИЦ ИЧ ИШ ИЩ',
 Э:'ЭБ ЭВ ЭД ЭК ЭЛ ЭМ ЭН ЭП ЭР ЭС ЭТ ЭФ ЭХ ЭШ',
 Е:'ЕБ ЕВ ЕГ ЕД ЕЖ ЕЗ ЕК ЕЛ ЕМ ЕН ЕП ЕР ЕС ЕТ ЕФ ЕХ ЕЦ ЕЧ ЕШ ЕЩ',
 Ё:'ЁЖ ЁК ЁЛ ЁМ ЁН ЁР ЁС ЁТ ЁЧ ЁШ',
 Ю:'ЮБ ЮГ ЮД ЮЖ ЮЗ ЮК ЮЛ ЮМ ЮН ЮП ЮР ЮС ЮТ ЮХ ЮЧ ЮШ',
 Я:'ЯБ ЯВ ЯГ ЯД ЯЖ ЯЗ ЯК ЯЛ ЯМ ЯН ЯП ЯР ЯС ЯТ ЯХ ЯЦ ЯЧ ЯШ ЯЩ'
};
const catalog = {
 open: Object.values(openGroups).join(' ').split(' '),
 reverse: Object.values(reverseGroups).join(' ').split(' ')
};
const modes = { open:'Открытые', reverse:'Обратные', mixed:'Смешанные' };
const selection = { mode:'open', consonants:new Set('ЛМРСТ'), vowels:new Set('АОУЫИ') };
const secondRow = /[ЯЁЮЕИ]/;
const automaticPools = {
  covered: `
    БАК БАЛ БАР БАС БОК БОР БУР БЫК ВАЛ ВОЛ ВОР ГАЗ ГАМ ГУЛ ДАР ДОМ
    ДУБ ЖАР ЖУК ЗАЛ ЗОВ ЗУБ КОМ КОТ КУБ ЛАК ЛОМ ЛУК МАК МАЛ МАТ МЁД
    МОЛ МОР МЫЛ МЫС НОС НУЛ ПАЗ ПАР ПОЛ ПОП ПУХ ПЫЛ РАК РОВ РОГ РОТ
    САД САМ СОМ СОН СОК СУП СЫР СЫН ТАЗ ТАМ ТОМ ТУР ФОН ХОР ЦЕХ ЧАС
    ЧУБ ШАГ ШАР ШОВ ШУМ ЩУР
    БЕГ БИЛ БИС ВЕК ВЕС ВЁЛ ВИД ВЯЗ ГИД ДЕД ДЕЛ ДЫМ ЖИЛ ЖИР
    ЗЕВ КИТ ЛЕВ ЛЁД ЛЁН ЛЁТ ЛИК ЛИС ЛЮК ЛЯП МЕЛ МЕЧ МИГ МИЛ
    МИР МЯЛ МЯЧ НЁС НИЛ ПЕЛ ПЁК ПИР РЕЗ РЁВ РИМ РИС РЯД
    СЕЛ СЕВ СИЛ СЯД ТЕН ТИК ТИП ТЮК ФЕН ЧЕК ЧИЖ
    ЧИП ШЕФ ШЁЛ ШИЛ ШИП ЩИТ
  `,
  cluster: `
    БРА БРО БРУ ВРА ВРО ГЛА ГЛО ГРА ГРО ГРУ ДВА ДВО ДРА ДРО
    ЖГУ ЗВА ЗВО ЗЛА ЗЛО КВА КВО КЛА КЛО КЛУ КРА КРО КРУ МНО
    МРА НРА ПЛА ПЛО ПЛУ ПРА ПРО ПРУ ПСА ПТА СВА СВО СКА СКО
    СКУ СЛА СЛО СЛУ СМА СМО СМУ СНА СНО СПА СПО СРА СРО СТА
    СТО СТУ СХО ТВА ТВО ТРА ТРО ТРУ ФЛА ФЛО ФРА ХВА ХВО ХЛА
    ХЛО ХРА ШКА ШКО ШЛА ШЛО ШПА ШТА ШТУ БЛЕ БЛЁ БЛИ БЛЮ БРЕ
    БРЁ БРИ ВДЕ ВДЁ ВЗЯ ВЛЕ ВЛИ ВМЕ ВНЕ ВНИ ВРЕ ВРЁ ВРИ ГЛЕ
    ГЛЁ ГЛИ ГЛЮ ГЛЯ ГРЕ ГРЁ ГРИ ГРЯ ДВЕ ДВИ ДЛИ ДЛЯ ДРЕ ДРЁ
    ДРИ ЗВЕ ЗВЁ ЗДЕ ЗЛЕ ЗЛИ КЛЕ КЛЁ КЛИ КЛЮ КЛЯ КРЕ КРИ КРЮ
    МЛЕ МНИ МНЁ МНЕ ПЛЕ ПЛЁ ПЛИ ПЛЮ ПЛЯ ПРЕ ПРИ ПРЯ СВЕ СВЁ
    СВИ СКИ СЛЕ СЛЁ СЛИ СМЕ СМЁ СНИ СНЁ СПЕ СПИ СРЕ СТЕ СТЁ
    СТИ ТРЕ ТРЁ ТРИ ТРЮ ФЛЕ ФРИ ХЛЕ ХЛЁ ХРЕ ХРИ ЦВЕ ЦВЁ ШЛИ
    ШЛЮ ШЛЯ ШТЕ
  `
};

function automaticPool({ mode, includeSecondRow }) {
  return automaticPools[mode].trim().split(/\s+/).filter(value => includeSecondRow || !secondRow.test(value));
}

function eligible({ mode, consonants: chosenConsonants, vowels: chosenVowels }) {
  const open = catalog.open.filter(([c,v]) => chosenConsonants.has(c) && chosenVowels.has(v));
  const reverse = catalog.reverse.filter(([v,c]) => chosenVowels.has(v) && chosenConsonants.has(c));
  if (mode === 'mixed') return [...open, ...reverse];
  return mode === 'open' ? open : reverse;
}

function shuffled(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickCommon(pool, count, groupBy) {
  const values = shuffled(pool);
  if (!groupBy) return values.slice(0, count);
  const first = values.find(value => groupBy(value));
  const second = values.find(value => !groupBy(value));
  return [first, second, ...values.filter(value => value !== first && value !== second).slice(0, count - 2)];
}

function makeRound(pool, groupBy) {
  const overlap = Math.max(boardSize * 2 - pool.length, 3 + Math.floor(Math.random() * 3));
  const common = pickCommon(pool, overlap, groupBy);
  const commonWeight = 1.7 + Math.max(0, overlap - 5) * .57;
  // With more shared cells, replays reduce the advantage of earlier child-only draws.
  const childWeight = 1.46 + Math.max(0, overlap - 6) * .15;
  const unique = shuffled(pool.filter(value => !common.includes(value)));
  const sides = [0, 1].map(side => shuffled([
    ...common, ...unique.slice(side * (boardSize - overlap), (side + 1) * (boardSize - overlap))
  ]));
  const draws = [...new Set(sides.flat())].map(value => {
    const weight = common.includes(value) ? commonWeight : sides[1].includes(value) ? childWeight : 1;
    return { value, order: -Math.log(1 - Math.random()) / weight };
  }).sort((a,b) => a.order - b.order).map(entry => entry.value);
  return { sides, draws };
}

const $ = id => document.getElementById(id);
const dialog = $('dialog');
const state = {
  players:[], remaining:[], repeats:new Map(), history:[],
  current:null, interrupted:null, winner:null, turn:0, nextTimer:null
};
let audioEnabled = true;
let audio;
let drag;
let activeAutomatic = null;

function button(label, action, className) {
  const node = document.createElement('button');
  node.type = 'button';
  node.textContent = label;
  if (className) node.className = className;
  if (action) node.addEventListener('click', action);
  return node;
}

function screen(id) {
  for (const name of ['intro','setup','game']) $(name).hidden = name !== id;
  $(id).querySelector('h1')?.focus({ preventScroll:true });
  if (id === 'game') $('draw').focus({ preventScroll:true });
}

function updateSettings() {
  for (const node of $('modes').children) node.setAttribute('aria-pressed', node.dataset.value === selection.mode);
  for (const group of ['consonants','vowels']) {
    for (const node of $(group).children) node.setAttribute('aria-pressed', selection[group].has(node.textContent));
  }
  const count = eligible(selection).length;
  const enoughLetters = selection.consonants.size >= 4 && selection.vowels.size >= 4;
  const hasBoth = selection.mode !== 'mixed' ||
    (eligible({ ...selection, mode:'open' }).length && eligible({ ...selection, mode:'reverse' }).length);
  $('start').disabled = !enoughLetters || count < minimumPool || !hasBoth;
  $('validation').textContent = !enoughLetters ? 'Выберите минимум 4 согласные и 4 гласные.' :
    count < minimumPool || !hasBoth ? 'Недостаточно слогов для игры. Выберите дополнительные буквы.' :
    'Доступно сочетаний: ' + count + ' · На каждой карточке 12 слогов';
}

for (const [mode, label] of Object.entries(modes)) {
  const node = button(label, () => { selection.mode = mode; updateSettings(); });
  node.dataset.value = mode;
  $('modes').append(node);
}
for (const [group, letters] of Object.entries({ consonants, vowels })) {
  for (const letter of letters) {
    $(group).append(button(letter, () => {
      if (selection[group].has(letter)) selection[group].delete(letter);
      else selection[group].add(letter);
      updateSettings();
    }, 'letters'));
  }
}
updateSettings();

function chime(notes, volume = .045) {
  if (!audioEnabled || !window.AudioContext) return;
  audio ??= new AudioContext();
  if (audio.state === 'suspended') audio.resume().catch(() => {});
  notes.forEach((frequency, i) => {
    const start = audio.currentTime + i * .085;
    const wave = audio.createOscillator();
    const gain = audio.createGain();
    wave.type = 'sine';
    wave.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .018);
    gain.gain.exponentialRampToValueAtTime(.0001, start + .32);
    wave.connect(gain).connect(audio.destination);
    wave.start(start);
    wave.stop(start + .33);
  });
}

function animate(node, name) {
  node.classList.remove(name);
  void node.offsetWidth;
  node.classList.add(name);
}

function gem(index) {
  const node = document.createElement('i');
  node.className = 'gem';
  node.setAttribute('aria-hidden', 'true');
  node.style.setProperty('--x', (index % 3) * 50 + '%');
  node.style.setProperty('--y', Math.floor(index / 3) * 50 + '%');
  return node;
}

function hint(message) {
  $('hint').textContent = message;
}

function refresh(player) {
  player.score.textContent = player.count + ' / ' + boardSize;
  player.token.replaceChildren(gem(player.colors[player.count % player.colors.length]));
  $('undo').disabled = !state.history.length || Boolean(state.winner);
}

function begin() {
  if (!activeAutomatic && $('start').disabled) return;
  clearTimeout(state.nextTimer);
  const pool = activeAutomatic ? automaticPool(activeAutomatic) : eligible(selection);
  const groupBy = activeAutomatic
    ? (activeAutomatic.includeSecondRow ? value => secondRow.test(value) : null)
    : (selection.mode === 'mixed' ? value => consonants.includes(value[0]) : null);
  const round = makeRound(pool, groupBy);
  $('game').classList.toggle('long-syllables', Boolean(activeAutomatic));
  Object.assign(state, {
    remaining:round.draws, repeats:new Map(), history:[],
    current:null, interrupted:null, winner:null, turn:0, nextTimer:null
  });
  $('boards').replaceChildren();
  state.players = round.sides.map((syllables, index) => {
    const name = ['Педагог','Ребёнок'][index];
    const board = document.createElement('article');
    board.className = 'board';
    const card = document.createElement('div');
    card.className = 'card';
    const corners = document.createElement('div');
    corners.className = 'corners';
    corners.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i++) corners.append(document.createElement('i'));
    const heading = document.createElement('div');
    heading.className = 'board-heading';
    const title = document.createElement('h2');
    title.textContent = name.toUpperCase();
    const score = document.createElement('span');
    score.className = 'score';
    heading.append(title, score);
    const grid = document.createElement('div');
    grid.className = 'grid';
    const token = document.createElement('div');
    token.className = 'token';
    token.setAttribute('aria-hidden', 'true');
    const player = { name, board, score, grid, token, syllables, count:0, colors:shuffled([0,1,2,3,4,5,6,7,8]), closed:new Set() };
    for (const value of syllables) {
      const cell = button('', () => place(player, cell), 'cell');
      cell.dataset.value = value;
      const label = document.createElement('span');
      label.textContent = value;
      cell.append(label);
      grid.append(cell);
    }
    token.addEventListener('pointerdown', event => startDrag(event, player));
    card.append(heading, grid, corners);
    board.append(card, token);
    $('boards').append(board);
    refresh(player);
    return player;
  });
  $('current').textContent = '?';
  $('draw').textContent = 'Достать слог';
  $('draw').disabled = false;
  hint('Достаньте первый слог из мешочка.');
  screen('game');
}

function particles(x, y, count, parent) {
  const palette = ['#fbd783','#f3a691','#b4e6df','#d0b2e9'];
  for (let i = 0; i < count; i++) {
    const node = document.createElement('i');
    const angle = (i / count) * Math.PI * 2;
    const distance = 24 + Math.random() * (count > 12 ? 175 : 55);
    node.className = 'spark';
    node.style.cssText = 'left:'+x+'px;top:'+y+'px;--dx:'+Math.cos(angle)*distance+'px;--dy:'+Math.sin(angle)*distance+'px;--color:'+palette[i%4];
    parent.append(node);
    setTimeout(() => node.remove(), 1750);
  }
}

function modal(title, detail, actions) {
  $('dialog-title').textContent = title;
  $('dialog-detail').textContent = detail;
  $('dialog-actions').replaceChildren(...actions.map(([label, action, style]) => button(label, () => {
    dialog.close();
    action?.();
  }, style || 'quiet')));
  dialog.showModal();
}

function win(player) {
  state.winner = player;
  player.board.classList.add('winner');
  $('draw').disabled = $('undo').disabled = true;
  chime([523,659,784,1047]);
  setTimeout(() => {
    if (state.winner !== player) return;
    if (dialog.open) dialog.close();
    modal('Победа', 'Победил ' + player.name.toLowerCase() + '!', [
      ['Играть ещё', begin, 'primary'], ['К настройкам', () => screen('setup')]
    ]);
    particles(dialog.clientWidth / 2, dialog.clientHeight / 2, 30, dialog);
  }, 530);
}

function place(player, cell, fromDrag = false) {
  if (state.winner || state.nextTimer !== null || cell.disabled) return false;
  const value = cell?.dataset.value;
  if (!state.current || value !== state.current) {
    if (cell) {
      animate(cell, 'wrong');
      cell.addEventListener('animationend', () => cell.classList.remove('wrong'), { once:true });
    }
    chime([247], .025);
    hint(state.current ? 'Камушек ждёт другой слог. Попробуйте ещё раз.' : 'Сначала достаньте слог из мешочка.');
    return false;
  }
  const stone = player.colors[player.count % player.colors.length];
  player.closed.add(value);
  player.count++;
  state.history.push({ player, cell, value });
  cell.classList.add('covered');
  cell.setAttribute('aria-label', value + ' закрыт');
  cell.disabled = true;
  const placed = gem(stone);
  const bounds = cell.getBoundingClientRect();
  if (!fromDrag) {
    const source = player.token.getBoundingClientRect();
    placed.classList.add('from-tray');
    placed.style.setProperty('--from-x', (source.x + source.width / 2 - bounds.x - bounds.width / 2) + 'px');
    placed.style.setProperty('--from-y', (source.y + source.height / 2 - bounds.y - bounds.height / 2) + 'px');
    placed.style.setProperty('--from-scale', source.width / Math.min(bounds.width, innerHeight * .11, 88));
  }
  cell.append(placed);
  refresh(player);
  placed.addEventListener('animationend', () => {
    if (!placed.isConnected) return;
    const landed = cell.getBoundingClientRect();
    particles(landed.x + landed.width / 2, landed.y + landed.height / 2, 8, $('sparks'));
  }, { once:true });
  chime([659,880]);
  if (player.count === boardSize) {
    win(player);
  } else {
    if (state.players.some(entry => entry.syllables.includes(value) && !entry.closed.has(value))) {
      state.repeats.set(value, state.turn + 3);
      hint('Слог закрыл ' + player.name.toLowerCase() + '. Позже он выпадет ещё раз.');
    } else {
      state.repeats.delete(value);
      hint('Камушек на месте!');
    }
    state.nextTimer = setTimeout(() => {
      state.nextTimer = null;
      if (!$('game').hidden) advance();
    }, 560);
  }
  return true;
}

function startDrag(event, player) {
  if (drag || !event.isPrimary || event.button !== 0 || state.winner) return;
  const { token } = player;
  const pointer = event.pointerId;
  const startX = event.clientX;
  const startY = event.clientY;
  let proxy;
  token.setPointerCapture(pointer);
  drag = token;
  function move(next) {
    if (next.pointerId !== pointer) return;
    if (!proxy && Math.hypot(next.clientX - startX, next.clientY - startY) > 6) {
      proxy = gem(player.colors[player.count % player.colors.length]);
      proxy.classList.add('dragging');
      document.body.append(proxy);
    }
    if (proxy) {
      proxy.style.left = next.clientX + 'px';
      proxy.style.top = next.clientY + 'px';
    }
  }
  function finish(next) {
    if (next.pointerId !== pointer) return;
    drag = null;
    token.removeEventListener('pointermove', move);
    token.removeEventListener('pointerup', finish);
    token.removeEventListener('pointercancel', finish);
    token.removeEventListener('lostpointercapture', finish);
    if (!proxy) return;
    const target = next.type === 'pointerup' && document.elementFromPoint(next.clientX, next.clientY)?.closest('.cell');
    if (target && player.grid.contains(target) && place(player, target, true)) {
      proxy.remove();
      return;
    }
    if (target && !player.grid.contains(target)) hint('Положите камушек на свою карточку.');
    const bounds = token.getBoundingClientRect();
    proxy.style.transition = 'left .22s ease, top .22s ease, opacity .22s ease';
    proxy.style.left = bounds.x + bounds.width / 2 + 'px';
    proxy.style.top = bounds.y + bounds.height / 2 + 'px';
    proxy.style.opacity = '0';
    setTimeout(() => proxy.remove(), 230);
  }
  token.addEventListener('pointermove', move);
  token.addEventListener('pointerup', finish);
  token.addEventListener('pointercancel', finish);
  token.addEventListener('lostpointercapture', finish);
}

function showCurrent() {
  $('current').textContent = state.current;
  $('draw').textContent = 'Ход идёт';
  $('draw').disabled = true;
}

function advance() {
  let next;
  if (state.interrupted) {
    next = state.interrupted;
    state.interrupted = null;
  } else {
    const ready = [...state.repeats].find(([value, turn]) =>
      value !== state.current && (turn <= state.turn + 1 || !state.remaining.length)
    );
    next = ready?.[0] ?? state.remaining.shift() ?? state.repeats.keys().next().value;
  }
  if (!next) return;
  state.repeats.delete(next);
  state.current = next;
  state.turn++;
  showCurrent();
  animate(document.querySelector('.bag'), 'shake');
  animate($('current'), 'fly');
  chime([330,494,659], .035);
  hint('Кто первым найдёт слог? Нажмите на него и прочитайте вслух.');
}

$('draw').onclick = advance;

$('undo').onclick = () => {
  const last = state.history.at(-1);
  if (!last || state.winner) return;
  if (last.value !== state.current && state.interrupted) {
    hint('Сначала завершите исправление текущего слога.');
    return;
  }
  const { player, cell, value } = state.history.pop();
  clearTimeout(state.nextTimer);
  state.nextTimer = null;
  state.repeats.delete(value);
  player.closed.delete(value);
  player.count--;
  cell.disabled = false;
  cell.classList.remove('covered');
  cell.removeAttribute('aria-label');
  cell.querySelector('.gem').remove();
  refresh(player);
  if (state.current !== value) {
    state.interrupted = state.current;
    state.current = value;
    showCurrent();
  }
  hint('Ход отменён. Можно снова закрыть этот слог.');
};

$('restart').onclick = () => modal('Новая игра', 'Начните новую партию с теми же настройками или измените их.', [
  ['Играть ещё', begin, 'primary'], ['К настройкам', () => screen('setup')], ['Вернуться']
]);
$('play').onclick = () => screen('setup');
$('back').onclick = () => screen('intro');
$('start').onclick = () => {
  activeAutomatic = null;
  begin();
};
for (const mode of Object.keys(automaticPools)) {
  $('start-' + mode).onclick = () => {
    activeAutomatic = { mode, includeSecondRow:$(mode + '-vowels').checked };
    begin();
  };
}
$('sound').onclick = () => {
  audioEnabled = !audioEnabled;
  $('sound').setAttribute('aria-pressed', audioEnabled);
  $('sound').textContent = audioEnabled ? 'Звук вкл.' : 'Звук выкл.';
  chime([523,659]);
};

const fullscreen = $('fullscreen');
fullscreen.hidden = !document.fullscreenEnabled || !document.documentElement.requestFullscreen;
fullscreen.onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    fullscreen.textContent = 'Режим недоступен';
  }
};
document.addEventListener('fullscreenchange', () => {
  fullscreen.textContent = document.fullscreenElement ? 'Выйти из полного экрана' : 'На весь экран';
});
