const grid = document.getElementById('pixelGrid');
const gridSizeSelect = document.getElementById('gridSize');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBoard');
const pixelLabel = document.getElementById('pixelLabel');
const savedPalettes = document.getElementById('savedPalettes');
const gradientInputs = document.getElementById('gradientInputs');
const addColorInputBtn = document.getElementById('addColorInput');
const applyGradientBtn = document.getElementById('applyGradient');
const gradientPreview = document.getElementById('gradientPreview');
const saveGradientBtn = document.getElementById('saveGradient');

let pixelStates = {};
let currentPixels = [];
let palette = [];

function buildGrid(size) {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${size}, 30px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 30px)`;
  const cols = [...Array(size).keys()];
  const rows = [...Array(size).keys()];

  cols.forEach((x) => {
    rows.forEach((y) => {
      const id = `${x}_${y}`;
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
      });

      grid.appendChild(div);
    });
  });
}

colorPicker.addEventListener('input', () => {
  const color = colorPicker.value;
  currentPixels.forEach(pixel => {
    pixel.style.background = color;
    pixelStates[pixel.dataset.id] = color;
  });
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

gridSizeSelect.addEventListener('change', () => {
  buildGrid(parseInt(gridSizeSelect.value));
});

// Gradient tool
addColorInputBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'color';
  gradientInputs.appendChild(input);
  updateGradientPreview();
  input.addEventListener('input', updateGradientPreview);
});

function updateGradientPreview() {
  const direction = document.getElementById('gradientDirection').value;
  const colors = Array.from(gradientInputs.querySelectorAll('input')).map(input => input.value);
  if (colors.length > 1) {
    const gradient = `linear-gradient(${direction}, ${colors.join(',')})`;
    gradientPreview.style.background = gradient;
    gradientPreview.dataset.gradient = gradient;
  }
}

applyGradientBtn.addEventListener('click', () => {
  const style = gradientPreview.dataset.gradient;
  if (!style) return;
  currentPixels.forEach(pixel => {
    pixel.style.background = style;
    pixelStates[pixel.dataset.id] = style;
  });
});

saveGradientBtn.addEventListener('click', () => {
  const style = gradientPreview.dataset.gradient;
  if (!style || palette.includes(style)) return;
  palette.push(style);
  renderPalette();
});

function renderPalette() {
  savedPalettes.innerHTML = '';
  palette.forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = 'color-swatch';
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      currentPixels.forEach(pixel => {
        pixel.style.background = color;
        pixelStates[pixel.dataset.id] = color;
      });
    });
    savedPalettes.appendChild(swatch);
  });
}

buildGrid(15);
