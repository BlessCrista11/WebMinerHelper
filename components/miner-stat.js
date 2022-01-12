import errorInfo from '../components/error.js';
export const randerMainStats = data => {
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

export const fillMainStats = data => {
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

export const renderTableMinerStat = (content, i) => {
	try {
		const tableRigStats = document.getElementById(`table_rig_miner_stats_${i}`);

		let j = 0;
		for (let key in content) {
			if (typeof content[key] !== 'object') {
				const tr = document.createElement('tr');
				tr.innerHTML = `
                <td id="rig_${i}_row_${j}_colum_1"> </td>
                <td id="rig_${i}_row_${j}_colum_2"> </td>                            
            `;
				tableRigStats.append(tr);
			}
			j++;
		}
	} catch (err) {
		errorInfo(err);
	}
};

export const fillTableMinerStat = (response, i) => {
	let j = 0;
	var key = null;
	try {
		for (key in response) {
			if (typeof response[key] !== 'object') {
				let elem_name = document.getElementById(`rig_${i}_row_${j}_colum_1`);
				let elem_value = document.getElementById(`rig_${i}_row_${j}_colum_2`);
				elem_name.innerHTML = `${key}`;
				elem_value.innerHTML = `${response[key]}`;
			}
			j++;
		}
	} catch (err) {
		errorInfo(err);
	}
};
