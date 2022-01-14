import { mainToken } from '../components/token.js';
import blockedMessage from '../components/blocked-message.js';
import { openModalWindow, closeModalWindow, fillModalWindw } from '../components/modal-window.js';

const rebootRig = i => {
	const rebootRigMAC = document.querySelector(`#id_${i}`);

	const buttonReboot = document.querySelector(`#reboot_rig_${i}`);
	openModalWindow(`пререзагрузить риг ${rebootRigMAC.innerHTML}?`);

	const fetchReboot = () => {
		fetch(`/rebootRig/${rebootRigMAC.innerHTML}`, {
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
	};

	fillModalWindw(i, fetchReboot, buttonReboot);
};

export default rebootRig;
