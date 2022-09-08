import Axios from 'axios';

const BASE_URL = 'https://localhost:8443';
const Client = Axios.create({ baseURL: BASE_URL, withCredentials: true });

Client.interceptors.request.use(
	(response) => response,
	(error) => Promise.reject(error)
);

export default Client;
