
window.onload = go;


function go() {

	var API_ENDPOINT = "https://dfq6ate2ul.execute-api.us-east-1.amazonaws.com/prod/TileFunction";
	var SIZE = 3;




	tileGrid = $('#tileGrid');
	var dataArray = getDataArray();
	drawTiles(tileGrid, dataArray);



	/* ********** HELPERS ********** */
	function getDataArray() {
		return [1, 2, 3, 4, 5, 6, 7, 8, 0];
	}

	function drawTiles(tileGrid, dataArray) {

		$(tileGrid).empty();
		setupTilegrid(tileGrid);
		setTileGridData(tileGrid, dataArray);


		/* ********** Inner HELPERS ********** */

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
					    class: 'col-md-4 gridcell square',
					    text: 'cell'
					}).appendTo(row);
				}
				$(tileGrid).append(row);
			}
		}

		function setTileGridData(tileGrid, array) {
			var i = 0
			$(tileGrid).find(".gridcell").each(function() {
				$(this).text(array[i]);
				if (array[i] === 0) {
					$(this).addClass("zerocell");
				}
				i++;
			});
		}
	}
}