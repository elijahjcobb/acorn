import { Button } from "../button";
import styles from "./index.module.css";
import { RiSendPlaneFill } from "react-icons/ri";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetcher } from "../../lib/front/fetch";
import type { ResponseFeedItem } from "../../app/api/user/feed/route";

export function Composer({
	onCreateTick
}: {
	onCreateTick: (tick: ResponseFeedItem) => void;
}) {

	const [value, setValue] = useState("");
	const ref = useRef<HTMLTextAreaElement>(null);
	const [loading, setLoading] = useState(false);

	const handleTick = useCallback(() => {
		setLoading(true);
		fetcher<ResponseFeedItem>({
			url: "/nut",
			method: "post",
			body: { content: value }
		}).then(res => {
			onCreateTick(res);
			setLoading(false);
			setValue("");
		}).catch(() => {
			setLoading(false);
		})
	}, [value, setLoading, onCreateTick]);

	useEffect(() => {
		ref.current?.focus();
	}, []);

	return <div className={styles.modal}>
		<textarea
			ref={ref}
			placeholder="What's going on in your neck of the woods?"
			className={styles.field}
			value={value}
			onChange={ev => setValue(ev.target.value)}
		/>
		<Button
			value="stow acorn"
			icon={RiSendPlaneFill}
			hoverIcon={RiSendPlaneFill}
			onClick={handleTick}
			loading={loading}
			disabled={loading}
		/>
	</div>
}