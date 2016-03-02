package com.servlet;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bean.Music;
import com.bean.MusicHelper;
import com.dao.MusicDao;
import com.service.download.DownLoadService;
import com.service.download.MultiDown;
import com.services.RandomId;
import com.services.Services;
import com.services.XMLService;

/**
 * @author john
 * 
 */
@SuppressWarnings("serial")
public class MusicServlet extends HttpServlet {

	public void process(HttpServletRequest req, HttpServletResponse resp,
			Map map, String url) throws MalformedURLException, IOException {
		//cry%20on%20my%20shoulder%20$$singerName$$$$
		
		resp.setCharacterEncoding("UTF-8");
		PrintWriter out=resp.getWriter();

		// 获取参数
		String count = (String) map.get("count");
		String mtype = (String) map.get("mtype");
		String title = (String) map.get("title");
		
		
		int indexF=title.indexOf("$");
		//得到歌名和歌手名,留作最后输出使用
		String songName=title.substring(0,indexF);
		String singerName=title.substring(indexF+2,title.length()-4);

		//把songName和singerName中的%20替换为空格
		songName=songName.replaceAll("%20"," ");
		singerName=singerName.replaceAll("%20"," ");
		
		//在数据库中查询歌曲是否已存在,若存在,直接返回地址,不必搜索,若不存在,则联网搜索
		MusicDao dao=new MusicDao();
		ArrayList<Music> list=dao.getMusic(songName,singerName);
		System.out.println("size: "+list.size());
		
		//可以考虑从MusicDao中直接输出
		//暂时只输出一首歌曲
		if(list.size()!=0){
			out.print("{\"returncode\":\"0\",\"list\":[");
			for(int i=0;i<list.size();i++){
				Music music=list.get(i);
				String id=music.getId();
				//歌曲名可以不用修改
//				songName=music.getSongName();
				singerName=music.getSingerName();
				String songUrl=music.getSongUrl();
				String lrcUrl=music.getLrcUrl();
				out.print("{\"id\":\""+id+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\""+songUrl+"\",\"lrcUrl\":\""+lrcUrl+"\"}");
				if(i!=list.size()-1){
					out.print(",");
				}
			}
			out.print("]}");
			return;
		}
		
		
		//搜索时需要把title中的%20替换为""
		title=title.replaceAll("%20", "");
		// 拼接参数字符?
		String params = "&count=" + count + "&mtype=" + mtype + "&title="
				+ title;

		// 目标URL,获得XML文件
		String tURL = url + params;

		byte[] data = params.getBytes("UTF-8");

		HttpURLConnection huc = (HttpURLConnection) new URL(tURL)
				.openConnection();

		huc.setDoOutput(true);
		huc.setRequestMethod("POST");
		huc.setRequestProperty("Conten-Type",
				"application/x-javascript text-xml; charset=UTF-8");
		huc.setRequestProperty("Content-Length",
				String.valueOf(params.length()));
		huc.setConnectTimeout(5 * 1000);
		try {
			huc.connect();
		} catch (UnknownHostException e) {
			//代表网络异常
			out.print("{\"returncode\":\"-2\"}");
			return ;
		}


		OutputStream targetOS = huc.getOutputStream();

		targetOS.write(data);

		targetOS.flush();
		targetOS.close();

		System.out.println(huc.getResponseCode() + " "
				+ huc.getResponseMessage());

		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

		BufferedInputStream reader = null;

		reader = new BufferedInputStream(huc.getInputStream());

		int b;

		byte[] bit = new byte[1024];

		while (-1 != (b = reader.read(bit))) {
			byteArrayOutputStream.write(bit, 0, b);
		}
		String result = new String(byteArrayOutputStream.toByteArray());

		huc.disconnect();

		//读取歌词地址返回的XML文件
		XMLService xmlService = new XMLService();
		Object obj = new MusicHelper();
		//读取XML字符,返回MusicHelper的实例或者"-1"
		obj = xmlService.read(result);

		if (obj instanceof MusicHelper) {
			MusicHelper mh = (MusicHelper) obj;

			System.out.println("songurl: " + mh.songUrl);
			System.out.println("lrcurl: " + mh.lrcUrl);
			//下载歌曲和歌词文件
			DownLoadService dls=new DownLoadService();
		
			//多线程
			MultiDown md=new MultiDown();
			
			String targetPath="";
			String lrcPath="";
			String musicName="";
			System.out.println("xxx: "+singerName);
			System.out.println(singerName.equals(""));
			System.out.println("real: "+req.getSession().getServletContext().getRealPath("\\"));
			//下载歌曲存放的路径
			String realPath=req.getSession().getServletContext().getRealPath("/")+"music/";
			//下载歌词存放的路径
			String realPathB=req.getSession().getServletContext().getRealPath("/")+"lrc/";
			System.out.println("realPath: "+realPath);
			System.out.println("lrcPath: "+realPathB);
			if(singerName.equals("")&&songName.equals("")){
				return;
			}else if(singerName.equals("")){
				musicName=songName;
				targetPath=realPath+musicName+".mp3";
				lrcPath=realPathB+songName+".lrc";
			}else if(songName.equals("")){
				//若歌曲名为空,暂时不作处理,直接返回
				targetPath=realPath+singerName+".mp3";
				return;
			}else{
				musicName=singerName+"-"+songName;
				targetPath=realPath+musicName+".mp3";
				lrcPath=realPathB+songName+".lrc";
			}
			
			
			//下载歌曲
			/*boolean isSuccess=dls.downLoadMusic(mh.songUrl,targetPath);*/
			//改为多线程下载
			boolean isSuccess=md.downLoadMusicMultily(targetPath, mh.songUrl);
			
			System.out.println("歌曲下载成功: "+isSuccess);
			if(isSuccess){
				//歌曲下载成功
				
				//下载成功即把数据插入数据库
				Music music=new Music();
				music.setSongName(musicName);
				music.setSingerName(singerName);
				music.setSongUrl("music/"+musicName+".mp3");
//				music.setLrcUrl("lrc/"+songName+".lrc");
				new RandomId();
				music.setId(new RandomId().getRandomId());

				if(mh.lrcUrl!="-1"){
					music.setLrcUrl("lrc/"+songName+".lrc");
					//有歌曲和歌词
					//下载歌词
//					boolean isLrcSuccess=dls.downLoadLrc(mh.lrcUrl, lrcPath);
					
					//改为多线程下载歌词
					boolean isLrcSuccess=md.downLoadMusicMultily(lrcPath, mh.lrcUrl);

					//歌词下载成功
					if(isLrcSuccess){

						//歌曲和歌词均下载成功
						//out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+singerName+"-"+songName+".mp3\",\"lrcUrl\":\"lrc/"+songName+".lrc\"}]}");
						out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+musicName+".mp3\",\"lrcUrl\":\"lrc/"+songName+".lrc\"}]}");
						
					}else{
						//歌曲下载成功,但歌词下载失败,lrcUrl:-1,待查验
						//out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+singerName+"-"+songName+".mp3\",\"lrcUrl\":\"-1\"}]}");
						out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+musicName+".mp3\",\"lrcUrl\":\"-1\"}]}");
					}
				}else{
					music.setLrcUrl("-1");
					System.out.println("暂无歌词");
					//输出暂无歌词,待查验
					//有歌曲,无歌词
					//out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+singerName+"-"+songName+".mp3\",\"lrcUrl\":\"-1\"}]}");
					out.print("{\"returncode\":\"0\",\"list\":[{\"id\":\""+music.getId()+"\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"music/"+musicName+".mp3\",\"lrcUrl\":\"-1\"}]}");
				}
				//插入数据库
				boolean isInsert=dao.insert(music);
			}else{
				//代表下载失败,输出没有数据,待查验
				//返回的不是list格式
				out.print("{\"returncode\":\"-1\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"-1\",\"lrcUrl\":\"-1\"}"); 
			}

			
		} else {
			// 返回的不是MusicHelper类的实例,代表没有查到数据
			System.out.println("error");
			//输出没有数据,待查验
			//返回的不是list格式
			out.print("{\"returncode\":\"-1\",\"songName\":\""+songName+"\",\"singerName\":\""+singerName+"\",\"songUrl\":\"-1\",\"lrcUrl\":\"-1\"}");
		}
	}

	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		// 设置编码
		req.setCharacterEncoding("UTF-8");

		String url = req.getParameter("sourceUrl");
		// 取得参数
		String count = req.getParameter("count");
		String mtype = req.getParameter("mtype");
		String title = req.getParameter("title");
		
		if(count==null||mtype==null||title==null){
			return ;
		}

		title=title.replaceAll(" ", "%20");
		
		Map<String, String> argMap = new HashMap<String, String>();

		argMap.put("count", count);
		argMap.put("mtype", mtype);
		argMap.put("title", title);

		System.out.println("doget  " + url + " count: " + count + " mtype: "
				+ mtype + " title: " + title);
		process(req, resp, argMap, url);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doGet(req, resp);
	}

}
