import axios from 'axios';

function fetchDaily(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				// console.log(response);
				if (response.status === 200)
					resolve(response.data);
				else
					reject(response);
			})
			.catch(reject)
	});
}

function getPreviousURL(dailyData) {
	return dailyData.PreviousURL
}

async function loadLastDays(days = 10) {
	const daysData = [];
	const todayDailyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
	let dayCount = days;
	let url = todayDailyUrl;
	try {
		do {
			const data = await fetchDaily(url);
			url = getPreviousURL(data);
			daysData.push(data);
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