import errorInfo from '../components/error.js';

export const getDataToRanderOrFillDeviceStat = (renderTableDeviceStat, data) => {
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

export function renderTableDeviceStat(row, col, rig) {
	try {
		const tableRigDevicesStats = document.getElementById(`table_rig_devices_stats_${rig}`);

		for (let i = 0; i < row.length + 1; i++) {
			const ro = tableRigDevicesStats.insertRow(-1);
			for (var j = 0; j < col; j++) {
				var ce = ro.insertCell(-1);
				// ce.innerHTML = j + 1;

				const id = document.createAttribute('id');
				id.value = `rig_${rig}_devices_id_${i}_${j}`;
				ce.setAttributeNode(id);
			}
		}
	} catch (err) {
		errorInfo(err);
	}
}

export function fillTableDeviceStat(data, rows, rig) {
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
