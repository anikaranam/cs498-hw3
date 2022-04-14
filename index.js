const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.get('/lengthCounts', (req, res) => {
        try {
                const part1 = fs.readFileSync("./output/part-00000", 'utf8');
                console.log(part1);
                const part2 = fs.readFileSync("./output/part-00001", 'utf8');
                console.log(part2);
                String.prototype.tuple = function(){
                         return eval(this.replace(/\(/g,"[").replace(/\)/g,"]"))
                };
                a = part1.split('\n');
                b = part2.split('\n');
                toReturn = {};
                for (let i = 0; i < a.length; i++) {
                        if (a[i] == '') {
                                continue;
                        }
                        tup = a[i].tuple();
                        toReturn[parseInt(tup[0])] = parseInt(tup[1]);
                }
                for (let i = 0; i < b.length; i++) {
                        if (b[i] == '') {
                                continue;
                        }
                        tup = b[i].tuple();
                        toReturn[parseInt(tup[0])] = parseInt(tup[1]);
                }
                res.json(toReturn);
        } catch(err) {
                console.log(err);
                res.send('error occurred while processing');
        }
});

app.post('/analyze', (req, res) => {
        res.send('processing...');
        const spawn = require('child_process').spawn;
        wordList = req.body['wordlist']
        weights = req.body['weights']
        console.log('hello');
        const mapRed = spawn('python3', ['sparktest.py', 'input3.txt', 'output', JSON.stringify(weights)]);
        mapRed.stdout.on('end', function() {
                console.log('done');
        });
        try {
                fs.writeFileSync('wordList.txt', JSON.stringify(wordList));
        } catch(err) {
                console.log(err);
        }
});

app.post('/test', (req, res) => {
        res.send(req.body['val']);
});

app.get('/results', (req, res) => {
        var wordListStr;
        try {
                wordListStr = fs.readFileSync('wordList.txt', 'utf8');
        } catch(err) {
                console.log(err);
        }
        const wordList = JSON.parse(wordListStr);
        if (wordList.length == 0) {
                res.send('Not done yet');
        } else {
                const part1 = fs.readFileSync("./output/part-00000", 'utf8');
                console.log(part1);
                const part2 = fs.readFileSync("./output/part-00001", 'utf8');
                console.log(part2);
                String.prototype.tuple = function(){
                        return eval(this.replace(/\(/g,"[").replace(/\)/g,"]"))
                };
                a = part1.split('\n');
                b = part2.split('\n');
                toReturn = [];
                for (let i = 0; i < a.length; i++) {
                        if (a[i] == '') {
                                continue;
                        }
                        tup = a[i].tuple();
                        toReturn.push(tup);
                }
                for (let i = 0; i < b.length; i++) {
                        if (b[i] == '') {
                                continue;
                        }
                        tup = b[i].tuple();
                        toReturn.push(tup);
                }
                function compareVals(a, b) {
                        if (a[1] < b[1]) return -1;
                        if (a[1] > b[1]) return 1;
                        return 0;
                }
                toReturn.sort(compareVals);
                result = {};
                for (let i = 0; i < wordList.length; i++) {
                        for (let j = 0; j < toReturn.length; j++) {
                                if (toReturn[j][0].toLowerCase().includes(wordList[i].toLowerCase())) {
                                        result[wordList[i]] = toReturn[j][0];
                                }
                        }
                }
                res.send(result);
        }
});
var http = require('http').Server(app);
const PORT = 80;
http.listen(PORT, function() {
        console.log('Listening on port ' + PORT + '...');
});