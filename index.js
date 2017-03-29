
window.onload = go;


function go() {

	var API_ENDPOINT = "https://dfq6ate2ul.execute-api.us-east-1.amazonaws.com/prod/TileFunction";
	var SIZE = 3;




	var tileGrid = $('#tileGrid');
	var inputGrid = $('#inputGrid');
	var defaultInputGrid = getDefaultInputGrid(SIZE);

	var animation = {
		tileGrid: null,
		prev: null,
		next: null,
		solutionArray: null,
		solutionIndex: 0,
		SIZE: 3,

		setButtons: function(prev, next) {
			this.prev = prev;
			this.next = next;

			that = this;

			$(this.prev).click(function() {
				if (that.solutionIndex !== 0) {
					that.solutionIndex--;
					that.drawTileData(that.solutionArray[that.solutionIndex]);
				}
			});

			$(this.next).click(function() {
				if (that.solutionIndex !== that.solutionArray.length - 1) {
					that.solutionIndex++;
					that.drawTileData(that.solutionArray[that.solutionIndex]);
				}
			});

		},

		setSolutionArray: function(solutionArray) {
			this.solutionArray = solutionArray;
			this.solutionIndex = 0;
			this.drawTileData(this.solutionArray[0]);
		},

		drawTileData(tileData) {
			var i = 0
			$(tileGrid).find(".gridcell").each(function() {
				var row = Math.floor(i / SIZE);
				var col = i % SIZE;
				$(this).text(tileData[row][col]);
				if (tileData[row][col] === 0) {
					$(this).addClass("zerocell");
				} else {
					$(this).removeClass("zerocell");
				}
				i++;
			});
		}

	};

	/////////////////////////////////
	///////////////////////////////// ENCAPSULATE INTO ONCLICK SOLVE
	/////////////////////////////////

	var dataArray = getDataArray();
	drawTiles(tileGrid, dataArray);
	drawTiles(inputGrid, defaultInputGrid, "");

	animation.setButtons($('#prev'), $('#next'));
	//animation.setSolutionArray(getSolution(dataArray));
	var callbackSetSolutionArray = function(data) {
		animation.setSolutionArray(data);
	}
	//getSolution(dataArray, callbackSetSolutionArray);

	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////
	/////////////////////////////////




	/* ********** HELPERS ********** */
	function getDataArray() {
		return [1, 2, 3, 4, 5, 6, 7, 0, 8];
	}

	function getDefaultInputGrid(size) {
		var ar = [];
		for (var i = 1; i < size * size; i++) {
			ar.push(i);
		}
		ar.push(0);
		return ar;
	}

	function getSolution(dataArray, callback) {

			//turn array into padded number string
			var dataString = dataArray.toString().replace(/,/g, ' ');
			dataString = "\"" + dataString + "\"";

			console.log(dataString);
			$.ajax({
				url: API_ENDPOINT,
				type: "POST",
				data: dataString,
				async: false,
				success: function(data) {
					data = JSON.parse(data);
					//console.log(data[0]);
					callback(data);
					//return data;
				}
			});
	}

	function drawTiles(tileGrid, dataArray, extraClassName) {

		$(tileGrid).empty();
		setupTilegrid(tileGrid);
		setTileGridData(tileGrid, dataArray);


		/* ********** Inner HELPERS ********** */

		function setupTilegrid(tileGrid) {
			for (var i = 0; i < SIZE; i++) {
				appendRow(tileGrid);
			}
			
			function appendRow(tileGrid) {

				var gridClass = 'col-xs-4 gridcell square ';

				if (typeof(extraClassName === "string")) {
					gridClass += extraClassName;
				}
				var row = $('<div/>', {
					class: 'row'
				});
				for (var j = 0; j < SIZE; j++) {
					$('<div/>', {
					    class: gridClass,
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