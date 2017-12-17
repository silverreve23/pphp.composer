<p align="center">
	<img src="https://github.com/silverreve23/pphp/blob/master/system/image/pphp.png">
</p>

# pphp

## Preprocessor PHP

This package is for those who like beautiful, orderly and easily program code!

### Example:

#### Source In
##### This package in developer mode!!

```

@php

@class Test

  $test = 1;
    
  $arr = [];
    
  @function(static)+ test()
	
	@foreach($arr as $ar)
		
	  $var = @$ar.foo + 1;
			
	@end
		
  @end
	
  @function(static)+ staticTest()
	
    @if($arr.0)
		
	  $var = $arr.0;
			
	@end
		
  @end
	
@end


```

#### Source Out

```php

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

```
