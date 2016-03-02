package com.service.download;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class MultiDown{
	
	public boolean downLoadMusicMultily(String fileName,String link){
		final int DOWN_THREAD_NUM=2;
		
		InputStream[] isArr=new InputStream[DOWN_THREAD_NUM];
		
		RandomAccessFile[] outArr=new RandomAccessFile[DOWN_THREAD_NUM];
		
		long begin=0;
		try {
			//创建一个URL对象
			URL url=new URL(link);
			begin=System.currentTimeMillis();
			//以此对象打开第一个输入流
			
			try {
				isArr[0]=url.openStream();
			} catch (IOException e) {
				System.out.println("文件未找到");
				return false;
			}
			
			long fileLen=getFileLength(url);
			
			System.out.println("网络资源大小: "+fileLen);
			
			//以输出文件名创建第一个RandomAccessFile输入流
			//创建从中读取和向其中写入的随机存取文件流,第一个参数:文件名,第二个参数:访问模式
			//"rw"是可读可写
			outArr[0]=new RandomAccessFile(fileName,"rw");
			//创建一个与下载资源大小相等的文件
			for(int i=0;i<fileLen;i++){
				outArr[0].write(0);
			}
			//每线程应该下载的字节数
			long numPerThread=fileLen/DOWN_THREAD_NUM;
			
			//整个下载资源整除后剩下的余数取模
			long left=fileLen%DOWN_THREAD_NUM;
			
			for(int i=0;i<DOWN_THREAD_NUM;i++){
				//为每个线程打开一个输入流,一个RandomAccessFile对象
				//让每个资源分别下载资源的不同部分
				//isArr[0]和outArr[0]已经使用,从不为0开始
				if(i!=0){
					//以URL打开多个输入流
					isArr[i]=url.openStream();
					//以指定输出文件创建多个RandomAccessFile对象
					outArr[i]=new RandomAccessFile(fileName,"rw");
				}
				//分别启动多个线程来下载网络资源
				if(i==DOWN_THREAD_NUM-1){
					//最后一个线程下载指定numPerThread+left个字节
					new DownThread(i*numPerThread,(i+1)*numPerThread+left,isArr[i],outArr[i]).start();
				}else{
					//每个线程负责下载一定的numPerThread字节
					new DownThread(i*numPerThread,(i+1)*numPerThread,isArr[i],outArr[i]).start();
				}
				
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return false;
		} catch (IOException e) {
			e.printStackTrace();
		}
		long end=System.currentTimeMillis();
		System.out.println("下载成功....耗时: "+(end-begin)/1000+"秒");
		return true;
	}


	//定义获取网络资源长度的方法
	private static long getFileLength(URL url) throws IOException {
		long length=0;
		URLConnection con=url.openConnection();
		//获取URL连接资源的长度
		long size=con.getContentLength();
		
		length=size;
		return length;
	}
}	
