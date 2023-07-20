import { MouseEvent, useCallback, useMemo } from "react";
import { LikeButton, ShareButton } from "../interactable-button";
import { formatDistanceToNow } from 'date-fns'
import styles from "./index.module.css";
import { Avatar } from "../avatar";
import type { ResponseFeedItem } from "../../app/api/user/feed/route";
import { BsMegaphoneFill } from "react-icons/bs";
import { IoChatbubbleOutline, IoHeartOutline } from "react-icons/io5";
import { useRouter } from "next/router";

function formatDateString(dateString: string): string {
	const date = new Date(dateString);
	let value = formatDistanceToNow(date);
	value = value.replace("about ", "")
	value = value.replace("less than ", "")
	value = value.replace("over ", "")
	return `${value} ago`
}

export function Nut({
	nut,
	event
}: ResponseFeedItem) {

	const { user,
		createdAt: createdAtRaw,
		content,
		shareCount,
		likeCount,
		liked,
		shared,
		id
	} = nut;

	const createdAt = useMemo(() => formatDateString(createdAtRaw), [createdAtRaw])
	const eventDate = useMemo(() => formatDateString(event.createdAt), [event.createdAt]);

	const eventMessage = useMemo(() => {
		switch (event.type) {
			case "comment":
				return "commented on";
			case "share":
				return "shared";
			case "like":
				return "liked";
			default:
				return "";
		}
	}, [event.type]);

	const EventIcon = useMemo(() => {
		switch (event.type) {
			case "comment":
				return IoChatbubbleOutline;
			case "share":
				return BsMegaphoneFill;
			default:
				return IoHeartOutline;
		}
	}, [event.type]);

	const router = useRouter();

	const handleMainClick = useCallback(() => {
		router.push(`/nut/${id}`)
	}, [router, id]);

	const handleAvatarClick = useCallback((ev: MouseEvent) => {
		ev.stopPropagation();
		router.push(`/${nut.user.id}`)
	}, [router, nut]);

	return <div onClick={handleMainClick} className={styles.container}>
		{event.type === 'nut' ? null : <div className={styles.event}>
			<EventIcon className={styles.eventIcon} />
			<span>@{event.user.username}</span>
			<span>{eventMessage}</span>
			<span>@{nut.user.username}&apos;s nut</span>
			<span>{eventDate}</span>
		</div>}
		<div
			className={styles.tick}>
			<Avatar onClick={handleAvatarClick} name={user.name} id={user.id} />
			<div className={styles.content}>
				<div className={styles.top}>
					<span className={styles.name}>{user.name}</span>
					<span>·</span>
					<span>@{user.username}</span>
					<span>·</span>
					<span>{createdAt}</span>
				</div>
				<p>{content}</p>
				<div className={styles.buttons} >
					<LikeButton id={id} initialStatus={liked} initialCount={likeCount} />
					<ShareButton id={id} initialStatus={shared} initialCount={shareCount} />
				</div>
			</div>
		</div>
	</div>
}