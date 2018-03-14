$( document ).ready(function() {

	var SmartRoomSocket = new WebSocket("ws://192.168.10.110:8080");
	SmartRoomSocket.onopen = function (event) {
	SmartRoomSocket.onmessage = function (event) {
		console.log(event.data);
		var JSONdata = JSON.parse(event.data);
		console.log(JSONdata)
		switch(JSONdata["topic"])
		{
			case "Neumann/SmartRoom/Livingroom/Temperature":
				console.log("rafut1");
				$("#hombent").text(JSONdata["message"]);
			break;
			case "Neumann/SmartRoom/Livingroom/Humidity":
			console.log("rafut2");
				$("#parabent").text(JSONdata["message"]);
			break;
			case "Neumann/SmartRoom/Frontyard/Temperature":
				$("#homkint").text(JSONdata["message"]);
			break;
			case "Neumann/SmartRoom/Frontyard/Humidity":
				$("#parakint").text(JSONdata["message"]);
			break;
			case "Neumann/SmartRoom/Livingroom/Smoke":
				if(JSONdata["message"]==0)
				{
					$("#co2").text("Normál");
				}else{
					$("#co2").text("Veszélyes");
				}
			break;
			case "Neumann/SmartRoom/Frontyard/Grass":
				if(JSONdata["message"]==0)
				{
					$("#foldn").text("Száraz");
				}else{
					$("#foldn").text("Nedves");
				}
			break;
			case "Neumann/SmartRoom/Frontyard/Rain":
				if(JSONdata["message"]==0)
				{
					$("#eso").text("Nem");
				}else{
					$("#eso").text("Igen");
				}
			break;
			case "Neumann/SmartRoom/Frontyard/Grass":
				if(JSONdata["message"]==0)
				{
					$("#foldn").text("Száraz");
				}else{
					$("#foldn").text("Nedves");
				}
			break;
			case "Neumann/SmartRoom/Livingroom/Motion":
				if(JSONdata["message"]==0)
				{
					$("#move").attr("src","stop.png");
				}else{
					$("#move").attr("src","move.png");
				}
			break;
			default:
				console.log(event.data)
			break;
			
			
		}


	}
};

	var hangulatWrapper = $("#hangulat-wrapper");
	hangulatWrapper.find("input").on('change', function() {
		var inputvalue=$(this).val();
		$("#hangulat").attr("src",inputvalue + ".png");
		
		if(inputvalue=="piros"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#ff0000");
		}
		if(inputvalue=="zold"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#00ff00");
		}
		if(inputvalue=="kek"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#0000ff");
		}
		if(inputvalue=="nincs"){
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/Mood;" + "#000000");
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

	$(".switch").on("change", function() {
		var inputvalue=$(this).val();
		var allas=0;
		if ($(this).is(":checked")) {
			allas=1;
		}
		console.log(inputvalue,allas);
		 SmartRoomSocket.send(inputvalue +allas); 
	});;
	
	$("#plus").on("click", function(){
		var ertek= parseInt($("#futertek").text());
		if(ertek<30){
			$("#futertek").text(ertek+1);
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/heater; "+(ertek+1)); 
		}else
		alert("nem lehet feljebb menni!");
	});;
	
	$("#minus").on("click", function(){ 
		var ertek= parseInt($("#futertek").text());
		if(ertek>10){
			$("#futertek").text(ertek-1);
			SmartRoomSocket.send("Neumann/SmartRoom/Livingroom/heater; "+(ertek-1)); 
		}else
		alert("nem lehet lejebb menni!");
		
			
	});;
	
    

	//192.168.10.110
});