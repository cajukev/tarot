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

export let getTokenCost = (nbCards: number, model: string, length: string, information?: string) => {
	let modelCost = 0;
	let modelMultiplier = 0;
	let multiplierPref = 0.5;
	switch (length) {
		case 'short':
			multiplierPref = 0.75;
			break;
		case 'medium':
			multiplierPref = 1;
			break;
		case 'long':
			multiplierPref = 1.25;
			break;
	}
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

	let fullValue = ((nbCards-1) * modelMultiplier * multiplierPref + modelCost * multiplierPref + (information?.length || 0)*0.0025*modelMultiplier)

	return Math.round(fullValue * 100) / 100;
}

export let getAnalysisTokenCost = (nbCards: number) => {
	return (nbCards * 2 / 10);
}

export let centsToDollars = (cents: number) => {
	// Returns a string with the dollar amount with 2 decimal places
	return (cents / 100).toFixed(2);
}

export let blobToBase64 = (blob: Blob) => {
	return new Promise((resolve) => {
	  const reader = new FileReader();
	  reader.readAsDataURL(blob);
	  reader.onloadend = function () {
		resolve(reader.result);
	  };
	});
  };


export let getLengthInstruction = (length: string, nbCards: number) => {
	let lengthInstruction = "";
	switch (length) {
		case 'short':
			lengthInstruction = `Keep the reading short and succinct. Max ${nbCards * 50} words.`;
			break;
		case 'medium':
			lengthInstruction = `Keep the reading medium length. Max ${nbCards * 125} words.`;
			break;
		case 'long':
			lengthInstruction = "Provide a long, deep and detailed reading. ";
			break;
	}
	return lengthInstruction;
}
  