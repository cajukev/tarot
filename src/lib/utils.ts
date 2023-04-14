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

export let getTokenCost = (nbCards: number, model: string) => {
	let cardCost = nbCards / 2;
	let modelCost = model === 'gpt-3.5-turbo' ? 1 : 10;
	return Math.ceil(cardCost * modelCost);
}

export let centsToDollars = (cents: number) => {
	// Returns a string with the dollar amount with 2 decimal places
	return (cents / 100).toFixed(2);
}