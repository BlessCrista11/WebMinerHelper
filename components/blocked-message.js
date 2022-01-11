import { wrapper } from './base-markup.js';
import { intreval } from '../script/script.js';
import { powerMonitorPage } from './power_monitor/power-monitor.js';

const blockedMessage = messageError => {
	const header = document.querySelector('header');

	const body = document.querySelector('body');
	const blockedMessageWindow = document.createElement('div');
	blockedMessageWindow.classList.add('blocked_message_wrapper');

	blockedMessageWindow.innerHTML = `
		<div style="color: rgb(228,91,71); font-size: 200px;">&#451</div>
		<div>
			<span style="color: rgb(228,91,71)">Error occured!</span>
			</br>
			</br>
			<span>${messageError.data}</span>
			</br>
			</br>
			<p>
			In case of any errors try to reload this page. </br> 
			If reloading will not help try to get new link from <a href="https://web.telegram.org/z/#1755458126">@gminerHelperBot</a> whith command <span style="font-weight: bold">"/getlink"</span>.</br>
			If you need some assistance during the usage please contact with administrators in Telegram:
			</br><a href="https://web.telegram.org/z/#572561813">@AlexeiKislinskii</a> or <a href="https://web.telegram.org/z/#327776117">@Andrey_Kislinskiy</a>
			</p>
		</div>
		
	`;
	body.append(blockedMessageWindow);
	wrapper.style.display = 'none';
	powerMonitorPage.style.display = 'none';
	header.style.display = 'none';

	clearTimeout(intreval);
};

export default blockedMessage;
