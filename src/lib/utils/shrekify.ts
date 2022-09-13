import * as faceapi from '@vladmandic/face-api';
import type { Point } from '@vladmandic/face-api';
import { turnSkinGreen } from '$lib/utils/canvas-helpers';

const shrekify = async (src: string) => {
	await faceapi.loadSsdMobilenetv1Model('./src/assets/models');

	const image = document.querySelector('.placeholder-image') as HTMLImageElement;
	image.src = src;

	const canvas = document.querySelector('.shrekify-canvas') as HTMLCanvasElement;

	canvas.width = image.width;
	canvas.height = image.height;

	const context = canvas.getContext('2d');

	if (!context) {
		return '';
	}

	context.drawImage(image, 0, 0, image.width, image.height);

	turnSkinGreen(image, canvas);

	const faces = await faceapi.detectAllFaces(image as unknown as HTMLImageElement);

	const drawEar = (image: HTMLImageElement, point: Point, earSize: number) => {
		context.drawImage(image, point.x - earSize / 2, point.y - earSize, earSize, earSize);
	};

	for (const face of faces) {
		const box = face.box;
		const earSize = box.width / 4;

		drawEar(document.querySelector('.left-ear') as HTMLImageElement, box.topLeft, earSize);
		drawEar(document.querySelector('.right-ear') as HTMLImageElement, box.topRight, earSize);
	}

	const shrekifiedImage = canvas.toDataURL('image/png');

	return shrekifiedImage;
};

export default shrekify;
