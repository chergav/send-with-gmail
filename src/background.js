import storage from './storage.js';

const menuCreate = async () => {
	chrome.contextMenus.removeAll();
	const emailsArray = await storage.get('emailsArray');

	chrome.contextMenus.create({
		id: 'sendFromGmail',
		title:  chrome.i18n.getMessage('menu_title'),
		contexts: ['selection'],
	});

	emailsArray.forEach(email =>
		chrome.contextMenus.create({
			id: email,
			title: email,
			parentId: 'sendFromGmail',
			contexts: ['selection'],
		})
	);

	chrome.contextMenus.create({
		id: 'separator',
		type: 'separator',
		parentId: 'sendFromGmail',
		contexts: ['selection'],
	});

	chrome.contextMenus.create({
		id: 'optionsPage',
		title:  chrome.i18n.getMessage('menu_options'),
		parentId: 'sendFromGmail',
		contexts: ['selection'],
	});
};

const openGmailWindow = (to, body) => {
	const subject = new Date().toLocaleString();
	const url = `
		https://mail.google.com/mail/?view=cm&fs=1&tf=1
		&to=${to}
		&su=${encodeURIComponent(subject)}
		&body=${encodeURIComponent(body)}
	`;
	chrome.windows.create({
		type: 'popup',
		url: url,
		left: 50,
		top: 30,
		width: 700,
		height: 600,
	});
};

chrome.runtime.onInstalled.addListener(menuCreate);

chrome.storage.onChanged.addListener(menuCreate);

chrome.contextMenus.onClicked.addListener((info, _) => {
	if (info.menuItemId === 'optionsPage') {
		chrome.runtime.openOptionsPage();
	} else if (info.parentMenuItemId === 'sendFromGmail') {
		openGmailWindow(info.menuItemId, info.selectionText);
	}
});
