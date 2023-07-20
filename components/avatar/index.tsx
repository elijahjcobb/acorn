import clsx from "clsx";
import { MouseEvent, useMemo } from "react";
import styles from "./index.module.css";

function generateCodeForId(id: string, rand: number, max: number, step: number): number {
	let value = 1;
	let i = 1;
	for (const char of id) {
		const code = char.charCodeAt(0);
		value *= code + (i * rand) / i;
	}
	return value % (max < 0 ? 0 : max) + step;
}

function rgbToHex(color: [number, number, number]): string {
	return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
}

function generateColor(id: string, delta = 0): [number, number, number] {
	return [
		generateCodeForId(id, 1, 255, 0) - delta,
		generateCodeForId(id, 2, 255, 0) - delta,
		generateCodeForId(id, 3, 255, 0) - delta
	];
}

function generateColors(id: string): string[] {
	return [
		rgbToHex(generateColor(id)),
		rgbToHex(generateColor(id, 50)),
	]
}

export function Avatar({
	size = 48,
	name,
	id,
	onClick
}: {
	size?: number;
	name: string;
	id: string;
	onClick?: (ev: MouseEvent) => void;
}) {

	const colors = useMemo(() => {
		return generateColors(id);
	}, [id]);

	const initials = useMemo(() => {
		const nameSegments = name.split(" ").slice(0, 2);
		return nameSegments.map(v => v.charAt(0)).join("");
	}, [name]);

	return <div
		style={{
			width: size,
			height: size,
			fontSize: size / 2,
			background: `linear-gradient(${colors.join(", ")})`
		}}
		onClick={onClick}
		className={clsx(styles.avatar, onClick && styles.clickable)}>
		{initials}
	</div>
}