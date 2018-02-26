var fs = require('fs');
var mkdirp = require('mkdirp');

var dirRoot = '../';

var sleepTime = 2000;

var config = fs.readFileSync(
    __dirname + '/../config/config.json'
);

var scanFilesTime = new Object();

config = JSON.parse(config);

if(config.sleep)
   sleepTime = config.sleep * 1000;

console.log(
    "\n\x1b[42mRun pphp with period: " 
    + sleepTime / 1000
    + 's\x1b[0m'
);

setInterval(
    checkChangeFiles, 
    sleepTime
);

function checkChangeFiles(dirScan = null){
    
    if(!dirScan)
        dirScan = dirRoot + config.in;
    
    fs.readdir(dirScan, function(err, items){
        
        for(var i = 0; i < items.length; i++){
            
            var file = dirScan + '/' + items[i];
            
            if(fs.lstatSync(file).isDirectory()){
                
                checkChangeFiles(file);
                
            }else{
                
                isChangeFile(file);
                
            }

        }
        
    });
    
}

function isChangeFile(file){
    
    var fileTime = 0;
    
    fs.stat(file, function(err, stats){
        
        fileTime = stats.mtimeMs;
        
        if(scanFilesTime[file] != fileTime){
        
            scanFilesTime[file] = fileTime;

            dirParse(dirRoot + config.in);
            
            console.log(
                '\n\x1b[33m\t' 
                + file 
                + ' changed!'
            );

        }

    });
    
}

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

        // Pares [variable] word
        line = line.replace(/\@var\s*(\+)\s*\([$|\w|\s|,]*\)/, function(findedStr){

            return 'public ' + findedStr.substr(5);

        });
        
        // Pares [function] word
        line = line.replace(/\@function\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){

            return 'public function' + findedStr.substr(10) + "{";

        });

        // Pares [static function] word
        line = line.replace(/\@function\(static\)\s*(\+)\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr){

            return 'public static function' + findedStr.substr(18) + "{";

        });

        // Pares [end if] word
        line = line.replace(/\@if\s*\([\s\$|(\=\>\<\!)|\[\]|\.|0-9|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [end foreach] word
        line = line.replace(/@foreach\s*\([\@\.\s\$|(\=\>)|\[\]|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [end symbol] word
        line = line.replace(/\@end/, function(findedStr){

            return "}";

        });

        // Pares [php] word
        line = line.replace(/\@php/, function(findedStr){

            return "<?php";

        });

        // Pares [end php] word
        line = line.replace(/\@endphp/, function(findedStr){

            return "?>";

        });

        newFileData += line + "\n";

    });
    
    lineReader.on('close', function(){
        
        var fileOut = '/';
        var pathOut = null;
        var pathMake = null;
        
        fileOut = $filePath.replace(dirRoot + config.in + '/', '');
        pathOut = dirRoot + config.out + '/';
        fileOut = pathOut + fileOut;
        pathMake = fileOut.replace(/\/\w{1,}\.php$/, '');
        
        console.log();
        
        if(!newFileData)
            return false;
        
        mkdirp(pathMake, (err) => {
            
            if(err) return err;
            
            fs.writeFile(fileOut, newFileData, () => {});
            
        });

        

    });
    
}

