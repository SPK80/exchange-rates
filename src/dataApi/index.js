import axios from 'axios';
import serverApi from './serverApi.json'

let daysData;

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

export function loadPreviousDays(daysNumber = 9) {
	return new Promise((resolve, reject) => {
		let dayCount = daysNumber;
		const interval = 1000 / serverApi.MaxRequestsPerSecond;
		const promises = [];
		setTimeout(function continueRun() {
			promises.push(loadPreviousDay());
			if (--dayCount > 0) setTimeout(continueRun, interval);
			else Promise.all(promises).then(resolve).catch(reject);
		}, interval);
	});
}

function getValute(data) {
	return data?.Valute ?? [];
}

export async function loadToday() {
	try {
		const dailyData = await fetchDaily(serverApi.TodayDailyUrl);
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