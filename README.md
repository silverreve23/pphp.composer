# pphp

<p align="center">
	<img src="https://lh3.googleusercontent.com/fgWad7OjuLD0eeDNooyDX98BsDmywtA3p2bw-_rO6BzUOawdCimzc8aYgJ64-XhME8N7-pb6Fu7O7_UalnGQZAlmZGWUM_-OaZiaDWjbJjs3N-JUpOpM8mPwNDezuxVVp0Y7NmuNR9GEm3vKREV4gTAmoG4MdY6L3s--XhXR3Oj4h6j6CGksITBgueYgzlyBxVQtg1S1Ox1mKFkIHRmKKhYJOS9dnA4L3HKf5yAkqneYA42K0KjZbyzSW2cEdSPqIr3TcX4_eXsKq-GLjW8i5bQZO4sKiub7fb9yaok-5QGOP8f3_AoDylgmIAhsXZmbHd5hxRVivEZMuAr_FEq5stoMW0o3E-oFC8lN150O2ovzOSSZ48sv6xPISxWMRpGKLq0G_aglFwGZAtvhlLZ_pVibv-BDyrirPqihv3TTRAlba-DVPJjKZKjk9URZuUm6Dtt_I5pZlLDa_de8cBplGfpz9qJYvehNL3OXNeLRx4Y8EKLsHshlaYXT513ft7xqirXvrsL8xL2xgOnrRn_1tzKp4eIU-BrI6pXosDuZ8yJYEMxz-LyRFyP6HrhPXHyr0AIZs_bzfpfUO5vpUZzXBFYlcSeV_obQQUW5rlY=w900-h490-no" width="540">
</p>

<p align="center">
	This package is for those who like beautiful, orderly and easily program code!
</p>

### Example:

#### Source In
##### This package in developer mode!!

```

@php

@class Test
	
	@var+ $testPublic = array();
	@var- $testPrivate = 20;
	@var. $testProtected = 'test';
	
	@var(static). $testStatic = 'static';

	@function+ test()
	
		@foreach(@this.test as $key => $val)
		
			echo $key.$val;
			
		@end
		
	@end
	
	@function(static)- staticTest($test)
	
		@if($test)
		
			return true;
			
		@end
		
	@end
	
@end

```

#### Source Out

```php

<?php

class Test{
	
	public $testPublic = array();
	private $testPrivate = 20;
	protected $testProtected = 'test';
	
	protected static $testStatic = 'static';

	public function test(){
	
		foreach($this->test as $key => $val){
		
			echo $key.$val;
			
		}
		
	}
	
	private static function staticTest($test){
	
		if($test){
		
			return true;
			
		}
		
	}
	
}

```
