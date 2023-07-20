import styles from "./index.module.css";
import type { IconType } from "react-icons";
import { ChangeEvent, HTMLInputTypeAttribute, KeyboardEvent, useCallback, useEffect } from "react";

export function Field({
	placeholder = '',
	icon: Icon,
	onChange,
	value,
	type = 'text',
	onEnter
}: {
	placeholder?: string;
	icon?: IconType;
	value?: string;
	onChange?: (value: string) => void;
	type?: HTMLInputTypeAttribute | undefined;
	onEnter?: () => void;
}) {

	const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(ev.target.value);
	}, [onChange]);

	const handleKeyDown = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Enter" && onEnter) onEnter();
	}, [onEnter]);

	return <div className={styles.container}>
		{Icon ? <Icon className={styles.icon} /> : null}
		<input
			placeholder={placeholder}
			className={styles.field}
			value={value}
			onChange={handleChange}
			type={type}
			onKeyDown={handleKeyDown}
		/>
	</div>
}