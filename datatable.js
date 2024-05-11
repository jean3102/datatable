const entriesPagination = document.getElementById('pagination');
const paginationList = document.getElementById('paginationList');
const filterData = document.getElementById('filterData');
const tbody = document.getElementById('tbody');
const thead = document.getElementById('thead');
const tfoot = document.getElementById('tfoot');
const showing = document.getElementById('showing');
const tableName = 'dataTable';
let currentPage = 1;
let itemPerPage = entriesPagination.value;
let sortBy = '';

const getUsers = async () => {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos');
	return await response.json();
};

const pagination = (filterData) => {
	const page = parseInt(currentPage);
	const item = parseInt(itemPerPage);
	let values = getValueFromLocalStore(tableName);

	if (filterData) values = filterData;

	if (values.dataTable) {
		const startIndex = (page - 1) * item;
		const endIndex = item + startIndex;

		showing.innerHTML = `Showing ${startIndex + 1} to ${
			values.dataTable.length
		} of ${getValueFromLocalStore(tableName).dataTable.length} entries`;

		const result = values.dataTable.slice(startIndex, endIndex);

		if (sortBy) return sorbByElement(result);

		return result;
	}
};

const sorbByElement = (result) => {
	return result.sort((a, b) => {
		{
			if (a[sortBy] < b[sortBy]) return -1;
			if (a[sortBy] > b[sortBy]) return 1;
			return 0;
		}
	});
};

const generateHeader = (head) => {
	let headRow = `<tr>`;
	let footRow = `<tr>`;

	headRow += `<th>#</th>`;
	footRow += `<th>#</th>`;
	for (const key in head) {
		headRow += `<th>${head[key]}<span class="${head[key]}"> ^ </span></th>`;
		footRow += `<th>${head[key]}</th>`;
	}
	headRow += `</tr>`;
	thead.innerHTML = headRow;
	tfoot.innerHTML = footRow;
	handleSort();
};

const handleSort = () => {
	const thElements = thead.querySelectorAll('th');
	thElements.forEach(function (th) {
		th.onclick = function () {
			clearSorbSelector();

			const value = this.textContent.split('^');
			th.classList.add('sorbBy');
			sortBy = value[0].trim();
			const paginatedData = pagination();
			if (paginatedData.length > 0) generateTable(paginatedData);
		};
	});
};

const clearSorbSelector = () => {
	const thElements = thead.querySelectorAll('th');

	thElements.forEach(function (th) {
		th.classList.remove('sorbBy');
	});
};

const generateBody = (head, body) => {
	let bodyRow = '';

	if (body.length > 0) {
		for (const key in body) {
			const object = body[key];

			bodyRow += `<tr>`;
			bodyRow += `<td>${parseInt(key) + 1}</th>`;
			for (const iterator of head) {
				bodyRow += `<td>${object[iterator]}</th>`;
			}

			bodyRow += `</tr>`;
		}
	} else {
		bodyRow += `<td colspan="${
			head.length + 1
		}">No matching records found</td>`;
	}

	tbody.innerHTML = bodyRow;
};

const getValueFromLocalStore = (value) => {
	const data = sessionStorage.getItem(value);
	if (data) return JSON.parse(data);
};

const handleNext = () => {
	const values = getValueFromLocalStore(tableName);
	if (currentPage > 0 && values.dataTable) {
		currentPage += 1;
		const paginatedData = pagination();
		if (paginatedData.length > 0) {
			generateTable(paginatedData);
			clearPagination();
			generateTable(paginatedData);
			generateButtonPagination();
		} else {
			currentPage -= 1;
		}
	}
	handleActiveColor();
};

const handlePrevious = () => {
	const values = getValueFromLocalStore(tableName);
	if (currentPage > 1 && values.dataTable) {
		currentPage -= 1;

		const paginatedData = pagination();
		if (paginatedData.length > 0) {
			generateTable(paginatedData);
			clearPagination();
			generateTable(paginatedData);
			generateButtonPagination();
		}
	}
	handleActiveColor();
};

const handleActiveColor = () => {
	const listItems = paginationList.querySelectorAll('li');

	for (const item of listItems) {
		if (parseInt(item.textContent) === currentPage) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	}
};
const generateButton = (value, disable) => {
	const element = document.createElement('li');
	const button = document.createElement('button');

	button.textContent = value;
	if (disable) button.disabled = true;

	element.classList.add('li');

	element.appendChild(button);
	paginationList.appendChild(element);
	button.onclick = function () {
		if (value === '<') handlePrevious();
		if (value === '>') handleNext();
		if (parseInt(value) > 0) handlePage(this.textContent);
	};
};

const handlePage = (value) => {
	const values = getValueFromLocalStore(tableName);
	if (values) {
		currentPage = parseInt(value);
		const paginatedData = pagination();
		if (paginatedData.length > 0) {
			clearPagination();
			currentPage = parseInt(value);
			generateTable(paginatedData);
			generateButtonPagination();
		}
	}
	handleActiveColor();
};

const generateButtonPagination = (dataFilter) => {
	const values = getValueFromLocalStore(tableName);
	let element = values.dataTable.length / itemPerPage;
	if (dataFilter) {
		element = dataFilter.length / itemPerPage;
	}

	const maxElement = currentPage + 5;

	generateButton('<');
	if (maxElement > 10) {
		generateButton(1);
		generateButton('...', true);
		for (let index = currentPage - 3; index < element; index++) {
			if (index > currentPage && maxElement <= element) {
				generateButton(index + 1);
				if (index < element) {
					generateButton('...', true);
					generateButton(element);
				}

				break;
			}
			generateButton(parseInt(index) + 1);
		}
	} else {
		for (let index = 0; index < element; index++) {
			if (index === 5) {
				generateButton(index + 1);
				generateButton('...', true);
				generateButton(element);
				break;
			}
			generateButton(parseInt(index) + 1);
		}
	}

	generateButton('>');
	const li = document.querySelector('#paginationList li:nth-child(2)');
	li.classList.add('active');
};

const generateTable = (body, generateHead = false) => {
	const values = getValueFromLocalStore(tableName);
	if (values) {
		if (generateHead) {
			generateHeader(values.head);
		}
		generateBody(values.head, body);
	}
};

const saveData = (data) => {
	if (sessionStorage.getItem(tableName)) {
		sessionStorage.removeItem(tableName);
	}

	if (data) sessionStorage.setItem(tableName, JSON.stringify(data));
};

const dataTable = (head, data) => {
	if (data.length > 0) {
		saveData({ head: head, dataTable: data });
		const paginatedData = pagination();
		if (paginatedData.length > 0) {
			generateTable(paginatedData, true);
			generateButtonPagination();
		}
	} else {
		generateTable(data);
	}
};
entriesPagination.addEventListener('change', () => {
	let paginatedData = null;
	const items = parseInt(entriesPagination.value);
	(currentPage = 1), (itemPerPage = items), (paginatedData = pagination());
	if (paginatedData.length > 0) {
		clearPagination();
		generateTable(paginatedData);
		itemPerPage = items;
		generateButtonPagination();
	}
});

const clearPagination = () => {
	const liToDelete = paginationList.querySelectorAll('li');
	for (const element of liToDelete) {
		const getList = document.getElementsByClassName('li')[0];
		getList.remove(element);
	}
};

filterData.addEventListener('input', () => {
	const input = filterData.value.toLowerCase().trim();
	const values = getValueFromLocalStore(tableName);

	const searchData = values.dataTable.filter((item) => {
		for (const iterator of values.head) {
			const element = item[iterator].toString().toLowerCase().trim();
			if (element.includes(input)) return item;
		}
	});

	const paginatedData = pagination({
		...values,
		dataTable: searchData,
	});

	clearPagination();
	generateTable(paginatedData);
	generateButtonPagination(searchData);
});

const printData = async () => {
	const data = await getUsers();
	const head = ['title', 'id', 'completed'];
	dataTable(head, data);
};

printData();
