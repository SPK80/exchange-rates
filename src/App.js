import { Button, Table, Tooltip } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { useEffect, useState } from 'react';
import { getDailyValute, getLastDaysOf } from './dataApi';

function App() {

	const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);

	async function getData() {
		setLoading(true);
		try {
			setDataSource(prepareData(await getDailyValute()));
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(getData, []);

	const columns = [
		{
			key: 'CharCode',
			title: 'Букв. код',
			dataIndex: 'CharCode',
		},
		{
			key: 'Value',
			title: 'Курс',
			dataIndex: 'Value',
		},
		{
			key: 'delta',
			title: 'Δ',
			dataIndex: 'delta',
			width: '10%',
			render: delta => {
				let trendClass = 'LateralTrend'
				if (delta >= 0.1) trendClass = 'RisingTrend'
				else if (delta <= -0.1) trendClass = 'DownTrend';
				return (<span className={trendClass}>{`${delta} %`}</span>);
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
		function prepareChildData(charCode) {
			const data = getLastDaysOf(charCode)
			return data.map((valute, index) => ({
				Value: valute.Value,
				key: charCode + index,
				delta: calcDeltaPercent(valute.Value, valute.Previous),
			}))
		}
		return [
			...Object.values(valute)
				.map(valute => ({
					key: valute.ID,
					Name: valute.Name,
					CharCode: valute.CharCode,
					Value: valute.Value,
					delta: calcDeltaPercent(valute.Value, valute.Previous),
					children: prepareChildData(valute.CharCode),
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
					pagination={{ pageSize: 10 }}
				/>
			</div>
		</div>
	);
}

export default App;
