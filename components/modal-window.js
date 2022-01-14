let globalActionButton = null;

const modalContent = document.querySelector('.modal_content');
export const openModalWindow = data => {
	modalContent.innerHTML = `
        <div class="modal_inner">
            <div class="modal_title">55</div>
            <div class="close_modal_window">&times</div>
        </div>
    `;

	window.addEventListener('click', event => {
		if (event.target.classList.contains('modal')) {
			let modal = document.querySelector('.modal');
			modal.style.display = 'none';
			autoClose();
		}
	});

	const modalTitle = modal.querySelector('.modal_title');
	modalTitle.innerHTML = `${data}`;

	modal.style.display = 'block';
};

var modal = document.querySelector('#modal_window_id');
export const closeModalWindow = () => {
	let close = modal.querySelector('.close_modal_window');

	close.addEventListener('click', () => {
		modal.style.display = 'none';
		autoClose();
	});
};

let timer = 5;

let closeTimer = null;

export const fillModalWindw = (i, getFetchFunc, actionButton) => {
	globalActionButton = actionButton;

	const acceotDiv = document.createElement('div');
	acceotDiv.innerHTML = `
	<div class="reboot_window" style="display: flex; justify-content: space-between;">
		<button id="accept">ДА</button>
		<button id="cancel">НЕТ (5 cек)</button>
	</div>
	`;
	modalContent.append(acceotDiv);

	let acceptBtn = modalContent.querySelector('#accept');
	let cancelBtn = modalContent.querySelector('#cancel');

	acceptBtn.addEventListener('click', () => {
		getFetchFunc();
		modal.style.display = 'none';
		autoClose();
	});

	cancelBtn.addEventListener('click', () => {
		autoClose();
	});

	const closeFunc = () => {
		const checkTimer = () => {
			console.log(timer);
			cancelBtn.innerHTML = `НЕТ (${--timer} cек)`;
			if (timer <= 0) {
				autoClose();
			}
		};

		closeTimer = setInterval(checkTimer, 1000);
	};
	closeFunc();
	closeModalWindow();
};

const autoClose = () => {
	timer = 5;
	modal.style.display = 'none';
	clearInterval(closeTimer);
};
