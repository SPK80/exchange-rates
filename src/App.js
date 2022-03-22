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
				delta: (`(${(v.Value - v.Previous).toFixed(1)})`)
			}
			))
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

	return (

		<div className='Wrapper'>
			<div className='Table'>
				<Table
					size={'middle'}
					dataSource={dataSource}
					columns={columns}
					pagination={{ pageSize: 20 }}
					onRow={(record, index) => ({
						// onClick: event => { console.log(event) }, // click row
						// onDoubleClick: event => { console.log(event) }, // double click row
						// onContextMenu: event => { console.log(event) }, // right button click row
						onMouseEnter: event => { console.log(event) }, // mouse enter row
						onMouseLeave: event => { console.log(event) }, // mouse leave row
					})}
				/>
			</div>
		</div>
	);
}

export default App;
