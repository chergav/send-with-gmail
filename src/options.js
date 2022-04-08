import storage from './storage.js';

const inputEmail = document.querySelector('#inputEmail');
const buttonAdd = document.querySelector('#buttonAdd');
const mailList = document.querySelector('#mailList');

document
	.querySelectorAll('[data-locale]')
	.forEach(i => (i.textContent = chrome.i18n.getMessage(i.dataset.locale)));

const showEmailsList = async () => {
	const emailsArray = await storage.get('emailsArray');
	const mailListHtml = emailsArray.reduce(
		(a, v) =>
			(a += `
				<div>
					<span>${v}</span>
					<button data-email="${v}">
						${chrome.i18n.getMessage('button_delete')}
					</button>
				</div>`
			),
		''
	);
	mailList.innerHTML = mailListHtml;
};

const addEmail = async () => {
	const email = inputEmail.value;
	if (email === '') return;
	if (!inputEmail.checkValidity()) {
		alert(chrome.i18n.getMessage('email_error'));
		return;
	}
	let emailsArray = await storage.get('emailsArray');
	if (emailsArray.includes(email)) {
		alert(chrome.i18n.getMessage('email_exist'));
		return;
	}
	emailsArray.push(email);
	storage.set({ emailsArray });
	inputEmail.value = '';
};

const deleteEmail = async event => {
	const target = event.target;
	if (target.tagName !== 'BUTTON') return;
	let emailsArray = await storage.get('emailsArray');
	const indexOfEmail = email => emailsArray.findIndex(i => i === email);
	emailsArray.splice(indexOfEmail(target.dataset.email), 1);
	storage.set({ emailsArray });
};

const buttonDisabled = () => {
	buttonAdd.disabled = inputEmail.value === '';
};

buttonAdd.addEventListener('click', addEmail);

inputEmail.addEventListener('input', buttonDisabled);

inputEmail.addEventListener('keydown', event => {
	if (event.key === 'Enter') {
		addEmail();
	}
});

chrome.storage.onChanged.addListener(showEmailsList);

mailList.addEventListener('click', deleteEmail);

showEmailsList();
