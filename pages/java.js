$( document ).ready(function() {

	var SmartRoomSocket = new WebSocket("ws://192.168.10.110:8080");
	SmartRoomSocket.onopen = function (event) {
	
};

	var hangulatWrapper = $("#hangulat-wrapper");
	hangulatWrapper.find("input").on('change', function() {
		var inputvalue=$(this).val();
		$("#hangulat").attr("src",inputvalue + ".png");
	});;
	
	var redonyWrapper=$("#redony");
	redonyWrapper.find("input").on('change', function() {
		var inputvalue=$(this).val();
		$("#redbelul").height(inputvalue);
	});;

	$(".switch").on('change', function() {
		var inputvalue=$(this).val();
		var allas=0;
		if ($(this).is(':checked')) {
			allas=1;
		}
		console.log(inputvalue,allas);
		 martRoomSocket.send(inputvalue +allas); 
	});;
	
	//192.168.10.110
});