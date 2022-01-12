import { mainToken } from '../components/token.js';

let ip = null;

const getIP = async () => {
	ip = await fetch('https://ipapi.co/json/')
		.then(response => response.json())
		.then(response => {
			return response.ip;
		});
};

getIP();

const errorInfo = err => {
	getIP();
	fetch(
		`/webException/IP сайта ${ip},\n

	Текст ошибки: ${err},\n

	строка ошибки в файле:${err.fileName} ${err.lineNumber},\n 
	Информация о браузере: ${navigator.userAgent}`,
		{
			headers: {
				token: mainToken,
			},
		}
	);

	console.warn(`Текст ошибки: ${err}`);
	console.warn(`строка ошибки в файле:${err.fileName} ${err.lineNumber}`);
	console.warn(`Информация о браузере: ${navigator.userAgent}`);
	console.log(' ');
	// location.reload();
};
export default errorInfo;
