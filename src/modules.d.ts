declare module 'emoji-sprinkle' {
	export function sprinkleEmojis({
		emoji,
		fontSize,
		count
	}: {
		emoji: string;
		fontSize: number;
		count: number;
	}): void;
}
