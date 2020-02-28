function display() {
	console.log("details")
	d = document.getElementById("l");
	res = JSON.parse(sessionStorage.getItem("details"));
	n = res.length;
	for(i=0; i<n; i++){
		row = document.createElement("tr");
		// row.setAttribute("id",res[i][0])

		key=Object.keys(res[i]);
		n1 = key.length;
		// console.log(key);
		// console.log(res[i][key[2]]);
		s = res[i][key[2]]
		// row.setAttribute("id",res[i][key[2]])
		for(j=0; j<=n1; j++){
			// console.log(res[i][key[j]]);
			data = document.createElement("td");
			if(j==(n1-1)){
				// console.log(res[i][key[j]].length,res[i][key[j]]);
				// data.setAttribute("style","{display:none}")
				data.style.display = "none"
				data.setAttribute("id",JSON.stringify(s)+" time")
				if(res[i][key[j]]!="NULL"){
					// console.log("in")
					tab = document.createElement("table");
					
					for(k=0; k<res[i][key[j]].length; k++){
						rt = document.createElement("tr");
						dt = document.createElement("td");
						dt.innerHTML = res[i][key[j]][k][0];
						rt.appendChild(dt);
						tab.appendChild(rt);
					}
					data.appendChild(tab);
				}
				// continue;
			}
			else if(j==n1){
				
				// alert(s)
				data.innerHTML = "<input type = \"button\" class=\"btn btn-form\" value=\"Book\" onclick=\"bookapi(this.id)\" id="+JSON.stringify(s)+">"
			}
			else{
				data.innerHTML = res[i][key[j]];
			}
			row.appendChild(data);
		}
		d.appendChild(row);
	}
}

function bookapi(id_ele){
	// alert(id_ele);
	// console.log("id: ",id_ele);
	sessionStorage.setItem("test",JSON.stringify(id_ele))
	res = JSON.parse(sessionStorage.getItem("details"));
	n = res.length;
	ts = []
	for(i=0; i<n; i++){
		// console.log(res[i]["time slots"])
		if(id_ele == res[i]["name"]){   
			if(res[i]["at home"]=="No"){   //at home service not available
				sessionStorage.setItem("atHome","No")
				for(j=0; j < res[i]["time slots"].length; j++){
					ts.push(res[i]["time slots"][j]);
				}
				sessionStorage.setItem("timeslot",JSON.stringify(ts));
				// console.log(ts)
				
			}
			else{
				sessionStorage.setItem("atHome","Yes")
				for(j=0; j < res[i]["time slots"].length; j++){
					ts.push(res[i]["time slots"][j]);
				}
				// console.log(ts)
				sessionStorage.setItem("timeslot",JSON.stringify(ts));
				
			}
			break;  //after storing the test details
		}
		
	}

	window.location.replace("timeslots.html")
}

function displayFname()
{
	// alert("hi")
    document.getElementById("Hitext").innerHTML = "Hi, "+ sessionStorage.getItem('fname');  
}
window.onload = displayFname();
window.onload = display();