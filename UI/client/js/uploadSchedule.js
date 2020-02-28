count=1;
count1=1;


function addRow() {
    var inparr=document.getElementById("ip"+count);
    inparr.setAttribute('disabled','disabled');
    var inparr1=document.getElementById("ipc"+count);
    inparr1.setAttribute('disabled','disabled');
    
    var inpsarr=document.getElementsByClassName("ips"+count);
    for(var i=0;i<inpsarr.length;i++){
        inpsarr[i].setAttribute('disabled','disabled');
    }

    var timeslot = document.getElementsByClassName("timeslot"+count);
    for(var i=0;i<timeslot.length;i++){
        timeslot[i].setAttribute('disabled','disabled');
    }
    
    var athome = document.getElementsByClassName("athome"+count);
    for(var i=0;i<athome.length;i++){
        athome[i].setAttribute('disabled','disabled');
    }
    
    var atdc = document.getElementsByClassName("atdc"+count);
    for(var i=0;i<atdc.length;i++){
        atdc[i].setAttribute('disabled','disabled');
    }
    
    document.getElementById("btn"+count).disabled=true;

    

    count=count+1;
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0); 
    var cell3 = row.insertCell(1); 
    var cell4 = row.insertCell(2); 
    var cell5 = row.insertCell(3); 
    var cell6=row.insertCell(4);
    var cell7=row.insertCell(5);

    count1=count1+1;
    cell4.setAttribute("id","slot"+count1);
    cell5.setAttribute("id", "day"+count1);
    cell6.setAttribute("id", "home"+count1);
    cell7.setAttribute("id", "dc"+count1);
    
    

    cell1.innerHTML="<select name='name' style='width: 170px;' onchange='getCost(this.value)' id='ip"+count+"'></select>";
    cell3.innerHTML="<input type='TEXT' NAME='cost' SIZE='20'id='ipc"+count+"'></input>";
    cell4.innerHTML="<select name='slot' style='width: 130px;' class='timeslot"+count+"'><option>07:00-08:00</option><option>08:00-09:00</option><option>09:00-10:00</option><option>10:00-11:00</option><option>11:00-12:00</option><option>12:00-13:00</option><option>13:00-14:00</option><option>14:00-15:00</optio><option>15:00-16:00</option><option>16:00-17:00</option><option>17:00-18:00</option><option>18:00-19:00</option></select><input type='button' value='Add Slot' onclick=addSlot() id='btn"+count+"'>";
    cell5.innerHTML="<select name='day' style='width: 170px;' class='ips"+count+"'><option value='today'>Today</option><option value='tomorrow'>Tomorrow</option><option value='day-after'>Day-after</option></select>";
    cell6.innerHTML="<select name='at home' style='width: 170px;' class='athome"+count+"'><option>None</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";
    cell7.innerHTML="<select name='at dc' style='width: 170px;' class='atdc"+count+"'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";

    getTests();
    updateDB();
}

function addSlot(){
    var timeslot =document.getElementById("slot"+count);
    var athome = document.getElementById("home"+count);
    var atdc = document.getElementById("dc"+count);
    var day = document.getElementById("day"+count);

    day.innerHTML      += "<br><select name='day' style='width: 170px;' class='ips"+count+"'><option value='today'>Today</option><option value='tomorrow'>Tomorrow</option><option value='day-after'>Day-after</option></select>";
    timeslot.innerHTML += "<br><select name='slot' class='timeslot"+count+"' style='width: 130px;'><option>07:00-08:00</option><option>08:00-09:00</option><option>09:00-10:00</option><option>10:00-11:00</option><option>11:00-12:00</option><option>12:00-13:00</option><option>13:00-14:00</option><option>14:00-15:00</optio><option>15:00-16:00</option><option>16:00-17:00</option><option>17:00-18:00</option><option>18:00-19:00</option></select>"
    athome.innerHTML   += "<br><select name='at home' style='width: 170px;' class='athome"+count+"'><option>None</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";
    atdc.innerHTML     += "<br><select name='at dc' style='width: 170px;' class='atdc"+count+"'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>";
}

function getCost(e){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var res=JSON.parse(this.responseText);
            var costarea=document.getElementById('ipc'+count);
            costarea.value=res;
        }
    };
    var dc = sessionStorage.getItem("dc_name");
    
    xhr.open("GET","http://127.0.0.1:5050/uploadSchedule/"+dc+"/"+e,true);
    xhr.send();
}

function getTests(){

    var xhr = new XMLHttpRequest();
    var dc = sessionStorage.getItem("dc_name");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            var res=JSON.parse(this.responseText);
            var dropdown = document.getElementById('ip'+count);

            for(var i=0;i<res['tests'].length;i++){
                var option = document.createElement("option");
                option.text = res["tests"][i];
                dropdown.appendChild(option);                   
            }
        }
    };
    xhr.open("GET","http://127.0.0.1:5050/uploadSchedule/"+dc,true);
    xhr.send();
}
        

function updateDB() {
    var testname = document.getElementById("ip"+(count-1));
    testname = testname.options[testname.selectedIndex].innerHTML;
    
    var timeslots = document.getElementsByClassName("timeslot"+(count-1));
    var athome = document.getElementsByClassName("athome"+(count-1));
    var atdc = document.getElementsByClassName("atdc"+(count-1));

    var timeslots_final = new Array();
    days = {"Today": new Array(), "Tomorrow": new Array(), "Day-after": new Array()};
    count_day = 0;

    for (var i = 0; i < timeslots.length; i++) {
        var timeslots_inter = new Array();
        var timeslotval = timeslots[i].options[timeslots[i].selectedIndex].innerHTML;

        var athomeval = athome[i].options[athome[i].selectedIndex].innerHTML;
        var atdcval = atdc[i].options[atdc[i].selectedIndex].innerHTML;
        
        if (count_day == 0) {
            days["Today"].push(athomeval);
            days["Today"].push(atdcval);
        }

        if (count_day == 1) {
            days["Tomorrow"].push(athomeval);
            days["Tomorrow"].push(atdcval);
        }

        if (count_day == 2) {
            days["Day-after"].push(athomeval);
            days["Day-after"].push(atdcval);
        }
        
        count_day = count_day + 1;

        if ((i+1)%3 == 0) {
            timeslots_inter.push(timeslotval);
            timeslots_inter.push(days["Today"]);
            timeslots_inter.push(days["Tomorrow"]);
            timeslots_inter.push(days["Day-after"]);            
            timeslots_final.push(timeslots_inter);
        }
        
    }
    var dc_name = sessionStorage.getItem("dc_name");
    var data = '{"finalinsertion" : "'+ timeslots_final +'", "dc_name": "' + dc_name + '", "testname": "' + testname + '"}';
    xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            if(this.responseText == "1") {
                alert("Successfully added "+testname);
            }
        }
    };
    xhr1.open("POST", "http://localhost:5050/addToDB", true);
    xhr1.setRequestHeader("Content-type", "application/json");
    xhr1.setRequestHeader("Authorization", "Basic a2Vyb==");
    xhr1.send(data);
    console.log(data);

    var submitbtn = document.getElementById("submitbtn");
    submitbtn.onclick = function() {
        window.location.href = "index.html#schedule";
    }
}
window.onload=getTests();