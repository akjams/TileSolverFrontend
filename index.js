
window.onload = go;


function go() {

	/* **** SET UP **** */
	var API_ENDPOINT = "https://dfq6ate2ul.execute-api.us-east-1.amazonaws.com/prod/TileFunction";
	var SIZE = 3;
	var TOTAL_SIZE = 9;
	var animation = getAnimation();
	var inputDiv = $('#inputDiv')
	var soluDiv = $('#soluDiv');
	var tileGrid = $('#tileGrid');
	var inputGrid = $('#inputGrid');
	var messageField = $('#message');
	var solveButton = $('#solve');
	var newGameButton = $('#newButton');
	var gameStateManager = getGameStateManager();

	setUp();
	/* ****        **** */


	function setUp() {
		
		animation.setButtons($('#prev'), $('#next'));

		var defaultInputGrid = getDefaultInputGrid(SIZE);
		drawTiles(inputGrid, defaultInputGrid, "<textarea/>");
		drawTiles(tileGrid, defaultInputGrid, "<div/>");
		$(solveButton).click(onClickSolve);
		$(newGameButton).click(onClickNewGame);
		setOnclickInputGreyZeros();
		gameStateManager.setIntro();
	}

	function getGameStateManager() {
		introList = [inputDiv, messageField, solveButton];
		doneList = [soluDiv, messageField, newGameButton];
		var gsm = {
			setIntro: function() {
				this.hideAll(doneList);
				this.showAll(introList);
			},
			setDone: function() {
				this.hideAll(introList);
				this.showAll(doneList);
			},
			hideAll: function(ar) {
				for (var i = 0; i < ar.length; i++) {
					$(ar[i]).hide();
				}
			},
			showAll: function(ar) {
				for (var i = 0; i < ar.length; i++) {
					$(ar[i]).show();
				}
			}
		}
		return gsm;
	}

	function setOnclickInputGreyZeros() {
		$('textarea').change(function() {
			var num = parseInt($(this).val());
			if (num === 0) {
				$(this).removeClass("invalidCell");
				$(this).addClass("zerocell");
			} else if (num > 0 && num < TOTAL_SIZE) {
				$(this).removeClass("invalidCell");
				$(this).removeClass("zerocell");
			} else {
				$(this).removeClass("zerocell");
				$(this).addClass("invalidCell");
			}
		});
	}


	function callbackSetSolutionArray(data) {
		animation.setSolutionArray(data);
	}

	function onClickNewGame() {
		gameStateManager.setIntro();
	}

	function onClickSolve() {
		gameStateManager.setDone();
		setMessage("Solving");
		var dataArray = getDataArray(inputGrid);
		if (validDataArray(dataArray, SIZE * SIZE)) {
			getSolution(dataArray, callbackSetSolutionArray);
		} else {
			setMessage("Invalid input. Please enter numbers 0 through 8");
		}
	}	

	function setMessage(m) {
		$(messageField).text(m);
	}

	function validDataArray(ar, size) {
		for (var i = 0; i < size; i++) {
			if (ar.indexOf(i) === -1) {
				return false;
			}
		}
		if (ar.length === size) {
			return true;
		}
		return false;
	}

	function getAnimation() {
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

				var that = this;

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
		return animation;
	}


	/* ********** HELPERS ********** */
	function getDataArray(inputGrid) {
		ar = [];
		$(inputGrid).find('.gridcell').each(function() {
			ar.push(parseInt($(this).val()));
		});
		return ar;
	}

	function getDefaultInputGrid(size) {
		// var ar = [];
		// for (var i = 1; i < size * size; i++) {
		// 	ar.push(i);
		// }
		// ar.push(0);
		// return ar;

		return [5, 4, 1, 8, 3, 0, 2, 6, 7]
	}

	function getSolution(dataArray, callback) {

			//turn array into padded number string
			var dataString = dataArray.toString().replace(/,/g, ' ');
			dataString = "\"" + dataString + "\"";

			$.ajax({
				url: API_ENDPOINT,
				type: "POST",
				data: dataString,
				success: function(data) {
					try {
						//console.log(data);
						data = JSON.parse(data);
						callback(data);
						setMessage("SUCCESS");
					} catch (err) {
						setMessage("That's an impossible board!");
					}
				},
				error: function(data) {
					setMessage("Server Error. Sorry :(");
				}

			});
	}

	function drawTiles(tileGrid, dataArray, cellDivType) {

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

				var row = $('<div/>', {
					class: 'row'
				});
				for (var j = 0; j < SIZE; j++) {
					$(cellDivType, {
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