const wrapper = document.querySelector('.wrapper');
var currentData = null;
var mainToken = null;

// console.log(window.location.href);

const getData = async () => {
	currentData = await fetch('/stat', {
		headers: {
			token: mainToken,
		},
	})
		.then(response => response.json())
		.then(response => {
			if (response.isError) {
				alert('что то пошло не так! ' + response.data);
				return null;
			}
			return response.data;
		});
};

const baseMarkup = data => {
	for (let i = 0; i < data.length; i++) {
		const section = document.createElement('section');
		// section.className = `table_rig_${i}`; сделать единый класс для стилизации
		section.setAttribute('id', `table_rig_${i}`);
		wrapper.append(section);

		const tableMainStats = document.createElement('div');
		tableMainStats.setAttribute('id', `table_rig_miner_stats_main_${i}`);
		tableMainStats.classList = 'table_rig_miner_stats_main';
		if (data[i].miner_data) {
			tableMainStats.addEventListener('click', () => {
				toggleStateTableStats(i);
			});
		}

		section.append(tableMainStats);
		if (data[i].miner_data) {
			const tableMinerStats = document.createElement('table');
			tableMinerStats.setAttribute('id', `table_rig_miner_stats_${i}`);
			tableMinerStats.setAttribute('style', `display:none`);
			section.append(tableMinerStats);

			const tableDeviceStats = document.createElement('table');
			tableDeviceStats.setAttribute('id', `table_rig_devices_stats_${i}`);
			tableDeviceStats.setAttribute('style', `display:none`);
			section.append(tableDeviceStats);
		}

		const buttonSection = document.createElement('div');
		buttonSection.setAttribute('id', `button_section_rig_${i}`);
		section.append(buttonSection);

		const buttonReboot = document.createElement('button');
		buttonReboot.innerHTML = `перезагрузить`;
		buttonReboot.setAttribute('onclick', `rebootRig(${i})`);
		buttonReboot.setAttribute('id', `reboot_rig_${i}`);
		buttonSection.append(buttonReboot);

		const buttonDelete = document.createElement('button');
		buttonDelete.innerHTML = `удалить`;
		buttonDelete.setAttribute('onclick', `removeRig(${i})`);
		buttonDelete.setAttribute('id', `remove_rig_${i}`);
		buttonSection.append(buttonDelete);

		const buttonAnyDesk = document.createElement('button');
		buttonAnyDesk.innerHTML = `Anydesk`;
		buttonAnyDesk.setAttribute('onclick', `routToAnydesk(${i})`);
		buttonAnyDesk.setAttribute('id', `anydesk_rig_${i}`);
		buttonSection.append(buttonAnyDesk);

		const divToButtonMoreInfo = document.createElement('div');
		divToButtonMoreInfo.classList.add('button_more_info');
		buttonSection.append(divToButtonMoreInfo);

		const buttonMoreInfo = document.createElement('button');
		buttonMoreInfo.innerHTML = `подробней`;
		buttonMoreInfo.setAttribute('onclick', `toggleStateTableStats(${i})`);
		buttonMoreInfo.setAttribute('id', `more_info_rig_${i}`);
		if (!data[i].miner_data) {
			buttonMoreInfo.setAttribute('disabled', true);
		}
		divToButtonMoreInfo.append(buttonMoreInfo);
	}
};

const errorInfo = err => {
	fetch(
		`/webException/
	Текст ошибки: ${err}, 
	строка ошибки в файле:${err.fileName} ${err.lineNumber}, 
	Информация о браузере: ${navigator.userAgent}`,
		{
			headers: {
				token: mainToken,
			},
		}
	);

	console.warn(`Текст ошибки: ${err}`);
	console.warn(`строка ошибки в файле:${err.fileName} ${err.lineNumber}`);
	console.warn(`Информация о браузере: ${navigator.userAgent}`);
	console.log(' ');
};

var oldMassId = [];
var currentMassId = [];

const getAllRigsToCheck = data => {
	for (let i = 0; i < data.length; i++) {
		for (let item in data[i]) {
			if (typeof data[i][item] !== 'object' && item === 'id') {
				currentMassId.push(data[i][item]);
			}
		}
	}

	if (oldMassId.length === currentMassId.length || oldMassId.length === 0) {
		for (let i = 0; i < currentMassId.length; i++) {
			if (oldMassId[i] !== undefined && oldMassId[i] !== currentMassId[i]) {
				console.log('old - undefined');
				location.reload();
			}
		}
	} else {
		console.log('raznie');
		location.reload();
	}

	oldMassId = currentMassId;
	currentMassId = [];
};

let arrayStatusRigs = [];

const chackAllRigsOnOffline = data => {
	let id,
		status = null;

	if (arrayStatusRigs.length === 0) {
		for (let i = 0; i < data.length; i++) {
			id = data[i].id;
			status = data[i].status;

			arrayStatusRigs.push({ id, status });
		}
	}
	for (let i = 0; i < data.length; i++) {
		if (data[i].status.substr(0, 2) !== arrayStatusRigs[i].status.substr(0, 2)) {
			console.log('reboot');
			console.log('DATA ', data[i].status.substr(0, 2), 'Arr ', arrayStatusRigs[i].status.substr(0, 2));
			location.reload();
		}
	}
};

const randerMainStats = data => {
	try {
		for (let i = 0; i < data.length; i++) {
			const curentRig = document.getElementById(`table_rig_miner_stats_main_${i}`);

			for (let item in data[i]) {
				if (typeof data[i][item] !== 'object') {
					curentRig.innerHTML += `
							<div>
								<span id="${item}_${i}"></span>
							</div>
							`;
				}
			}
		}
	} catch (err) {
		errorInfo(err);
	}
};

const fillMainStats = data => {
	try {
		for (let i = 0; i < data.length; i++) {
			for (let item in data[i]) {
				const curentRigCommonStat = document.getElementById(`${item}_${i}`);
				if (typeof data[i][item] !== 'object') {
					curentRigCommonStat.innerHTML = `${data[i][item]}`;
				}
			}
		}
	} catch (err) {
		errorInfo(err);
	}
};

const getDataToRanderOrFillStat = (functionTableMinerStat, data) => {
	for (let i = 0; i < data.length; i++) {
		for (let item in data[i]) {
			if (typeof data[i][item] === 'object') {
				functionTableMinerStat(data[i][item], i);
			}
		}
	}
};

const renderTableMinerStat = (content, i) => {
	try {
		const tableRigStats = document.getElementById(`table_rig_miner_stats_${i}`);

		let j = 0;
		for (let key in content) {
			if (typeof content[key] !== 'object') {
				const tr = document.createElement('tr');
				tr.innerHTML = `
                <td id="rig_${i}_row_${j}_colum_1_${key}"> </td>
                <td id="rig_${i}_row_${j}_colum_2_${key}"> </td>                            
            `;
				tableRigStats.append(tr);
			}
			j++;
		}
	} catch (err) {
		errorInfo(err);
	}
};

const fillTableMinerStat = (response, i) => {
	let j = 0;
	try {
		for (let key in response) {
			if (typeof response[key] !== 'object') {
				let elem_name = document.getElementById(`rig_${i}_row_${j}_colum_1_${key}`);
				let elem_value = document.getElementById(`rig_${i}_row_${j}_colum_2_${key}`);
				elem_name.innerHTML = `${key}`;
				elem_value.innerHTML = `${response[key]}`;
			}
			j++;
		}
	} catch (err) {
		errorInfo(err);
	}
};

const getDataToRanderOrFillDeviceStat = (renderTableDeviceStat, data) => {
	let size = 0;
	try {
		for (let i = 0; i < data.length; i++) {
			for (let item in data[i]) {
				if (typeof data[i][item] === 'object') {
					for (let elem in data[i][item]) {
						if (typeof data[i][item][elem] == 'object') {
							if (size === 0) {
								size = Object.keys(data[i][item][elem][0]).length;
							}
							renderTableDeviceStat(data[i][item][elem], size, i);
						}
					}
				}
			}
		}
	} catch (err) {
		errorInfo(err);
	}
};

function renderTableDeviceStat(row, col, rig) {
	try {
		const tableRigDevicesStats = document.getElementById(`table_rig_devices_stats_${rig}`);

		for (let i = 0; i < row.length + 1; i++) {
			const ro = tableRigDevicesStats.insertRow(-1);
			for (var j = 0; j < col; j++) {
				var ce = ro.insertCell(-1);
				// ce.innerHTML = j + 1;

				id = document.createAttribute('id');
				id.value = `rig_${rig}_devices_id_${i}_${j}`;
				ce.setAttributeNode(id);
			}
		}
	} catch (err) {
		errorInfo(err);
	}
}

function fillTableDeviceStat(data, rows, rig) {
	try {
		for (let i = 0; i < data.length; i++) {
			let m = 0;
			for (let device in data[i]) {
				const key = document.getElementById(`rig_${rig}_devices_id_0_${m}`);
				key.innerHTML = `${device}`;
				m++;
			}
		}

		for (let i = 0; i < rows; i++) {
			let j = 0;
			for (let device in data[i]) {
				let key = document.getElementById(`rig_${rig}_devices_id_${i + 1}_${j}`);
				key.innerHTML = `${data[i][device]}`;
				j++;
			}
		}
	} catch (err) {
		errorInfo(err);
	}
}

const getLinkTail = () => {
	return window.location.pathname.substring(1);
};

const isCorrectToken = async () => {
	if (getLinkTail()) {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		let rootJson = await requestPermanentToken();

		if (rootJson.isError) {
			alert('Ошибка токена: ' + rootJson.data);
		} else {
			let posOfDelim = rootJson.data.indexOf(' ');
			localStorage.setItem('token', rootJson.data.substr(0, posOfDelim));
			localStorage.setItem('name', rootJson.data.substr(posOfDelim));
		}

		window.location.href = window.location.origin;
	}

	if (localStorage.getItem('token') === null) {
		alert('Сори,токина нет. Иди в телегу');
		location.reload();
	}
	mainToken = localStorage.getItem('token');

	if (localStorage.getItem('name') !== null) {
		// mainToken = localStorage.getItem('name');
		const userName = document.getElementById('user_name');
		userName.innerHTML = localStorage.getItem('name');
	}
};

const requestPermanentToken = async () => {
	return await fetch(`/getToken/${window.location.pathname.substring(1)}`)
		.then(response => response.json())
		.then(response => {
			return response;
		});
};

const randerPage = async () => {
	await isCorrectToken();

	await getData();
	if (currentData === null) {
		return;
	}
	baseMarkup(currentData);
	randerMainStats(currentData);

	getDataToRanderOrFillDeviceStat(renderTableDeviceStat, currentData);
	getDataToRanderOrFillStat(renderTableMinerStat, currentData);
};

randerPage();

setInterval(function () {
	getData();
	if (currentData === null) {
		return;
	}
	fillMainStats(currentData);
	chackAllRigsOnOffline(currentData);
	getAllRigsToCheck(currentData);
	getDataToRanderOrFillStat(fillTableMinerStat, currentData);
	getDataToRanderOrFillDeviceStat(fillTableDeviceStat, currentData);
}, 1000);

// ДОБАВИТЬ РИГ

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
				<button id="button_rig_${i}" onclick="chooseRigOnModalWindow('${response[i]}')">${response[i]}</button>
			`;
				div.classList = 'rig';
				allRigs.append(div);
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

window.onclick = event => {
	closeModalWindow(event);
};

const closeModalWindow = event => {
	if (event.target.hasAttribute('data-modal-window')) {
		let modal = document.querySelector('#modal_window_id');
		modal.style.display = 'none';
	}
};
//  ПЕРЕЗАГРУЗИТЬ РИГ

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

// УДАЛИТЬ РИГ

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

// ИНФО РИГА

const toggleStateTableStats = i => {
	const tableMinerStats = document.querySelector(`#table_rig_miner_stats_${i}`);
	const tableDeviceStats = document.querySelector(`#table_rig_devices_stats_${i}`);
	const buttonMoreInfo = document.querySelector(`#more_info_rig_${i}`);

	if (tableMinerStats.style.display === 'none') {
		buttonMoreInfo.innerHTML = 'свернуть';
		tableMinerStats.removeAttribute('style');
		tableDeviceStats.removeAttribute('style');
	} else {
		buttonMoreInfo.innerHTML = 'подробней';
		tableMinerStats.setAttribute('style', `display:none`);
		tableDeviceStats.setAttribute('style', `display:none`);
	}
};

//Переход на AnyDesk

const routToAnydesk = i => {
	const buttonAnyDesk = document.querySelector(`#id_${i}`);

	fetch(`/getAnydesk/${buttonAnyDesk.innerHTML}`, {
		headers: {
			token: mainToken,
		},
	}).then(function (response) {
		// console.log(response.text().then (response) => {response});
		response.json().then(response => {
			window.open(`https://go.anydesk.com/${response.data}`);
		});
	});
};
