import styles from '../styles/pages/Register.module.css';
import { ChangeEvent, FormEvent, SyntheticEvent, useEffect, useState } from 'react';
import Client from '../utils/AxiosClient';

type registrationForm = {
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;
	password: string;
	passwordConfirm: string;
};

export default function Register() {
	const initialForm = {
		firstName: '',
		lastName: '',
		displayName: '',
		email: '',
		password: '',
		passwordConfirm: '',
	};
	const [registerationInfo, setRegistrationInfo] = useState(initialForm);
	const [submitInput, setSubmitInput] = useState(false);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const tempForm: registrationForm = { ...registerationInfo };
		tempForm[e.target.name as keyof registrationForm] = e.target.value;
		setRegistrationInfo(tempForm);
	};

	const register = async () => {
		try {
			const res = await Client.post('/api/user/register', registerationInfo);
			console.log(res.data);
		} catch (e) {
		} finally {
			console.log('success');
			setSubmitInput(false);
		}
		//do axios call
	};

	const submitForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSubmitInput(true);
		console.log('submitting form');
	};

	useEffect(() => {
		if (submitInput) {
			register();
		}
	}, [submitInput]);

	return (
		<div className={styles['container']}>
			<form onSubmit={submitForm} className={styles['registration-form']}>
				<h1 className={styles['title-txt']}>Register:</h1>
				<label className={styles['fields']} htmlFor='firstName'>
					First Name:
				</label>
				<input className={styles['fields']} required type='text' name='firstName' onChange={handleInputChange} value={registerationInfo.firstName} />
				<label className={styles['fields']} htmlFor='lastName'>
					Last Name:
				</label>
				<input className={styles['fields']} required type='text' name='lastName' onChange={handleInputChange} value={registerationInfo.lastName} />
				<label className={styles['fields']} htmlFor='email'>
					Email:
				</label>
				<input className={styles['fields']} required type='text' name='email' onChange={handleInputChange} value={registerationInfo.email} />
				<label className={styles['fields']} htmlFor='displayName'>
					Display Name:
				</label>
				<input className={styles['fields']} required type='text' name='displayName' onChange={handleInputChange} value={registerationInfo.displayName} />
				<label className={styles['fields']} htmlFor='password'>
					Password:
				</label>
				<input className={styles['fields']} required type='password' name='password' onChange={handleInputChange} value={registerationInfo.password} />
				<label className={styles['fields']} htmlFor='passwordConfirm'>
					Confirm Password:
				</label>
				<input className={styles['fields']} required type='password' name='passwordConfirm' onChange={handleInputChange} value={registerationInfo.passwordConfirm} />
				<input className={styles['fields']} type='submit' value='Register' />
			</form>
		</div>
	);
}
