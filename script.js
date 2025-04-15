const grid = document.getElementById('pixelGrid');
const colorPicker = document.getElementById('colorPicker');
const pixelLabel = document.getElementById('pixelLabel');
const quickColors = document.getElementById('quickColors');
const clearBtn = document.getElementById('clearBoard');
const gradientPicker = document.getElementById('gradientPicker');

let currentPixels = [];
let pixelStates = {};
let recentColors = [];

const cols = [...'ABCDEFGHIJKLMNO'];
const rows = [...Array(15).keys()].map(i => i + 1);

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
    btn.style.background = color.includes(',') ? `linear-gradient(${color})` : color;
    btn.addEventListener('click', () => {
      applyColorToSelection(color);
    });
    quickColors.appendChild(btn);
  });
}

function applyColorToSelection(color) {
  currentPixels.forEach(pixel => {
    pixel.style.background = color.includes(',') ? `linear-gradient(${color})` : color;
    pixelStates[pixel.dataset.id] = color;
  });
  addQuickColor(color);
}

cols.forEach((col, x) => {
  rows.forEach((row, y) => {
    const id = col + row;
    const div = document.createElement('div');
    div.classList.add('pixel');
    div.dataset.id = id;
    div.style.background = '#222';

    div.addEventListener('click', (e) => {
      if (!e.shiftKey) {
        currentPixels.forEach(p => p.classList.remove('active'));
        currentPixels = [];
      }
      if (!currentPixels.includes(div)) {
        currentPixels.push(div);
        div.classList.add('active');
      }
      pixelLabel.textContent = 'Selected: ' + currentPixels.map(p => p.dataset.id).join(', ');
      if (pixelStates[id] && !pixelStates[id].includes(',')) {
        colorPicker.value = pixelStates[id];
      }
    });

    grid.appendChild(div);
  });
});

colorPicker.addEventListener('input', () => {
  const color = colorPicker.value;
  applyColorToSelection(color);
});

gradientPicker.addEventListener('click', () => {
  const gradient = prompt("Enter gradient (e.g., red, blue or 45deg, red, blue):");
  if (gradient) {
    applyColorToSelection(gradient);
  }
});

clearBtn.addEventListener('click', () => {
  const pixels = document.querySelectorAll('.pixel');
  pixels.forEach(pixel => {
    pixel.style.background = '#222';
    pixel.classList.remove('active');
    pixelStates[pixel.dataset.id] = '#222';
  });
  currentPixels = [];
  pixelLabel.textContent = 'Select a pixel';
});
