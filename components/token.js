import blockedMessage from '../components/blocked-message.js';
export var mainToken = null;

export const isCorrectToken = async () => {
	if (window.location.pathname.substring(1)) {
		localStorage.removeItem('token');
		localStorage.removeItem('name');
		var rootJson = await requestPermanentToken();

		if (rootJson.isError) {
			blockedMessage(rootJson);
			return;
		} else {
			let posOfDelim = rootJson.data.indexOf(' ');
			localStorage.setItem('token', rootJson.data.substr(0, posOfDelim));
			localStorage.setItem('name', rootJson.data.substr(posOfDelim));
		}

		window.location.href = window.location.origin;
	}

	if (localStorage.getItem('token') === null) {
		const messageError = {
			data: `This browser is not registered.
		`,
		};
		blockedMessage(messageError);
		return;
	}
	mainToken = localStorage.getItem('token');

	if (localStorage.getItem('name') !== null) {
		const userName = document.getElementById('user_name');
		userName.innerHTML = localStorage.getItem('name');
	}
};

export const requestPermanentToken = async () => {
	return await fetch(`/getToken/${window.location.pathname.substring(1)}`)
		.then(response => response.json())
		.then(response => {
			return response;
		});
};
