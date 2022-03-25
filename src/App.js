import { Button, Table, Tooltip } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import { useState } from 'react';
import { getLast10DaysOf, getTodayDailyValute, loadLast10Days } from './dataApi';

function App() {

	const [loading, setLoading] = useState(false);

	const [dataSource, setDataSource] = useState([]);

	const columns = [

		// {
		// 	title: 'Валюта',
		// 	dataIndex: 'Name',
		// 	key: 'ID',
		// 	width: '40%',
		// },
		{
			title: 'Букв. код',
			dataIndex: 'CharCode',
			key: 'key',
		},
		{
			title: 'Курс',
			dataIndex: 'Value',
			key: 'key',
		},
		{
			title: 'Изменение курса',
			dataIndex: 'delta',
			key: 'key',
			width: '10%',
		},
		// {
		// 	title: 'Цифр. код',
		// 	dataIndex: 'NumCode',
		// 	key: 'ID',
		// },

		// {
		// 	title: 'Единиц',
		// 	dataIndex: 'Nominal',
		// 	key: 'ID',
		// },

	];

	function CustomRow(props) {
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


	function prepareData(valute) {
		if (!valute) return []
		return [
			...Object.values(valute)
				.map(v => ({
					...v,
					key: v.ID,
					delta: (`(${((v.Value - v.Previous) / v.Value * 100).toFixed(1)}%)`)
				}))
		];
	}

	async function getData() {
		setLoading(true);
		try {
			await loadLast10Days();
			setDataSource(prepareData(await getTodayDailyValute()));
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
					components={{ body: { row: CustomRow } }}
					pagination={{ pageSize: 20 }}
					onRow={(record, index) => ({
						onClick: async e => {
							const ld = await getLast10DaysOf(record.CharCode);
							console.log(ld);
						}, // click row
					})}

				/>
			</div>
		</div>
	);
}

export default App;
