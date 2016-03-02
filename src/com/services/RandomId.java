package com.services;

import java.util.Random;

public class RandomId {

	public String getRandomId(){
		int[] array={0,1,2,3,4,5,6,7,8,9};
		Random rand=new Random();
		//每次循环随机选array中的某个数与第i-1个数交换位置,即每次循环结束之后形成了顺序不同的数组
		for(int i=10;i>=1;i--){
			//生成i以内的随机数
			int index=rand.nextInt(i);
			int temp=array[index];
			array[index]=array[i-1];
			array[i-1]=temp;
		}
		
		int result=0;
		for(int i=0;i<6;i++){
			result=result*10+array[i];
		}
		System.out.println(Integer.toString(result));
		return Integer.toString(result);
	}
}
