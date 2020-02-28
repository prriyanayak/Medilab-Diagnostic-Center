//var user_id = 6;

function authenticate() {
	var email = document.getElementById("email");
	var pass = document.getElementById("password");
	if(email.value != "" || pass.value != ""){
		console.log(email.value);
		console.log(pass.value);
		xhr = new XMLHttpRequest();
		xhr.onreadystatechange = this.confirmAuthenticate;
		xhr.open("POST", "http://localhost:5000/login/"+email.value+"/"+pass.value, true);
		xhr.send();
	}
}

function confirmAuthenticate()
{
	if(this.readyState==4 && this.status==200){
		message = JSON.parse(this.responseText);
		console.log(message)
		if(message["status"]=="Correct credentials"){
			sessionStorage.setItem("fname",message["x"][0]["fname"]);
			sessionStorage.setItem("u_id",message["x"][0]["user_id"]);
			window.location.replace("booking.html")
		}
		else{
			d = document.getElementById("message");
			d.innerHTML = "Wrong credentials"
		}
		
	}	   
}


function populate()
{
	var user_id = 6;
	var fname = document.getElementById("name");
	var email = document.getElementById("email");
	var pass = document.getElementById("password");
	var number = document.getElementById("number");
	var age = document.getElementById("age");
	var address = document.getElementById("address");
	if(fname.value != "" || email.value != "" || pass.value != "" || number.value != "" || age.value != "" || address.value != ""){
		xhr = new XMLHttpRequest();
		console.log(address.value)
		// sessionStorage.setItem("addr",JSON.stringify(address.value))
		xhr.onreadystatechange = this.confirmRegistration;
		xhr.open("POST", "http://localhost:5000/register/"+fname.value+"/"+email.value+"/"+pass.value+"/"+number.value+"/"+age.value+"/"+address.value, true);
		xhr.send();
	}
}

function confirmRegistration()
{
	if(this.readyState==4 && this.status==200){
		message = JSON.parse(this.responseText);
		console.log(message)
		if(message["status"]=="User Already Exists"){
			d = document.getElementById("message");
			d.innerHTML = "User Already Exists"
			
		}
		else{
			// alert("wrong credentials")
			window.location.replace("login.html")
		}
	}	
}