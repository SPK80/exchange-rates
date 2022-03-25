import axios from 'axios';

const todayDailyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
let predDailyUrl = '';

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

export async function getTodayDailyValute() {
	return getValute(await fetchDaily(todayDailyUrl));
}

const last10Days = {
	loaded: false,
	daysData: [],
};

async function loadLast10Days() {
	let dayCount = 10;
	let url = todayDailyUrl;
	try {
		do {
			const data = await fetchDaily(url);
			url = data.PreviousURL;
			last10Days.daysData.push(data);
		} while (--dayCount > 0);
		last10Days.loaded = true;
	} catch (error) {
		console.error(error);
	}
}

export async function getLast10DaysOf(ValuteID) {
	if (!last10Days.loaded) {
		await loadLast10Days();
	}

	if (last10Days.loaded)
		return last10Days.daysData.reduce((valuteDays, dayData) => {
			const valute = [...Object.values(dayData.Valute)].find(v => v.ID === ValuteID);
			valuteDays.push(valute);
			return valuteDays;
		}, [])
	else return [];
}