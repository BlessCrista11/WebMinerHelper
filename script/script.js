const wrapper = document.querySelector('.wrapper');
const serverIp = 'http://109.87.25.33:4000';

const getData = async () => {
	const data = await fetch(serverIp + '/stat');
	// console.error(data.json();)
	return data.json();
};

const baseMarkup = () => {
	getData().then(data => {
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

			const buttonMoreInfo = document.createElement('button');
			buttonMoreInfo.innerHTML = `подробней`;
			buttonMoreInfo.setAttribute('onclick', `toggleStateTableStats(${i})`);
			buttonMoreInfo.setAttribute('id', `more_info_rig_${i}`);
			if (!data[i].miner_data) {
				buttonMoreInfo.setAttribute('disabled', true);
				// buttonMoreInfo.removeAttribute('onclick');
			}

			buttonSection.append(buttonMoreInfo);
		}
	});
};
baseMarkup();

const errorInfo = err => {
	console.warn(`Текст ошибки: ${err}`);
	console.warn(`строка ошибки в файле:${err.fileName} ${err.lineNumber}`);
	console.warn(`Информация о браузере: ${navigator.userAgent}`);
	console.log(' ');
};

var oldMassId = [];
var currentMassId = [];
const getAllRigsToCheck = () => {
	getData().then(data => {
		for (let i = 0; i < data.length; i++) {
			// console.log(data.length)

			for (let item in data[i]) {
				if (typeof data[i][item] !== 'object' && item === 'id') {
					currentMassId.push(data[i][item]);
				}
			}
		}

		if (oldMassId.length === currentMassId.length || oldMassId.length === 0) {
			// console.log('odinakovie');
			for (let i = 0; i < currentMassId.length; i++) {
				if (oldMassId[i] !== undefined && oldMassId[i] !== currentMassId[i]) {
					console.log('old - undefined');
					location.reload();
					// console.log('stariy', oldMassId[i]);
					// console.log('tekusiy', currentMassId[i]);
					// console.log('------');
				}
			}
		} else {
			console.log('raznie');
			location.reload();
		}

		oldMassId = currentMassId;
		currentMassId = [];
		// oldMassId = []
	});
};

const fillMainStats = () => {
	getData().then(data => {
		try {
			for (let i = 0; i < data.length; i++) {
				const curentRig = document.getElementById(
					`table_rig_miner_stats_main_${i}`
				);

				for (let item in data[i]) {
					if (typeof data[i][item] !== 'object') {
						// console.log(item)
						curentRig.innerHTML += `
							<div>
								<span id="${item}_${i}">${data[i][item]}</span>
							</div>
							`;
					}
				}
			}
		} catch (err) {
			// console.log('ошибка в fillMainStats' + err);
			errorInfo(err);
		}
	});
};

fillMainStats();

const getDataToRanderMinerStat = renderTableMinerStat => {
	getData().then(data => {
		for (let i = 0; i < data.length; i++) {
			for (let item in data[i]) {
				if (typeof data[i][item] === 'object') {
					// console.log(data[i][item])
					renderTableMinerStat(data[i][item], i);
				}
			}
		}
	});
};

const getDataToFillMinerStat = fillTableMinerStat => {
	getData().then(data => {
		for (let i = 0; i < data.length; i++) {
			for (let item in data[i]) {
				if (typeof data[i][item] === 'object') {
					// console.log(data[i][item])
					fillTableMinerStat(data[i][item], i);
				}
			}
		}
	});
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
				let elem_name = document.getElementById(
					`rig_${i}_row_${j}_colum_1_${key}`
				);
				let elem_value = document.getElementById(
					`rig_${i}_row_${j}_colum_2_${key}`
				);
				elem_name.innerHTML = `${key}`;
				elem_value.innerHTML = `${response[key]}`;
			}
			j++;
		}
	} catch (err) {
		errorInfo(err);
	}
};

const getDataToRanderDeviceStat = renderTableDeviceStat => {
	getData().then(data => {
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
								renderTableDeviceStat(data[i][item][elem].length + 1, size, i);
							}
						}
					}
				}
			}
		} catch (err) {
			errorInfo(err);
		}
	});
};

const getDataToFillDeviceStat = fillTableDeviceStat => {
	getData().then(data => {
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
								// console.log(data[i][item][elem])
								fillTableDeviceStat(data[i][item][elem], size, i);
							}
						}
					}
				}
			}
		} catch (err) {
			errorInfo(err);
		}
	});
};

function renderTableDeviceStat(row, col, rig) {
	try {
		const tableRigDevicesStats = document.getElementById(
			`table_rig_devices_stats_${rig}`
		);

		for (let i = 0; i < row; i++) {
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
				let key = document.getElementById(
					`rig_${rig}_devices_id_${i + 1}_${j}`
				);
				key.innerHTML = `${data[i][device]}`;
				j++;
			}
		}
	} catch (err) {
		errorInfo(err);
	}
}

getDataToRanderMinerStat(renderTableMinerStat);
getDataToRanderDeviceStat(renderTableDeviceStat);

setInterval(function () {
	getData();
	getAllRigsToCheck();
	getDataToFillMinerStat(fillTableMinerStat);
	getDataToFillDeviceStat(fillTableDeviceStat);
}, 1000);

// ДОБАВИТЬ РИГ

const getAllClients = async () => {
	await fetch(serverIp + '/getAllOnline').then(response =>
		response.text().then(response => {
			renderWindowAllClients(response.split('\r\n'));
		})
	);
};

const renderWindowAllClients = response => {
	const allRigs = document.querySelector('.all_rigs');
	allRigs.innerHTML = '';
	for (let i = 0; i < response.length; i++) {
		const div = document.createElement('div');
		div.innerHTML = `
            <button id="button_rig_${i}" onclick="chooseRigOnModalWindow('${response[i]}')">${response[i]}</button>
        `;
		div.classList = 'rig';
		allRigs.append(div);
	}
};

const chooseRigOnModalWindow = res => {
	console.log(res + '');

	fetch(serverIp + `/addRig/${res}`).then(function (response) {
		console.warn(response.text());
	});
	location.reload();
};

let btn = document.querySelector('[data-modal-button]');
btn.addEventListener('click', () => {
	getAllClients();

	let modal = document.querySelector('[data-modal-window]');

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
		let modal = document.querySelector('[data-modal-window]');
		modal.style.display = 'none';
	}
};
//  ПЕРЕЗАГРУЗИТЬ РИГ

const rebootRig = i => {
	const buttonReboot = document.querySelector(`#id_${i}`);
	// console.log(buttonReboot.innerHTML)

	fetch(serverIp + `/rebootRig/${buttonReboot.innerHTML}`).then(function (
		response
	) {
		console.log(response.text());
	});
};

// УДАЛИТЬ РИГ

const removeRig = i => {
	const buttonRemove = document.querySelector(`#id_${i}`);
	// console.log(buttonRemove.innerHTML)

	// fetch('/removeRig/127.0.0.1:3333')
	fetch(serverIp + `/removeRig/${buttonRemove.innerHTML}`).then(function (
		response
	) {
		console.log(response.text());
	});
	location.reload();
};

// ИНФО РИГА

const toggleStateTableStats = i => {
	const tableMinerStats = document.querySelector(`#table_rig_miner_stats_${i}`);
	const tableDeviceStats = document.querySelector(
		`#table_rig_devices_stats_${i}`
	);
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
