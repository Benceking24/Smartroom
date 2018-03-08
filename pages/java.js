$( document ).ready(function() {

	var SmartRoomSocket = new WebSocket("ws://192.168.10.110:8080");
	SmartRoomSocket.onopen = function (event) {
	
};

	var hangulatWrapper = $("#hangulat-wrapper");
	hangulatWrapper.find("input").on('change', function() {
		var inputvalue=$(this).val();
		$("#hangulat").attr("src",inputvalue + ".png");
		
		if(inputvalue=="piros"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#ff0000");
			console.log(inputvalue);
		}
		if(inputvalue=="zold"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#00ff00");
			console.log(inputvalue);
		}
		if(inputvalue=="kek"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#0000ff");
			console.log(inputvalue);
		}
		if(inputvalue=="nincs"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#000000");
			console.log(inputvalue);
		}
	});;
	
	var redonyWrapper=$("#redony");
	redonyWrapper.find("input").on('change', function() {
		var inputvalue=$(this).val();
		$("#redbelul").height(inputvalue);
		
		if(inputvalue=="0")
		{ SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Shades;" + 0);
		}if(inputvalue=="75")
		{ SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Shades;" + 50);
		}else if(inputvalue=="145"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Shades;" + 100);
		}

			
	});;

	$(".switch").on('change', function() {
		var inputvalue=$(this).val();
		var allas=0;
		if ($(this).is(':checked')) {
			allas=1;
		}
		console.log(inputvalue,allas);
		 SmartRoomSocket.send(inputvalue +allas); 
	});;
	
	//192.168.10.110
});