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
	let modelCost = 0;
	let modelMultiplier = 0;
	switch (model) {
		case 'gpt-3.5-turbo':
			modelCost = 0.75;
			modelMultiplier = 0.25;
			break;
		case 'gpt-4':
			modelCost = 4;
			modelMultiplier = 1;
			break;
	}

	return (nbCards * modelMultiplier + modelCost);
}

export let centsToDollars = (cents: number) => {
	// Returns a string with the dollar amount with 2 decimal places
	return (cents / 100).toFixed(2);
}