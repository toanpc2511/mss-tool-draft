/* eslint-disable no-empty */
export const storageUtils = {
	set(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {}
	},

	setMap(key, mapValue: Map<any, any>) {
		try {
			localStorage.setItem(
				key,
				JSON.stringify(Array.from(mapValue.entries()))
			);
		} catch (e) {}
	},

	get(key: string) {
		try {
			return JSON.parse(localStorage.getItem(key) || '');
		} catch (e) {}
	},

	getMap(key: string) {
		try {
			return new Map(JSON.parse(localStorage.getItem(key) || null));
		} catch (e) {}
	},

	remove(key) {
		localStorage.removeItem(key);
	},

	clear() {
		localStorage.clear();
	},

	clearPrefix(prefix: string) {
		for (const key in localStorage) {
			if (key.indexOf(prefix) === 0) {
				localStorage.removeItem(key);
			}
		}
	}
};
