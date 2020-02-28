var obj1 = {
    xhr: new XMLHttpRequest(),
    populate: function() {
        this.xhr.onreadystatechange = this.getDCNames;
        this.xhr.open("GET", "http://127.0.0.1:5050/getNames", true);
        this.xhr.setRequestHeader("Authorization", "Basic a2Vyb==");
        this.xhr.send();
    },
    getDCNames: function() {
        if(this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            // console.log(res);
            var select = document.getElementById('dc_name');
            for(var i = 0; i < res['names'].length; i++) {
                var option = document.createElement('option');
                option.text = res['names'][i];
                select.appendChild(option);
            }
        }
    },
    addToDB: function() {
        
        var fullname = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        var conf_pwd = document.getElementById("conf_password").value;
        var dc_name = document.getElementById("dc_name").value;
        
        if (password == conf_pwd) {
            this.xhr.onreadystatechange = this.addDetails;
            this.xhr.open("POST", "http://127.0.0.1:5050/addDetails", true);
            this.xhr.setRequestHeader("Content-type", "application/json");
            this.xhr.setRequestHeader("Authorization", "Basic a2Vyb==");
            var parameters = '{"fullname": "' + fullname + '", "email": "'+ email + '", "password": "' + password + '", "dc_name": "' + dc_name +'"}';
            console.log(parameters);
            this.xhr.send(parameters);
        }
        else {
            alert("Passwords don't match! Register again");
        }
    },
    addDetails: function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                alert("Registration Successful!");
                window.location.href = "login.html";
            }
            else {
                alert("Could not register. Try again!");
            }
        }
    }
}