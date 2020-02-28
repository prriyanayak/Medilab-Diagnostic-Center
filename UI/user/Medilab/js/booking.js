function sendLocation() {
	loc = document.getElementById("Location");
	if(loc.value != ""){
		// console.log(loc.value);
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = this.displayDiacen;
		xhr.open("GET", "http://localhost:5000/location/"+loc.value, true);
		xhr.send();
	}
}

function displayDiacen() {
	if(this.readyState==4 && this.status==200){
		message = JSON.parse(this.responseText);
		// console.log(message)
		sessionStorage.setItem("centres",JSON.stringify(message));
		window.location.replace("diacen.html");
	}	   
}

function makeappointment(){
	// alert("make appointment")
	d = document.getElementById("makeappointment")
	d.style.display = "block"
	d = document.getElementById("viewappointments")
	d.style.display = "none"
}


function displayAppointments(){
	// alert("view");
	d = document.getElementById("viewappointments")
	d.style.display = "block"
	d = document.getElementById("makeappointment")
	d.style.display = "none"
	u_id = sessionStorage.getItem("u_id");
	// alert(u_id)
	// alert(typeof(u_id))
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = this.viewBooking;
	xhr.open("GET","http://localhost:5000/viewbookings/"+u_id, true);
	xhr.send();
}

function viewBooking(){
	if(this.readyState==4 && this.status==200){
		// alert("viewBookings")
		d1 = document.getElementById("l")
		message = JSON.parse(this.responseText);
		n = message.length;
		// console.log(message)
		for(i=0; i<n; i++){
			console.log(message[i]["At home"])
			row = document.createElement("tr");
			d = document.createElement("div")
			key = Object.keys(message[i])
			// console.log(key)
			n1 = key.length
			// d.innerHTML = message[i][key[2]] + "&nbsp;&nbsp;&nbsp;" + message[i][key[3]] + "&nbsp;&nbsp;&nbsp;" + message[i][key[4]]
			// d1.appendChild(d)
			data = document.createElement("td");
			data.setAttribute("class",JSON.stringify(i))
			data.innerHTML = message[i][key[2]];    //centre
			row.appendChild(data) 

			data = document.createElement("td");
			data.setAttribute("class",JSON.stringify(i))
			data.innerHTML = message[i][key[3]];    //test
			row.appendChild(data)

			data = document.createElement("td");
			data.setAttribute("class",JSON.stringify(i))
			data.innerHTML = message[i][key[4]];    //timeslot
			row.appendChild(data)

			data = document.createElement("td");
			data.setAttribute("class",JSON.stringify(i))
			data.innerHTML = message[i][key[1]];    //day
			row.appendChild(data)

			data = document.createElement("td");
			data.innerHTML = "<input type = \"button\" class=\"btn btn-form\" value=\"Cancel\" onclick=\"cancelSlot(this.id)\" id="+JSON.stringify(i)+">"
			row.appendChild(data)

			d1.appendChild(row)
		}
	}
}

function cancelSlot(id_ele){
	// console.log(id_ele);
	d = document.getElementsByClassName(id_ele)
	// console.log(d[0])
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = this.cancel;
	u_id = sessionStorage.getItem("u_id")
	xhr.open("POST","http://localhost:5000/diacen/"+u_id+"/"+d[0].innerHTML+"/"+d[1].innerHTML+"/"+d[3].innerHTML, true);
	xhr.send();
}

function cancel(){
	if(this.readyState==4 && this.status==200){
		if (this.responseText == "0") {
			alert("You can only cancel minimum 18 hours prior to appointment");
		}
		else {
			alert("Appointment is cancelled");
		}
	}
}

function displayFname()
{
	// alert("hi")
    document.getElementById("Hitext").innerHTML = "Hi, "+ sessionStorage.getItem('fname');  
}
window.onload = displayFname();