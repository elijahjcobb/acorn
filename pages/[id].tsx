import { useRouter } from "next/router";
import { Shell } from "../components/shell";

export default function Page() {

	const router = useRouter();

	return <Shell>user {router.query.id}</Shell>
}