import { Button, Table, Tooltip } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { useState } from 'react';
import { getDailyValute, getLastDaysOf } from './dataApi';

function App() {

	const [loading, setLoading] = useState(false);
	const [dataSource, setDataSource] = useState([]);

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
			title: 'Изменение курса',
			dataIndex: 'delta',
			width: '10%',
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

	function renderDeltaPercent(Value, Previous) {
		return `(${((Value - Previous) / Value * 100).toFixed(1)}%)`
	}

	function prepareData(valute) {
		if (!valute) return []
		function prepareChildData(charCode) {
			const data = getLastDaysOf(charCode)
			return data.map((valute, index) => ({
				Value: valute.Value,
				key: charCode + index,
				delta: renderDeltaPercent(valute.Value, valute.Previous),
			}))
		}

		return [
			...Object.values(valute)
				.map(valute => ({
					key: valute.ID,
					Name: valute.Name,
					CharCode: valute.CharCode,
					Value: valute.Value,
					delta: renderDeltaPercent(valute.Value, valute.Previous),
					children: prepareChildData(valute.CharCode),
				}))
		];
	}

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

	return (

		<div className='Wrapper'>
			<div>
				<Button
					onClick={getData}
				>Load</Button>
			</div>

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
