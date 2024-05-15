import { dataTable } from './datatable.js';

const getUsers = async () => {
	const response = await fetch('https://dummyjson.com/users');
	const data = await response.json();
	return data.users;
};

const printData = async () => {
	const data = await getUsers();
	const head = ['firstName', 'email', 'age', 'phone'];
	dataTable(head, data);
};

printData();
