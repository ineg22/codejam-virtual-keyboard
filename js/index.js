import helper from './helper.js';

const { KEYCODES, FUNCTIONALKEYCODES, WRITINGKEYCODES } = helper;
const fragment = document.createDocumentFragment();

const wrap = document.createElement('div');
wrap.classList.add('wrapper');
document.body.appendChild(wrap);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
wrap.appendChild(textarea);

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
wrap.appendChild(keyboard);

let lang = localStorage.getItem('lang') || 'en';
let shift = false;

function renderWritingKeys() {
  const writingKeys = Object.keys(WRITINGKEYCODES);

  for (let i = 0; i < writingKeys.length; i += 1) {
    const currentKey = WRITINGKEYCODES[writingKeys[i]][lang];
    const [firstChar, secondChar] = currentKey;

    if (shift) {
      if (firstChar.toUpperCase() === secondChar) {
        const span = document.createElement('span');
        span.textContent = secondChar;
        fragment.appendChild(span);
      } else {
        const sup = document.createElement('sup');
        sup.textContent = firstChar;
        const span = document.createElement('span');
        span.textContent = secondChar;
        fragment.appendChild(sup);
        fragment.appendChild(span);
      }
    }
    if (!shift) {
      if (firstChar.toUpperCase() === secondChar) {
        const span = document.createElement('span');
        span.textContent = firstChar;
        fragment.appendChild(span);
      } else {
        const sup = document.createElement('sup');
        sup.textContent = secondChar;
        const span = document.createElement('span');
        span.textContent = firstChar;
        fragment.appendChild(sup);
        fragment.appendChild(span);
      }
    }
    const currNode = document.querySelector(`.${writingKeys[i]}`);
    while (currNode.hasChildNodes()) {
      currNode.removeChild(currNode.firstChild);
    }
    currNode.appendChild(fragment);
  }
}

function animationOn(evt) {
  if (evt.key === 'Alt' || evt.key === 'Meta' || evt.key === 'Tab') {
    evt.preventDefault();
  }
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  key.classList.add('anime');
}

function animationOff(evt) {
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  key.classList.remove('anime');
}

function addSymbol(evt) {
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  let text = '';
  textarea.focus();
  if (evt.target !== textarea) {
    if (!key.classList.contains('functional')) {
      const currKey = WRITINGKEYCODES[key.classList[1]][lang];
      const [small, big] = currKey;
      text = shift ? big : small;
    } else if (key.classList.contains('Space')) {
      text = ' ';
    } else if (key.classList.contains('Enter')) {
      text = '\n';
    } else if (key.classList.contains('Backspace') || key.classList.contains('Delete')) {
      textarea.value = textarea.value.slice(0, textarea.value.length - 1);
    }
  }

  textarea.value += text;
}

function onMousedown(evt) {
  const { target } = evt;
  if (target.classList.contains('key') || target.parentNode.classList.contains('key')) {
    if (target.classList.contains('CapsLock') || target.parentNode.classList.contains('CapsLock')) {
      shift = !shift;
      renderWritingKeys();
    }

    if (
      target.classList.contains('ShiftLeft') ||
      target.parentNode.classList.contains('ShiftLeft') ||
      target.classList.contains('ShiftRight') ||
      target.parentNode.classList.contains('ShiftRight')
    ) {
      shift = !shift;
      renderWritingKeys();
      evt.preventDefault();
    }

    animationOn(evt);
    let binded;

    const onMouseup = function onMouseup(e) {
      animationOff(e);
      addSymbol(e);

      if (
        target.classList.contains('ShiftLeft') ||
        target.parentNode.classList.contains('ShiftLeft') ||
        target.classList.contains('ShiftRight') ||
        target.parentNode.classList.contains('ShiftRight')
      ) {
        shift = !shift;
        renderWritingKeys();
      }

      document.removeEventListener('mouseup', binded);
    };
    binded = onMouseup.bind(null, evt);
    document.addEventListener('mouseup', binded);
  }
}

for (let i = 0; i < KEYCODES.length; i += 1) {
  const key = document.createElement('div');
  key.classList.add('key');
  key.classList.add(KEYCODES[i]);
  if (FUNCTIONALKEYCODES[KEYCODES[i]]) {
    const span = document.createElement('span');
    span.textContent = FUNCTIONALKEYCODES[KEYCODES[i]];
    key.appendChild(span);
    key.classList.add('functional');
  }
  fragment.appendChild(key);
}
keyboard.appendChild(fragment);
renderWritingKeys();

document.addEventListener('keydown', e => {
  const evt = e;
  textarea.focus();
  addSymbol(evt);
  animationOn(evt);
  if (evt.key === 'Shift' && !evt.repeat) {
    shift = !shift;
    renderWritingKeys();
  }
  if (evt.key === 'CapsLock' && !evt.repeat) {
    shift = !shift;
    renderWritingKeys();
  }
  if (evt.key === 'Shift' && evt.altKey && !evt.repeat) {
    lang = lang === 'en' ? 'ru' : 'en';
  }
  if (evt.key === 'Alt' && evt.shiftKey && !evt.repeat) {
    lang = lang === 'en' ? 'ru' : 'en';
  }
});

document.addEventListener('keyup', evt => {
  animationOff(evt);
  if (evt.key === 'Shift') {
    shift = !shift;
    renderWritingKeys();
  }
});

keyboard.addEventListener('mousedown', onMousedown);

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lang', lang);
});
