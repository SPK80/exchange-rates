import axios from 'axios';

const todayDailyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
let predDailyUrl = '';

function fetchDaily(url) {
	return new Promise((resolve, reject) => {
		axios.get(url)
			.then(response => {
				// console.log(response);
				if (response.status === 200)
					resolve(getValute(response.data));
				else
					reject(response);
			})
			.catch(reject)
	});
}

function getValute(data) {
	return data?.Valute ?? [];
}

export function fetchValute(daysAgo = 0) {
	return fetchDaily(todayDailyUrl);
}