import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './hooks/UserProvider';
import WebRTCProvider from './hooks/WebRTCProvider';
import { StompProvider } from './hooks/StompProvider';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<UserProvider>
		<StompProvider>
			<WebRTCProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</WebRTCProvider>
		</StompProvider>
	</UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
