function mysubmit(){
    var x = document.getElementById("demo");
    x.style.display = "block";
}

var obj = {
    xhr: new XMLHttpRequest(),
    uploadReport: function() {
        var dcname = sessionStorage.getItem("dc_name");
        this.xhr.onreadystatechange = this.verifyOTP;

        
        this.xhr.open("POST", "http://127.0.0.1:5050/generateOTP", true);
        this.xhr.setRequestHeader("Content-type", "application/json");
        this.xhr.setRequestHeader("Authorization", "Basic a2Vyb==");
        var data = '{"name": "'+ dcname +'"}';
        this.xhr.send(data);
    },
    verifyOTP: function() {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);


            // creation of form with input and verify Button
            var div = document.getElementById("modal-con");
            var text = document.createElement("input");
            text.setAttribute("type", "text");
            text.setAttribute("id", "otpholder");

            
            var fileupload = document.getElementById("fileToUpload");
            
            fileupload.disabled = true;

            
            var btn = document.createElement("button");
            var br  = document.createElement("br");

            // console.log(text.innerHTML);
            // btn.setAttribute("id", "verify");
            btn.setAttribute("type", "button");
            btn.setAttribute("name", "Verify");
            btn.setAttribute("id", "verify");
            btn.innerHTML = "Verify";

            div.appendChild(br);
            div.appendChild(text);
            div.appendChild(btn);
            obj1.sendemail(res["OTP"]);
        }
    }
}

var obj1 = {
    xhr: new XMLHttpRequest(),
    sendemail: function(otprecvd) {
        var btn = document.getElementById("verify");
        var parentThis = this;
        btn.onclick = function() {
            
            var otpadd = document.getElementById("otpholder").value;
            
            if (otpadd == otprecvd) {
            
                var formdata = new FormData();
                var file = document.getElementById("fileToUpload").files[0];
                
                formdata.append("input1", file);
                var dcname = sessionStorage.getItem("dc_name");
                var test = document.getElementById("insert").innerHTML;
                var name = document.getElementById("name").innerHTML;
                
                parentThis.xhr.onreadystatechange = parentThis.sendReport;
                parentThis.xhr.open("POST", "http://127.0.0.1:5050/sendEmail/"+dcname+"/"+test+"/"+name, true);
                parentThis.xhr.send(formdata);
            }
        }
    },
    sendReport: function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "1") {
                alert("Email sent successfully");
                window.location.href = "index.html#report";
            }
            else 
                alert("Email not sent. Try again!");
        }
    }
}
