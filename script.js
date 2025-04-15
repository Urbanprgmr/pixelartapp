const grid = document.getElementById('pixelGrid');
const gridSizeSelect = document.getElementById('gridSize');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBoard');
const gradientBtn = document.getElementById('gradientPicker');
const addToPaletteBtn = document.getElementById('addToPalette');
const quickColors = document.getElementById('quickColors');
const savedPalettes = document.getElementById('savedPalettes');
const pixelLabel = document.getElementById('pixelLabel');

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

gradientBtn.addEventListener('click', () => {
  const gradient = prompt("Enter gradient (e.g., red, yellow or 45deg, red, yellow)");
  if (gradient) {
    const style = `linear-gradient(${gradient})`;
    currentPixels.forEach(pixel => {
      pixel.style.background = style;
      pixelStates[pixel.dataset.id] = style;
    });
    addToPalette(gradient);
  }
});

function addToPalette(color) {
  if (!palette.includes(color)) {
    palette.push(color);
    renderPalette();
  }
}

addToPaletteBtn.addEventListener('click', () => {
  const color = colorPicker.value;
  addToPalette(color);
});

function renderPalette() {
  savedPalettes.innerHTML = '';
  palette.forEach(color => {
    const swatch = document.createElement('button');
    swatch.className = 'color-swatch';
    swatch.style.background = color.includes('gradient') ? color : color;
    swatch.addEventListener('click', () => {
      currentPixels.forEach(pixel => {
        pixel.style.background = color.includes('gradient') ? color : color;
        pixelStates[pixel.dataset.id] = color;
      });
    });
    savedPalettes.appendChild(swatch);
  });
}

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

buildGrid(15);
