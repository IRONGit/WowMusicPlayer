package com.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import com.services.Services;

/**
 * Servlet implementation class MyServlet
 */
@WebServlet("/MyServlet")
public class LrcServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		String lrcUrl=request.getParameter("lrcUrl");
		Services service=new Services();
		
		
		Map<String,String> lrcMap=service.getLrc(lrcUrl, request);
		
		JSONObject jsonObject = JSONObject.fromObject(lrcMap);
				
		response.getWriter().print(jsonObject.toString());
		
		response.getWriter().flush();
		response.getWriter().close();

	}

}
