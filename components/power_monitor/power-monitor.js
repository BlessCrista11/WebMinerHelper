import { wrapper } from '../base-markup.js';
import { startInterval, stopInterval } from '../../script/script.js';
import { mainToken } from '../token.js';
import blockedMessage from '../blocked-message.js';

const choiceDay = document.querySelector('#choice_day');
const choiceMinute = document.querySelector('#choice_minute');

const dateFromDays = document.querySelector('#date_from_days');
const dateTillDays = document.querySelector('#date_till_days');

const dateFromTime = document.querySelector('#date_time_from');
const dateTillTime = document.querySelector('#date_time_till');

export const powerMonitorPage = document.querySelector('.power_monitor_page');
const getRangeButton = powerMonitorPage.querySelector('#get_range_button');

const ctx = document.getElementById('myChart');

const setCurrentDate = () => {
	dateFromDays.value = moment(new Date()).hour(-24).format('YYYY-MM-DD');
	dateTillDays.value = moment(new Date()).hour(-24).format('YYYY-MM-DD');
};

const validateInputDate = () => {
	let to = moment(new Date()).hour(-24);

	dateFromDays.addEventListener('change', () => {
		let from = moment(dateFromDays.value);
		if (to.diff(from) < 0 || moment(dateFromDays.value) > moment(dateTillDays.value)) {

			dateFromDays.style = `
			animation: glowing 1500ms infinite;			
			`;
			getRangeButton.disabled = true;
		} else {
			dateFromDays.style.removeProperty('animation');
			getRangeButton.disabled = false;
		}
	});
	dateTillDays.addEventListener('change', () => {
		let from = moment(dateTillDays.value);
		if (to.diff(from) < 0 || moment(dateFromDays.value) > moment(dateTillDays.value)) {
			
			dateTillDays.style = `
			animation: glowing 1500ms infinite;			
			`;
			getRangeButton.disabled = true;
		} else {
			dateTillDays.style.removeProperty('animation');
			getRangeButton.disabled = false;
		}
	});
};

validateInputDate();

var arrayDataPower = null;
let requestLink = '';
let nameRigUser = '';
let rigId = '';

export const changePage = () => {
	arrayDataPower = null;
	requestLink = '';
	const toMainPage = document.getElementById('to_main_page');
	const modalButtonId = document.getElementById('modal_button_id');

	toMainPage.style.display = 'block';
	modalButtonId.style.display = 'none';

	if (powerMonitorPage.style.display === 'none') {
		wrapper.style.display = 'none';
		powerMonitorPage.style.display = 'block';

		randerChart(nameRigUser);
		stopInterval();
	} else if (wrapper.style.display === 'none') {
		wrapper.style.display = 'block';
		powerMonitorPage.style.display = 'none';

		toMainPage.style.display = 'none';
		modalButtonId.style.display = 'block';

		myChart.innerHTML = '';
		myChart.destroy();

		startInterval();
	}
};

const onBtnDataClick = async () => {
	requestLink = `/getConsumption/${rigId}`;
	console.warn(requestLink);
	getDataFromInput();

	await getDataFromServer();
	getTotalPrice();

	myChart.destroy();
	randerChart();
};

export const openPowerMonitor = async (i, data) => {
	nameRigUser = data[i].name;
	rigId = data[i].id;

	setCurrentDate();

	getRangeButton.addEventListener('click', onBtnDataClick);

	changePage();
};

const getDataFromServer = async () => {
	arrayDataPower = await fetch(requestLink, {
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
				console.log(response.data);
				blockedMessage(response);

				return null;
			}

			return response.data;
		});
};

const intrevalToggle = () => {
	choiceDay.addEventListener('change', () => {
		dateFromTime.disabled = true;
		dateTillTime.disabled = true;
	});
	choiceMinute.addEventListener('change', () => {
		dateFromTime.disabled = false;
		dateTillTime.disabled = false;
	});
};
intrevalToggle();

const getDataFromInput = () => {
	if (choiceDay.checked) {
		requestLink += '/' + dateFromDays.value + '/' + dateTillDays.value;
	} else if (choiceMinute.checked) {
		requestLink += '/' + dateFromDays.value + '_' + dateFromTime.value + '/' + dateTillDays.value + '_' + dateTillTime.value;
	}
	console.log(requestLink);
};

var arreyOfDate = [];
var powerData = [];
var numberOfDays = 0;

const countDiffDateInDays = () => {
	let till = moment(dateTillDays.value);
	let from = moment(dateFromDays.value);
	let duration = moment.duration(till.diff(from));
	let days = duration.asDays();
	return Math.round(days);
};

const fillArraysFromDataInDays = () => {
	numberOfDays = countDiffDateInDays();

	if (numberOfDays === 0 && arrayDataPower.length !== 0) {
		powerData.push(arrayDataPower[0][1]);
	} else if (numberOfDays !== 0 && arrayDataPower.length === 0) {
		alert('данных нет');
	}

	for (let i = 0; i < numberOfDays + 1; i++) {
		powerData.push(null);
		arreyOfDate.push(moment(dateFromDays.value, 'YYYY-MM-DD').add(i, 'd').format('YYYY-MM-DD'));
	}

	for (let i = 0; i < numberOfDays + 1; i++) {
		for (let j = 0; j < arrayDataPower.length; j++) {
			if (arreyOfDate[i] === arrayDataPower[j][0]) {
				powerData[i] = arrayDataPower[j][1];
			}
		}
	}
	if (powerData[0] === null) powerData[0] = 0;
};

const countDiffDateInMinute = () => {
	let fromDate = moment(dateFromDays.value).add(dateFromTime.value);

	let tillDate = moment(dateTillDays.value).add(dateTillTime.value);

	let now = moment().add(tillDate);
	let end = moment().add(fromDate);
	let duration = moment.duration(now.diff(end));
	let minutes = duration.asMinutes();

	console.log(minutes);
	if (!Number.isInteger(minutes)) {
		console.error('дробь');
	}
	return Math.round(minutes + 1);
};

const fillArraysFromDataInMinutes = () => {
	numberOfDays = countDiffDateInMinute();

	if (numberOfDays === 0 && arrayDataPower.length !== 0) {
		powerData.push(arrayDataPower[0][1]);
	} else if (numberOfDays !== 0 && arrayDataPower.length === 0) {
		alert('данных нет');
	}

	let tempDateString = `${dateFromDays.value}_${dateFromTime.value}`;

	for (let i = 0; i < numberOfDays; i++) {
		powerData.push(0);
		arreyOfDate.push(moment(tempDateString, 'YYYY-MM-DD_HH:mm').add(i, 'm').format('MMM DD HH:mm'));
	}
	let start = moment(tempDateString, 'YYYY-MM-DD_HH:mm');
	for (let i = 0; i < arrayDataPower.length; i++) {
		let current = moment(arrayDataPower[i][0], 'YYYY-MM-DD_HH:mm');

		powerData[moment.duration(current.diff(start)).asMinutes()] = arrayDataPower[i][1];
	}

	if (powerData[0] === null) powerData[0] = 0;
};

const getTotalPrice = () => {
	const totalPowerValue = document.querySelector('#total_power_value');
	const totalVriceValue = document.querySelector('#total_price_value');

	var totalPrice = 0;
	var totalPower = 0;
	for (let i = 0; i < arrayDataPower.length; i++) {
		totalPower += arrayDataPower[i][1];
		totalPrice += arrayDataPower[i][2];
	}

	console.log(Math.round(totalPrice * 100) / 100);
	totalPowerValue.innerHTML = `${Math.round((totalPower / 1000) * 100) / 100}`;
	totalVriceValue.innerHTML = `${Math.round(totalPrice * 100) / 100}`;
};

var myChart = null;
const randerChart = () => {
	const nameCurrentUert = document.getElementById('chart_name');
	nameCurrentUert.innerHTML = `${nameRigUser}`;

	arreyOfDate = [];
	powerData = [];
	if (choiceDay.checked && arrayDataPower !== null) {
		fillArraysFromDataInDays();
	} else if (choiceMinute.checked && arrayDataPower !== null) {
		fillArraysFromDataInMinutes();
	}

	myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: arreyOfDate,
			datasets: [
				{

					data: powerData,
					backgroundColor: ['rgb(50,80,0,0.2)'],
					borderColor: ['rgb(63, 128, 4)'],

					borderWidth: 2,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				x: {
					display: true,
					title: {
						display: true,
						text: 'Время',
						color: ['#FFF'],
						font: {
							size: 30,
						},
					},
				},
				y: {
					display: true,
					title: {
						display: true,
						text: 'kWt',
						color: ['#FFF'],

						font: {
							size: 30,
						},
					},
				},
			},
		},
	});
};
