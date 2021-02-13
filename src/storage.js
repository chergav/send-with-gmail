export class Storage {
	_storage = chrome.storage.sync;
	_example = ['mail@example.com', 'mail@example.org'];
	
	async _getStorageData(key = null) {
		return new Promise((res, _) => {
			this._storage.get(key, data =>
				res(data && data[key] ? data[key] : this._example)
			);
		});
	}

	saveSettings(data) {
		this._storage.set({ settings: data }, () => 
			alert(chrome.i18n.getMessage('data_saved'))
		);
	}

	async getSettings() {
		//this._storage.clear();
		//this._storage.get(null, d => console.log(d));
		return await this._getStorageData('settings');
	}
}