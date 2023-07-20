import { ReactNode } from "react";
import { Nav } from "../nav";
import styles from "./index.module.css";

export function Shell({
	children,
	width = 480,
	borderRadius = 'var(--sp2)',
	margin = 'var(--sp4) 0',
	hideNav = false
}: {
	children: ReactNode,
	hideNav?: boolean;
	width?: number | string;
	borderRadius?: number | string;
	margin?: string | number;
}) {
	return <div className={styles.main}>
		{hideNav ? null : <Nav />}
		<div
			style={{
				maxWidth: width,
				borderRadius,
				margin
			}}
			className={styles.container}>
			{children}
		</div>
	</div>
}