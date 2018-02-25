var fs = require('fs');

var count = 0;

var dirRoot = '../';

var config = fs.readFileSync(
    __dirname + '/../config/config.json'
);

config = JSON.parse(config);

dirParse(dirRoot + config.in);

function dirParse(dirname){
    
    fs.readdir(dirname, function(err, items){
        
        for(var i = 0; i < items.length; i++){
            
            var file = dirname + '/' + items[i];
            
            if(fs.lstatSync(file).isDirectory()){
                
                dirParse(file);
                
            }else{
                
                parseFile(file);
                
            }

        }

    });
    
}

function parseFile($filePath){
    
    var newFileData = '';
    
    var lineReader = require('readline').createInterface({
        
        input: fs.createReadStream($filePath)
        
    });
    
    lineReader.on('line', function(line){
    
        // Pares [class] word
        line = line.replace(/@class\s.(\w+)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [function] word
        line = line.replace(/@function\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){

            return 'public function' + findedStr.substr(10) + "{";

        });

        // Pares [static function] word
        line = line.replace(/@function\(static\)\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){

            return 'public static function' + findedStr.substr(18) + "{";

        });

        // Pares [end if] word
        line = line.replace(/@if\s*\([\s\$|(\=\>\<\!)|\[\]|\.|0-9|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [end foreach] word
        line = line.replace(/@foreach\s*\([\s\$|(\=\>)|\[\]|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [end symbol] word
        line = line.replace(/@end/, function(findedStr){

            return "}";

        });

        // Pares [php] word
        line = line.replace(/^@php/, function(findedStr){

            return "<?php";

        });

        // Pares [end php] word
        line = line.replace(/@endphp/, function(findedStr){

            return "?>";

        });

        // Pares [array int key] word
        line = line.replace(/\$[A-Z|a-z|\_]{1,}[0-9]*\.[0-9]/, function(findedStr){

            return findedStr.replace(".", "[") + "]";

        });

        // Pares [array string key] word
        line = line.replace(/\$[A-Z|a-z|\_]{1,}[0-9]*\.[\w]{1,}/, function(findedStr){

            return findedStr.replace(".", "['") + "']";

        });

        newFileData += line + "\n";

    });
    
    lineReader.on('close', function(){
        
        var fileOut = '/';
        
        fileOut = $filePath.replace(dirRoot + config.in + '/', '');
        fileOut = dirRoot + config.out + '/' + fileOut;
        
        console.log(fileOut);
        
        if(!newFileData)
            return false;

        fs.writeFile(fileOut, newFileData, () => {});

    });
    
}

