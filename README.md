# Simple Datatable

This DataTable is a tool to handle tabular data efficiently in javascript. Whether you're working with small data sets or big data, DataTable offers a comprehensive set of features to seamlessly manipulate, analyze, and visualize your data.

##Characteristics

- **Data manipulation:** Perform operations such as filtering and sorting data with ease.

## Facility

To use the DataTable, simply follow the instructions below:


### copy the following structure

```
  	<article class="mainContainer">
			<section class="container">
				<section class="tableHead">
					<section>
						<select
							name="pagination"
							id="pagination">
							<option value="10">10</option>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
						<span> entries per page</span>
					</section>
					<input
						type="text"
						id="filterData"
						placeholder="Search..." />
				</section>
				<table id="dataTable">
					<thead id="thead"></thead>
					<tbody id="tbody"></tbody>
					<tfoot id="tfoot"></tfoot>
				</table>
				<section class="pagingButton">
					<span id="showing"></span>
					<ul id="paginationList"></ul>
				</section>
			</section>
	</article>
```

## then export the datatable function
This function receives two parameters, the first are the columns and the second is the object array.


`Make sure the keys are identical to the object array you want to render`


```
import { dataTable } from './datatable.js';

const data = await getData();
const head = ['key1', 'key2', 'key3', 'etc....'];

dataTable(head, data);
```




