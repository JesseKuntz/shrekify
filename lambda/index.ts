import * as nodeCanvas from 'canvas';
import type { Image } from 'canvas';
import faceDetect from './face-detect';
import { turnSkinGreen } from './utils/canvas-helpers';

type Event = {
	body: string;
};

type ShrekifyProps = {
	file: string;
};

exports.handler = async (event: Event, _: unknown, callback: (e: Error) => void) => {
	const { file }: ShrekifyProps = JSON.parse(event.body);

	let shrekifiedImage = '';

	try {
		const { loadImage, createCanvas } = nodeCanvas;

		const image = await loadImage(file);
		const canvas = createCanvas(image.width, image.height);
		const context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, image.width, image.height);

		turnSkinGreen(image, canvas);

		const faces = faceDetect.detect_objects({ canvas, interval: 5, min_neighbors: 1 });

		const leftEar = await loadImage('./assets/left-ear.png');
		const rightEar = await loadImage('./assets/right-ear.png');

		const drawEar = (image: Image, point: { x: number; y: number }, earSize: number) => {
			context.drawImage(image, point.x - earSize / 2, point.y - earSize, earSize, earSize);
		};

		for (const face of faces) {
			const earShift = face.width / 10;

			const topLeft = { x: face.x + earShift, y: face.y - earShift };
			const topRight = { x: face.x + face.width - earShift, y: face.y - earShift };

			const earSize = face.width / 4;

			drawEar(leftEar, topLeft, earSize);
			drawEar(rightEar, topRight, earSize);
		}

		shrekifiedImage = canvas.toDataURL('image/jpeg');
	} catch (e) {
		callback(e as Error);
	}

	return { body: JSON.stringify({ image: shrekifiedImage }), statusCode: 200 };
};
