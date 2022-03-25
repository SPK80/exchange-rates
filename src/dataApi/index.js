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

function getValute(data) {
	return data?.Valute ?? [];
}

export async function getDailyValute(daysAgo = 0) {
	return getValute(daysData[daysAgo]);
}

const daysData = [];

export async function loadLastDays(days = 10) {
	const todayDailyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
	let dayCount = 10;
	let url = todayDailyUrl;
	try {
		do {
			const data = await fetchDaily(url);
			url = data.PreviousURL;
			daysData.push(data);
		} while (--dayCount > 0);
	} catch (error) {
		console.error(error);
	}
}

export async function getLast10DaysOf(valuteCharCode) {
	return daysData.reduce((valuteDays, dayData) => {
		const valute = dayData.Valute[valuteCharCode];
		valuteDays.push(valute.Value);
		return valuteDays;
	}, [])
}