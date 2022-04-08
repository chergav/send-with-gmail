class Storage {
	#example = ['mail@example.com', 'mail@example.org'];

	#storage = (type = 'sync') => chrome.storage[type];

	async get(key = null, storageType) {
		try {
			const data = await this.#storage(storageType).get(key);
			return data && data[key] ? data[key] : this.#example;
		} catch (e) {
			console.error(e);
		}
	}

	set(data, storageType) {
		this.#storage(storageType).set(data, 
			//alert(chrome.i18n.getMessage('data_saved'))
		);
	}
}

export default new Storage();
