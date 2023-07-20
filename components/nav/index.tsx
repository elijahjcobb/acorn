import Link from "next/link";
import { AcornIcon } from "../icons/icon";
import { UserAvatar } from "../user-avatar";
import styles from "./index.module.css";

export function Nav() {
	return <nav className={styles.nav}>
		<Link href='/home' className={styles.navIcon}>
			<AcornIcon />
			<h1>acorn</h1>
		</Link>
		<UserAvatar />
	</nav>
}