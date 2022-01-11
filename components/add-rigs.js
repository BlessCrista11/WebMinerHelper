import { mainToken } from '../components/token.js';
import errorInfo from '../components/error.js';

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
	console.log('2121');
	fetch(`/addRig/${res}`, {
		headers: {
			token: mainToken,
		},
	}).then(function (response) {
		console.warn(response.text());
	});
};

const addNewRig = () => {
	let btn = document.querySelector('#modal_button_id');

	btn.addEventListener('click', () => {
		getAllClients();

		let modal = document.querySelector('#modal_window_id');

		modal.style.display = 'block';

		let close = modal.querySelector('.close_modal_window');
		close.addEventListener('click', () => {
			modal.style.display = 'none';
		});
	});
};

export default addNewRig;
