app.controller('AppCtrl',function($scope, $http, filterdata) {

  $scope.searchButtonText = "Find somewhere nearby";
  $scope.searchClicked=0;


  var inputFrom = document.getElementById('input');


  var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
  google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {


    var place = autocompleteFrom.getPlace();

    var placeName = place.formatted_address;

    $scope.place = placeName;
    console.log('place', $scope.place);


  }); 
  
  $scope.search = function(counter) {
    $scope.searchClicked = $scope.searchClicked + counter;
    if($scope.searchClicked == 1){

  
    $scope.geocode($scope.place);

    } else{

  
      $scope.next();
    }

  };


  $scope.next = function(){



    $scope.listOfPhotos = [];

    var restaurant = $scope.filterdata;
    if(restaurant.length <= 1){
      $scope.alertShow = true;
      $scope.alert_msg = "We ran out of 10 restaurants. Enter a different location?"
      $scope.reset();
    }

    else{

      $scope.filterdata.splice(0, 1);

      restaurant = $scope.filterdata;

   
      $scope.getDetails();

      var server = {location: $scope.place, restaurant: restaurant[0].name};

      $http.post("/getyelp", server)
        .success(function(response){
          console.log('from yelp');
          console.log(response);

          var restaurant = response.businesses;


          var name            = restaurant[0].name
          localStorage.setItem('restaurantName', name);

 

        var rating_url      =  restaurant[0].location.rating_img_url;
        $scope.rating_img   = restaurant[0].rating_img_url;

        $scope.name     =  name;
        $scope.display_name = name;

        var address         = restaurant[0].location.display_address;
        $scope.address = "Address : " + address;

        localStorage.setItem('restaurant', address);

        var status          = restaurant[0].is_closed;

         if(status == "false"){
             $scope.status   = "Closed!";
         } else{
          $scope.status = "Open!";
         }

        var rating          = restaurant[0].rating;
        $scope.rating   = "rating : " + rating + " / 5";

        var contact         = restaurant[0].phone;
        $scope.contact  = "Contact : " + contact;

        var url             = restaurant[0].url;
        $scope.url      = url;

        var reviewCount     = restaurant[0].review_count;
        $scope.link   = "Check out " + reviewCount + " reviews "+ " in Yelp ";

        var image           = restaurant[0].image_url;

        $scope.rimage     = restaurant[0].image_url;

    });

    } 


  } 

  $scope.geocode = function(placeName){


    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
            address: placeName
          }, function(results, status){
            if(status === google.maps.GeocoderStatus.OK){

              address = results[0];

                var location = {
                  lat: address.geometry.location.lat(),
                  lng: address.geometry.location.lng()
                };

              var service = new google.maps.places.PlacesService(map.gMap);

              var request = {
                location: location,
              
                type: ['restaurant'],
                radius: '10000'
              };

              service.nearbySearch(
               request,
               function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {


               
                  $scope.filterdata = filterdata.filter(place);   


       
                  $scope.getDetails();


            }
          })

        }

        else{
          $scope.alertShow = true;
          $scope.alert_msg = "No nearby restaurants found"

        }

      });

  } 

  $scope.getDetails = function(){

    var service = new google.maps.places.PlacesService(map.gMap);
    var listOfRestaurants = $scope.filterdata;

    var id = listOfRestaurants[0].place_id;

      service.getDetails({
        placeId: id
      }, function(result, status){
        if(status === google.maps.places.PlacesServiceStatus.OK){


          $scope.restaurantName = result.name;
          $scope.callServer();
          
          $scope.website        =  result.website;


          if(result.reviews){

            $scope.reviews      = result.reviews;
          }

        if(result.photos){
          $scope.listOfPhotos = [];

          for(var i=0; i < result.photos.length; i++){
            var photos = result.photos[i].getUrl({'maxWidth': 600, 'maxHeight': 600});

           $scope.listOfPhotos.push(photos);
         

          }
        }
        else{
          document.getElementById('slideshow').style.visibility= "hidden";
          $scope.noPhotoText = "No photos to display"
        }

        $scope.searchButtonText = "Find another restaurant"

        }

        else{
          $scope.alertShow = true;
          $scope.alert_msg = "Couldn't retrieve details from Google."
        }


      })


  } 





$scope.reset = function(){


    $scope.link           = "";
    $scope.address        = "";
    $scope.name           = "";
    $scope.rating         = "";
    $scope.status         = "";
    $scope.contact        = "";
    $scope.url            = "";
    $scope.display_name   = "";
    $scope.rating_img     = "";
    $scope.snippet        = "";
    $scope.rimage         = "";
    $scope.displayWebsite = "";
    $scope.reviews        = "";
    $scope.listOfPhotos   = "";

    $scope.searchButtonText = "find somewhere nearby";

    document.getElementById("modify").innerHTML = "";

    $scope.show = false;

    document.getElementById("result").style.visibility = "hidden"
    document.getElementById("accordion").style.visibility = "hidden"
    document.getElementById('map-canvas').style.visibility="hidden";
    document.getElementById('slideshow').style.visibility = "hidden";

    $scope.searchClicked = 0;


  }




  $scope.callServer = function(){
     var server = {location: $scope.place, restaurant: $scope.restaurantName};


    $http.post("/getyelp", server)
      .success(function(response){
        console.log('response is', response);
      var restaurant = response;
      var name = restaurant[0].name

 
      $scope.displayWebsite = "Click to visit website";
      $scope.web            = "Website : "

      var rating_url      =  restaurant[0].location.rating_img_url;
      $scope.rating_img   = restaurant[0].rating_img_url;

      $scope.snippet        = restaurant[0].snippet_text;

      $scope.name     =  name;
      $scope.display_name = name;

      var price = restaurant[0].price;
      $scope.price = "price : " + price + "/$$$$";

      var address         = restaurant[0].location.display_address;
      $scope.address = "Address : " + address;

       localStorage.setItem('restaurant', address);

      var status          = restaurant[0].is_closed;

       if(status == "false"){
           $scope.status   = "Closed!";
       } else{
        $scope.status = "Open!";
       }

      var rating          = restaurant[0].rating;
      $scope.rating   = "rating : " + rating + " / 5";

      var contact         = restaurant[0].phone;
      $scope.contact  = "Contact : " + contact;

      var url             = restaurant[0].url;
      $scope.url      = url;

      var reviewCount     = restaurant[0].review_count;
      $scope.link   = "Check out " + reviewCount + " reviews "+ " in Yelp ";

      var image           = restaurant[0].image_url;

      $scope.rimage     = restaurant[0].image_url;


      document.getElementById("result").style.visibility = "visible"

      document.getElementById("accordion").style.visibility = "visible"
      document.getElementById('map-canvas').style.visibility="visible";
      document.getElementById('slideshow').style.visibility = "visible";

      $scope.show = true;

    });

  }


});

