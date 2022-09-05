// Largely inspired by https://codepen.io/mathdotrandom/pen/ANgeBx 🙏

import * as nodeCanvas from 'canvas';
import type { Image } from 'canvas';

function ImageProcessor(image: Image) {
	const { createCanvas, Image } = nodeCanvas;

	const WID = image.width;
	const HIE = image.height;

	const node = createCanvas(WID, HIE);
	const bufferCtx = node.getContext('2d');
	let bufferImageData = null;
	let map = new PixelMapInterface(ImageProcessor.color_modes.RGBA, WID, HIE);

	// handy publics
	this.width = node.width = WID;
	this.height = node.height = HIE;

	this.emptyMap = function () {
		const newMap = map.clone();
		newMap.clear();
		return newMap;
	};

	this.update = function () {
		bufferImageData = bufferCtx.getImageData(0, 0, WID, HIE);
		map.loadFromCanvasPixelArray(bufferImageData);
	};

	this.render = function () {
		map.dumpToCanvasPixelArray(bufferImageData);
		bufferCtx.putImageData(bufferImageData, 0, 0);
	};

	this.getMap = function () {
		return map.clone();
	};

	this.setMap = function (newMap) {
		if (newMap.mode !== undefined) map = newMap;
	};

	this.pasteImage = function (img) {
		bufferCtx.drawImage(img, 0, 0, this.width, this.height);
		this.update();
	};

	this.compositePaintImage = function (img, gco) {
		bufferCtx.globalCompositeOperation = gco;
		this.pasteImage(img);
		bufferCtx.globalCompositeOperation = 'none';
	};

	this.tint = function (canvas) {
		const x = canvas.getContext('2d');

		const fg = new Image();
		fg.src = this.getImageUrl();

		// create offscreen buffer,
		const buffer = createCanvas(fg.width, fg.height);
		const bx = buffer.getContext('2d');

		// fill offscreen buffer with the tint color
		bx.fillStyle = '#00FF00';
		bx.fillRect(0, 0, buffer.width, buffer.height);

		// destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
		bx.globalCompositeOperation = 'destination-atop';
		bx.drawImage(fg, 0, 0);

		// to tint the image, draw it first
		x.drawImage(fg, 0, 0);

		//then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
		x.globalAlpha = 0.2;
		x.drawImage(buffer, 0, 0);
		x.globalAlpha = 1;
	};

	this.getImageUrl = function () {
		return node.toDataURL('image/png');
	};
}

ImageProcessor.prototype.loadImage = function (img) {
	if (img.complete !== true) {
		img.addEventListener('load', this.loadImage);
		return;
	}
	this.pasteImage(img);
};

ImageProcessor.color_modes = {
	BOOLEAN: -1,
	RGBA: 0,
	RGB: 1,
	GREYSCALE: 2,
	HSVA: 3,
	HSV: 4
};
ImageProcessor.utils = {};
ImageProcessor.noops = {
	RGBA: {
		R: 0,
		G: 0,
		B: 0,
		A: 0
	}
};

function PixelMapInterface(mode, width, height) {
	this.mode = mode;
	this.width = width;
	this.height = height;
	this.templateMap = [];

	for (let y = 0; y < this.height; y++) {
		this.templateMap[y] = [];

		for (let x = 0; x < this.width; x++) {
			this.templateMap[y][x] = {
				R: 0,
				G: 0,
				B: 0,
				A: 0
			};
		}
	}

	this.clear = function () {
		this.data = this.templateMap.map(function (e) {
			return e.slice(0);
		});
	};

	this.clone = function () {
		return Object.assign({}, this);
	};

	this.setMap = function (data) {
		this.data = data;
	};

	this.clear();

	this.dumpToCanvasPixelArray = function (ImageData) {
		const PixelArray = ImageData.data;
		let x = 0,
			y = 0,
			pixel_iter = 0,
			pixel = null;

		for (y = 0; y < this.height; y++) {
			for (x = 0; x < this.width; x++) {
				pixel = this.data[y][x];
				PixelArray[pixel_iter] = pixel.R;
				PixelArray[pixel_iter + 1] = pixel.G;
				PixelArray[pixel_iter + 2] = pixel.B;
				PixelArray[pixel_iter + 3] = pixel.A;
				pixel_iter += 4;
			}
		}
	};

	this.loadFromCanvasPixelArray = function (ImageData) {
		const PixelArray = ImageData.data;
		let x = 0,
			y = 0,
			pixel_iter = 0,
			pixel = null;

		for (y = 0; y < this.height; y++) {
			for (x = 0; x < this.width; x++) {
				pixel = this.data[y][x];
				pixel.R = PixelArray[pixel_iter];
				pixel.G = PixelArray[pixel_iter + 1];
				pixel.B = PixelArray[pixel_iter + 2];
				pixel.A = PixelArray[pixel_iter + 3];
				pixel_iter += 4;
			}
		}
	};
}

ImageProcessor.ThresHold = function (max, min) {
	if (this.mode === undefined) {
		console.log('Invalid call');
	}

	function constrain(pixel) {
		for (const key in ImageProcessor.noops.RGBA) {
			if (max && key in max && pixel[key] > max[key]) {
				return false;
			}
			if (min && key in min && pixel[key] < min[key]) {
				return false;
			}
		}

		return true;
	}
	this.mode = ImageProcessor.color_modes.BOOLEAN;
	let w = this.width,
		ht = this.height,
		x = 0,
		y = 0,
		pixel = null;
	for (y; y < ht; y++) {
		for (x = 0; x < w; x++) {
			pixel = this.data[y][x];
			if (!constrain(pixel)) {
				pixel.R = pixel.G = pixel.B = pixel.A = 0;
			} else {
				pixel.R = pixel.G = pixel.B = pixel.A = 255;
			}
		}
	}
};

ImageProcessor.Dilute = function (k) {
	if (this.mode === undefined || this.mode !== ImageProcessor.color_modes.BOOLEAN) {
		console.log('Invalid Call');
		return;
	}

	const _temp = this.data.map(function (e) {
		return e.slice(0);
	});

	let w = this.width,
		h = this.height,
		manhattan = ImageProcessor.utils.ManhattanOracle(_temp, w, h, 255),
		x = 0,
		y = 0,
		image = this.data,
		pixel;
	for (y; y < h; y++) {
		for (x = 0; x < w; x++) {
			pixel = image[y][x];
			pixel.R = pixel.G = pixel.B = pixel.A = manhattan[y][x] <= k ? 255 : 0;
		}
	}
};

ImageProcessor.Erode = function (k) {
	if (this.mode === undefined || this.mode !== ImageProcessor.color_modes.BOOLEAN) {
		console.log('Invalid Call');
		return;
	}

	const _temp = this.data.map(function (e) {
		return e.slice(0);
	});

	let w = this.width,
		h = this.height,
		manhattan = ImageProcessor.utils.ManhattanOracle(_temp, w, h, 0),
		x = 0,
		y = 0,
		image = this.data,
		pixel;
	for (y; y < h; y++) {
		for (x = 0; x < w; x++) {
			pixel = image[y][x];
			pixel.R = pixel.G = pixel.B = pixel.A = manhattan[y][x] <= k ? 0 : 255;
		}
	}
};

ImageProcessor.utils.ManhattanOracle = function (dataMap, w, h, quan) {
	let x,
		y,
		pixel,
		max = w + h,
		comp = 0;
	for (y = 0; y < h; y++) {
		for (x = 0; x < w; x++) {
			comp++;
			pixel = dataMap[y][x];
			if (pixel.R == quan) {
				pixel = 0;
			} else {
				pixel = max;
				if (y > 0) pixel = Math.min(pixel, dataMap[y - 1][x] + 1);
				if (x > 0) pixel = Math.min(pixel, dataMap[y][x - 1] + 1);
			}
			dataMap[y][x] = pixel;
		}
	}

	const w_minus_1 = w - 1;

	for (y = h - 1; y >= 0; y--) {
		for (x = w_minus_1; x >= 0; x--) {
			pixel = dataMap[y][x];
			if (y + 1 < h) pixel = Math.min(pixel, dataMap[y + 1][x] + 1);
			if (x + 1 < w) pixel = Math.min(pixel, dataMap[y][x + 1] + 1);
			dataMap[y][x] = pixel;
		}
	}
	return dataMap;
};

ImageProcessor.toHSV = function () {
	if (this.mode === undefined) {
		console.log('Invalid call');
		return;
	}
	if (this.mode === ImageProcessor.color_modes.HSV) {
		return;
	}
	let w = this.width,
		ht = this.height,
		x = 0,
		y = 0,
		h,
		s,
		v,
		max,
		min,
		delta,
		r,
		g,
		b,
		pixel = null;

	this.mode = ImageProcessor.color_modes.HSL;

	for (y; y < ht; y++) {
		for (x = 0; x < w; x++) {
			pixel = this.data[y][x];
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

export default function tintFace(canvas, image) {
	const ip2 = new ImageProcessor(image);

	ip2.loadImage(image);
	const mm = ip2.getMap();
	ImageProcessor.toHSV.call(mm);
	mm.mode = ImageProcessor.color_modes.RGBA;

	ImageProcessor.ThresHold.call(
		mm,
		{
			R: 38,
			G: 0.68
		},
		{
			R: 6,
			G: 0.23
		}
	);
	ImageProcessor.Erode.call(mm, 2);
	ImageProcessor.Dilute.call(mm, 3);
	ip2.setMap(mm);

	ip2.render();
	ip2.compositePaintImage(image, 'source-in');
	ip2.tint(canvas);
}
