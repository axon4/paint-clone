const { body } = document;
const activeToolElement = document.getElementById('active-tool');
const brushColourButton = document.getElementById('brush-colour');
const brushIcon = document.getElementById('brush');
const brushSize = document.getElementById('brush-size');
const brushSlider = document.getElementById('brush-slider');
const bucketColourButton = document.getElementById('bucket-colour');
const rubber = document.getElementById('rubber');
const clearCanvasButton = document.getElementById('clear-canvas');
const saveStorageButton = document.getElementById('save-storage');
const loadStorageButton = document.getElementById('load-storage');
const clearStorageButton = document.getElementById('clear-storage');
const downLoadButton = document.querySelector('a');

const canvas = document.createElement('canvas');

canvas.setAttribute('id', 'canvas');

const context = canvas.getContext('2d');

const BRUSH_TIME = 1500;
let currentSize = 10;
let bucketColour = '#FFFFFF';
let currentColour = '#A51DAB';
let isRubber = false;
let isMouseDown = false;
let drawnArray = [];

function disPlayBrushSize() {
	if (brushSlider.value < 10) {
		brushSize.textContent = `0${brushSlider.value}`;
	} else {
		brushSize.textContent = brushSlider.value;
	};
};

brushSlider.addEventListener('change', () => {
	currentSize = brushSlider.value;

	disPlayBrushSize();
});
brushColourButton.addEventListener('change', () => {
	isRubber = false;
	currentColour = `#${brushColourButton.value}`;
});
bucketColourButton.addEventListener('change', () => {
	bucketColour = `#${bucketColourButton.value}`;

	createCanvas();
	reStoreCanvas();
});
rubber.addEventListener('click', () => {
	isRubber = true;
	brushIcon.style.color = 'white';
	rubber.style.color = 'black';
	activeToolElement.textContent = 'Rubber';
	currentColour = bucketColour;
	currentSize = 50;
});

function switchToBrush() {
	isRubber = false;
	activeToolElement.textContent = 'Brush';
	brushIcon.style.color = 'black';
	rubber.style.color = 'white';
	currentColour = `#${brushColourButton.value}`;
	currentSize = 10;
	brushSlider.value = 10;

	disPlayBrushSize();
};

function brushTimeSetTimeout(milliSeconds) {
	setTimeout(switchToBrush, milliSeconds);
};

function createCanvas() {
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight - 50);

	context.fillStyle = bucketColour;

	context.fillRect(0, 0, canvas.width, canvas.height);
	body.appendChild(canvas);
	switchToBrush();
};

clearCanvasButton.addEventListener('click', () => {
	createCanvas();

	drawnArray = [];
	activeToolElement.textContent = 'Canvas Cleared';

	brushTimeSetTimeout(BRUSH_TIME);
});

function reStoreCanvas() {
	for (let i = 1; i < drawnArray.length; i++) {
		context.beginPath();
		context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
		context.lineWidth = drawnArray[i].size;
		context.lineCap = 'round';

		if (drawnArray[i].rub) {
			context.strokeStyle = bucketColour;
		} else {
			context.strokeStyle = drawnArray[i].colour;
		};

		context.lineTo(drawnArray[i].x, drawnArray[i].y);
		context.stroke();
	};
};

function storeDrawn(x, y, size, colour, rub) {
	const line = {
		x,
		y,
		size,
		colour,
		rub
	};

	drawnArray.push(line);
};

function getMousePosition(event) {
	const boundaries = canvas.getBoundingClientRect();

	return {
		x: event.clientX - boundaries.left,
		y: event.clientY - boundaries.top
	};
};

canvas.addEventListener('mousedown', event => {
	isMouseDown = true;

	const currentPosition = getMousePosition(event);

	context.moveTo(currentPosition.x, currentPosition.y);
	context.beginPath();

	context.lineWidth = currentSize;
	context.lineCap = 'round';
	context.strokeStyle = currentColour;
});

canvas.addEventListener('mousemove', event => {
	if (isMouseDown) {
		const currentPosition = getMousePosition(event);

		context.lineTo(currentPosition.x, currentPosition.y);
		context.stroke();
		storeDrawn(
			currentPosition.x,
			currentPosition.y,
			currentSize,
			currentColour,
			isRubber
		);
	} else {
		storeDrawn(undefined);
	};
});

canvas.addEventListener('mouseup', () => {
	isMouseDown = false;

	console.log('mouse unClicked');
});
saveStorageButton.addEventListener('click', () => {
	localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));

	activeToolElement.textContent = 'Canvas Saved';

	brushTimeSetTimeout(BRUSH_TIME);
});
loadStorageButton.addEventListener('click', () => {
	if (localStorage.getItem('savedCanvas')) {
		drawnArray = JSON.parse(localStorage.getItem('savedCanvas'));

		reStoreCanvas();

		activeToolElement.textContent = 'Canvas Loaded';

		brushTimeSetTimeout(BRUSH_TIME);
	} else {
		activeToolElement.textContent = 'No Canvas';
	};
});
clearStorageButton.addEventListener('click', () => {
	localStorage.removeItem('savedCanvas');

	activeToolElement.textContent = 'Local-Storage Cleared';

	brushTimeSetTimeout(BRUSH_TIME);
});
downLoadButton.addEventListener('click', () => {
	downLoadButton.setAttribute('href', canvas.toDataURL('image/jpeg', 1));

	const date = new Date();

	downLoadButton.setAttribute('download', 'painting');

	activeToolElement.textContent = 'Canvas Saved';

	brushTimeSetTimeout(BRUSH_TIME);
});

// event-listeners
brushIcon.addEventListener('click', switchToBrush);

// upOn-load
createCanvas();