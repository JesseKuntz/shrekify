import type { RequestHandler } from '@sveltejs/kit';
import * as nodeCanvas from 'canvas';
import type { Image } from 'canvas';
import * as faceapi from 'face-api.js';
import type { Point } from 'face-api.js';
import { drawRotated, turnSkinGreen } from '$lib/utils/canvas-helpers';

export const post: RequestHandler = async ({ request }) => {
	// Keep until we have it running on a server in production OR we test a prod build locally
	// console.log(process.cwd());
	// fs.readdirSync('./').forEach(file => {
	//   console.log(file);
	// });

	const { Canvas, Image, ImageData, loadImage, createCanvas } = nodeCanvas;
	faceapi.env.monkeyPatch({
		Canvas: Canvas as unknown as {
			new (): HTMLCanvasElement;
			prototype: HTMLCanvasElement;
		},
		Image: Image as unknown as {
			new (): HTMLImageElement;
			prototype: HTMLImageElement;
		},
		ImageData
	});

	await faceapi.nets.ssdMobilenetv1.loadFromDisk('./src/assets/models');

	const data = await request.formData();
	const file = data.get('file');
	const landscape = data.get('landscape') === '1';
	let image = await loadImage(file as unknown as Buffer);

	let canvas;
	if (landscape) {
		canvas = createCanvas(image.width, image.height);
	} else {
		canvas = createCanvas(image.height, image.width);
	}

	const context = canvas.getContext('2d');

	if (landscape) {
		context.drawImage(image, 0, 0, image.width, image.height);
	} else {
		drawRotated(canvas, context, image, 90);
	}

	const dataUrl = canvas.toDataURL('image/png');
	image = await loadImage(dataUrl);

	turnSkinGreen(image, canvas);

	const faces = await faceapi.detectAllFaces(image as unknown as HTMLImageElement);

	const leftEar = await loadImage('./src/assets/left-ear.png');
	const rightEar = await loadImage('./src/assets/right-ear.png');

	const drawEar = (image: Image, point: Point, earSize: number) => {
		context.drawImage(image, point.x - earSize / 2, point.y - earSize, earSize, earSize);
	};

	for (const face of faces) {
		const box = face.box;
		const earSize = box.width / 4;

		drawEar(leftEar, box.topLeft, earSize);
		drawEar(rightEar, box.topRight, earSize);
	}

	const shrekifiedImage = canvas.toDataURL('image/png');

	return { body: { image: shrekifiedImage } };
};
