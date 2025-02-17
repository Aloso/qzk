import type { Image } from '$lib/data'

function getIdealWidth(img: Image, width?: number, height?: number): number {
	const aspectRatio = img.width / img.height
	const factor = (width && width < 70) || (height && height < 70) ? 2 : 1.5

	if (width !== undefined && height !== undefined) {
		const desiredRatio = width / height
		if (aspectRatio > desiredRatio) {
			// image file is too wide
			return (width * factor * aspectRatio) / desiredRatio
		} else {
			return width * factor
		}
	} else if (width !== undefined) {
		return width * factor
	} else if (height !== undefined) {
		return height * aspectRatio * factor
	} else {
		return Math.min(img.width, 1920)
	}
}

interface Size {
	width: number
	height: number
}

export function getSize(img: Image, width?: number, height?: number): Size {
	const idealWidth = Math.round(getIdealWidth(img, width, height))
	const clampedWidth = Math.min(img.width, idealWidth)
	const clampedHeight = Math.round((img.height * clampedWidth) / img.width)
	return {
		width: clampedWidth,
		height: clampedHeight,
	}
}

export function getHtmlSize(size: Size, width?: number, height?: number): Partial<Size> {
	if (width && height) {
		return { width, height }
	} else if (width) {
		return { width, height: (size.height * width) / size.width }
	} else if (height) {
		return { height, width: (size.width * height) / size.height }
	} else {
		return size
	}
}
