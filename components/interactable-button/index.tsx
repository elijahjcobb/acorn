import clsx from "clsx";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { fetcher } from "../../lib/front/fetch";
import type { ResponseLike } from "../../app/api/nut/like/route";
import { AcornIcon } from "../icons/icon";
import styles from "./index.module.css";
import { BsMegaphone, BsMegaphoneFill } from "react-icons/bs";

interface Props {
	initialStatus: boolean;
	initialCount: number;
	id: string;
}

function useInteractableBinaryButton({
	initialCount,
	initialStatus,
	id,
	path
}: {
	path: 'like' | 'share';
} & Props) {
	const [status, setStatus] = useState(initialStatus);
	const [count, setCount] = useState(initialCount);

	const handleClick = useCallback((ev: MouseEvent) => {

		ev.stopPropagation();

		const pre = { status, count };

		setCount(count + (status ? -1 : 1));
		setStatus(!status);

		(async () => {

			const res = await fetcher<ResponseLike>({
				url: `/nut/${path}`,
				body: { id },
				method: "post"
			});

			setCount(res.count);
			setStatus(res.status);

		})().catch(err => {
			console.error(err);
			setCount(pre.count);
			setStatus(pre.status);
		})
	}, [status, count, id, path]);

	return { status, count, handleClick };

}

export function LikeButton({
	initialCount,
	initialStatus,
	id
}: Props) {

	const { count, status, handleClick } = useInteractableBinaryButton({ initialCount, initialStatus, id, path: "like" });

	return <button onClick={handleClick} className={styles.button}>
		<div className={styles.left}>
			<div className={styles.background} />
			<AcornIcon outlineClassName={clsx(styles.outline, status && styles.outlineEnabled)} enabled={status} className={styles.icon} size={24} />
		</div>
		<span className={clsx(styles.count, status && styles.countEnabled)}>{count}</span>
	</button >
}

export function ShareButton({
	initialCount, initialStatus, id
}: Props) {
	const { count, status, handleClick } = useInteractableBinaryButton({ initialCount, initialStatus, id, path: "share" });

	const Icon = useMemo(() => status ? BsMegaphoneFill : BsMegaphone, [status]);

	return <button onClick={handleClick} className={styles.button}>
		<div className={styles.left}>
			<div className={clsx(styles.background, styles.shareBackground)} />
			<Icon size={18} className={clsx(styles.icon, styles.shareIcon, status && styles.shareIconEnabled)} />
		</div>
		<span className={clsx(styles.count, styles.shareCount, status && styles.shareCountEnabled)}>{count}</span>
	</button >
}