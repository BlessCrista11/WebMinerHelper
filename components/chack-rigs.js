var oldMassId = [];
var currentMassId = [];

export const getAllRigsToCheck = data => {
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

export const chackAllRigsOnOffline = data => {
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

let oldArrayFildName = [];
let currentArrayFildName = [];
function deepEqual(obj1, obj2) {
	// console.log('object');
	return JSON.stringify(obj1) === JSON.stringify(obj2);
}
