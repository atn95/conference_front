import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../hooks/UserProvider';
import Client from '../utils/AxiosClient';
import styles from '../styles/pages/Login.module.css';
import { useNavigate } from 'react-router-dom';

type loginform = {
	email: string;
	password: string;
};

export default function Login() {
	const { user, setUser, rooms, setRooms } = useUserContext() || { user: null, setUser: null, rooms: [], setRooms: null };
	const [loggingIn, setLoggingIn] = useState(false);
	const loginFormInit: loginform = { email: '', password: '' };
	const [loginForm, setLoginForm] = useState(loginFormInit);
	const navigate = useNavigate();

	const login = async () => {
		try {
			let res = await Client.post(`/api/user/login`, loginForm);
			console.log(res.data);
			setUser!(res.data.user);
		} catch (e) {
		} finally {
			setLoggingIn(false);
		}
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
		<div className={styles['container']}>
			<form className={styles['login-form']} onSubmit={setLogingState}>
				<h1 className={styles['title-txt']}>Login</h1>
				<label className={styles['form-fields']} htmlFor='email'>
					Email:
				</label>
				<input required className={styles['form-fields']} type='text' placeholder='email' name='email' value={loginForm.email} onChange={handleInputChange} />
				<label className={styles['form-fields']} htmlFor='password'>
					Password:
				</label>
				<input required className={styles['form-fields']} type='password' placeholder='password' name='password' value={loginForm.password} onChange={handleInputChange} />
				<input className={styles['form-fields']} type='submit' value='Login' />
				<input className={styles['form-fields']} type='button' value='Register' onClick={() => navigate('/register')} />
			</form>
		</div>
	);
}
