import { mainToken } from './token.js';

const routToAnydesk = i => {
	const buttonAnyDesk = document.querySelector(`#id_${i}`);

	fetch(`/getAnydesk/${buttonAnyDesk.innerHTML}`, {
		headers: {
			token: mainToken,
		},
	}).then(response => {
		response.json().then(response => {
			console.log(response.data);
			window.open(`https://go.anydesk.com/${response.data}`);
		});
	});
};

export default routToAnydesk;
