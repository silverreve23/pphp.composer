@php

@class Test

    $test = 1;
    
    $arr = [];
    
	@function(static)+ test()
	
		@foreach($arr as $ar)
		
			$var = $ar.foo + 1;
			
		@end
		
	@end
	
	@function(static)+ staticTest()
	
		@if($arr.0)
		
			$var = $arr[0];
			
		@end
		
	@end
	
@end
