package com.service.download;

import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;

public class DownThread extends Thread{
	//定义字节数组的长度
	private final int BUFF_LEN=32;
	
	//定义下载的起始点
	private long start;
	
	//定义下载的结束点
	private long end;
	
	//定义下载的输入流
	private InputStream is;
	
	//将下载的字节输入到raf中
	private RandomAccessFile raf;

	//构造器
	public DownThread(long start, long end, InputStream is, RandomAccessFile raf) {
		System.out.println(start+"----->"+end);
		this.start = start;
		this.end = end;
		this.is = is;
		this.raf = raf;
	}
	
	@Override
	public void run() {
		try {
			is.skip(start);
			raf.seek(start);
			//定义读取输入流的缓存数组
			byte[] buff=new byte[BUFF_LEN];
			
			//本线程负责下载的文件大小
			long currentLen=end-start;
			//定义最多需要读取几次就可以完成本线程的下载
			long times=currentLen/BUFF_LEN+4;
			
			//实际读取的字节数
			int hasRead=0;
			
			for(int i=0;i<times;i++){
				hasRead=is.read(buff);
				//如果读取的字节数小于0,则退出循环
				if(hasRead<0){
					break;
				}
				
				raf.write(buff,0,hasRead);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			//关闭当前线程的输入流和输出流
			try {
				if(is!=null){
					is.close();
				}
				if(raf!=null){
					raf.close();
				}
			} catch (Exception e2) {
				e2.printStackTrace();
			}

		}
		
	}
	
	
	
	
}
