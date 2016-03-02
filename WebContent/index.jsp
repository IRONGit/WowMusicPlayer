<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>index.html</title>
<link rel="stylesheet" type="text/css" href="styles/id.css">
<link rel="stylesheet" type="text/css" href="styles/class.css">
<link rel="stylesheet" type="text/css" href="styles/temp.css">
<script type="text/javascript" src="scripts/jquery-1.11.3.js"></script>
</head>
<body>
	<img src="" id="bg">
	<div id="wrapper">
		<p>
			<audio src="" id="media"></audio>
		</p>
		<div id="top">
			<div id="search-area">
				<form id="search-form" action="index.jsp">
					歌名:<input type="text" id="song-name" value="红玫瑰"> 歌手名:<input
						type="text" id="singer-name" value="陈奕迅">
					<button id="check" type="submit">搜索</button>
				</form>
			</div>
			<div id="other-area">
				<p>Wow! Player</p>
				<img alt="皮肤" src="images/skin/pf3.jpg" id="skin">
			</div>
		</div>
		<div id="main">
			<div id="left">
				<div id="information-area">
					<span>
						<h2>歌曲名</h2>
						<br>
						<h3>歌手名</h3>
					</span>
				</div>
				<div id="lrc-area">
					<div id ="lrc-content">
						
					</div>
				</div>
				<div id="control-area">
					<div id ="mode-area">
						<ul>
							<li class="mode">顺序播放</li>
							<li class="mode">随机播放</li>
							<li class="mode">单曲循环</li>
							<li class="mode">列表循环</li>
						</ul>
					</div>
					<div class="buttons" id="previous_song_button"></div>
					<div class="buttons" id="play_button"></div>
					<div class="buttons" id="next_song_button"></div>
				</div>
			</div>
			<div id="right">
				<ul id="rightTool">
					<li>播放列表</li>
					<li>搜索结果</li>
					<li>收藏列表</li>
					<li>更多功能</li>
				</ul>
				<div id="music-area">
					<div id="music-list-area">

					</div>
					<div id="search-result-area" style="display: none;">

					</div>

					<!-- 收藏列表 -->
					<div id="favourite-list-area" style="display: none;">
					<!-- 
						<div class="music music-favourite-list">
							<a class="music-list music-list-favourite" link="w d dsada"><p>我的歌声里</p>
								<br><br>
							<p>李代沫</p>
							</a>
							<span class="download-this-song"></span>
							<span class="add-to-favourite-test"></span>
						</div>
						<div class="music music-favourite-list">
							<a class="music-list music-list-favourite" link="w d dsada"><p>我的歌声里</p>
								<br><br>
							<p>李代沫</p>
							</a>
							<span class="download-this-song"></span>
							<span class="add-to-favourite"></span>
						</div>
						<div class="music music-favourite-list">
							<a class="music-list music-list-favourite" link="w d dsada"><p>我的歌声里</p>
								<br><br>
							<p>李代沫</p>
							</a>
							<span class="download-this-song"></span>
							<span class="add-to-favourite"></span> 
						</div> 
					-->
					</div>
				</div>
			</div>
		</div>
		<div id="foot"></div>
		<!-- 
			<div id ="overSkin">
				
			</div> -->
		<div id="skinArea" style="display: none;">
			<ul>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg1-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg2-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg3-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg4-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg5-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg6-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg7-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg8-min"></li>
				<li><img src="images/bg1-min.PNG" class="skin-min" id="bg9-min"></li>
			</ul>
		</div>
	</div>
</body>
<script type="text/javascript">
	var base='<%=basePath%>';
	var sourceUrl = "http://box.zhangmen.baidu.com/x?op=12";
</script>
<script type="text/javascript" src="scripts/add.js"></script>
<script type="text/javascript" src="scripts/index.js"></script>
</html>
