const toggleStateTableStats = i => {
	const tableMinerStats = document.querySelector(`#table_rig_miner_stats_${i}`);
	const tableDeviceStats = document.querySelector(`#table_rig_devices_stats_${i}`);

	if (tableMinerStats.style.display === 'none') {
		tableMinerStats.removeAttribute('style');
		tableDeviceStats.removeAttribute('style');
	} else {
		tableMinerStats.setAttribute('style', `display:none`);
		tableDeviceStats.setAttribute('style', `display:none`);
	}
};

export default toggleStateTableStats;
