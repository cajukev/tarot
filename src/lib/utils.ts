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
			modelCost = 1;
			modelMultiplier = 0.1;
			break;
		case 'gpt-4':
			modelCost = 20;
			modelMultiplier = 2;
			break;
	}

	return ((nbCards-1) * modelMultiplier + modelCost);
}

export let getAnalysisTokenCost = (nbCards: number) => {
	return (nbCards * 2 / 10);
}

export let centsToDollars = (cents: number) => {
	// Returns a string with the dollar amount with 2 decimal places
	return (cents / 100).toFixed(2);
}