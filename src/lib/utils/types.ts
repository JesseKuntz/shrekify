export type RGBA = {
	R: number;
	G: number;
	B: number;
	A: number;
};

export type TemplateMapType = Array<Array<RGBA>>;

type PixelMapInterfaceThis = {
	mode: number;
	width: number;
	height: number;
	templateMap: TemplateMapType;
	data: TemplateMapType;
	clear: () => void;
	clone: () => PixelMapInterfaceThis;
	setMap: (data: TemplateMapType) => void;
	dumpToCanvasPixelArray: (imageData: ImageData) => void;
	loadFromCanvasPixelArray: (imageData: ImageData) => void;
};

export type ImageProcessorFunction = {
	(
		this: {
			width: number;
			height: number;
			update: () => void;
			render: () => void;
			getMap: () => PixelMapInterfaceThis;
			setMap: (map: PixelMapInterfaceThis) => void;
			pasteImage: (image: HTMLImageElement) => void;
			compositePaintImage: (image: HTMLImageElement, gco: GlobalCompositeOperation) => void;
			tint: (canvas: HTMLCanvasElement) => void;
			getImageUrl: () => string;
			toHSV: (map: PixelMapInterfaceThis) => void;
			threshold: (
				map: PixelMapInterfaceThis,
				max: Record<string, number>,
				min: Record<string, number>
			) => void;
			traverseImage: (
				map: PixelMapInterfaceThis,
				k: number,
				oracleValue: number,
				backupValue: number
			) => void;
			dilute: (map: PixelMapInterfaceThis, k: number) => void;
			erode: (map: PixelMapInterfaceThis, k: number) => void;
			manhattanOracle: (
				dataMap: Array<Array<number>> | TemplateMapType,
				w: number,
				h: number,
				quan: number
			) => Array<Array<number>>;
			loadImage: (image: HTMLImageElement) => void;
		},
		canvas: HTMLCanvasElement,
		image: HTMLImageElement
	): void;
	colorModes: Record<string, number>;
	RGBA: RGBA;
};

export type PixelMapInterfaceFunction = (
	this: PixelMapInterfaceThis,
	mode: number,
	width: number,
	height: number
) => void;
