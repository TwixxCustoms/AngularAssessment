app.service('filterdata', function(){

	this.filter = function(data){

		var filterarray = [];
		for(var i=0; i < 10; i++){


			var item =  data[Math.floor(Math.random()*data.length)];

			if(filterarray.indexOf(i) == item){
				console.log('duplicate random found');
				break;
			}
			else{
				filterarray.push(item);
			}


		}
		return filterarray;
	}
})