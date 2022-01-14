import { baseMarkup, wrapper } from '../components/base-markup.js';
import { mainToken, isCorrectToken } from '../components/token.js';
import { getDataToRanderOrFillDeviceStat, renderTableDeviceStat, fillTableDeviceStat } from '../components/device-stat.js';
import blockedMessage from '../components/blocked-message.js';
import { getAllRigsToCheck, chackAllRigsOnOffline } from '../components/chack-rigs.js';
import { randerMainStats, fillMainStats, renderTableMinerStat, fillTableMinerStat } from '../components/miner-stat.js';
import addNewRig from '../components/add-rigs.js';

var currentData = null;

const getData = async () => {
	currentData = await fetch('/stat', {
		headers: {
			token: mainToken,
		},
	})
		.then(response => {
			if (response.ok) return response.json();
			return null;
		})
		.then(response => {
			if (response === null) return null;
			if (response.isError) {
				blockedMessage(response);

				return null;
			}

			return response.data;
		});
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

const randerPage = async () => {
	await isCorrectToken();
	if (mainToken === null) {
		return;
	}
	await getData();
	if (currentData === null) {
		return;
	}
	baseMarkup(currentData);
	randerMainStats(currentData);

	getDataToRanderOrFillDeviceStat(renderTableDeviceStat, currentData);
	getDataToRanderOrFillStat(renderTableMinerStat, currentData);
};
addNewRig();

randerPage();

export const collectAndFill = () => {
	getData();
	if (currentData === null) {
		return;
	}

	getAllRigsToCheck(currentData);
	chackAllRigsOnOffline(currentData);
	fillMainStats(currentData);
	getDataToRanderOrFillStat(fillTableMinerStat, currentData);
	getDataToRanderOrFillDeviceStat(fillTableDeviceStat, currentData);
};
export var intreval;
export const startInterval = () => {
	if (mainToken !== null) {
		intreval = setInterval(() => {
			collectAndFill();
		}, 1000);
	}
};
export const stopInterval = () => {
	clearInterval(intreval);
};
startInterval();
