import { mainToken } from '../components/token.js';
import blockedMessage from '../components/blocked-message.js';
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
		}).then(response => {
			response.json().then(response => {
				if (response.isError === false) {
					return false;
				} else {
					blockedMessage(response);
				}
			});
		});

		location.reload();
	};

	fillModalWindw(i, fetchRemove, buttonRemove);
};

export default removeRig;
