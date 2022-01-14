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
		}).then(function (response) {
			if (response.isError) {
				blockedMessage(response);
				return null;
			}
		});
		location.reload();
	};

	fillModalWindw(i, fetchRemove, buttonRemove);
};

export default removeRig;
