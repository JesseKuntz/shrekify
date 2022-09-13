// Largely inspired by https://codepen.io/mathdotrandom/pen/ANgeBx 🙏

import PixelMapInterface from './pixel-map-interface';
import type { ImageProcessorFunction, RGBA } from './types';

const ImageProcessor = <ImageProcessorFunction>function (canvas, image) {
	this.width = image.width;
	this.height = image.height;

	const ipCanvas = document.querySelector('.image-processing-canvas') as HTMLCanvasElement;
	ipCanvas.width = this.width;
	ipCanvas.height = this.height;

	const ipCanvasContext = ipCanvas.getContext('2d');

	if (!ipCanvasContext) {
		return;
	}

	let imageData: ImageData | null = null;
	// Would need to convert to class... maybe at some point!
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let map = new PixelMapInterface(ImageProcessor.colorModes.RGBA, this.width, this.height);

	this.update = () => {
		imageData = ipCanvasContext.getImageData(0, 0, this.width, this.height);
		map.loadFromCanvasPixelArray(imageData);
	};

	this.render = () => {
		map.dumpToCanvasPixelArray(imageData);
		imageData && ipCanvasContext.putImageData(imageData, 0, 0);
	};

	this.getMap = () => {
		return map.clone();
	};

	this.setMap = (newMap) => {
		if (newMap.mode !== undefined) map = newMap;
	};

	this.loadImage = () => {
		this.pasteImage(image);
	};

	this.pasteImage = (image) => {
		ipCanvasContext.drawImage(image, 0, 0, this.width, this.height);
		this.update();
	};

	this.compositePaintImage = (image, gco) => {
		ipCanvasContext.globalCompositeOperation = gco;
		this.pasteImage(image);
		ipCanvasContext.globalCompositeOperation = 'source-over';
	};

	this.tint = () => {
		const canvasContext = canvas.getContext('2d');

		if (!canvasContext) {
			return;
		}

		// create offscreen buffer
		const bufferCanvas = document.querySelector('.buffer-canvas') as HTMLCanvasElement;
		bufferCanvas.width = this.width;
		bufferCanvas.height = this.height;
		// const buffer = createCanvas(fg.width, fg.height);
		const bufferCanvasContext = bufferCanvas.getContext('2d');

		if (!bufferCanvasContext) {
			return;
		}

		// fill offscreen buffer with the tint color
		bufferCanvasContext.fillStyle = '#00FF00';
		bufferCanvasContext.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);

		// destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
		bufferCanvasContext.globalCompositeOperation = 'destination-atop';
		bufferCanvasContext.drawImage(ipCanvas, 0, 0);

		// to tint the image, draw it first
		canvasContext.drawImage(ipCanvas, 0, 0);

		//then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
		canvasContext.globalAlpha = 0.2;
		canvasContext.drawImage(bufferCanvas, 0, 0);
		canvasContext.globalAlpha = 1;
	};

	this.getImageUrl = () => {
		return ipCanvas.toDataURL('image/png');
	};

	this.toHSV = (map) => {
		const w = map.width;
		const ht = map.height;
		let x = 0,
			y = 0,
			h: number,
			s: number,
			v: number,
			max: number,
			min: number,
			delta: number,
			r: number,
			g: number,
			b: number,
			pixel = null;

		map.mode = ImageProcessor.colorModes.HSL;

		for (y; y < ht; y++) {
			for (x = 0; x < w; x++) {
				pixel = map.data[y][x];
				r = pixel.R / 255;
				g = pixel.G / 255;
				b = pixel.B / 255;
				max = Math.max(r, g, b);
				min = Math.min(r, g, b);
				delta = max - min;
				v = max;

				if (max !== 0 && delta !== 0) {
					s = delta / max;

					if (r === max) h = ((g - b) / delta) % 6;
					else if (g === max) h = 2 + (b - r) / delta;
					else h = 4 + (r - g) / delta;

					h *= 60;
					if (h < 0) h += 360;
				} else {
					h = 0;
					s = 0;
				}

				pixel.R = h;
				pixel.G = s;
				pixel.B = v;
			}
		}
	};

	this.threshold = (map, max, min) => {
		const constrain = (pixel: Record<string, number>) => {
			for (const key in ImageProcessor.RGBA) {
				if (max && key in max && pixel[key] > max[key]) {
					return false;
				}
				if (min && key in min && pixel[key] < min[key]) {
					return false;
				}
			}

			return true;
		};

		map.mode = ImageProcessor.colorModes.BOOLEAN;

		const w = map.width;
		const ht = map.height;
		let x = 0,
			y = 0,
			pixel = null;

		for (y; y < ht; y++) {
			for (x = 0; x < w; x++) {
				pixel = map.data[y][x];
				if (!constrain(pixel)) {
					pixel.R = pixel.G = pixel.B = pixel.A = 0;
				} else {
					pixel.R = pixel.G = pixel.B = pixel.A = 255;
				}
			}
		}
	};

	this.traverseImage = (map, k, oracleValue, backupValue) => {
		const _temp = map.data.map((e) => {
			return e.slice();
		});

		const w = map.width;
		const h = map.height;
		const manhattan = this.manhattanOracle(_temp, w, h, oracleValue);
		const image = map.data;
		let x = 0,
			y = 0,
			pixel: RGBA;

		for (y; y < h; y++) {
			for (x = 0; x < w; x++) {
				pixel = image[y][x];
				pixel.R = pixel.G = pixel.B = pixel.A = manhattan[y][x] <= k ? oracleValue : backupValue;
			}
		}
	};

	this.dilute = (map, k) => {
		this.traverseImage(map, k, 255, 0);
	};

	this.erode = (map, k) => {
		this.traverseImage(map, k, 0, 255);
	};

	this.manhattanOracle = (dataMap, w, h, quan) => {
		const max = w + h;
		let x: number, y: number;

		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				let pixel = dataMap[y][x];

				if (typeof pixel === 'object' && pixel.R === quan) {
					pixel = 0;
				} else {
					pixel = max;

					if (y > 0) pixel = Math.min(pixel, (dataMap[y - 1][x] as number) + 1);
					if (x > 0) pixel = Math.min(pixel, (dataMap[y][x - 1] as number) + 1);
				}

				dataMap[y][x] = pixel;
			}
		}

		const w_minus_1 = w - 1;

		for (y = h - 1; y >= 0; y--) {
			for (x = w_minus_1; x >= 0; x--) {
				let pixel = dataMap[y][x] as number;

				if (y + 1 < h) pixel = Math.min(pixel, (dataMap[y + 1][x] as number) + 1);
				if (x + 1 < w) pixel = Math.min(pixel, (dataMap[y][x + 1] as number) + 1);

				dataMap[y][x] = pixel;
			}
		}

		return dataMap as Array<Array<number>>;
	};
};

ImageProcessor.colorModes = {
	BOOLEAN: -1,
	RGBA: 0,
	RGB: 1,
	GREYSCALE: 2,
	HSVA: 3,
	HSV: 4
};

ImageProcessor.RGBA = {
	R: 0,
	G: 0,
	B: 0,
	A: 0
};

export default ImageProcessor;
