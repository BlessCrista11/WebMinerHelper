import toggleStateTableStats from './toggle-stats.js';
import routToAnydesk from './anydesk.js';
import rebootRig from './reboot-rig.js';
import removeRig from './remove-rig.js';
import { openPowerMonitor, changePage } from './power_monitor/power-monitor.js';

export const wrapper = document.querySelector('.wrapper');
export const toMainPage = document.getElementById('to_main_page');

export const baseMarkup = data => {
	toMainPage.addEventListener('click', () => {
		changePage();
	});
	for (let i = 0; i < data.length; i++) {
		const section = document.createElement('section');
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
		buttonReboot.addEventListener('click', () => rebootRig(i));
		buttonReboot.setAttribute('id', `reboot_rig_${i}`);
		buttonReboot.classList.add('button_hover');
		buttonSection.append(buttonReboot);

		const buttonDelete = document.createElement('button');
		buttonDelete.innerHTML = `удалить`;
		buttonDelete.addEventListener('click', () => removeRig(i));
		buttonDelete.setAttribute('id', `remove_rig_${i}`);
		buttonDelete.classList.add('button_hover');
		buttonSection.append(buttonDelete);

		const buttonAnyDesk = document.createElement('button');
		buttonAnyDesk.innerHTML = `AnyDesk`;
		buttonAnyDesk.addEventListener('click', () => routToAnydesk(i));
		buttonAnyDesk.setAttribute('id', `anydesk_rig_${i}`);
		buttonAnyDesk.classList.add('button_hover');

		buttonSection.append(buttonAnyDesk);

		const divToButtonMoreInfo = document.createElement('div');
		divToButtonMoreInfo.classList.add('button_more_info');
		buttonSection.append(divToButtonMoreInfo);

		const buttonMoreInfo = document.createElement('button');
		buttonMoreInfo.innerHTML = `подробней`;
		buttonMoreInfo.addEventListener('click', () => toggleStateTableStats(i));
		buttonMoreInfo.setAttribute('id', `more_info_rig_${i}`);
		buttonMoreInfo.classList.add('button_hover');

		if (!data[i].miner_data) {
			buttonMoreInfo.setAttribute('disabled', true);
			buttonMoreInfo.classList.remove('button_hover');
		}
		divToButtonMoreInfo.append(buttonMoreInfo);

		const powerMonitor = document.createElement('button');
		powerMonitor.innerHTML = 'Power Monitor';
		powerMonitor.addEventListener('click', () => {
			openPowerMonitor(i, data);
		});

		powerMonitor.setAttribute('id', `power_monitor_rig_${i}`);
		powerMonitor.classList.add('button_hover');
		buttonSection.append(powerMonitor);
	}
};
