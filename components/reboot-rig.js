import { mainToken } from '../components/token.js';

const rebootRig = i => {
	const buttonReboot = document.querySelector(`#id_${i}`);

	fetch(`/rebootRig/${buttonReboot.innerHTML}`, {
		headers: {
			token: mainToken,
		},
	}).then(function (response) {
		console.log(response.text());
	});
};

export default rebootRig;
