const entriesPagination = document.getElementById('pagination');
const paginationList = document.getElementById('paginationList');
const filterData = document.getElementById('filterData');
const tbody = document.getElementById('tbody');
const thead = document.getElementById('thead');
const tfoot = document.getElementById('tfoot');
const showing = document.getElementById('showing');
const tableName = 'dataTable';
let savedData = [];
let saveFiltered = [];
let currentPage = 1;
let itemPerPage = entriesPagination.value;
let sortBy = '';

const getUsers = async () => {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos');
	return await response.json();
};

const pagination = () => {
	const page = parseInt(currentPage);
	const item = parseInt(itemPerPage);
	let data = savedData.body;

	if (saveFiltered.length > 0) {
		data = saveFiltered;
	}

	if (data) {
		let startIndex = (page - 1) * item;
		let endIndex = item + startIndex;

		if (data.length < startIndex) {
			startIndex = 0;
			endIndex = item + startIndex;
		}

		let result = data.slice(startIndex, endIndex);

		showingEntries(startIndex,endIndex, data);
		if (sortBy) return sorbByElement(result);

		return result;
	}
};

const showingEntries = (startIndex, endIndex,data) => {
	showing.innerHTML = `Showing ${startIndex + 1} to ${endIndex} of ${
		savedData.body.length
	} entries`;
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

const handleNext = () => {
	const values = getValueFromLocalStore(tableName);
	if (currentPage > 0 && savedData.body) {
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
	if (currentPage > 1 && savedData.body) {
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

const handlePage = (value) => {
	if (savedData.body) {
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

filterData.addEventListener('input', () => {
	const input = filterData.value.toLowerCase().trim();

	const searchData = savedData.body.filter((item) => {
		for (const iterator of savedData.head) {
			const element = item[iterator].toString().toLowerCase().trim();
			if (element.includes(input)) return item;
		}
	});

	saveFiltered = searchData;

	const paginatedData = pagination();

	clearPagination();
	generateTable(paginatedData);
	generateButtonPagination();
});

const clearPagination = () => {
	const liToDelete = paginationList.querySelectorAll('li');
	for (const element of liToDelete) {
		const getList = document.getElementsByClassName('li')[0];
		getList.remove(element);
	}
};

const generateHeader = (head) => {
	let headRow = '<tr>';
	let footRow = '<tr>';

	headRow += '<th>#</th>';
	footRow += '<th>#</th>';
	for (const key in head) {
		headRow += `<th>${head[key]}<span class="${head[key]}"> ^ </span></th>`;
		footRow += `<th>${head[key]}</th>`;
	}
	headRow += '</tr>';
	thead.innerHTML = headRow;
	tfoot.innerHTML = footRow;
	handleSort();
};

const generateBody = (head, body) => {
	let bodyRow = '';

	if (body.length > 0) {
		let startIndex = (currentPage - 1) * itemPerPage + 1;

		for (const key in body) {
			const object = body[key];

			bodyRow += '<tr>';
			if (currentPage > 1) {
			
				bodyRow += `<td>${
					parseInt(startIndex) + parseInt(key)
				}</th>`;
			} else {
				bodyRow += `<td>${parseInt(key) + 1}</th>`;
			}
			
			for (const iterator of head) {
				bodyRow += `<td>${object[iterator]}</th>`;
			}

			bodyRow += '</tr>';
		}
	} else {
		bodyRow += `<td colspan="${
			head.length + 1
		}">No matching records found</td>`;
	}

	tbody.innerHTML = bodyRow;
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

const generateButtonPagination = () => {
	let element = Math.ceil(savedData.body.length / itemPerPage);
	if (saveFiltered.length > 0) {
		element = Math.ceil(saveFiltered.length / itemPerPage);
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
	if (body) {
		if (generateHead) {
			generateHeader(savedData.head);
		}
		generateBody(savedData.head, body);
	}
};

const dataTable = (head, data) => {
	if (data.length > 0) {
		savedData = { head: head, body: data };
		const paginatedData = pagination();
		if (paginatedData.length > 0) {
			generateTable(paginatedData, true);
			generateButtonPagination();
		}
	} else {
		generateTable(data);
	}
};

const printData = async () => {
	const data = await getUsers();
	const head = ['title', 'id', 'completed'];
	dataTable(head, data);
};

printData();
