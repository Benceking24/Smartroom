function hangulatvil()
{
	var kep= document.getElementById("hangulat");
	
	if(document.getElementById("red").checked)
	{
		kep.src="piros.png"
	}
	if(document.getElementById("blue").checked)
	{
		kep.src="kek.png"
	}
	if(document.getElementById("green").checked)
	{
		kep.src="zold.png"
	}
	if(document.getElementById("none").checked)
	{
		kep.src="nincs.png"
	}
}
function redony()
{
	var red= document.getElementById("redbelul");
	
	if(document.getElementById("fent").checked)
	{
		red.style.display="none";
	}
	if(document.getElementById("kozep").checked)
	{
		red.style.height="75px";
		red.style.display="block";
	}
	if(document.getElementById("lent").checked)
	{
		red.style.height="145px";
		red.style.display="block";
	}
	
}