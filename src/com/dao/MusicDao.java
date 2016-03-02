package com.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import com.bean.Music;
import com.jdbc.JDBC;

public class MusicDao {

	private static JDBC dao;
	
	private static Connection con;
	
	private Statement st;
	
	private PreparedStatement ps;
	
	private ResultSet rs;
	
	
	static{
		dao=new JDBC();
	}

	public ArrayList<Music> getMusic(String songName,String singerName){
		ArrayList<Music> list=new ArrayList<Music>();
		con=dao.getConnection();
		String sql="select* from music where songName='"+singerName+"-"+songName+"'";
		try {
			st=con.createStatement();
			rs=st.executeQuery(sql);
			while(rs.next()){
				Music music=new Music();
				music.setId(rs.getString("id"));
				music.setSongName(rs.getString("songName"));
				music.setSingerName(rs.getString("singerName"));
				music.setSongUrl(rs.getString("songUrl"));
				music.setLrcUrl(rs.getString("lrcUrl"));
				list.add(music);
			}
			con.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}

	
	public boolean insert(Music music){
		con=dao.getConnection();
		String sql="insert into music values(?,?,?,?,?);";
		
		try {
			ps=con.prepareStatement(sql);
			ps.setString(1,music.getId());
			ps.setString(2, music.getSongName());
			ps.setString(3, music.getSingerName());
			ps.setString(4, music.getSongUrl());
			ps.setString(5, music.getLrcUrl());
			int insertCt=ps.executeUpdate();
			if(insertCt<=0){
				return false;
			}
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return true;
	}
//	public static void main(String[] args) {
//		Music music=new Music();
//		music.setId("223344");
//		music.setLrcUrl("testlrcurl");
//		music.setSongName("testsongname");
//		music.setSingerName("testsingername");
//		music.setSongUrl("testsongurl");
//		new MusicDao().insert(music);
//	}
}
