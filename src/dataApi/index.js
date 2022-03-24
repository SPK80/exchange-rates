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

export function getTodayDailyValute() {
	return fetchDaily(todayDailyUrl);
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

	} catch (error) {
		console.error(error);
	}
}

export function getLast10DaysOf(ValuteID) {
	if (!last10Days.loaded) {
		loadLast10Days();
	}

	return last10Days.daysData.reduse((valuteDays, day) => {
		const valute = day.Valute.find(v => v.ID === ValuteID);
		valuteDays.push(valute);
	}, [])

}