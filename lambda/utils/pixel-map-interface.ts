/****
 * Not my code: converted to TS from https://codepen.io/mathdotrandom/pen/ANgeBx
 ****/

import type { PixelMapInterfaceFunction } from './types';

const PixelMapInterface = <PixelMapInterfaceFunction>function (mode, width, height) {
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

	this.clear = () => {
		this.data = this.templateMap.map((e) => {
			return e.slice();
		});
	};

	this.clone = () => {
		return Object.assign({}, this);
	};

	this.setMap = (data) => {
		this.data = data;
	};

	this.clear();

	this.dumpToCanvasPixelArray = (imageData) => {
		const PixelArray = imageData.data;
		let x = 0,
			y = 0,
			pixel_iter = 0,
			pixel;

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

	this.loadFromCanvasPixelArray = (imageData) => {
		const PixelArray = imageData.data;
		let x = 0,
			y = 0,
			pixel_iter = 0,
			pixel;

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
};

export default PixelMapInterface;
