import ImageProcessor from './image-processor';

export const turnSkinGreen = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
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
