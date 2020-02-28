function getDCName() {		
    var name = sessionStorage.getItem("dc_name");
    var h2 = document.getElementById("dc");
    h2.innerText = "Hi, "+ name;
}

function sendToDB() {
    var name = document.getElementById("name").value;
    var dc = sessionStorage.getItem("dc_name");
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    data = '{"name": "' + name + '", "dc_name": "' + dc + '", "email": "' + email + '", "subject": "' + subject + '", "message": "' + message + '"}';
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = sendDetails();
    xhr.open("POST", "http://127.0.0.1:5050/sendFeedback", true);
    xhr.send(data);
}

function sendDetails() {
    if (this.readyState == 4 && this.status == 200) {
        if (this.responseText == "1") {
            alert("Feedback Sent! :) We'll be in touch!");
        }
        else {
            alert("Feedback not sent! :( Try again.")
        }
    }
}