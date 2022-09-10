import type { Image, Canvas, CanvasRenderingContext2D } from 'canvas';
import ImageProcessor from './image-processor';

export const drawRotated = (
	canvas: Canvas,
	context: CanvasRenderingContext2D,
	image: Image,
	degrees: number
) => {
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
};

export const turnSkinGreen = (image: Image, canvas: Canvas) => {
	// Would need to convert to class... maybe at some point!
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const imageProcessor = new ImageProcessor(canvas, image);

	imageProcessor.loadImage();
	const map = imageProcessor.getMap();
	imageProcessor.toHSV(map);
	map.mode = ImageProcessor.colorModes.RGBA;

	imageProcessor.threshold(
		map,
		{
			R: 38,
			G: 0.68
		},
		{
			R: 6,
			G: 0.23
		}
	);
	imageProcessor.erode(map, 2);
	imageProcessor.dilute(map, 3);
	imageProcessor.setMap(map);
	imageProcessor.render();
	imageProcessor.compositePaintImage(image, 'source-in');
	imageProcessor.tint();
};
