import { Table } from 'antd';
import './App.css';
import 'antd/dist/antd.css';

import daily from './daily.json';

function App() {


	const dataSource = [
		...Object.values(daily.Valute).map(v => {

			return { key: v.ID, name: v.Name, value: v.Value }
		})
	];
	console.log(dataSource);

	// function onChange(pagination, filters, sorter, extra) {
	// 	console.log('params', pagination, filters, sorter, extra);
	// }
	// const dataSource = [
	// 	{
	// 		key: '1',
	// 		name: 'Mike',
	// 		age: 32,
	// 		address: '10 Downing Street',
	// 	},
	// 	{
	// 		key: '2',
	// 		name: 'John',
	// 		age: 42,
	// 		address: '10 Downing Street',
	// 	},
	// ];
	// console.log(dataSource);
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'key',
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'key',
		},

	];

	return (
		<Table
			size={'middle'}
			dataSource={dataSource}
			columns={columns}
		/>
	);
}

export default App;
