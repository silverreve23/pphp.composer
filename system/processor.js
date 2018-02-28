var fs = require('fs');
var mkdirp = require('mkdirp');

var isError = false;

var dirRoot = '../../../';

var sleepTime = 2000;

var config = fs.readFileSync(
    __dirname + '/../config/config.json'
);

var accesseVals = {
    '+' : 'public',
    '-' : 'private',
    '.' : 'protected',
};

var scanFilesTime = new Object();

config = JSON.parse(config);

if(config.sleep)
   sleepTime = config.sleep * 1000;

console.log(
    "\n\x1b[42mRun pphp with period: " 
    + sleepTime / 1000
    + 's\x1b[0m'
);

var idInterval = setInterval(
    checkChangeFiles, 
    sleepTime
);

checkChangeFiles();

function checkChangeFiles(dirScan = null){
    
    if(!dirScan)
        dirScan = __dirname + '/' + dirRoot + config.in;
    
    fs.readdir(dirScan, function(err, items){
		
		if(err){
            
            isError = err;
            
            clearInterval(idInterval);
			
			console.log(
                "\x1b[41mError: " 
                + err.code
                + ' code\x1b[0m'
            );
			
			return false;
			
		}
        
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

            dirParse(__dirname + '/' + dirRoot + config.in);
            
            console.log(
                '\x1b[33m\t' 
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
        line = line.replace(/@class\s.\w+(\s?@extends\s.\w+){0,}(\s?@implements\s.\w+){0,}/, function(findedStr){
            
            return findedStr.replace(/\@/g, '') + "{";


        });    
        
        // Pares [extends] word 
        line = line.replace(/@extends\s.\w+(\s?@implements\s.\w+){0,}/, function(findedStr){
            
            newFileData = newFileData.replace(/class[\s|\w]{0,}\{/, function(findedSubStr){
            
                return findedSubStr.replace(/\{/, '');


            })
            
            return findedStr.replace(/\@/g, '') + "{";


        });   
        
        // Pares [implements] word 
        line = line.replace(/@implements\s.\w+/, function(findedStr){
            
            newFileData = newFileData.replace(/class[\s|\w|\n]{0,}extends[\s|\w]{0,}\{/, function(findedSubStr){
            
                return findedSubStr.replace(/\{/, '');


            })
            
            return findedStr.replace(/[\@|\{]/g, '') + "{";


        });

        // Pares [variable] word
        line = line.replace(/\@var(s)?\s{0,}([\+|\-|\.]){0,}[$|\w|\s|,|=]{1,}/, function(findedStr, static, access){
            
            if(static)
                return accesseVals[access] + ' static ' + findedStr.substr(7);
            
            return accesseVals[access] + findedStr.substr(5);

        });
        
        // Pares [function] word
        line = line.replace(/\@def(s)?\s*([\+|\-|\.])\s*(\w+)\s*\([$|\w|\s|,]*\)/, function(findedStr, static, access){
            
            if(static)
                return accesseVals[access] + ' static function' + findedStr.substr(6) + "{";
            
            return accesseVals[access] + ' function' + findedStr.substr(5) + "{";

        });

        // Pares [end if] word
        line = line.replace(/\@if\s*\([\s\$|(\=\>\<\!)|\[\]|\.|0-9|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });

        // Pares [end foreach] word
        line = line.replace(/@foreach\s{0,}\([\@|\.|\s|\$|(\=\>)|\[|\]|\w]{1,}\s*\)/, function(findedStr){

            return findedStr.substr(1) + "{";

        });
        
        // Pares [this] word
        line = line.replace(/\@this\.[$|\w|\s]{1,}/, function(findedStr){

            return '$this->' + findedStr.substr(6);

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
        
        fileOut = $filePath.replace(
            config.in,
            config.out
        );
        
        fileOut = fileOut.replace(/.blade/, '');
        pathMake = fileOut.replace(/\/\w{1,}\.php$/, '');
        
        if(!newFileData)
            return false;
        
        
        mkdirp(pathMake, (err) => {
            
            if(err) return err;
            
            fs.writeFile(fileOut, newFileData, () => {});
            
        });

        

    });
    
}

