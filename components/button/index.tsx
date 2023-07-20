import Link from "next/link";
import styles from "./index.module.css";
import type { IconType } from "react-icons/lib";
import clsx from "clsx";
import { ImSpinner6 } from 'react-icons/im';
import { HiCursorClick } from 'react-icons/hi';

function RawButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return <button {...props} />
}

export function Button({
	value,
	icon: Icon,
	href,
	onClick,
	variant = 'pri',
	type,
	disabled,
	loading,
	hoverIcon: HoverIcon = HiCursorClick,
	inline = false
}: {
	value: string;
	icon?: IconType
	onClick?: () => void;
	href?: string;
	variant?: 'pri' | 'sec';
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	loading?: boolean;
	hoverIcon?: IconType;
	inline?: boolean;
}) {

	const Component = href ? Link : RawButton;
	const hrefData = (href ? { href } : {}) as { href: string };

	return <Component
		className={clsx(styles.button, {
			[styles.pri]: variant === 'pri',
			[styles.sec]: variant === 'sec',
			[styles.inline]: inline
		})}
		disabled={disabled || loading}
		onClick={onClick}
		type={type}
		{...hrefData}>
		{Icon ? <Icon /> : null}
		{loading ?
			<ImSpinner6 className={styles.spinner} />
			: <span>{value}</span>}
		<HoverIcon size={24} className={styles.clicker} />
	</Component>
}