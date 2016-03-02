package com.services;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.bean.MusicHelper;

/**
 * @author john
 *
 */
public class XMLService {
	
	/*读取XML字符
	 * */
	public Object read(String xml) {

		System.out.println("xml: "+xml);
		DocumentBuilderFactory dbf=DocumentBuilderFactory.newInstance();
		
		try {
			Document doc = dbf.newDocumentBuilder().parse(
					new InputSource(new StringReader(xml)));
			

			Element root = doc.getDocumentElement();
			
			System.out.println("root: "+root.getTagName());
			
			NodeList nodes = root.getChildNodes();
			// 先找到根节点的子节点
			for (int i = 0; i < nodes.getLength(); i++) {
				Node node = nodes.item(i);
				if (node == null) {
					return "-1";
				}
				if (node.getNodeName() == "count") {

					NodeList nodes1 = node.getChildNodes();
					if (nodes1 == null) {
						return "-1";
					}
					for (int j = 0; j < nodes1.getLength(); j++) {
						Node node1 = nodes1.item(j);
						if (node1 != null
								&& node1.getNodeType() == Node.TEXT_NODE) {
							System.out.println("find");
							System.out.println(node1.getNodeValue());
							// 没有找到歌曲
							if (node1.getNodeType() == 0) {
								return "-1";
							}

						}

					}
					// continue;
				}

				if (node.getNodeName() == "url") {
					NodeList nodes1 = node.getChildNodes();

					StringBuffer strbURL = new StringBuffer();

					StringBuffer lrcURL=new StringBuffer("http://box.zhangmen.baidu.com/bdlrc/");
					
					String urlF = "";
					String urlS = "";
					if (nodes1 == null) {
						return "-1";
					}
					// 循环遍历<url>的子节点,找到<encode>,<decode>�?lrcid>
					for (int j = 0; j < nodes1.getLength(); j++) {
						Node node1 = nodes1.item(j);
						if (node1 == null) {
							return "-1";
						}
						// 找到encode
						if (node1.getNodeName() == "encode") {

							System.out.println("length: "+node1.getChildNodes().getLength());
							urlF = node1.getChildNodes().item(0).toString();

							urlF = urlF.replaceAll("\n", "");
							urlF = urlF.replaceAll(" ", "");

							int firstIndex = urlF.indexOf(':');
							urlF = urlF.substring(firstIndex + 1,
									urlF.length() - 2);

							System.out.println("find encode");
						}
						if (node1.getNodeName() == "decode") {

							urlS = node1.getChildNodes().item(0).toString();

							urlS = urlS.replaceAll("\n", "");
							urlS = urlS.replaceAll(" ", "");

							int firstIndex = urlS.indexOf(':');
							urlS = urlS.substring(firstIndex + 1,
									urlS.length() - 2);

							System.out.println("find decode");
//							break;
						}
						
						if(node1.getNodeName()=="lrcid"){
							String text=node1.getChildNodes().item(0).toString();
							int indexF=node1.getChildNodes().item(0).toString().indexOf(":");


							String lrcId=text.substring(indexF+2,text.length()-1);
							//暂时认为lrcid�?���?位数
							if(lrcId.length()!=1){
								String temp=lrcId.substring(0,lrcId.length()-2);
								lrcURL.append(temp).append("/").append(lrcId).append(".lrc");
								
							}
							System.out.println("find lrcid");
						}
						

					}

					if (urlF != "" && urlS != "") {
						//可能�?���?
						strbURL.append(urlF).append(urlS);
					}
					System.out.println("url: " + strbURL);

					MusicHelper mh=new MusicHelper();
					mh.songUrl=strbURL.toString();
					if(lrcURL.toString().charAt(lrcURL.toString().length()-1)!='/'){
						mh.lrcUrl=lrcURL.toString();
					}else{
						mh.lrcUrl="-1";
					}
					return mh;
				}

			}
			
			
			
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}

		return "-1";
	}
	
	
	
}
