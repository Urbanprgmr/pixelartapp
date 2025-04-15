const grid = document.getElementById('pixelGrid');
const colorPicker = document.getElementById('colorPicker');
const pixelLabel = document.getElementById('pixelLabel');
const quickColors = document.getElementById('quickColors');
const clearBtn = document.getElementById('clearBoard');

let currentPixels = [];
let pixelStates = {};
let recentColors = [];

const cols = 'ABCDEFGHIJ'.split('');
const rows = [...Array(10).keys()].map(i => i + 1);

function addQuickColor(color) {
  if (!recentColors.includes(color)) {
    recentColors.unshift(color);
    if (recentColors.length > 5) recentColors.pop();
    renderQuickColors();
  }
}

function renderQuickColors() {
  quickColors.innerHTML = '';
  recentColors.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'color-swatch';
    btn.style.backgroundColor = color;
    btn.addEventListener('click', () => {
      currentPixels.forEach(pixel => {
        pixel.style.backgroundColor = color;
        pixelStates[pixel.dataset.id] = color;
      });
      addQuickColor(color);
    });
    quickColors.appendChild(btn);
  });
}

cols.forEach((col, x) => {
  rows.forEach((row, y) => {
    const id = col + row;
    const div = document.createElement('div');
    div.classList.add('pixel');
    div.dataset.id = id;
    div.style.backgroundColor = '#111';

    div.addEventListener('click', (e) => {
      if (!e.shiftKey) {
        currentPixels.forEach(p => p.classList.remove('active'));
        currentPixels = [];
      }
      currentPixels.push(div);
      div.classList.add('active');
      pixelLabel.textContent = 'Selected: ' + currentPixels.map(p => p.dataset.id).join(', ');
      if (pixelStates[id]) colorPicker.value = pixelStates[id];
    });

    grid.appendChild(div);
  });
});

colorPicker.addEventListener('input', () => {
  const color = colorPicker.value;
  currentPixels.forEach(pixel => {
    pixel.style.backgroundColor = color;
    pixelStates[pixel.dataset.id] = color;
  });
  addQuickColor(color);
});

clearBtn.addEventListener('click', () => {
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach(pixel => {
    pixel.style.backgroundColor = '#222';
    pixel.classList.remove('active');
    pixelStates[pixel.dataset.id] = '#222';
  });
  currentPixels = [];
  pixelLabel.textContent = 'Select a pixel';
});
