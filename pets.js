/*Sarah Beidelschies
  How-To Petfinder
*/

var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var request = require('request');
var session = require('express-session');

app.use(express.static('public'));
app.use(session({secret:'SuperSecretPassword'}));
app.set('port', 1234);

var appid = "83624ff3703594fb655ab3001112d2d2";
 
app.get('/pets', function(req, res, next) {
	console.log("in get request");
	var context = {};
	request("http://api.petfinder.com/pet.get?key=" + appid + "&id=33727592&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			console.log(body);
			var response = JSON.parse(body);
			context.name = response.petfinder.pet.name.$t;
			context.email = response.petfinder.pet.contact.email.$;
			var data = [];
			if(response.petfinder.pet.breeds.breed.length >= 1) {
				for(var i=0; i<response.petfinder.pet.breeds.breed.length; i++) {
					
					data.push(response.petfinder.pet.breeds.breed[i]);
			        console.log(response.petfinder.pet.breeds.breed[i].$t);
			    }
				context.breeds = data;
			}
			else {
				console.log(response.petfinder.pet.breeds.breed.$t);
				context.breed = response.petfinder.pet.breeds.breed.$t;
			}
			var photos = [];
			
		    for(var i=0; i<response.petfinder.pet.media.photos.photo.length; i++) {
				console.log(response.petfinder.pet.media.photos.photo[i].$t);
				photos.push(response.petfinder.pet.media.photos.photo[i]);
				
			}
			context.pics = photos;
				
			
		    res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});

app.get('/petsBreed', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/breed.list?key=" + appid + "&animal=horse&format=json", function(error, response, body) {
		var data = [];
		if(!error && response.statusCode < 400) {
			var response = JSON.parse(body);
			for(var i=0; i<response.petfinder.breeds.breed.length; i++) {
				data.push(response.petfinder.breeds.breed[i].$t);
			}
			context.body = data;
			
		  res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});


app.get('/petRand', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/pet.getRandom?key=" + appid + "&shelterid=IN613&output=full&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			var response = JSON.parse(body);
			context.name = response.petfinder.pet.name.$t;
			var data = [];
			if(response.petfinder.pet.breeds.breed.length >= 1) {
				for(var i=0; i<response.petfinder.pet.breeds.breed.length; i++) {
					
					data.push(response.petfinder.pet.breeds.breed[i]);
			    }
			context.breeds = data;
			}
			else {
				context.breed = response.petfinder.pet.breeds.breed.$t;
			}
			context.age = response.petfinder.pet.age.$t;
			
			context.photo = response.petfinder.pet.media.photos.photo[0].$t;
			
		  res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});

app.get('/petFind', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/pet.find?key=" + appid + "&count=5&location=46113&animal=dog&output=full&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			console.log(body);
			context.body = body;
			var response = JSON.parse(body);
			for(var i=0; i<response.petfinder.pets.pet.length; i++) {
				console.log(response.petfinder.pets.pet[i].name.$t);
				if(response.petfinder.pets.pet[i].breeds.breed.length >= 1) {
				for(var j=0; j<response.petfinder.pets.pet[i].breeds.breed.length; j++) {
			
			        console.log(response.petfinder.pets.pet[i].breeds.breed[j].$t);
			    }
			}
			else {
				console.log(response.petfinder.pets.pet[i].breeds.breed.$t);
			}
			}
			
						
		res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});

app.get('/sheltFind', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/shelter.find?key=" + appid + "&location=46113&count=5&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			console.log(body);
			context.body = body;
			var response = JSON.parse(body);
			for(var i=0; i<response.petfinder.shelters.shelter.length; i++) {
				console.log(response.petfinder.shelters.shelter[i].name.$t);
			}
			console.log(response);
						
		  res.render('petdata', context);
		}
		else {
			
			console.log(response.statusText);
			next(error);
		}
	});
	
});

app.get('/sheltGet', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/shelter.get?key=" + appid + "&id=IN613&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			console.log("in if");
			console.log(body);
			context.body = body;
			var response = JSON.parse(body);
						
		  res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});

app.get('/sheltGetPet', function(req, res, next) {
	var context = {};
	request("http://api.petfinder.com/shelter.getPets?key=" + appid + "&count=5&id=IN613&output=full&format=json", function(error, response, body) {
		if(!error && response.statusCode < 400) {
			console.log(body);
			context.body = body;
			var response = JSON.parse(body);
			console.log(response);
			//for(var i=0; i<response.petfinder.pets.pet.length; i++) {
			//	console.log(response.petfinder.pets.pet[i].name.$t);
			//	if(response.petfinder.pets.pet[i].breeds.breed.length >= 1) {
			//	for(var j=0; j<response.petfinder.pets.pet[i].breeds.breed.length; j++) {
			
			//        console.log(response.petfinder.pets.pet[i].breeds.breed[j].$t);
			//    }
			//}
			//else {
				//console.log(response.petfinder.pets.pet[i].breeds.breed.$t);
			//}
			//}
			
						
		res.render('petdata', context);
		}
		else {
			console.log(response.statusText);
			next(error);
		}
	});
	
});
app.use(function(req, res) {
	
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http:52.26.106.49:' + app.get('port') + '; press Ctrl-C to terminate.');
});