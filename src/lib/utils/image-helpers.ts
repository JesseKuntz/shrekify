export const downloadImage = (image: string) => {
	const a = document.createElement('a');

	a.href = image;
	a.download = 'shrekified';

	document.body.appendChild(a);

	a.click();

	document.body.removeChild(a);
};

export const shareImage = async (image: string) => {
	const response = await fetch(image);
	const blob = await response.blob();

	const files = [
		new File([blob], 'shrekify.jpg', {
			type: 'image/jpeg',
			lastModified: new Date().getTime()
		})
	];

	if (
		navigator.canShare({
			files
		})
	) {
		return navigator.share({
			files
		});
	}

	window.alert('Sorry, sharing is not available in this browser.');
};

export const calculateSize = (img: HTMLImageElement, maxWidth = 1000, maxHeight = 1000) => {
	let width = img.width;
	let height = img.height;

	if (width > height) {
		if (width > maxWidth) {
			height = Math.round((height * maxWidth) / width);
			width = maxWidth;
		}
	} else {
		if (height > maxHeight) {
			width = Math.round((width * maxHeight) / height);
			height = maxHeight;
		}
	}

	return { width, height };
};
