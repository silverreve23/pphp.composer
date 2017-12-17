<?php

class Test{

    $test = 1;
    
    $arr = [];
    
	public static function test(){
	
		foreach($arr as $ar){
		
			$var = @$ar['foo'] + 1;
			
		}
		
	}
	
	public static function staticTest(){
	
		if($arr[0]){
		
			$var = $arr[0];
			
		}
		
	}
	
}
