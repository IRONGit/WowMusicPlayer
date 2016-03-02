package com.services;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import com.bean.Music;
import com.jdbc.JDBC;

public class Services {

	static BufferedReader br;

	static File file;

	static Map<String, String> lrcmap;
	
	public static void main(String[] args) {
		System.out.println(new Services().checkFileExists("WebContent\\lrc\\白玫瑰.lrc"));
	}
	
	public boolean checkFileExists(String filePath){
		File cFile=new File(filePath);
		System.out.println(cFile.getAbsolutePath());
		if(cFile.exists()){
			return true;
		}

		return false;
	}
	
	

	// 根据歌词文件路径获得歌词
	public Map<String, String> getLrc(String uri, HttpServletRequest request) {
		String src = request.getSession().getServletContext().getRealPath("/")
				+ uri.substring(1, uri.length() - 1);
		file = new File(src);
		System.out.println("uri:"+uri);
		System.out.println("src: "+src);
		Map<String, String> map = new LinkedHashMap<String, String>();
		try {
			InputStreamReader isr = new InputStreamReader(new FileInputStream(
							file), "gbk");	
			br = new BufferedReader(isr);
			
			// 一行读完,然后分割字符串
			String str="";
			String ss=br.readLine();
			str+=ss;
			while((ss=br.readLine())!=null){
				str+=ss;
			}
			System.out.println("lrc:  "+str);
			int length = str.length();
			
			boolean find = false;
			boolean notFirst = false;
			int begin = -1;
			int end = -1;
			for (int i = 0; i < length; i++) {
				if (!find && str.charAt(i) == '[') {
					if (notFirst) {

						map.put(str.substring(begin, end + 1),
								str.substring(end + 1, i));
						System.out.println(map.get(str.substring(begin, end + 1)));
					}
					begin = i;
					find = true;
					notFirst = true;
					continue;
				}
				if (find && str.charAt(i) == ']') {
					end = i;
					find = false;
				}
			}

			
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				br.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		return map;
	}

	// 根据歌词文件路径获得歌词
	// 废弃
	public Map<String, String> getLrcF(String uri, HttpServletRequest request) {
		String src = request.getSession().getServletContext().getRealPath("/")
				+ uri.substring(1, uri.length() - 1);
		System.out.println("ll: " + src);
		Map<String, String> lrc = new LinkedHashMap();
		file = new File(src);
		try {
			InputStreamReader isr = new InputStreamReader(new FileInputStream(
					file), "UTF-8");
			br = new BufferedReader(isr);

			// 一行读完,然后分割字符串
			for (int i = 0;; i++) {
				String line = br.readLine();
				if (line == null) {
					System.out.println("kkkkk");
					break;
				}
				System.out.println("line: " + line);
				String[] map = new String[2];
				if (line.length() > 10) {
					map[0] = line.substring(0, 10);
					map[1] = line.substring(10);
				} else {
					map[0] = line;
					map[1] = "";
				}

				lrc.put(map[0], map[1]);
			}
			br.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return lrc;
	}
}
