import type { RequestHandler } from '@sveltejs/kit';
import * as nodeCanvas from 'canvas';
import type { Image, Canvas, CanvasRenderingContext2D } from 'canvas';
import * as faceapi from 'face-api.js';
import type { Point } from 'face-api.js';
import ImageProcessor from '../lib/utils/image-processor';

function drawRotated(
	canvas: Canvas,
	context: CanvasRenderingContext2D,
	image: Image,
	degrees: number
) {
	context.clearRect(0, 0, canvas.width, canvas.height);

	// save the unrotated context of the canvas so we can restore it later
	context.save();

	// move to the center of the canvas
	context.translate(canvas.width / 2, canvas.height / 2);

	// rotate the canvas to the specified degrees
	context.rotate((degrees * Math.PI) / 180);

	// draw the image - since the context is rotated, the image will be rotated also
	context.drawImage(image, -image.width / 2, -image.height / 2);

	// we’re done with the rotating so restore the unrotated context
	context.restore();
}

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

	// Would need to convert to class... maybe at some point!
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const ip2 = new ImageProcessor(canvas, image);

	ip2.loadImage(image);
	const mm = ip2.getMap();
	ip2.toHSV(mm);
	mm.mode = ImageProcessor.colorModes.RGBA;

	ip2.threshold(
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
	ip2.erode(mm, 2);
	ip2.dilute(mm, 3);
	ip2.setMap(mm);

	ip2.render();
	ip2.compositePaintImage(image, 'source-in');
	ip2.tint();

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

	return { body: { message: 'Shrekified image', image: shrekifiedImage } };
};
