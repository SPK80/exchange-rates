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

	const columns = [
		{
			title: 'Валюта',
			dataIndex: 'name',
			key: 'key',
			// align: 'left',
			className: 'Name',
			width: '80%',
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'key',
			// align: 'right',
			width: '20%',

		},

	];

	return (

		<div className='Wrapper'>

			<Table
				size={'middle'}
				dataSource={dataSource}
				columns={columns}
			/>

		</div>
	);
}

export default App;
