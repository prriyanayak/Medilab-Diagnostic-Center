var obj2 = {
    xhr: new XMLHttpRequest(),
    login: function() {
        var email = document.getElementById("email").value;
        var pwd = document.getElementById("password").value;
        this.xhr.onreadystatechange = this.success;
        this.xhr.open("POST", "http://127.0.0.1:5050/login", true);
        this.xhr.setRequestHeader("Content-type", "application/json");
        this.xhr.setRequestHeader("Authorization", "Basic a2Vyb==");
        var data = '{"email" : "' + email + '", "password": "'+ pwd +'"}';
        this.xhr.send(data);
    },
    success: function() {
        if(this.readyState == 4 && this.status == 200) {
            if(this.responseText != "0") {
                var dc = JSON.parse(this.responseText);
                sessionStorage.setItem("dc_name", dc['name']);
                window.location.href = "index.html";
            }
            else {
                alert("Login Unsuccessful");
            }
        }
    }
}