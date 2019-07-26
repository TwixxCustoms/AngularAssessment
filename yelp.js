var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(express.static("client"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



const yelp = require('yelp-fusion');
const client = yelp.client('OhsHgXSJubo2tUxQYlJt-tVWTvrjR1sCbvd6lVM0HeOEWrsa-heZ93vXY7k1-5PfMznVAqI926HoCafcCQvdkh65weMco177Xm_1MLKKdaJts8nL_5CDi9eLE1M6XXYx');





app.post('/getyelp', function(req, res){

	var searchRestaurant		= req.body.restaurant;
	var yelpLocation 				= req.body.location;


	client.search({ location: yelpLocation, term: searchRestaurant})
	.then(function (data) {
		res.json(data.jsonBody.businesses);

	})
	.catch(function (err) {
	  console.error(err);

	});

})

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
