import axios from 'axios';
import dataUrl from './dataUrl.json'

let daysData;

function delay(delayInms) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(delayInms);
		}, delayInms);
	});
}

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

async function loadPreviousDay() {
	try {
		const dailyUrl = getPreviousURL(daysData[daysData.length - 1]);
		if (!dailyUrl) throw ('Error getPreviousURL!');
		const dailyData = await fetchDaily(dailyUrl);
		if (!dailyData) throw ('Error fetchDaily!');
		daysData.push(dailyData);
	} catch (error) {
		console.error(error);
	}
}

const maxRequestsPerSecond = 5;

export async function loadPreviousDays(daysNumber = 9) {
	let dayCount = daysNumber;
	do {
		await delay(1000 / maxRequestsPerSecond);
		await loadPreviousDay();
	} while (--dayCount > 0);
}

function getValute(data) {
	return data?.Valute ?? [];
}


export async function loadToday() {
	try {
		const dailyData = await fetchDaily(dataUrl.TodayDailyUrl);
		if (!dailyData) throw ('Error fetchDaily!');
		daysData = [dailyData];
	} catch (error) {
		console.error(error);
	}
}

export async function getToDayValute() {
	return getValute(daysData[0]);
}

export async function getDayValute(daysAgo) {
	console.log(daysData);
	return getValute(daysData[daysAgo]);
}

export function getLastDaysOf(valuteCharCode, daysNumber = 9) {
	const result = Array.from(Array(daysNumber).keys())
		.reduce((valuteDays, day) => {
			const dailyData = getValute(daysData[day + 1]);
			const valute = dailyData[valuteCharCode];
			valuteDays.push({
				Value: valute.Value,
				Previous: valute.Previous,
			});
			return valuteDays;
		}, [])
	return result;
}