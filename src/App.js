import { Table, Tooltip } from 'antd';
import './App.css';
import 'antd/dist/antd.css';
import daily from './daily.json';

function App() {

	const dataSource = [
		...Object.values(daily.Valute)
			.map(v => ({
				...v,
				key: v.ID,
				delta: (`(${((v.Value - v.Previous) / v.Value * 100).toFixed(1)}%)`)
			}))
	];

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
			colSpan: 2,
			dataIndex: 'Value',
			key: 'key',
		},
		{
			title: 'Изменение курса',
			colSpan: 0,
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
		const name = dataSource.find(dataRow => dataRow.key === props['data-row-key']).Name;
		return (
			<Tooltip title={name}>
				<tr {...props} />
			</Tooltip>
		);
	}

	return (

		<div className='Wrapper'>
			<div className='Table'>
				<Table
					size={'middle'}
					dataSource={dataSource}
					columns={columns}
					components={{ body: { row: CustomRow } }}
					pagination={{ pageSize: 20 }}
				/>
			</div>
		</div>
	);
}

export default App;
