import * as nodeCanvas from 'canvas';
import type { Image } from 'canvas';
import * as faceapi from '@vladmandic/face-api';
import type { Point } from '@vladmandic/face-api';
import { turnSkinGreen } from './utils/canvas-helpers';
import '@tensorflow/tfjs-node';

type Event = {
	body: string;
};

type ShrekifyProps = {
	file: string;
};

exports.shrekify = async (event: Event, _: unknown, callback: (e: Error) => void) => {
	const { file }: ShrekifyProps = JSON.parse(event.body);

	let shrekifiedImage = '';

	try {
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

		await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');

		let image = await loadImage(file);

		const canvas = createCanvas(image.width, image.height);

		const context = canvas.getContext('2d');

		context.drawImage(image, 0, 0, image.width, image.height);

		const dataUrl = canvas.toDataURL('image/png');
		image = await loadImage(dataUrl);

		turnSkinGreen(image, canvas);

		const faces = await faceapi.detectAllFaces(image as unknown as HTMLImageElement);

		const leftEar = await loadImage('./assets/left-ear.png');
		const rightEar = await loadImage('./assets/right-ear.png');

		const drawEar = (image: Image, point: Point, earSize: number) => {
			context.drawImage(image, point.x - earSize / 2, point.y - earSize, earSize, earSize);
		};

		for (const face of faces) {
			const box = face.box;
			const earSize = box.width / 4;

			drawEar(leftEar, box.topLeft, earSize);
			drawEar(rightEar, box.topRight, earSize);
		}

		shrekifiedImage = canvas.toDataURL('image/png');
	} catch (e) {
		callback(e as Error);
	}

	return { body: JSON.stringify({ image: shrekifiedImage }), statusCode: 200 };
};
