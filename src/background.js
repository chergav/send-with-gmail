import { Storage } from './storage.js';

(() => {
	const storage = new Storage();
	const i18n = message => chrome.i18n.getMessage(message);

	menuCreate();

	chrome.storage.onChanged.addListener(()=> menuCreate());

	async function menuCreate(){
		chrome.contextMenus.removeAll();
		
		const emailArray = await storage.getSettings();

		chrome.contextMenus.create({
			title: i18n('menu_title'),
			contexts: ["selection"],
			id: "sendFromGmail"
		});

		emailArray.forEach(email =>
			chrome.contextMenus.create({
				title: email,
				parentId: "sendFromGmail",
				contexts: ["selection"],
				onclick: (info, _) => sendEmail(email, info.selectionText)
			})
		);

		chrome.contextMenus.create({
			type: 'separator',
			parentId: "sendFromGmail",
			contexts: ["selection"]
		});
	
		chrome.contextMenus.create({
			title: i18n('menu_options'),
			parentId: "sendFromGmail",
			contexts: ["selection"],
			onclick: () => chrome.runtime.openOptionsPage()
		});
	}

	function sendEmail(to, body) {
		const subject = (new Date).toLocaleString();
		const gmailURL = `
			https://mail.google.com/mail/?view=cm&fs=1&tf=1
			&to=${to}
			&su=${encodeURIComponent(subject)}
			&body=${encodeURIComponent(body)}
		`;
		chrome.windows.create({
			type: "popup",
			url: gmailURL,
			left: 50,
			top: 30,
			width: 700,
			height: 600
		});
	}
})();