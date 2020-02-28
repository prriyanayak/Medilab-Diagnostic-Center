function display() {
	d = document.getElementById("l");
	res = JSON.parse(sessionStorage.getItem("centres"));
	n = res.length;
	// console.log(res);
	
	// lis.className = "form-control br-radius-zero";
	for(i=0; i<n; i++){
		d1 = document.createElement("div");
		
		// console.log(res[i])
		s = res[i]['name']
		about = res[i]['about us']
		//d1.addEventListener("mouseover",displayPopUp(about),true);
		d1.setAttribute("id",s);
		// d1.setAttribute("class","popup")
		s = JSON.stringify(s);
		d1.innerHTML = "<input type=\"checkbox\" name="+s+" value="+s+" id="+s+">"+JSON.parse(s)+"<br><br>";
        d1.setAttribute("id","dc");
		// console.log(d1.innerHTML);
		d.appendChild(d1);
	}
}

function sendDiacen(){
	dia=""
	input_obj=document.getElementsByTagName('input');
    for (i = 0; i < input_obj.length; i++) {
	    if (input_obj[i].type === 'checkbox' && input_obj[i].checked === true) {
	        dia = input_obj[i].value;
	        break;
	    	}
	}
    // console.log("dia: ",dia)
    sessionStorage.setItem("dia",JSON.stringify(dia));
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = this.displayDetails;
	xhr.open("GET", "http://localhost:5000/diacen/"+dia, true);
	xhr.send();
}


function displayDetails() {
	if(this.readyState==4 && this.status==200){
		message = JSON.parse(this.responseText);
		// console.log(message)
		sessionStorage.setItem("details",JSON.stringify(message));
		window.location.replace("details.html");
	}	   
}

function displayFname()
{
	// alert("hi")
    document.getElementById("Hitext").innerHTML = "Hi, "+ sessionStorage.getItem('fname');  
}
window.onload = displayFname();
window.onload = display();