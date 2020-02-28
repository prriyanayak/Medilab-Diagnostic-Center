function display() {
	table = document.getElementById("l");
	res = JSON.parse(sessionStorage.getItem("timeslot"))
	// console.log(res);
	if(res == "NULL"){
		d.innerHTML="u can visit the diagnostic centre anytime between 6 am to 9 pm"
	}
	else{
		d1 = document.getElementById("tab");
		d1.innerHTML = "Time Slots Available are as follows"
		n = res.length;
		
		day = sessionStorage.getItem("day")

		if(day==1){
	        d = document.getElementById("Today");
	        d.style.backgroundColor = "white";
	        d.style.color = "black"
	        
	        d1 = document.getElementById("Tomorrow");
	       // console.log(d1.style.backgroundColor);
	        d1.style.backgroundColor = "#0CB8B6"
	        d1.style.color = "white"
	        
	        d2 = document.getElementById("Day After");
	       // console.log(d1.style.backgroundColor);
	        d2.style.backgroundColor = "#0CB8B6"
	        d2.style.color = "white"
		}
		else if(day==2){
	        
	        d = document.getElementById("Today");
	        d.style.backgroundColor = "#0CB8B6";
	        d.style.color = "white"
	        
	        d1 = document.getElementById("Tomorrow");
	        d1.style.backgroundColor = "white"
	        d1.style.color = "black"
	        
	        d2 = document.getElementById("Day After");
	        d2.style.backgroundColor = "#0CB8B6"
	        d2.style.color = "white"
		}
		else{
	        d = document.getElementById("Today");
	        d.style.backgroundColor = "#0CB8B6";
	        d.style.color = "white"
	        
	        d1 = document.getElementById("Tomorrow");
	        d1.style.backgroundColor = "#0CB8B6"
	        d1.style.color = "white"
	        
	        d2 = document.getElementById("Day After");
	        d2.style.backgroundColor = "white"
	        d2.style.color = "black"
	        
		}
		for(i=0; i<n; i++){
			// console.log(res[i][day][0],res[i][day][1])
			if((res[i][day][0]==0 || res[i][day][0]=="None") && res[i][day][1]==0 ){
				// console.log("true")
				continue;
			}
			else{
				// console.log("false")
				row = document.createElement("tr");
				data = document.createElement("td");
				s = res[i][0]
				data.setAttribute("id",s);
				s = JSON.stringify(s);
				data.innerHTML = "<input type=\"checkbox\" name="+s+" value="+s+">"+JSON.parse(s)
				// console.log(data.innerHTML)
				row.appendChild(data)

				data = document.createElement("td");
				s = res[i][day][0]
				data.setAttribute("id",s);
				s = JSON.stringify(s);
				if(s=="0" || JSON.parse(s)=="None"){
					data.innerHTML="";
				}
				else{
					data.innerHTML = "<input type=\"checkbox\" name=\"Yes\" value=\"Yes\">"+JSON.parse(s)
				}
				row.appendChild(data)


				data = document.createElement("td");
				s = res[i][day][1]
				data.setAttribute("id",s);
				s = JSON.stringify(s);
				if(s=="0"){
					data.innerHTML="";
				}
				else{
					data.innerHTML = "<input type=\"checkbox\" name=\"No\" value=\"No\">"+JSON.parse(s)
				}
				row.appendChild(data)

				table.appendChild(row)
			}
		}
	}
}

function sendTimeslot(){
	ts="";
	input_obj=document.getElementsByTagName('input');
	count=0
    for (i = 0; i < input_obj.length; i++) {
	    if (input_obj[i].type === 'checkbox' && input_obj[i].checked === true) {
	    	count = count +1
	    	if(count==1){
	    		ts = input_obj[i].value;

	    	}
	        if(count==2){
	        	sessionStorage.atHome = input_obj[i].value;
	        	break;
	        }
	    }
	}
    // console.log("ts: ",ts);
    xhr = new XMLHttpRequest();
	xhr.onreadystatechange = this.confirmBooking;
	centre = JSON.parse(sessionStorage.getItem("dia"));
	test = JSON.parse(sessionStorage.getItem("test"));
	day = JSON.parse(sessionStorage.getItem("day"))
	athome = sessionStorage.getItem("atHome")
	u_id = sessionStorage.getItem("u_id")
	xhr.open("POST", "http://localhost:5000/diacen/"+ts+"/"+centre+"/"+test+"/"+u_id+"/"+day+"/"+athome, true);
	xhr.send();
}

function confirmBooking(){
	if(this.readyState==4 && this.status==200){
		message = JSON.parse(this.responseText);
		// console.log(message)
		if(message["status"]=="Please try other slots"){
			alert("Please try other slots")
		}
		else if(message["status"]=="At home not available"){
			alert("At home not available")
		}
		else{
			alert("confirmed Booking")
			window.location.replace("booking.html")
		}
		
	}
}

function sendDay(day){
	if(day=="Today"){
		sessionStorage.setItem("day",JSON.stringify(1))
	}
	else if(day=="Tomorrow"){
		sessionStorage.setItem("day",JSON.stringify(2))
	}
	else{
		sessionStorage.setItem("day",JSON.stringify(3)) 
	}
	window.location.reload()
    
}
function displayFname()
{
	// alert("hi")
    document.getElementById("Hitext").innerHTML = "Hi, "+ sessionStorage.getItem('fname');  
}
window.onload = displayFname();
window.onload = display();