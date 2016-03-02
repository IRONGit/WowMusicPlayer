package com.service.download;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;

public class DownLoadService {	
	
	//编码问题
	public boolean downLoadLrc(String url,String path){
		try {
			
			HttpURLConnection huc = (HttpURLConnection) new URL(url)
			.openConnection();
			
			if(huc.getResponseCode()!=200){
				System.out.println("歌词连接失败");
				return false;
			}
			
			InputStream fis=huc.getInputStream();

			InputStreamReader lsr=new InputStreamReader(fis,"GBK");	
			
			BufferedReader reader = new BufferedReader(lsr); 
			
			
			String s="";
			String ss=new String();
			while((s=reader.readLine())!=null){
				ss+=s;
			}
			System.out.println("lrc: "+ss);	

			System.out.println(huc.getResponseCode());
			
			FileOutputStream fo = new FileOutputStream(path);
			
			OutputStreamWriter osw=new OutputStreamWriter(fo,"UTF-8");
			
			String csn =  Charset.defaultCharset().name(); 
			
			System.out.println(csn);
			

			String str=new String(ss.getBytes("GBK"),"UTF-8");
			
			osw.write(ss);
			osw.close();
			System.out.println("歌词下载完成");
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	
	
	public boolean downLoadMusic(String url,String path){
		try {
			
			HttpURLConnection huc = (HttpURLConnection) new URL(url)
			.openConnection();
			
			try {
				if(200==huc.getResponseCode()){
					System.out.println("连接成功");
				}else{
					System.out.println("连接失败");
					return false;
				}

				InputStream fis=huc.getInputStream();
				byte[] b=getBytesByInputStream(fis);

				System.out.println(huc.getResponseCode());
				//需要修改

				FileOutputStream fo = new FileOutputStream(path);
				fo.write(b);
				fo.flush();
				fo.close();
				System.out.println("歌词下载完成");
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				System.out.println("文件未找到");
				return false;
			}

		} catch (MalformedURLException e) {
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public static byte[] getBytesByInputStream(InputStream fin) throws IOException{
		
		ByteArrayOutputStream bStream=new ByteArrayOutputStream();
		
		byte[] buf=new byte[1024];
		
		int nc=0;
		
		while((nc=fin.read(buf,0,buf.length))>0){
			bStream.write(buf,0,nc);
		}
		
		byte[] ret=bStream.toByteArray();
		bStream.flush();
		bStream.close();
		return ret;
	}
	
	public static String getLrc(BufferedReader reader) throws IOException{
		String s="";
		StringBuffer strb=new StringBuffer();
		while((s=reader.readLine())!=null){
			strb.append(s);
		}
		return strb.toString();
	}
	
}

