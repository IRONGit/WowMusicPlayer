var currentPosX = -1;
var currentPosY = -1;
var lrcPosY = 0;
var gbLrcPos = -1;
var isDown = false;
var EventUtil = {
	addHandler : function(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, false);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		} else {
			elem["on" + type] = handler;
		}
	},
	removeHandler : function(elem, type, handler) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handler, false);
		} else if (elem.detachEvent) {
			elem.detachEvent("on" + type, handler);
		} else {
			elem["on" + type] = null;
		}
	},
	getEvent : function(event) {
		return event ? event : window.event;
	},
	getTarget : function(event) {
		return event.target || event.srcElement;
	},
	preventDefault : function(event) {
		if (event, preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	stopPropagation : function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

};

function seek(ty, str) {

	var offY = ty - currentPosY;
	$('#lrc-content').css("top", lrcPosY + offY);

	var aimLocation = parseInt($('#lrc-content').css("top"));
	var index = Math.ceil(Math.abs(aimLocation / $('.lrc-p').height()));

	if (str === 'mouseup') {
		if (index > flagArray.length - 1) {
			index = flagArray.length - 1;
			$('#lrc-content').css("top", lrcFinalPos + "px");
		}

		for ( var i = 0; i < flagArray.length; i++) {
			flagArray[i] = false;
		}

		while (isNaN(timeIntArray[index])) {
			index++;
			if (index >= flagArray.length) {
				break;
			}
		}

		document.getElementsByTagName('audio')[0].currentTime = timeIntArray[index];
	}

}

function initLine() {
	// 确定#weight的位置
	if (!document.getElementById('weight')) {
		return;
	}
	var linePosY = $('#weight').offset().top - $('#lrc-area').offset().top + 10;
	$('#lrc-area')
			.append(
					" <HR style=\"FILTER: progid:DXImageTransform.Microsoft.Glow(color=gray,strength=10)\" width=\"100%\" id =\"baseLine\" color=gray SIZE=2>");
	$('#baseLine').css("position", "absolute");
	$('#baseLine').css("top", linePosY);
	$('#baseLine').hide();
}
function seekEvent() {
	$('#lrc-area').mouseover(function() {
		$(this).css("cursor", "pointer");
	});

	// lrc-content
	document.getElementById('lrc-area').onmousedown = function(e) {
		if (lrcArray.length > 0) {
			$('#baseLine').show();
			lrcPosY = parseInt($('#lrc-content').css("top"));
			isDown = true;
			e = EventUtil.getEvent(e);
			currentPosX = event.pageX;
			currentPosY = event.pageY;
			if (currentPosX == undefined) {
				currentPosX = e.clientX + document.body.scrollLeft
						|| document.documentElement.scrollLeft;
			}
			if (currentPosY == undefined) {
				currentPosY = e.clientY + document.body.scrollTop
						|| document.documentElement.scrollTop;
			}
			clearTimeout(lrcTimeout);
		}

	};

	document.getElementById('lrc-area').onmousemove = function(e) {
		if (isDown === true) {
			e = EventUtil.getEvent(e);
			var x = event.pageX;
			var y = event.pageY;
			if (x == undefined) {
				x = e.clientX + document.body.scrollLeft
						|| document.documentElement.scrollLeft;
			}
			if (y == undefined) {
				y = e.clientY + document.body.scrollTop
						|| document.documentElement.scrollTop;
			}

			seek(y, 'mousemove');

		}

	};

	document.getElementById('lrc-area').onmouseup = function(e) {
		if (isDown === true) {
			$('#baseLine').hide();
			isDown = false;
			e = EventUtil.getEvent(e);
			var x = event.pageX;
			var y = event.pageY;
			if (x == undefined) {
				x = e.clientX + document.body.scrollLeft
						|| document.documentElement.scrollLeft;
			}
			if (y == undefined) {
				y = e.clientY + document.body.scrollTop
						|| document.documentElement.scrollTop;
			}

			seek(y, 'mouseup');
			gbLrcPos = parseInt($('#lrc-content').css("top"));

			if (gbLrcPos > 8) {
				gbLrcPos = 0;
				var i = 0;
				while (isNaN(timeIntArray[i])) {
					i++;
					if (i >= flagArray.length) {
						break;
					}
				}
				document.getElementsByTagName('audio')[0].currentTime = timeIntArray[i];
				$('#lrc-content').css("top", "0px");
			}
			// playCurrentSong();
			lrcTimeout = setTimeout("newAnimate()", 10);
		}

	};

}
var isBoxDown = false;
var boxPosX = -1;
var boxPosY = -1;

var oDrag;
var isDraging = false;
var startX = 0;
var startY = 0;
function boxDrag() {
	oDrag = document.getElementById('process-dragbox');
	oDrag.addEventListener('mouseover', function() {
		onselectstart = function() {
			return false;
		};
		oDrag.style.cursor = "pointer";
	});
	oDrag.addEventListener('mousedown', function(e) {
		// 鼠标事件1 - 在标题栏按下（要计算鼠标相对拖拽元素的左上角的坐标 ，并且标记元素为可拖动）
		clearTimeout(dragBallTimeout);
		var e = e || window.event;
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		startX = mouseX - oDrag.offsetLeft;
		startY = mouseY - oDrag.offsetTop;
		isDraging = true;

	});

	document.onmouseup = function(e) {
		if (isDraging === true) {
			// 鼠标事件3 - 鼠标松开的时候（标记元素为不可拖动）
			isDraging = false;
			var processLength = document.getElementById('left').offsetWidth
					- oDrag.offsetWidth;
			var posX = parseInt(oDrag.style.left);
			var cent = posX / processLength;
			var audioLength = document.getElementById('media').duration;
			clearTimeout(dragBallAnimate);
			if (isplay !== 'undefined' && isplay === true) {
				document.getElementById('media').currentTime = cent
						* audioLength;
				
				for(var i=0;i<lrcLength;i++){
					flagArray[i]=false;
				}
				
				dragBallTimeout = setTimeout("dragBallAnimate()", 10);
			}
		}
	};
}

function processControl() {
	document.getElementById('process-dragbox').onmousedown = function(e) {
		isBoxDown = true;
		e = EventUtil.getEvent(e);

		boxPosX = event.pageX;
		boxPosY = event.pageY;
		if (boxPosX == undefined) {
			boxPosX = e.clientX + document.body.scrollLeft
					|| document.documentElement.scrollLeft;
		}
		if (boxPosY == undefined) {
			boxPosY = e.clientY + document.body.scrollTop
					|| document.documentElement.scrollTop;
		}

	};

	document.getElementById('process-dragbox').onmousemove = function(e) {
		if (isBoxDown == true) {
			e = EventUtil.getEvent(e);
			var x = event.pageX;
			var y = event.pageY;
			if (x == undefined) {
				x = e.clientX + document.body.scrollLeft
						|| document.documentElement.scrollLeft;
			}
			if (y == undefined) {
				y = e.clientY + document.body.scrollTop
						|| document.documentElement.scrollTop;
			}
			moveElement('process-dragbox', x,
					$('#process-dragbox').offset().top, 1, 'RIGHT');
		}
	};

	document.getElementById('process-dragbox').onmouseup = function(e) {
		if (isBoxDown == true) {
			e = EventUtil.getEvent(e);
			var x = event.pageX;
			var y = event.pageY;
			if (x == undefined) {
				x = e.clientX + document.body.scrollLeft
						|| document.documentElement.scrollLeft;
			}
			if (y == undefined) {
				y = e.clientY + document.body.scrollTop
						|| document.documentElement.scrollTop;
			}
			isBoxDown = false;
		}
	};

}
