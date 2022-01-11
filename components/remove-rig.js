import { mainToken } from '../components/token.js';

const removeRig = i => {
	const buttonRemove = document.querySelector(`#id_${i}`);

	fetch(`/removeRig/${buttonRemove.innerHTML}`, {
		headers: {
			token: mainToken,
		},
	}).then(function (response) {
		console.log(response.text());
	});
	location.reload();
};

export default removeRig;
