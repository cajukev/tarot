import type { Achievement } from "./achievements";

// Fuction that transforms map to array of objects
export let mapToObj = (map: Map<string, Achievement>) => {
	let obj: { [key: string]: any } = {}
	for (let [key, value] of map) {
		obj[key] = value;
	}
	return obj;
};

// Function that transforms array of objects to map
export let objToMap = (obj: { [key: string]: any }) => {
	let map = new Map();
	for (let key in obj) {
		map.set(key, obj[key]);
	}
	if (map.size === 0) {
		return false;
	}

	return map;
};