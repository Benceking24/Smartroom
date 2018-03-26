$( document ).ready(function() {

	var SmartRoomSocket = new WebSocket("ws://raspberrypi.local:8080/");
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
                $("#futes").text(Math.floor(JSONdata["message"]));
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
                
            case "Neumann/SmartRoom/Livingroom/Lamp/1":
                if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Lamp/1").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Lamp/1").checked = false;
				}
            case "Neumann/SmartRoom/Livingroom/Lamp/2":
				if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Lamp/2").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Lamp/2").checked = false;
				}
			     break;
            case "Neumann/SmartRoom/Livingroom/Heater":
				if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Heater").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Heater").checked = false;
				}
			     break;
            case "Neumann/SmartRoom/Livingroom/Cooler":
				if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Cooler").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Cooler").checked = false;
				}
			     break;
            case "Neumann/SmartRoom/Livingroom/Window":
				if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Window").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Window").checked = false;
				}
			     break;  
            case "Neumann/SmartRoom/Livingroom/Sprinkler":
				if(JSONdata["message"]==true){
                    document.getElementById("Neumann/SmartRoom/Livingroom/Sprinkler").checked = true;
				}
                else{
                    document.getElementById("Neumann/SmartRoom/Livingroom/Sprinkler").checked = false;
				}
			     break;
            case "Neumann/SmartRoom/Livingroom/Shades":
				if(JSONdata["message"]>=0 && JSONdata["message"]<=100){
                    switch(JSONdata["message"]){
                        case 0:
                                document.getElementById("fent").checked = true;
                                document.getElementById("redbelul").style = "height: 0px";
                            break;
                        case 50:
                                document.getElementById("kozep").checked = true;
                                document.getElementById("redbelul").style = "height: 75px";
                            break;
                        case 100:
                                document.getElementById("lent").checked = true;
                                document.getElementById("redbelul").style = "height: 145px";
                            break;
                        default:
                            break;
                    }
				}
                break;
            case "Neumann/SmartRoom/Livingroom/Mood":
                    //0 kikapcsolva, 1 piros, 2 zöld, 3 kék
                if(JSONdata["message"]>=0 && JSONdata["message"]<=3){
                    switch(JSONdata["message"]){
                        case 0:
                                document.getElementById("none").checked = true;
                                document.getElementById("hangulat").src="nincs.png";
                            break;
                        case 1:
                                document.getElementById("redBox").checked = true;
                                document.getElementById("hangulat").src="piros.png";
                            break;
                        case 2:
                                document.getElementById("greenBox").checked = true;
                                document.getElementById("hangulat").src="zold.png";
                            break;
                        case 3:
                                document.getElementById("blueBox").checked = true;
                                document.getElementById("hangulat").src="kek.png";
                            break;
                        default:
                            break;
                  }
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
});