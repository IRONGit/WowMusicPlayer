package com.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBC {

	private static Connection conn;
	
	private Statement st;
	
	private ResultSet rs;
	
	private PreparedStatement ps;
	
	private static String user="root";
	
	private static String password="123456";
	
	private static String url="jdbc:mysql://localhost:3306/player?useUnicode=true&characterEncoding=UTF-8";
	public Connection getConnection(){
		try {
			Class.forName("com.mysql.jdbc.Driver");
			conn=DriverManager.getConnection(url,user,password);
			System.out.println("连接成功");
		} catch (Exception e) {
			System.out.println("ss");
			e.printStackTrace();
		}
		
		return conn;
		
	}

}
