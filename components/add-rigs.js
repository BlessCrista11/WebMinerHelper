import { mainToken } from '../components/token.js';
import errorInfo from '../components/error.js';
import { openModalWindow, closeModalWindow } from '../components/modal-window.js';

const getAllClients = async () => {
	await fetch('/getAddList', {
		headers: {
			token: mainToken,
		},
	}).then(response =>
		response.json().then(response => {
			renderWindowAllClients(response.data);
		})
	);
};

const renderWindowAllClients = response => {
	try {
		const allRigs = document.querySelector('.all_rigs');
		allRigs.innerHTML = '';
		if (response[0]) {
			for (let i = 0; i < response.length; i++) {
				const div = document.createElement('div');
				div.innerHTML = `
				<button id="button_rig_${i}">${response[i]}</button>
			`;
				div.classList = 'rig';

				allRigs.append(div);
				let buttonRig = document.querySelector(`#button_rig_${i}`);

				buttonRig.addEventListener('click', () => chooseRigOnModalWindow(response[i]));
			}
		} else {
			const div = document.createElement('div');
			div.innerHTML = `
				<span>Нет доступных ригов для добавления</span>
			`;
			div.classList = 'rig';
			allRigs.append(div);
		}
	} catch (err) {
		errorInfo(err);
	}
};

const chooseRigOnModalWindow = res => {
	res = res.split(' ')[0];

	fetch(`/addRig/${res}`, {
		headers: {
			token: mainToken,
		},
	}).then(function (response) {
		console.warn(response.text());
	});
	location.reload();
};

const modalContent = document.querySelector('.modal_content');
const addNewRig = () => {
	let btn = document.querySelector('#modal_button_id');

	btn.addEventListener('click', () => {
		getAllClients();
		openModalWindow('Добавить риг');

		const allRigs = document.createElement('div');
		allRigs.setAttribute('class', 'all_rigs');
		modalContent.append(allRigs);

		closeModalWindow();
	});
};

export default addNewRig;
