const wrap = document.createElement('div');
wrap.classList.add('wrapper');
document.querySelector('body').appendChild(wrap);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
wrap.appendChild(textarea);

const keyboard = document.createElement('div');
keyboard.classList.add('keyboard');
wrap.appendChild(keyboard);

let lang = 'en';
let shift = false;

function renderWritingKeys() {
  const writingKeys = Object.keys(window.helper.WRITINGKEYCODES);

  for (let i = 0; i < writingKeys.length; i += 1) {
    let inner;
    const currentKey = window.helper.WRITINGKEYCODES[writingKeys[i]][lang];

    if (shift) {
      if (currentKey[0].toUpperCase() === currentKey[1]) {
        inner = `<span>${currentKey[1]}</span>`;
      } else {
        inner = `<sup>${currentKey[0]}</sup><span>${currentKey[1]}</span>`;
      }
    }
    if (!shift) {
      if (currentKey[0].toUpperCase() === currentKey[1]) {
        inner = `<span>${currentKey[0]}</span>`;
      } else {
        inner = `<sup>${currentKey[1]}</sup><span>${currentKey[0]}</span>`;
      }
    }
    document.querySelector(`.${writingKeys[i]}`).innerHTML = inner;
  }
}

function animationOn(evt) {
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  key.style.borderRadius = '15px';
  key.style.background = 'darkslateblue';
}

function animationOff(evt) {
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  key.style.borderRadius = '3px';
  key.style.background = '#3a424e';
}

function addSymbol(evt) {
  const key =
    document.querySelector(`.${evt.code}`) ||
    document.querySelector(`.${evt.target.classList[1]}`) ||
    document.querySelector(`.${evt.target.parentNode.classList[1]}`);
  let text;
  if (!key.classList.contains('functional') && evt.target !== textarea) {
    text = key.lastElementChild.innerText;
    textarea.value += text;
  } else if (key.classList.contains('Space') && evt.target !== textarea) {
    text = ' ';
    textarea.value += text;
  }
}

const fragment = document.createDocumentFragment();
for (let i = 0; i < window.helper.KEYCODES.length; i += 1) {
  const key = document.createElement('div');
  key.classList.add('key');
  key.classList.add(window.helper.KEYCODES[i]);
  if (window.helper.FUNCTIONALKEYCODES[window.helper.KEYCODES[i]]) {
    key.innerHTML = `<span>${window.helper.FUNCTIONALKEYCODES[window.helper.KEYCODES[i]]}</span>`;
    key.classList.add('functional');
  }
  fragment.appendChild(key);
}
keyboard.appendChild(fragment);
renderWritingKeys();

document.addEventListener('keydown', e => {
  const evt = e;
  evt.target = textarea;
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

function onMousedown(evt) {
  if (evt.target.classList.contains('key') || evt.target.parentNode.classList.contains('key')) {
    animationOn(evt);
    let binded;

    const onMouseup = function onMouseup(e) {
      animationOff(e);
      addSymbol(e);

      document.removeEventListener('mouseup', binded);
    };
    binded = onMouseup.bind(null, evt);
    document.addEventListener('mouseup', binded);
  }
}

keyboard.addEventListener('mousedown', onMousedown);
