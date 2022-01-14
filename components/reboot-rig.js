import { mainToken } from '../components/token.js';
import blockedMessage from '../components/blocked-message.js';
import { openModalWindow, closeModalWindow, fillModalWindw } from '../components/modal-window.js';

const rebootRig = i => {
	const rebootRigMAC = document.querySelector(`#id_${i}`);

	const buttonReboot = document.querySelector(`#reboot_rig_${i}`);
	openModalWindow(`пререзагрузить риг ${rebootRigMAC.innerHTML}?`);

	const fetchReboot = () => {
		fetch(`/rebootRig/${buttonReboot.innerHTML}`, {
			headers: {
				token: mainToken,
			},
		}).then(function (response) {
			if (response.isError) {
				blockedMessage(response);

				return null;
			}
		});
	};

	fillModalWindw(i, fetchReboot, buttonReboot);
};

export default rebootRig;
