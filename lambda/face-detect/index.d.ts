import type { Canvas } from 'canvas';

type Face = {
	x: number;
	y: number;
	width: number;
};

type DetectObjectsParams = {
	canvas: Canvas;
	interval: number;
	min_neighbors: number;
};

type DetectObjects = (params: DetectObjectsParams) => Array<Face>;

export default {
	detect_objects: DetectObjects
};
