declare module 'emoji-sprinkle' {
	export function sprinkleEmojis({
		emoji,
		fontSize,
		count,
		fade
	}: {
		emoji?: string;
		fontSize?: number;
		count?: number;
		fade?: number;
	}): void;
}
