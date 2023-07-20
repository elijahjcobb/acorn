import { useRouter } from "next/router";
import { useCallback } from "react";
import { useFetch } from "../../lib/front/fetch";
import type { ResponseUser } from "../../app/api/user/route";
import { Avatar } from "../avatar";
import { Button } from "../button";
import { Ghost } from "../ghost";

export function UserAvatar(): JSX.Element | null {

	const router = useRouter();

	const handleClick = useCallback(() => {
		router.push("/settings");
	}, [router]);

	const { data: user, error } = useFetch<ResponseUser>({ path: "/user" })
	if (error) return <Button href="/sign-up" value="Sign Up" />;
	return !user ?
		<Ghost height={64} width={64} borderRadius={32} />
		: <Avatar onClick={handleClick} size={64} name={user.name} id={user.id} />
}