var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();

require('dotenv').config({silent: true});

var port = process.env.PORT || 8080;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
	var result = {
		error: false,
		data: null
	};

	var url = "http://questure.poliziadistato.it/stranieri/?mime=1&lang="+ req.query.language +"&pratica="+ req.query.receipt;

	request(url, function(error, response, html){
        if(error){
        	result.error = error;
			return res.json(result);
		}

        var $ = cheerio.load(html),
        	$content = $('.content');

        if ($content.find('.m-ok').length > 0) {
        	result.data = $content.find('.m-ok').text();
        	return res.json(result);
        }

        var $result = $content.children('strong');

        if ($result.length > 0)
	        result.data = $result.text();
    	else 
    		result.error = 'Wrong Parameters';
    	
        return res.json(result);
    });
});

var server = app.listen(port, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});
