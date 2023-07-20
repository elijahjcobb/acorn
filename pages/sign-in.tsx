import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import { IoLockClosed, IoAt } from "react-icons/io5";
import { APIError } from "../lib/api/api-error";
import { AuthPage } from "../components/auth";
import { Field } from "../components/field";
import { fetcher } from "../lib/front/fetch";

export default function Page() {

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const router = useRouter();

	const handleSubmit = useCallback(() => {
		setIsLoading(true);
		setErrorMessage(undefined);
		fetcher({
			url: `/user/sign-in`,
			method: 'post',
			body: {
				username, password
			}
		}).then(() => {
			router.push("/");
		}).catch(err => {
			let message = "An error occurred.";
			if (err instanceof APIError) message = err.message;
			setErrorMessage(message);
		}).finally(() => {
			setIsLoading(false);
		})
	}, [username, password, router]);

	return <AuthPage
		type="in"
		onSubmit={handleSubmit}
		isLoading={isLoading}
		errorMessage={errorMessage}
	>
		<Field
			icon={IoAt}
			placeholder='username'
			value={username}
			onChange={setUsername}
		/>
		<Field
			icon={IoLockClosed}
			placeholder='password'
			value={password}
			type='password'
			onChange={setPassword}
			onEnter={handleSubmit}
		/>
	</AuthPage>
}