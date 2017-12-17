var fs = require('fs');

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('./in/test.php')
});

var newFileData = '';
var count = 0;


lineReader.on('line', function(line){

	line = line.replace(/@class\s.(\w+)/, function(findedStr){
		
		return findedStr.substr(1) + "{";
		
		
	});
	
	line = line.replace(/@function\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){
		
		return 'public function' + findedStr.substr(10) + "{";
		
	});
	
	line = line.replace(/@function\(static\)\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){
		
		return 'public static function' + findedStr.substr(18) + "{";
		
	});
	
	line = line.replace(/@if\s*\([\s\$|(\=\>\<\!)|\[\]|\.|0-9|\w]{1,}\s*\)/, function(findedStr){
		
		return findedStr.substr(1) + "{";
		
	});
	
	line = line.replace(/@foreach\s*\([\s\$|(\=\>)|\[\]|\w]{1,}\s*\)/, function(findedStr){
		
		return findedStr.substr(1) + "{";
		
	});
	
	line = line.replace(/@end/, function(findedStr){
		
		return "}";
		
	});
	
	line = line.replace(/^@php/, function(findedStr){
		
		return "<?php";
		
	});
	
	line = line.replace(/@endphp/, function(findedStr){
		
		return "?>";
		
	});
	
	line = line.replace(/\$[A-Z|a-z|\_]{1,}[0-9]*\.[0-9]/, function(findedStr){
	
		return findedStr.replace(".", "[") + "]";
		
	});
	
	line = line.replace(/\$[A-Z|a-z|\_]{1,}[0-9]*\.[\w]{1,}/, function(findedStr){
	
		return findedStr.replace(".", "['") + "']";
		
	});
	
	newFileData += line + "\n";
	
});

lineReader.on('close', function(){
	
	if(!newFileData)
		return false;
	
	fs.writeFile('./out/test.php', newFileData, () => {});
	
	console.log(newFileData);
	
});
