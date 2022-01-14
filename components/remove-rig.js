import { mainToken } from '../components/token.js';
import { openModalWindow, closeModalWindow, fillModalWindw } from '../components/modal-window.js';

const removeRig = i => {
	const removeRigMAC = document.querySelector(`#id_${i}`);

	const buttonRemove = document.querySelector(`#remove_rig_${i}`);

	openModalWindow(`удалить риг ${removeRigMAC.innerHTML}?`);

	const fetchRemove = () => {
		fetch(`/removeRig/${removeRigMAC.innerHTML}`, {
			headers: {
				token: mainToken,
			},
		}).then(function (response) {
			console.log(response.text());
		});
		location.reload();
	};

	fillModalWindw(i, fetchRemove, buttonRemove);
};

export default removeRig;
