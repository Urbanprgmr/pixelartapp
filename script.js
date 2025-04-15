const grid = document.getElementById('pixelGrid');
const gridSizeSelect = document.getElementById('gridSize');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBoard');
const pixelLabel = document.getElementById('pixelLabel');
const quickColors = document.getElementById('quickColors');

let pixelStates = {};
let currentPixels = [];

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

gridSizeSelect.addEventListener('change', () => {
  buildGrid(parseInt(gridSizeSelect.value));
});

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

buildGrid(15);
