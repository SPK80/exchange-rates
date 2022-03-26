import axios from 'axios';
import dataUrl from './dataUrl.json'

async function fetchDaily(dailyUrl) {
	try {
		const response = await axios.get(dailyUrl);
		if (response.status !== 200) throw (response);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

function getPreviousURL(dailyData) {
	return dailyData?.PreviousURL;
}

async function loadLastDays(daysNumber = 10) {
	const daysData = [];
	let dayCount = daysNumber;
	let dailyUrl = dataUrl.TodayDailyUrl;
	try {
		do {
			const dailyData = await fetchDaily(dailyUrl);
			if (!dailyData) throw ('Error fetchDaily!');
			dailyUrl = getPreviousURL(dailyData);
			if (!dailyUrl) throw ('Error getPreviousURL!');
			daysData.push(dailyData);
		} while (--dayCount > 0);
		return daysData;
	} catch (error) {
		console.error(error);
	}
}

let daysData;

export async function getDailyValute(daysAgo = 0) {
	if (!daysData) daysData = await loadLastDays();
	return getValute(daysData[daysAgo]);
}

function getValute(data) {
	return data?.Valute ?? [];
}

export function getLastDaysOf(valuteCharCode, daysNumber = daysData.length - 1) {
	return Array.from(Array(daysNumber).keys())
		.reduce((valuteDays, day) => {
			const dailyData = getValute(daysData[day + 1]);
			const valute = dailyData[valuteCharCode];
			valuteDays.push({
				Value: valute.Value,
				Previous: valute.Previous,

			});
			return valuteDays;
		}, [])
}