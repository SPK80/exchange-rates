import { Table, Tooltip } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { getToDayValute, getLastDaysOf, loadToday, loadPreviousDays } from './dataApi';

function App() {

	const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	useEffect(loadData, []);

	async function loadData() {
		let todayData;
		try {
			setLoading(true);
			await loadToday();
			todayData = prepareData(await getToDayValute());
			setDataSource(todayData);
		} catch (error) {
			console.error(error);
			return;
		} finally {
			setLoading(false);
		}

		try {
			await loadPreviousDays();
			setDataSource(todayData
				.map(valute => ({
					...valute,
					children: getLastDaysOf(valute.CharCode)
						.map(({ Value, Previous }, index) => ({
							key: valute.CharCode + index,
							Value,
							Previous,
							delta: calcDeltaPercent(Value, Previous),
						}))
				}))
			);
		} catch (error) {
			console.error(error);
			return;
		}
	}

	const columns = [
		{
			key: 'NominalAndCharCode',
			title: 'Букв. код',
			dataIndex: 'NominalAndCharCode',
			render: NominalAndCharCode => <div className='NominalAndCharCode'>{NominalAndCharCode}</div>
		},
		{
			key: 'Value',
			title: 'Курс',
			dataIndex: 'Value',
			render: Value => Value.toString().replace('.', ',')
		},
		{
			key: 'delta',
			title: 'Δ',
			dataIndex: 'delta',
			render: delta => {
				let trendClass = 'LateralTrend';
				if (delta >= 0.1) trendClass = 'RisingTrend'
				else if (delta <= -0.1) trendClass = 'DownTrend';
				return (<span className={trendClass}>{`${delta.toString().replace('.', ',')} %`}</span>);
			}

		},
	];

	function RowTooltip(props) {
		const name = dataSource.find(dataRow => dataRow.key === props['data-row-key'])?.Name;
		return (
			<Tooltip
				title={name}
				placement="topLeft"
				mouseEnterDelay={0.02}
				mouseLeaveDelay={0.02}
			>
				<tr {...props} />
			</Tooltip>
		);
	}

	function calcDeltaPercent(Value, Previous) {
		return ((Value - Previous) / Value * 100).toFixed(1)
	}

	function prepareData(valute) {
		if (!valute) return []

		return [
			...Object.values(valute)
				.map(valute => ({
					key: valute.ID,
					Name: valute.Name,
					CharCode: valute.CharCode,
					NominalAndCharCode: `${valute.Nominal} * ${valute.CharCode}`,
					Value: valute.Value,
					delta: calcDeltaPercent(valute.Value, valute.Previous),
					children: [],
				}))
		];
	}

	return (
		<div className='Wrapper'>
			<div className='Table'>
				<Table
					size={'middle'}
					loading={loading}
					dataSource={dataSource}
					columns={columns}
					expandRowByClick={true}
					components={{ body: { row: RowTooltip } }}
					pagination={{
						defaultPageSize: 10,
						showSizeChanger: true,
						pageSizeOptions: [5, 10, 50],
					}}
				/>
				<footer><a href='https://www.cbr-xml-daily.ru/' target="_blank">cbr-xml-daily</a></footer>
			</div>
		</div>
	);
}

export default App;
