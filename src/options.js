import { Storage } from './storage.js';

(async () => {
	const storage = new Storage();
	const i18n = message => chrome.i18n.getMessage(message);

	document.querySelectorAll('[data-locale]').forEach(i => 
		i.textContent = i18n(i.dataset.locale)
	);

	const mailList = document.querySelector('#mail_list');

	document.querySelector('button').addEventListener('click', saveOptions);

	loadSavedOptions(await storage.getSettings());

	function loadSavedOptions(arr){
		mailList.value = '';
		mailList.value = arr.join('\n');
	}

	function checkEmails(mla) {
		let re = /\S+@\S+\.\S+/;
		if (!mla.every(i => re.test(i)))
			return false;
		return true;
	}

	function saveOptions() {
		let mailListArr = mailList.value.split('\n').map(i => i.trim()).filter(Boolean);
		if (!checkEmails(mailListArr)) {
			alert(i18n('email_error'));
			return;
		}
		storage.saveSettings(mailListArr);
		loadSavedOptions(mailListArr);
	}
})();