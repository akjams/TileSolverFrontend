
window.onload = go;


function go() {

	var API_ENDPOINT = "https://dfq6ate2ul.execute-api.us-east-1.amazonaws.com/prod/TileFunction";
	var SIZE = 3;




	setupTilegrid(tileGrid);
	var dataArray = getDataArray();
	setTileGridData(tileGrid, dataArray);




	function setupTilegrid(tileGrid) {
		for (var i = 0; i < SIZE; i++) {
			appendRow(tileGrid);
		}
		
		function appendRow(tileGrid) {
			var row = $('<div/>', {
				class: 'row'
			});
			for (var j = 0; j < SIZE; j++) {
				$('<div/>', {
				    class: 'col-md-4 gridcell',
				    text: 'cell'
				}).appendTo(row);
			}
			$(tileGrid).append(row);
		}
	}

	function getDataArray() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 0];
	}

	function setTileGridData(tileGrid, array) {
		var i = 0
		$(tileGrid).find(".gridcell").each(function() {
			$(this).text(array[i]);
			i++;
		});
	}



}