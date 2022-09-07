import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../hooks/UserProvider';
import Client from '../utils/AxiosClient';

type loginform = {
	email: string;
	password: string;
};

export default function Login() {
	const { user, setUser, rooms, setRooms } = useUserContext() || { user: null, setUser: null, rooms: [], setRooms: null };
	const [loggingIn, setLoggingIn] = useState(false);
	const loginFormInit: loginform = { email: '', password: '' };
	const [loginForm, setLoginForm] = useState(loginFormInit);

	const login = async () => {
		let res = await Client.post(`/api/user/login`, loginForm);
		console.log(res.data);
		setLoggingIn(false);
		setUser!(res.data.user);
		// return setUser?.(res.data);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const loginTemp: loginform = { ...loginForm };
		loginTemp[e.target.name as keyof loginform] = e.target.value;
		setLoginForm(loginTemp);
	};

	const setLogingState = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoggingIn(true);
	};

	useEffect(() => {
		if (loggingIn) {
			login();
		}
	}, [loggingIn]);

	return (
		<div>
			<form onSubmit={setLogingState}>
				<input type='text' placeholder='email' name='email' value={loginForm.email} onChange={handleInputChange} />
				<input type='password' placeholder='password' name='password' value={loginForm.password} onChange={handleInputChange} />
				<input type='submit' value='login' />
			</form>
		</div>
	);
}
