import { mainToken } from '../components/token.js';

const errorInfo = err => {
	fetch(
		`/webException/
	Текст ошибки: ${err}, 
	строка ошибки в файле:${err.fileName} ${err.lineNumber}, 
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
	location.reload();
};
export default errorInfo;
