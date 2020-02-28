function myfunc(mySelect) {
    var selectedtest=mySelect.options[mySelect.selectedIndex].innerHTML;
    document.getElementById("mySelect2").style.display="block";
    document.getElementById("insert").innerHTML=selectedtest;
    getNames(selectedtest);
}

function myfunc2(mySelect2) {
    var selectedname=mySelect2.options[mySelect2.selectedIndex].innerHTML;
    document.getElementById("name").innerHTML=selectedname;
    getage(selectedname);
}
  
  
function getage(selectedname){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res=this.responseText;
            res = JSON.parse(res);
            d = document.getElementById('age');
            d.innerHTML = res;
        }
    };
    xhr.open("GET","http://127.0.0.1:5050/uploadReport/age/"+selectedname,true);
    xhr.send();
}

function getTests(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var res=this.responseText;
            res = JSON.parse(res);
            var dropdown=document.getElementById('mySelect');
        
            for(var i=0;i<res['tests'].length;i++){
                var option = document.createElement("option");
                option.text = res["tests"][i];
                dropdown.appendChild(option);                   
            }
        }
    };
    var dc_name = sessionStorage.getItem("dc_name");
    xhr.open("GET","http://127.0.0.1:5050/uploadReport/"+dc_name,true);
    xhr.send();
}
function getNames(selectedtest){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert("hello");
            var res=this.responseText;
            res = JSON.parse(res);
            //console.log(res);
            key = Object.keys(res)
            //console.log(key)
            var dropdown=document.getElementById('mySelect2');
            for(var i=0;i<key.length;i++){
                var option = document.createElement("option");
                option.text = key[i];
                //option.value = res["tests"][i];
                //alert(res["tests"][i]);
                dropdown.appendChild(option);                   
            }
            
        }
    };
    var dc_name = sessionStorage.getItem("dc_name");
    xhr.open("GET","http://127.0.0.1:5050/uploadReport/"+dc_name+"/"+selectedtest,true);
    xhr.send();
}
window.onload=getTests()

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("mysubmit");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}