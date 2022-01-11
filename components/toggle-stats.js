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

export default toggleStateTableStats;
