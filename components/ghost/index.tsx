import styles from "./index.module.css";

export function Ghost({ height = 135, width = '100%', borderRadius }: { height?: number, width?: number | string, borderRadius?: string | number }) {
	return <div style={{ height, width, borderRadius }} className={styles.container}>
		<div style={{ height }} className={styles.ghost} />
	</div>
}