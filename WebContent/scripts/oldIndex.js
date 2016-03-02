$(function(){
	addEvent();
	setMainHeight();
	dynamicWindow();
	setMusicArea();
	setMusicList();
	setToolips();

	// setLineHeight();
});

function addEvent(){
	$('#check').click(function() {
		var songName = document.getElementById('song-name').value;
		var singerName = document.getElementById('singer-name').value;
		var title = songName + "$$" + singerName + "$$$$";
		alert(title);
		$.ajax({
			type : "POST",
			url : base + "getmusic.action?sourceUrl=" + sourceUrl,
			dataType : 'text',
			data : "count=1&mtype=1&title=" + encodeURIComponent(title),
			success : function(data) {
				alert('1');
			},
			error : function(data) {
				console.log(arguments);
			}
		});
	});
}


function setMainHeight(){
	var mMargin=parseInt($('#main').css("margin-top"));
	var fMargin=parseInt($('#foot').css("margin-top"));
	$('#wrapper').css({height:$(window).height()});
	$('#main').height($(window).height()-$('#foot').height()-$('#top').height()-mMargin-fMargin);
}
//跟随窗口变化调整div大小
function dynamicWindow(){
	var windowHeight=$(window).outerHeight();
	$(window).resize(function(){
		setMainHeight();
		setMusicArea();
		setMusicList();
		// setToolips();
	});
}
//设置歌曲显示区域以及搜索结果区域的位置
function setMusicArea(){
	var rightWidth=parseInt($('#right').css("width"));
	var musicAreaWidth=parseInt($('#music-area').css("width"));
	var diff=rightWidth-musicAreaWidth;
	$('#music-list').css("margin-left",diff+"px");
}
function setMusicList(){
	var listWidth=parseInt($('#music-list').css("width"));
	//因为margin-right问题,需要先得到#music-area和#music-list的margin
	//有点冗余,可以考虑修改
	var rightWidth=parseInt($('#right').css("width"));
	var musicAreaWidth=parseInt($('#music-area').css("width"));
	var diff=rightWidth-musicAreaWidth;

	var eachMusicWidth=parseInt($('.music').css("width"));
	var eachLineCount=Math.floor(listWidth/eachMusicWidth);
	var margin=Math.floor((listWidth-diff-eachLineCount*eachMusicWidth)/(eachLineCount));
	margin=Math.floor(margin/2);
	$('.music').css('marginRight',margin+"px");
	$('.music').css('marginLeft',margin+"px");
	$('.music').css('marginTop',"10px");
}

function setToolips(){
	var eachMusicWidth=parseInt($('.music').css("width"));
	var toopLipsHeight=parseInt($('.music').css("height"));
	var toopLipsWidth=eachMusicWidth*0.2;
	var spanWidth=parseInt($('.add-favourite').css('width'));
	var spanHeight=parseInt($('.add-favourite').css('height'));
	$('.add-favourite').css('top',Math.floor((toopLipsHeight-spanHeight)/2)+"px");
	$('.add-favourite').css('right',Math.floor((toopLipsWidth-spanWidth)/2)+"px");
}

//废弃
function setLineHeight(){
	var heighta=$('#information-area').css("height");
	alert(heighta);
	$('#information-area').css({lineHeight:heighta/4*3});
	alert($('#information-area').css("lineHeight"));
}