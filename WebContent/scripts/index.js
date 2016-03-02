var isplay = false;

var lrcArray = new Array();
// 中间
var timeStringArray = new Array();
// 最终的时间数组
var timeIntArray = new Array();

var flagArray = new Array();

var lrcLength;

var lrcTimeout;
// 移动右侧工具栏计时器
var movement;

var newPage = true;

var lrcIndex = 0;

var playMode = "sxbf";

var lrcFinalPos=-1;

var dragBallTimeout;

$(function() {
	initSkinArea();
	readLocalStorage();
	setMainHeight();
	dynamicWindow();
	setMusicArea();
	setMusicList();
	setToolips();
	addEvent();
	initOther();
});


function reset(){
	lrcFinalPos=-1;
	currentPosX=-1;
 	currentPosY=-1;
 	lrcPosY=0;
 	gbLrcPos=-1;
 	$('hr').remove();
 	clearTimeout(dragBallTimeout);
	//lrcArray
}

function initOther() {
	modeN.css("color", "yellow");
	initProcessLine();
}
function initProcessLine(){
	$('#control-area').append("<div id =\"process-line\"></div>");
	$('#process-line').css({"width":"100%","height":"1px","background-color":"black","position":"absolute","bottom":"95%"});
	$('#control-area').append("<div id =\"process-dragbox\"></div>");
	$('#process-dragbox').css({"width":"9px","height":"9px","background-color":"blue","position":"absolute","bottom":"92%","border-radius":"9px"});
	$('#process-dragbox').mouseover(function(){
		$(this).css("cursor","pointer");
	});
//	processControl();
	boxDrag();
}
function animate(data) {

	var count = 0;
	for ( var key in data) {
		// 把时间转为String
		// 未考虑[ti:]
		timeStringArray[count] = JSON.stringify(key);
		if (timeStringArray[count].length > 10) {
			var minute = parseInt(timeStringArray[count].slice(2, 4));
			var second = parseFloat(timeStringArray[count].slice(5, 10));
			// 播放时间转换为Number类型
			var timeToInt = minute * 60 + second;
			// 时间存入数组
			timeIntArray[count] = timeToInt;
			// 歌词存入数组
			lrcArray[count] = data[key];
			count++;
		}
	}
	lrcLength = count;
	// 初始化歌词区域
	for ( var i = 0; i < 3; i++) {
		var tagP = document.createElement("p");
		var br = document.createElement("br");
		tagP.className = "lrc-p";
		tagP.innerHTML = "";
		document.getElementById("lrc-content").appendChild(tagP);
		$('#lrc-content').css("height",
				parseInt($('#lrc-content').css("height")) + 20 + "px");
		// document.getElementById("lrc-content").appendChild(br);
	}
	for ( var i = 0; i < lrcLength; i++) {
		var tagP = document.createElement("p");
		var br = document.createElement("br");
		tagP.className = "lrc-p";
		tagP.innerHTML = lrcArray[i];
		if (i == 0) {
			tagP.id = "weight";
		}
		flagArray[i] = false;
		document.getElementById("lrc-content").appendChild(tagP);
		$('#lrc-content').css("height",
				parseInt($('#lrc-content').css("height")) + 20 + "px");
		// document.getElementById("lrc-content").appendChild(br);
		// document.getElementById("lrc-area").appendChild(br);
	}
	initLine();
	newAnimate();
	// animateTest();
}
function newAnimate() {
	
	
	var bIndex=0;
	if(gbLrcPos!==-1){
		bIndex=Math.ceil(Math.abs(gbLrcPos/$('.lrc-p').height()));
	}

	var currentTime = document.getElementsByTagName('audio')[0].currentTime;
	var beginTime = timeIntArray[0];
	var endTime = timeIntArray[lrcLength - 1];
	var length = $('.lrc-p').length;

	for ( var i = bIndex; i < lrcLength; i++) {
		if (currentTime >= endTime) {
			lrcFinalPos=parseInt($('#lrc-content').css("top"));
			break;
		} else {
			if (flagArray[i] == false && i > 0 && currentTime > timeIntArray[i]) {
				flagArray[i] = true;
				$('#weight').removeAttr("id");
				/*
				 * if(i+3<=lrcLength-1){
				 * document.getElementsByClassName("lrc-p")[i+3].setAttribute("id","weight"); }
				 */
				/*
				 * $('#weight').attr("id","");
				 */
				document.getElementsByClassName("lrc-p")[i + 3].setAttribute(
						"id", "weight");
				/*$('#lrc-content').css("top",
						(parseInt($('#lrc-content').css("top")) - 20) + "px");*/
				$('#lrc-content').css("top",-(i*20)+"px");
				
				//设置歌词拖动条的位置
				/*var rate=document.getElementsByTagName('audio')[0].currentTime/document.getElementsByTagName('audio')[0].duration;
				var contentWidth=$('#control-area').width();
				$('#process-dragbox').css("left",contentWidth*rate+"px");*/
				break;
			}
		}

	}
	lrcTimeout = setTimeout("newAnimate()", 10);
}

function dragBallAnimate(){
	var rate=document.getElementsByTagName('audio')[0].currentTime/document.getElementsByTagName('audio')[0].duration;
	var contentWidth=$('#control-area').width();
	$('#process-dragbox').css("left",contentWidth*rate+"px");
	dragBallTimeout=setTimeout("dragBallAnimate()",10);
}


// 废弃
function animateTest() {
	// 当前播放时间
	var currentTime = document.getElementsByTagName('audio')[0].currentTime;
	var beginTime = timeIntArray[0];
	var endTime = timeIntArray[lrcLength - 1];
	var length = $('.lrc-p').length;

	// timeIntArray.length
	for ( var i = 0; i < lrcLength; i++) {
		var pointer = i;
		if (currentTime < beginTime) {
			$('#weight').html(lrcArray[0]);
			// 显示之后的歌词
			currentNode = $('#weight');
			for ( var j = 1; j < lrcLength; j++) {
				currentNode.next().next().html(lrcArray[j]);
				currentNode = currentNode.next().next();
			}
		}

		// 当前播放时间大于时间数组中的某一个时间
		if (i > 0 && currentTime > timeIntArray[i]) {
			$('#weight').html(lrcArray[i]);
			// 突出显示的标签
			var currentNode = $('#weight');
			// 显示当前时间之前的歌词

			var lrcLocation = pointer - 1;
			for ( var k = 5; k >= 0; k--) {
				currentNode.prev().prev().html(lrcArray[lrcLocation]);
				lrcLocation--;
				currentNode = currentNode.prev().prev();
			}
			// 显示当前时间之后的歌词
			currentNode = $('#weight');

			for ( var j = i + 1; j < lrcLength; j++) {
				currentNode.next().next().html(lrcArray[j]);
				currentNode = currentNode.next().next();
			}

		}
	}
	setTimeout("animateTest()", 1);
}
// 废弃
function initLrcArea() {
	var height = parseInt($('#lrc-area').height());
	var pHeight = parseInt($('.lrc-p').css('height'));
	// alert('ff');
	// alert("歌词区域height: " + height + " p标签height: " + pHeight);
	var pCount = Math.ceil(height / pHeight);
	// alert("即将插入p标签的个数: " + pCount);
	for ( var i = 0; i < pCount + 2; i++) {
		var tagP = document.createElement("p");
		var br = document.createElement("br");
		tagP.className = "lrc-p";

		if (i == 3) {
			tagP.id = "weight";
		}
		document.getElementById("lrc-area").appendChild(tagP);
		document.getElementById("lrc-area").appendChild(br);
		document.getElementById("lrc-area").appendChild(br);
	}
}
function NolrcTips() {
	for ( var i = 0; i < 3; i++) {
		var tagP = document.createElement("p");
		var br = document.createElement("br");
		tagP.className = "lrc-p";
		if (i == 2) {
			tagP.innerHTML = "暂无歌词";
		} else {
			tagP.innerHTML = "";
		}

		document.getElementById("lrc-content").appendChild(tagP);
		$('#lrc-content').css("height",
				parseInt($('#lrc-content').css("height")) + 20 + "px");
//		document.getElementById("lrc-content").appendChild(br);
	}
}
function getLrc(lrcLink) {
	clearTimeout(lrcTimeout);
	console.log("getLrc");
	// $('.lrc-p').html("");
	$('#lrc-content').css("height", "0px");
	$('#lrc-content').css("top", "0px");
	$('#lrc-content').html("");
	if (lrcLink === "-1") {
		// 显示暂无歌词
		// $('#weight').html("暂无歌词");
		NolrcTips();
		// 暂时new Array()
		lrcArray = new Array();
		return;
	}
	$.ajax({
		cache : false,
		type : "GET",
		async : true,
		dataType : "json",
		url : base + "/getlrc.action?lrcUrl='" + lrcLink + "'",
		success : function(data) {
			animate(data);
		},
		error : function() {
			alert('error');
		}
	});
	return;
}

function initTempList() {
	var str = localStorage.TEMP_LIST;
	var listObj = eval('(' + str + ')');
	var length = localStorage.TEMP_LIST_LENGTH;
	$('#music-list-area').html("");
	for ( var i = 0; i < length; i++) {
		// 插入播放列表中
		var musicObj = listObj[i];
		var songId = musicObj.songId;
		var songName = musicObj.songName;
		var singerName = musicObj.singerName;
		var songUrl = musicObj.songUrl;
		var lrcUrl = musicObj.lrcUrl;
		if (i % 2 == 0) {
			$('#music-list-area')
					.append(
							"<div class=\"music music-left\"><a class=\"music-list\" songid=\""
									+ songId
									+ "\" songlink=\""
									+ songUrl
									+ "\" lrclink=\""
									+ lrcUrl
									+ "\"><p>"
									+ songName
									+ "</p><br><p>"
									+ singerName
									+ "</p></a><span class=\"add-to-favourite\"></span><span class=\"delete-from-temp\"></span></div>");
		} else {
			$('#music-list-area')
					.append(
							"<div class=\"music music-right\"><a class=\"music-list\" songid=\""
									+ songId
									+ "\" songlink=\""
									+ songUrl
									+ "\" lrclink=\""
									+ lrcUrl
									+ "\"><p>"
									+ songName
									+ "</p><br><p>"
									+ singerName
									+ "</p></a><span class=\"add-to-favourite\"></span><span class=\"delete-from-temp\"></span></div>");
		}
		// newPage一直为true
		if (newPage === true && songId === localStorage.CURRENT_SONG_ID) {
			$('#media').attr("src", songUrl);
			$('#information-area').children('span').children('h2').html(
					songName);
			$('#information-area').children('span').children('h3').html(
					singerName);
			getLrc(lrcUrl);
			newPage = false;
		}

	}
	setMusicArea();
	setMusicList();
	setToolips();
}

function addToPlayList(thisSong) {
	// 可以获取songid,songlink,lrclink,songname,singername(通过p标签)
	var names = thisSong.children('p');
	var songName = names[0].innerHTML;
	var singerName = names[1].innerHTML;
	var songId = thisSong.attr("songid");
	var songLink = thisSong.attr("songlink");
	var lrcLink = thisSong.attr("lrclink");

	// 向localStorage中添加localStorge.TEMP_LIST
	var str = localStorage.TEMP_LIST;
	// 先遍历TEMP_LIST,查看是否已经添加过此首歌曲(根据songId)
	var listObj = eval('(' + str + ')');
	var length = localStorage.TEMP_LIST_LENGTH;
	for ( var i = 0; i < length; i++) {
		// 如果查询到一样的id,则不添加
		var musicObj = listObj[i];
		var id = musicObj.songId;
		if (id === songId) {
			return false;
		}
	}

	str = str.substring(0, str.length - 1);
	if (localStorage.TEMP_LIST_LENGTH > 0) {
		str = str + ",";
	} else if (localStorage.TEMP_LIST_LENGTH < 0) {
		return;
	}
	str = str + "{\"songId\":\"" + songId + "\",\"songName\":\"" + songName
			+ "\",\"singerName\":\"" + singerName + "\",\"songUrl\":\""
			+ songLink + "\",\"lrcUrl\":\"" + lrcLink + "\"}]";
	localStorage.TEMP_LIST = str;
	localStorage.TEMP_LIST_LENGTH++;

	// 不知道为什么会插入两段歌词
	// initTempList();
	updateTempList();
	playEvent();
}
function updateTempList() {
	var str = localStorage.TEMP_LIST;
	var listObj = eval('(' + str + ')');
	var length = localStorage.TEMP_LIST_LENGTH;
	$('#music-list-area').html("");
	for ( var i = 0; i < length; i++) {
		// 插入播放列表中
		var musicObj = listObj[i];
		var songId = musicObj.songId;
		var songName = musicObj.songName;
		var singerName = musicObj.singerName;
		var songUrl = musicObj.songUrl;
		var lrcUrl = musicObj.lrcUrl;
		if (i % 2 == 0) {
			$('#music-list-area')
					.append(
							"<div class=\"music music-left\"><a class=\"music-list\" songid=\""
									+ songId
									+ "\" songlink=\""
									+ songUrl
									+ "\" lrclink=\""
									+ lrcUrl
									+ "\"><p>"
									+ songName
									+ "</p><br><p>"
									+ singerName
									+ "</p></a><span class=\"add-to-favourite\"></span><span class=\"delete-from-temp\"></span></div>");
		} else {
			$('#music-list-area')
					.append(
							"<div class=\"music music-right\"><a class=\"music-list\" songid=\""
									+ songId
									+ "\" songlink=\""
									+ songUrl
									+ "\" lrclink=\""
									+ lrcUrl
									+ "\"><p>"
									+ songName
									+ "</p><br><p>"
									+ singerName
									+ "</p></a><span class=\"add-to-favourite\"></span><span class=\"delete-from-temp\"></span></div>");
		}

	}

	setMusicArea();
	setMusicList();
	setToolips();
}
// 播放列表TEMP_LIST,收藏列表FAVOURITE_LIST
function readLocalStorage() {
	if (localStorage.length == 0) {
		localStorage.TEMP_LIST = "[]";
		localStorage.TEMP_LIST_LENGTH = 0;
		return;
	}
	// 读取记录

	initTempList();
	// initCurrentSong();
}

// 初始化当前歌曲(上一次退出前播放的歌曲)
function initCurrentSong() {
	alert(localStorage.CURRENT_SONG_ID);
	if (localStorage.CURRENT_SONG_ID === undefined) {
		return;
	}
	var str = localStorage.TEMP_LIST;
	var listObj = eval('(' + str + ')');
	var length = localStorage.TEMP_LIST_LENGTH;
	// $('#media').attr("src", url);

}
// 添加到播放列表
// 废弃此方法,更改为localstorage存储
// 目前若添加重复的歌曲,会被重复添加到列表中,需要改进
function addToPlayListFail(index) {
	// alert('ss '+index);
	var test = $('#search-result-area').find("div:eq(" + index + ")");
	// alert(test.html());
	var count = $('#music-list-area').children().length;
	if (count % 2 === 0) {
		$('#music-list-area').append(
				"<div class=\"music music-left\">" + test.html() + "</div>");
	} else {
		$('#music-list-area').append(
				"<div class=\"music music-right\">" + test.html() + "</div>");
	}
	// 每次添加之后都需要重新设置样式
	setMusicArea();
	setMusicList();
}

function playCurrentSong() {
	console.log("play");
	$('audio')[0].play();
	isplay = true;
	//设置歌词拖动条timeout
//	dragBallTimeout = setTimeout("dragBallAnimate()", 10);
	//dragBallAnimate();
//	gbLrcPos=-1;
//	lrcFinalPos=-1;
	//
//	lrcPosY=0;
//	currentPosX=-1;
//	currentPosY=-1;
//	isDown=false;
	
	/*
	 * var page=""; var mode=""; switch(localStorage.CURRENT_PAGE){ case 0:
	 * console.log("播放列表"); page="temp"; break; case 1: console.log("搜索列表");
	 * page="search"; break; case 2: console.log("收藏列表"); page="fav"; break;
	 * case 3: console.log("其他"); page="other"; break; default:break; }
	 * 
	 * //记录下一首歌 switch (playMode){ case "sxbf": console.log("顺序播放");
	 * mode="sxbf"; break; case "sjbf": console.log("随机播放"); mode="sjbf"; break;
	 * case "dqxh": console.log("单曲循环"); mode="dqxh"; break; case "lbxh":
	 * console.log("列表循环"); mode="lbxh"; break; default: break; }
	 */
	// getNextSong(page,mode);
}
function setNextSong(thisSong) {
	var pmode = playMode;
	switch (playMode) {
	case "sxbf":
		console.log("顺序播放");
		pmode = "sxbf";
		break;
	case "sjbf":
		console.log("随机播放");
		pmode = "sjbf";
		break;
	case "dqxh":
		console.log("单曲循环");
		pmode = "dqxh";
		break;
	case "lbxh":
		console.log("列表循环");
		pmode = "lbxh";
		break;
	default:
		break;
	}

	console.log("songid: " + thisSong.attr("songid"));
	console.log(thisSong.parent());
	/*
	 * var pg=localStorage.CURRENT_PAGE; switch(pg){ case '0':
	 * list=localStorage.TEMP_LIST; break; case '1':
	 * list=localStorage.SEARCH_LIST; break; /*收藏列表暂未实现 case '2':
	 * list=localStorage.FAV_LIST; break; case '3': //暂定为临时列表
	 * list=localStorage.TEMP_LIST; break; default: list=localStorage.TEMP_LIST;
	 * break; }
	 */

	if (pmode === 'dqxh') {
		localStorage.NEXT_SONG_ID = thisSong.attr("songid");
	} else if (pmode === 'sxbf' && thisSong.parent().next().length === 0) {
		// localStorage.NEXT_SONG_ID==="-1"时,代表无下一首歌
		localStorage.NEXT_SONG_ID = "-1";
	} else if (pmode === 'sxbf' && thisSong.parent().next().length !== 0) {
		localStorage.NEXT_SONG_ID = thisSong.parent().next().children('a')
				.attr('songid');
	} else if (pmode === 'lbxh' && thisSong.parent().next().length !== 0) {
		localStorage.NEXT_SONG_ID = thisSong.parent().next().children('a')
				.attr('songid');
	} else if (pmode === 'lbxh' && thisSong.parent().next().length === 0) {
		if (thisSong.parent().prev().length !== 0) {
			var pl = thisSong.parent().prevAll().length;
			var firstSong = thisSong.parent().prevAll()[pl - 1];
			localStorage.NEXT_SONG_ID = firstSong.firstChild
					.getAttribute('songId');
		} else {
			localStorage.NEXT_SONG_ID = thisSong.attr("songid");
		}
	} else if (pmode === 'sjbf') {
		// 随机播放暂时定为本首
		var len = thisSong.parent().parent().children().length;
		console.log("len: " + len);
		if (len === 1) {
			localStorage.NEXT_SONG_ID = thisSong.attr("songid");
		} else {
			if (len === 2) {
				localStorage.NEXT_SONG_ID = thisSong.parent().next().length === 0 ? thisSong
						.parent().parent().children()[0].firstChild
						.getAttribute('songid')
						: thisSong.parent().parent().children()[1].firstChild
								.getAttribute('songid');
			} else {

				var number = Math.floor((Math.random() * (len - 1) + 1));
				var tId = thisSong.parent().parent().children()[number].firstChild
						.getAttribute('songid');
				while (tId === thisSong.attr('songid') || number > (len - 1)) {
					number = Math.floor((Math.random() * (len - 1) + 1));
					tId = thisSong.parent().parent().children()[number].firstChild
							.getAttribute('songid');
				}
				localStorage.NEXT_SONG_ID = tId;
			}

		}

	}

}
// 当前歌曲,$
var ctSong;
function playEvent() {
/*
	$('#music-list-area').delegate('.music-list','click',function(){
		localStorage.CURRENT_SONG_ID = $(this).attr("songId");
		var url = encodeURI($(this).attr("songlink"));
		// 改变播放音乐的路径
		$('#media').attr("src", url);
		// 显示歌曲信息
		setInformation($(this));
		reset();
		// 把当前播放的歌曲Id存入localStorage中
		playCurrentSong();

		getLrc($(this).attr("lrclink"));
		localStorage.CURRENT_PAGE = 0;
		setNextSong($(this));
		ctSong = $(this);
	});
	
	*/
	
	// 设置播放列表里中歌曲的播放事件(有问题)
	$('.music-list').each(function(i) {
		$(this).click(function() {
			localStorage.CURRENT_SONG_ID = $(this).attr("songId");
			var url = encodeURI($(this).attr("songlink"));
			// 改变播放音乐的路径
			$('#media').attr("src", url);
			// 显示歌曲信息
			setInformation($(this));
			reset();
			// 把当前播放的歌曲Id存入localStorage中
			playCurrentSong();

			getLrc($(this).attr("lrclink"));
			localStorage.CURRENT_PAGE = 0;
			setNextSong($(this));
			ctSong = $(this);
		});
	});

	$('.music-list-result').each(function(i) {
		$(this).unbind('click');
		console.log("unbind click");
		$(this).click(function() {
			console.log("click");
			localStorage.CURRENT_SONG_ID = $(this).attr("songId");
			var url = encodeURI($(this).attr("songlink"));
			// 更新当前歌曲的路径
			$('#media').attr("src", url);
			// 更新歌曲和歌手的显示
			setInformation($(this));

			// 获得歌词
			getLrc($(this).attr("lrclink"));
			// $('audio')[0].load();
			reset();
			// 点击即播放
			playCurrentSong();
			// 加入到播放列表
			addToPlayList($(this));
			// 设置为当前歌曲
			// $('audio')[0].play();
			localStorage.CURRENT_PAGE = 1;
			setNextSong($(this));
			ctSong = $(this);
		});
	});

	/*
	 * // 设置搜索结果中歌曲的播放事件 $('.music-list-result').each(function(i) {
	 * $(this).click(function() { var url = encodeURI($(this).attr("songlink")); //
	 * 改变播放音乐的路径 $('#media').attr("src", url); // 显示歌曲信息
	 * setInformation($(this)); // 加入播放列表 addToPlayList($(this)); //
	 * 把当前播放的歌曲Id存入localStorage中 localStorage.CURRENT_SONG_ID =
	 * $(this).attr("songId"); alert("2"); getLrc($(this).attr("lrclink"));
	 * playCurrentSong(); /*while($('#media').attr('src')!==url){
	 * $('#media').attr("src", url); }
	 */
	/*
	 * if($(this).attr('lrclink')!==-1){ console.log("!=-1");
	 * getLrc($(this).attr("lrclink")); playCurrentSong(); }else{
	 * console.log("-1"); getLrc($(this).attr("lrclink")); playCurrentSong(); }
	 * 
	 *  // getLrc($(this).attr("lrclink")); }); });
	 */

	document.getElementById('play_button').onclick=function(){
		if (!isplay) {
			$('audio')[0].play();
			isplay = true;
			//设置歌词拖动条timeout
			dragBallAnimate();
		} else {
			$('audio')[0].pause();
			isplay = false;
			//清除timeout
			clearTimeout(dragBallTimeout);
		}
	};
	
	/*
	$('#play_button').click(function() {
		if (!isplay) {
			$('audio')[0].play();
			isplay = true;
		} else {
			$('audio')[0].pause();
			isplay = false;
		}
	});*/

	$('#play_button').mouseover(function() {
		$(this).css("cursor", "pointer");
	});

	document.getElementById('next_song_button').onclick=function(){
		//重设全局变量
		reset();
		playNextSong();
	};
	
	/*
	$('#next_song_button').click(function() {
		playNextSong();
	});
	*/
	$('#next_song_button').mouseover(function() {
		$(this).css("cursor", "pointer");
	});

	$('#previous_song_button').mouseover(function() {
		$(this).css("cursor", "pointer");
	});

	document.getElementById('previous_song_button').onclick=function(){
		reset();
		playPrevSong();
	};
	/*
	$('#previous_song_button').click(function() {
		 playPrevSong();
	});*/

}

function playPrevSong() {
	//如果当前歌曲是第一首,点击播放前一首后先判断是否是唯一的一首......重新播放当前歌曲,如果不是第一首,则把current赋值给next
	//localStorage.NEXT_SONG_ID = localStorage.CURRENT_SONG_ID;

	var pg = localStorage.CURRENT_PAGE;
	var list = localStorage.TEMP_LIST;
	var pmode="";
	switch (pg) {
	case '0':
		list = localStorage.TEMP_LIST;
		break;
	case '1':
		list = localStorage.SEARCH_LIST;
		break;
	/*
	 * case '2': list=localStroage.FAV_LIST; break;
	 */
	case '3':
		// 暂定为临时列表
		list = localStorage.TEMP_LIST;
		break;
	default:
		list = localStorage.TEMP_LIST;
		break;
	}
	
	
	switch (playMode) {
	case "sxbf":
		console.log("顺序播放");
		pmode = "sxbf";
		break;
	case "sjbf":
		console.log("随机播放");
		pmode = "sjbf";
		break;
	case "dqxh":
		console.log("单曲循环");
		pmode = "dqxh";
		break;
	case "lbxh":
		console.log("列表循环");
		pmode = "lbxh";
		break;
	default:
		break;
	}

	
	var cSongId = localStorage.CURRENT_SONG_ID;
	var obj = eval('(' + list + ')');
	var cIndex = -1;
	for ( var i = 0; i < obj.length; i++) {
		if (obj[i].songId === cSongId) {
			cIndex = i;
			break;
		}
	}
	
	var preIndex=-1;
	var f=-1;
	if(pmode==='dqxh'){
		preIndex=cIndex;
//		localStorage.NEXT_SONG_ID=localStorage.CURRENT_SONG_ID;
	}else if((pmode==='sxbf'||pmode==='lbxh')&&cIndex!==0){
		
		preIndex=cIndex-1;
		
	}else if(pmode==='sxbf'&&cIndex===0){
		//播放本首
		preIndex=cIndex;	
		if(obj.length>1){
			f=0;
		}
	}else if(pmode==='lbxh'&&cIndex===0){
		//播放最后一首
		preIndex=obj.length-1;
	}else if(pmode==='sjbf'){
		//生成随机数
		
		if (obj.length === 1) {
			preIndex = 0;
		} else {
			if (obj.length === 2) {
				preIndex = 1 - cIndex;
			} else {
				var number = Math
						.floor((Math.random() * (obj.length - 1) + 1));
				while (number === cIndex || number > (obj.length - 1)) {
					number = Math
							.floor((Math.random() * (obj.length - 1) + 1));
				}
				preIndex = number;
			}

		}
		

		
	}
	
	
	$('#media').attr('src', obj[preIndex].songUrl);
	getLrc(obj[preIndex].lrcUrl);

	$('#information-area').children('span').children('h2').html(
			obj[preIndex].songName);
	$('#information-area').children('span').children('h3').html(
			obj[preIndex].singerName);
	
	if(f===-1){
		localStorage.NEXT_SONG_ID=localStorage.CURRENT_SONG_ID;	
	}
	
	localStorage.CURRENT_SONG_ID = obj[preIndex].songId;
	
	playCurrentSong();
	
	
	/*
	//当前歌曲是第一首
	if (cIndex === 0) {
		$('#media').attr('src', obj[0].songUrl);
		getLrc(obj[0].lrcUrl);
		playCurrentSong();
		//设置下一首歌曲
		return;
	}

	if (cIndex !== -1) {
		$('#media').attr('src', obj[cIndex - 1].songUrl);
		getLrc(obj[cIndex - 1].lrcUrl);

		$('#information-area').children('span').children('h2').html(
				obj[cIndex - 1].songName);
		$('#information-area').children('span').children('h3').html(
				obj[cIndex - 1].singerName);
		localStorage.NEXT_SONG_ID=localStorage.CURRENT_SONG_ID;
		localStorage.CURRENT_SONG_ID = obj[cIndex - 1].songId;
		
		playCurrentSong();

	}*/

}

function setInformation(thisSong) {
	var names = thisSong.children('p');
	$('#information-area').children('span').children('h2').html(
			names[0].innerHTML);
	$('#information-area').children('span').children('h3').html(
			names[1].innerHTML);
}
// 处理搜索的结果
function dealWithSearchResult(data) {

	var searchList = "[";
	var tags = $('#right').children("ul").children("li");
	tags[0].style.backgroundColor = "#C5CCCB";
	tags[1].style.backgroundColor = "gray";
	tags[2].style.backgroundColor = "#C5CCCB";
	tags[3].style.backgroundColor = "#C5CCCB";

	$('#search-result-area').css("display", "block");
	$('#music-list-area').css("display", "none");
	$('#favourite-list-area').css("display", "none");
	// alert(data);
	var dataObj = eval('(' + data + ')');
	// alert(dataObj.returncode);
	$('#search-result-area').html("");
	if (dataObj.returncode == 0) {
		var dataList = dataObj.list;
		for ( var i = 0; i < dataList.length; i++) {
			var music = dataList[i];
			$('#search-result-area')
					.append(
							"<div class =\"music music-result\"><a class=\"music-list-result\" songId=\""
									+ music.id
									+ "\" songLink=\""
									+ music.songUrl
									+ "\" lrcLink=\""
									+ music.lrcUrl
									+ "\"><p>"
									+ music.songName
									+ "</p><br><p>"
									+ music.singerName
									+ "</p></a><span class=\"add-to-favourite\"></span></div>");

			searchList += "{\"songId\":\"" + music.id + "\",\"songName\":\""
					+ music.songName + "\",\"singerName\":\""
					+ music.singerName + "\",\"songUrl\":\"" + music.songUrl
					+ "\",\"lrcUrl\":\"" + music.lrcUrl + "\"}";
			if (i != dataList.length - 1) {
				searchList += ",";
			}
		}
		searchList += "]";
		// 更新localStorage.SEARCH_LIST
		localStorage.SEARCH_LIST = searchList;
		// 冗余代码,可以简化
		setMusicList();
		setToolips();
		// 只要正确下载歌曲就可以播放
		playEvent();
	} else {
		// 居中显示暂无数据,高度居中暂未设置,跟随窗口变化也未设置
		var width = parseInt($('#search-result-area').css("width"));
		if (dataObj.returncode == -1) {
			// returncode==-1表示未找到歌曲
			$('#search-result-area').html(
					"<div class =\"music-not-found\"><p>暂无数据</p></div>");
		} else if (dataObj.returncode == -2) {
			// returncode==-2表示网络出现异常
			$('#search-result-area').html(
					"<div class =\"music-not-found\"><p>网络异常</p></div>");
		}

		$('.music-not-found').css("width", "500px");
		$('.music-not-found').css("height", "300px");
		$('.music-not-found').css("position", "absolute");
		$('.music-not-found').css("backgroundColor", "gray");
		$('.music-not-found').css("top", "100px");

		// 无用代码
		$('.music-not-found').css("textAlign", "center");

		$('.music-not-found').children('p').css("fontSize", "50px");
		$('.music-not-found').children('p').css("fontFamily", "微软雅黑");

		// 无用代码
		$('.music-not-found').children('p').css("textAlign", "center");

		var tWidth = parseInt($('.music-not-found').css("width"));
		var marginRight = Math.ceil((width - tWidth) / 2);
		$('.music-not-found').css("right", marginRight + "px");
		// alert($('.music-not-found').css("height"));
	}
}
// 异步提交,避免刷新页面,最后要return false;
function ajaxSubmit(fram, fn) {
	// alert('0');
	var songName = document.getElementById('song-name').value;
	var singerName = document.getElementById('singer-name').value;
	var title = songName + "$$" + singerName + "$$$$";
	// alert(title);
	$.ajax({
		url : base + "getmusic.action?sourceUrl=" + sourceUrl,
		method : "POST",
		dataType : 'text',
		data : "count=1&mtype=1&title=" + encodeURIComponent(title),
		success : dealWithSearchResult,
		error : function() {
			alert('error');
		}
	});
}

function searchEvent() {
	$('#search-form').bind('submit', function() {
		ajaxSubmit(this, function(data) {
			alert('xx');
		});
		return false;
	});
}
// 点击标签,切换播放列表,搜索结果,等等
function tagEvent() {
	var tags = $('#right').children("ul").children("li");
	// 默认标签的初始颜色
	tags[0].style.backgroundColor = "gray";
	tags[1].style.backgroundColor = "#C5CCCB";
	tags[2].style.backgroundColor = "#C5CCCB";
	tags[3].style.backgroundColor = "#C5CCCB";
	$('#search-result-area').css("display", "none");
	tags[0].onclick = function() {
		$('#music-list-area').css("display", "block");
		$('#search-result-area').css("display", "none");
		$('#favourite-list-area').css("display", "none");
		this.style.backgroundColor = "gray";
		tags[1].style.backgroundColor = "#C5CCCB";
		tags[2].style.backgroundColor = "#C5CCCB";
		tags[3].style.backgroundColor = "#C5CCCB";
	};
	tags[1].onclick = function() {
		$('#search-result-area').css("display", "block");
		$('#music-list-area').css("display", "none");
		$('#favourite-list-area').css("display", "none");
		this.style.backgroundColor = "gray";
		tags[0].style.backgroundColor = "#C5CCCB";
		tags[2].style.backgroundColor = "#C5CCCB";
		tags[3].style.backgroundColor = "#C5CCCB";
	};
	tags[2].onclick = function() {
		$('#search-result-area').css("display", "none");
		$('#music-list-area').css("display", "none");
		$('#favourite-list-area').css("display", "block");
		this.style.backgroundColor = "gray";
		tags[0].style.backgroundColor = "#C5CCCB";
		tags[1].style.backgroundColor = "#C5CCCB";
		tags[3].style.backgroundColor = "#C5CCCB";
	};
	tags[3].onclick = function() {
		$('#search-result-area').css("display", "none");
		$('#music-list-area').css("display", "none");
		$('#favourite-list-area').css("display", "none");
		this.style.backgroundColor = "gray";
		tags[0].style.backgroundColor = "#C5CCCB";
		tags[1].style.backgroundColor = "#C5CCCB";
		tags[2].style.backgroundColor = "#C5CCCB";
	};

}
// 增加事件
function addEvent() {
	searchEvent();
	tagEvent();
	playEvent();
	// 取消初始化歌词区域
	// initLrcArea();
	initBackground();
	initRightTool();
	initOtherTool();
	skinEvent();
	normalEvent();
	seekEvent();
}
function initOtherTool(){
	$('#control-area').append("<div id =\"tool-area\"><ul><li><span>+</span></li><li><span>-</span></li></ul></div>");
	$('#tool-area').css({"width":"8%","height":"80px","position":"absolute","right":"0","bottom":"20px"});
	$('#tool-area span:first').css({"display":"block","width":"20px","height":"20px","position":"absolute","top":"0","right":"0px","border-radius":"20px","font-weight":"bold"});
	$('#tool-area span:last').css({"display":"block","width":"20px","height":"20px","position":"absolute","top":"25px","right":"0px","border-radius":"20px","font-weight":"bold"});
	$('#tool-area span:first').attr('id','volume-up');
	$('#tool-area span:last').attr('id','volume-down');
	$('#volume-up').css("text-align","center");
	$('#volume-down').css("text-align","center");

	$('#volume-up').mouseover(function(){
		$(this).css({"cursor":"pointer","font-size":"20px"});
	});

	$('#volume-down').mouseover(function(){
		$(this).css({"cursor":"pointer","font-size":"20px"});
	});
	
	$('#tool-area span').mouseleave(function(){
		$(this).css("font-size","16px");
	});
	
	document.getElementById('volume-up').onclick=function(){
		if(document.getElementById('media').volume<=0.9){
			document.getElementById('media').volume+=0.1;			
		}
	};

	document.getElementById('volume-down').onclick=function(){
		if(document.getElementById('media').volume>=0.1){
			document.getElementById('media').volume-=0.1;	
		}
		
	};
}
function initRightTool() {
	clearTimeout(movement);
	$('#rightTool').css(
			"height",
			$('#rightTool').children('li').length
					* $('#rightTool').children('li').height());
	$('#rightTool').css("position", 'absolute');
	$('#rightTool').css("right", '-20px');
}
// 初始化背景图片
function initBackground() {
	if (localStorage.CURRENT_SKIN === undefined) {
		localStorage.CURRENT_SKIN = "bg1-min";
		$('#bg').attr("src", "images/bg1-normal.jpg");
	} else {
		var name = localStorage.CURRENT_SKIN.replace("min", "normal");
		$('#bg').attr("src", "images/" + name + ".jpg");
	}

}
var isOverRightTool = 0;
// 常规事件
/**
 * 
 */
var x = 0;
var y = 0;
var modeN = $('.mode:first');
var t;
function normalEvent() {

	// 鼠标离开选择皮肤区域,隐藏该区域
	$('#skinArea').mouseleave(function() {
		$('#skinArea').hide();
		$('#skin').attr('src', 'images/skin/pf3.jpg');
	});

	// 设置鼠标在skin-min上的事件
	$('.skin-min').mouseover(function() {
		if ($(this).attr("id") !== localStorage.CURRENT_SKIN) {
			$(this).css("cursor", "pointer");
		}
	});

	// 更改皮肤事件
	$('.skin-min').click(function() {
		var bgId = $(this).attr("id").replace("min", "normal");
		$('#bg').attr("src", "images/" + bgId + ".jpg");
		localStorage.CURRENT_SKIN = $(this).attr("id");
		$(this).css("cursor", "default");
	});

	$('#rightTool').mouseover(function() {
		isOverRightTool = 1;
	});

	/* 消耗系统资源过多，需要修改 */
	document.onmousemove = function(e) {
		if (e.screenX >= $(window).width() - 20 && isOverRightTool === 1) {
			isOverRightTool = 0;
			showRightTool();
		}
		
		//进度条拖动事件
		if(isDraging===true){
		    //鼠标事件2 - 鼠标移动时（要检测，元素是否标记为移动）
		    var mouseX=e.pageX-startX;
		    var maxX=document.getElementById('left').offsetWidth-oDrag.offsetWidth;
		    mouseX=Math.min(maxX,Math.max(0,mouseX));
		  
		    if(isDraging){
		        oDrag.style.left=mouseX+"px";
		    }
		}
		
	};
	$('#rightTool').mouseleave(function() {
		hideRightTool();
	});

	$('.add-to-favourite').click(function() {
		addToFavourite();
	});

	// $('.music').each(function(i){var a=$(this)[0].offsetLeft;var
	// b=$(this)[0].offsetTop;console.log("top:"+b);console.log("left:"+a);$(this).css({"position":"absolute","top":b+"px","left":a+"px"})});

	// 鼠标划过歌曲显示图标
	$('.music').mouseover(function() {
		/*
		 * var aMusic=$(this)[0]; x=aMusic.offsetLeft; y=aMusic.offsetTop;
		 * aMusic.style.position="absolute"; aMusic.style.left=x;
		 * aMUsic.style.top=y; aMusic.style.border="2px solid white";
		 */
		$(this).children('img').show();
	});

	// 鼠标离开歌曲隐藏图标
	$('.music').mouseleave(function() {
		/*
		 * var aMusic=$(this)[0]; aMusic.style.position="relative";
		 */

		$(this).children('img').hide();
	});

	document.getElementById("media").addEventListener("play", function() {
		console.log("media play");
	});

	document.getElementById("media").addEventListener("pause", function() {
		console.log("media pause");
	});

	// 当前歌曲播放完毕
	document.getElementById("media").addEventListener("ended", function() {
		console.log("media end");
		reset();
		playNextSong();
	});
	
	// 设置播放模式
	$('.mode').each(function(i) {

		$(this).mouseover(function() {
			$(this).css({
				"color" : "yellow",
				"cursor" : "pointer"
			});

		});

		$(this).mouseleave(function() {
			$(this).css("color", "black");
			modeN.css("color", "yellow");
		});

		$(this).click(function() {
			modeN = $(this);
			$(this).css("color", "yellow");
			$('.mode').not($(this)).css("color", "black");
			switch (i) {
			case 0:
				console.log("is 0");
				playMode = "sxbf";
				break;
			case 1:
				console.log("is 1");
				playMode = "sjbf";
				break;
			case 2:
				console.log("is 2");
				playMode = "dqxh";
				break;
			case 3:
				console.log("is 3");
				playMode = "lbxh";
				break;
			default:
				break;
			}
			updateNextSong("no");
		});
	});

	
	$("#music-list-area").delegate(".delete-from-temp","click",function(){
		console.log("fff   "+$(this).parent().attr('class'));
		deleteFromTempList($(this).prev().prev());
	});
	
	/*
	 * //tag点击事件 $('#rightTool').children('li').each(function(i){
	 * $(this).click(function(){ localStorage.CURRENT_PAGE=i; }); });
	 */


}

//传入a标签
function deleteFromTempList(thisSong){
	var tempList=localStorage.TEMP_LIST;
	var listObj=eval('('+tempList+')');
	var id =thisSong.attr('songId');
	for(var i=0;i<listObj.length;i++){
		if(listObj[i].songId===id){
			delete listObj[i];
			break;
		}
	}
	var str=JSON.stringify(listObj);
	str=str.replace(/null,/,'');
	str=str.replace(/,null/,'');
	str=str.replace(/null/,'');
	localStorage.TEMP_LIST=str;
	localStorage.TEMP_LIST_LENGTH--;
	updateTempList();
	//删除的歌曲是当前歌曲时,不更新下一首,当播放下一首时自动更新
	if(id!==localStorage.CURRENT_SONG_ID){
		updateNextSong('no');	
	}
	//避免templist的点击事件失效
	playEvent();
}


function playNextSong() {
	console.log("播放播放播放");
	// 清除歌词,重复

//	$('#lrc-content').css("height", "0px");
//	$('#lrc-content').css("top", "0px");
//	$('#lrc-content').html("");

	// 设置信息
	// 暂时在updateNextSong中设置歌曲显示信息,歌曲歌词路径
	// 重新设置下一首
	updateNextSong("yes");
}
function updateNextSong(str) {
	
	var pg = localStorage.CURRENT_PAGE;
	/* var currentSongId=localStorage.CURRENT_SONG_ID; */
	var currentSongId = localStorage.NEXT_SONG_ID;
	// 刚刚更新的歌曲的id
	if (str === 'no') {
		currentSongId = localStorage.CURRENT_SONG_ID;
	}

	var pmode = "";
	var list = "";

	switch (playMode) {
	case "sxbf":
		console.log("顺序播放");
		pmode = "sxbf";
		break;
	case "sjbf":
		console.log("随机播放");
		pmode = "sjbf";
		break;
	case "dqxh":
		console.log("单曲循环");
		pmode = "dqxh";
		break;
	case "lbxh":
		console.log("列表循环");
		pmode = "lbxh";
		break;
	default:
		break;
	}

	switch (pg) {
	case '0':
		list = localStorage.TEMP_LIST;
		break;
	case '1':
		list = localStorage.SEARCH_LIST;
		break;
	/*
	 * 收藏列表暂未实现 case '2': list=localStorage.FAV_LIST; break;
	 */
	case '3':
		// 暂定为临时列表
		list = localStorage.TEMP_LIST;
		break;
	default:
		list = localStorage.TEMP_LIST;
		break;
	}
	console.log("pg: " + pg);
	console.log(list);
	var obj = eval('(' + list + ')');
	var index = -1;
	for ( var i = 0; i < obj.length; i++) {
		if (obj[i].songId === currentSongId) {
			index = i;
			break;
		}
	}

	if(index===-1&&str==='yes'&&localStorage.NEXT_SONG_ID === "-1"){
		
		
		var tIndex = -1;
		var lsid=localStorage.CURRENT_SONG_ID;
		for ( var i = 0; i < obj.length; i++) {
			if (obj[i].songId === lsid) {
				tIndex = i;
				break;
			}
		}
		
		$('#media').attr("src", obj[tIndex].songUrl);
		getLrc(obj[tIndex].lrcUrl);
		//不更改localStorage.CUURENT_SONG_ID;
		playCurrentSong();
		
		return;
	}
	
	
	
	
	
	
	if (str === 'yes' && index !== -1) {
		$('#media').attr("src", obj[index].songUrl);
		getLrc(obj[index].lrcUrl);

		$('#information-area').children('span').children('h2').html(
				obj[index].songName);
		$('#information-area').children('span').children('h3').html(
				obj[index].singerName);

		localStorage.CURRENT_SONG_ID = currentSongId;

		playCurrentSong();

	}

	var nextIndex = -1;
	if (index !== -1) {
		if ((pmode === 'lbxh' || pmode === 'sxbf') && index !== obj.length - 1) {
			// 顺序播放,且本首歌不是列表中最后一首
			nextIndex = index + 1;
		} else if (pmode === 'sxbf' && index === obj.length - 1) {
			nextIndex = -1;
		} else if (pmode === 'lbxh' && index === obj.length - 1) {
			nextIndex = 0;
		} else if (pmode === 'dqxh') {
			nextIndex = index;
		} else if (pmode === 'sjbf') {
			// 生成一个小于等于obj.length-1的随机数(除去index)
			if (obj.length === 1) {
				nextIndex = 0;
			} else {
				if (obj.length === 2) {
					nextIndex = 1 - index;
				} else {
					var number = Math
							.floor((Math.random() * (obj.length - 1) + 1));
					while (number === index || number > (obj.length - 1)) {
						number = Math
								.floor((Math.random() * (obj.length - 1) + 1));
					}
					nextIndex = number;
				}

			}
		}
	}
	if (nextIndex === -1) {
		// 代表无下一首歌
		localStorage.NEXT_SONG_ID = "-1";

	} else {
		localStorage.NEXT_SONG_ID = obj[nextIndex].songId;
	}

}

// 添加到喜爱列表
function addToFavourite() {

}

// 鼠标划过屏幕右侧时,显示右边侧边栏
function showRightTool() {
	console.log("end");
	clearTimeout(movement);
	console.log("begin");
	var final_x = $(window).width() - $('#rightTool').width();
	moveElement('rightTool', final_x, $('#rightTool').offset().top, 1, 'LEFT');
}
// 鼠标离开#rightTool时,隐藏右边侧边栏
function hideRightTool() {
	clearTimeout(movement);
	var final_x = $(window).width() - 20;
	moveElement('rightTool', final_x, $('#rightTool').offset().top, 1, "RIGHT");
}
/* x轴移动 */
function moveElement(elementId, final_x, final_y, interval, direct) {

	if (!document.getElementById) {
		return false;
	}
	if (!document.getElementById(elementId)) {
		return false;
	}

	var ele = document.getElementById(elementId);

	if (direct === 'LEFT') {
		if (!ele.style.left) {
			ele.style.left = $('#rightTool').offset().left + "px";
		}
		var xpos = parseInt(ele.style.left);

		if (xpos == final_x) {
			clearTimeout(movement);
			return true;
		}

		if (xpos > final_x) {
			xpos--;
		}

	} else if (direct === 'RIGHT') {

		if (!ele.style.left) {
			ele.style.left = $('#rightTool').offset().left + "px";
		}
		var xpos = parseInt(ele.style.left);

		if (xpos == final_x) {
			clearTimeout(movement);
			return true;
		}

		if (xpos < final_x) {
			xpos++;
		}
	}

	ele.style.left = xpos + "px";
	var repeat = "moveElement('" + elementId + "'," + final_x + "," + final_y
			+ "," + interval + ",'" + direct + "')";
	movement = setTimeout(repeat, interval);
}

function toolAnimate() {
	// alert('r');
	var pos = parseInt($('#rightTool').offset().left);
	if (pos === 1235) {
		alert("return" + pos);
		clearInterval(window.s1);
		return;
	}
	if (pos > 1235) {
		pos--;
		$('#rightTool').css("left", pos + "px");
		// $('#rightTool').offset().left=pos+"px";
		// alert($('#rightTool').offset().left);
	}

}

// 更换皮肤事件
function skinEvent() {
	$('#skin').mouseover(function() {
		$('#skinArea').show();
		$('#skin').attr('src', 'images/skin/pf4.jpg');
	});
}


// 设置歌曲显示区域的样式
function setMainHeight() {
	var mMargin = parseInt($('#main').css("margin-top"));
	var fMargin = parseInt($('#foot').css("margin-top"));
	$('#wrapper').css({
		height : $(window).height()
	});
	$('#main').height(
			$(window).height() - $('#foot').height() - $('#top').height()
					- mMargin - fMargin);
}
// 跟随窗口变化动态调整div大小
function dynamicWindow() {
	$(window).resize(function() {
		setMainHeight();
		setMusicArea();
		setMusicList();
		initRightTool();
		// setToolips();
	});
}
// 设置歌曲显示区域以及搜索结果区域的位置
function setMusicArea() {
	var rightWidth = parseInt($('#right').css("width"));
	var musicAreaWidth = parseInt($('#music-area').css("width"));
	var diff = rightWidth - musicAreaWidth;
	$('#music-list-area').css("margin-left", diff + "px");
	$('#search-result-area').css("margin-left", diff + "px");
	$('#favourite-list-area').css("margin-left", diff + "px");

}
// 设置Main->ight->Music-Area->Music-List的样式
function setMusicList() {
	var listWidth = parseInt($('#music-list-area').css("width"));
	// 因为margin-right问题,需要先得到#music-area和#music-list的margin
	// 有点冗余,可以考虑修改
	var rightWidth = parseInt($('#right').css("width"));
	var musicAreaWidth = parseInt($('#music-area').css("width"));
	var diff = rightWidth - musicAreaWidth;

	var eachMusicWidth = parseInt($('.music').css("width"));
	var eachLineCount = Math.floor(listWidth / eachMusicWidth);
	var margin = Math.floor((listWidth - diff - eachLineCount * eachMusicWidth)
			/ (eachLineCount));
	margin = Math.floor(margin / 2);
	$('.music').css('marginRight', margin + "px");
	$('.music').css('marginLeft', margin + "px");
	$('.music').css('marginTop', "10px");
}
// 设置每首歌曲的辅助功能,目前仅有添加到收藏(收藏功能尚未实现)
function setToolips() {
	var eachMusicWidth = parseInt($('.music').css("width"));
	var toopLipsHeight = parseInt($('.music').css("height"));
	var toopLipsWidth = eachMusicWidth * 0.2;
	var spanWidth = parseInt($('.add-to-favourite').css('width'));
	var spanHeight = parseInt($('.add-to-favourite').css('height'));
	$('.add-to-favourite').css('top',
			Math.floor((toopLipsHeight - spanHeight) / 2) + "px");
	$('.add-to-favourite').css('right',
			Math.floor((toopLipsWidth - spanWidth) / 2) + "px");
	$('.del-from-favourite').css('top',
			Math.floor((toopLipsHeight - spanHeight) / 2) + "px");
	$('.del-from-favourite').css('right',
			Math.floor((toopLipsWidth - spanWidth) / 2) + "px");
}
// 每张图片126*84
// 宽126*3+6*padding-left
// 高84*3+6*padding-bottom

function initSkinArea() {
	/*
	 * $('#overSkin').css("width",$('#skin').width());
	 * $('#overSkin').css("height","30px");
	 * $('#overSkin').css("backgroundColor","white");
	 * $('#overSkin').css("position","absolute");
	 * $('#overSkin').css("left",$('#skin').offset().left);
	 * $('#overSkin').css("top",$('#top').height()+"px");
	 */
	// 皮肤显示区域的宽
	$('#skinArea').css("width", "408px");
	// 皮肤显示区域的高
	$('#skinArea').css("height", "287px");
	$('#skinArea').css("top", $('#top').height());
	$('#skinArea').css(
			"left",
			$('#skin').offset().left + $('#skin').width()
					- $('#skinArea').width());
	// $('#skinArea').css("top",$('#overSkin').offset().top+$('#overSkin').height());
	// $('#skinArea').css("left",$('#overSkin').offset().left+$('#overSkin').width()-$('#skinArea').width());
	$('#skinArea').css("backgroundColor", "white");
	$('#skin').attr('src', 'images/skin/pf3.jpg');
}

// 废弃
function setLineHeight() {
	var heighta = $('#information-area').css("height");
	alert(heighta);
	$('#information-area').css({
		lineHeight : heighta / 4 * 3
	});
	alert($('#information-area').css("lineHeight"));
}