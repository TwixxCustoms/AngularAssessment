(function(window, mapster){


	var options = mapster.MAP_OPTIONS;

	element = document.getElementById('map-canvas');


	//	map = new google.maps.Map(element, options);
	map = mapster.create(element, options);
	
	var geocoder = new google.maps.Geocoder();

	
	var input = document.getElementById('input');




document.getElementById('reset').addEventListener('click', function(e){
	map.clear();
	map = mapster.create(element, options);
});





button = document.getElementById('button');

	button.addEventListener('click', function(e){

		map.clear();

	geocoder.geocode({
		address: input.value
	}, function(results, status){
		if(status === google.maps.GeocoderStatus.OK){

			var result = results[0];


				//setting the center of the map to the inputted value.
			map.gMap.setCenter({lat: result.geometry.location.lat(), lng: result.geometry.location.lng()});

			map.addMarker({
				lat: result.geometry.location.lat(),
				lng: result.geometry.location.lng(),
				draggable: false,
				icon: './currentlocation.png',
				content: "Your current location"
			});

		input.value = result.formatted_address;

		var restaurant = localStorage.getItem('restaurant');

		geocoder.geocode({
			address: restaurant
		}, function(results, status){
			if(status === google.maps.GeocoderStatus.OK){
				restaurant = results[0];

				restaurant = restaurant.formatted_address;

				find(result, restaurant);
			}
		})


		}else{
			console.error(status);
		}
	});
})



function find(result, restaurant){

	var location = {
		lat: result.geometry.location.lat(),
		lng: result.geometry.location.lng()
	};

	var type;

	
	map._onService({
		destination: restaurant,
		location: location,
		origin: input.value,
		name: result.formatted_address
	});

	}



}(window, window.Mapster));


