import { mainToken } from './token.js';
import blockedMessage from '../components/blocked-message.js';

const routToAnydesk = i => {
	const buttonAnyDesk = document.querySelector(`#id_${i}`);

	fetch(`/getAnydesk/${buttonAnyDesk.innerHTML}`, {
		headers: {
			token: mainToken,
		},
	}).then(response => {
		response.json().then(response => {
			if (response.isError === false) {
				console.log(response.isError);
				window.open(`https://go.anydesk.com/${response.data}`);
			} else {
				blockedMessage(response);
			}
		});
	});
};

export default routToAnydesk;
