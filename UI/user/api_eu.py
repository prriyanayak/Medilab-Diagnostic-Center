from pymongo import MongoClient 
from datetime import datetime, date
from werkzeug.utils import secure_filename
from flask import Flask, flash, request, redirect, url_for, jsonify, json, Response
import requests
import datetime
from flask_cors import CORS, cross_origin
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
from email import encoders 


adminAddress = "nayakpriya98@gmail.com"

def sendReport(parameterDict):
    msg = MIMEMultipart() 

    msg['From'] = parameterDict['adminAddress'] 
    msg['To'] = parameterDict['userEmail']
    msg['Subject'] = "Booking Confirmation"

    
    body = "Dear "+ parameterDict['userName']+",\n\nThis email is to confirm your booking for "+parameterDict['test']+" test at "+parameterDict['centre']+" "+parameterDict['day']+".\nFor more information on your report, please contact us on our site.\n\nWarm Regards,\nMedilab"
    

    msg.attach(MIMEText(body, 'plain'))
    s = smtplib.SMTP('smtp.gmail.com', 587) 
    s.starttls() 
    s.login(parameterDict['adminAddress'], "lbeupuwzwmchfigw") 
    text = msg.as_string() 
    
    try:
        s.sendmail(parameterDict["adminAddress"], parameterDict["userEmail"], text) 
        s.quit() 
        return 1
    except:
        return 0

try:
    client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true") 
    print("connection successfull!")

except:
    print("connection not established")

db = client.get_database('DCCMS_SE')
record = db['Diagnostic Centres']
book = db['Bookings']
diagnosticCentre = ""
u = db['Users']

user_id = 6
app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/login/<string:email>/<string:pwd>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def login(email,pwd):
   if(request.method == 'POST'):
       
       x = list(u.find({"email":email,"password":pwd}))
       print(x)
       if(len(x) == 0):
           print("empty")
           if(request.is_json):
               return jsonify({}),400
           else:
               return jsonify(status = "Wrong Email or Password")
       else:
           for i in x:
                del i["_id"]
           return jsonify(status = "Correct credentials", x=x), 200
   else:
       return jsonify({}),405

@app.route("/getClients")
@cross_origin(supports_credentials=True)
def getClientList():
    col = db["Diagnostic Centres"]
    x = col.find()
    finalRet = {"names": []}
    for doc in x:
        finalRet["names"].append(doc["name"])
    return finalRet, 200
    


@app.route('/register/<string:fname>/<string:email>/<string:pwd>/<string:phone>/<string:age>/<string:address>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def register(fname, email, pwd, phone, age, address):
   if(request.method == 'POST'):
       global user_id
       user_id+=1
       data = request.get_json()
       # print(fname, email, pwd, phone, age, address)
       # age = int(age)
       print(user_id)
       print(age)
       age = int(age)
       x = list(u.find({"email":email}))
       data = {"fname": fname, "email": email,"password": pwd,"phone": phone,"age" : age,"address" : address,"user_id" : user_id} 
       print(data)
       #y = list(record.find({"email":data}))
       print(x)
       if(len(x) != 0):
           print("user already exists")
           if(request.is_json):
               return jsonify({}),400
           else:
               return jsonify(status = "User Already Exists")
       else:
            u.insert_one(data)
            return jsonify(status = "Registered!"), 200
   else:
       return jsonify({}),405

@app.route('/location/<string:loc>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def location(loc):
    if(request.method == 'GET'):
        print(loc)
        centers=[]
        x = list(record.find({"address":loc}))
        if(len(x) == 0):
            print("empty")
            if(request.is_json):
                return jsonify({}),400
            else:
                return jsonify(status = "Wrong Location")
        else:
            for i in x:
                # centers.append(i["name"])
                del i['_id']
            return json.dumps(x), 200
    else:
        return jsonify({}),405

@app.route('/diacen/<string:dc>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def diaCentre(dc):
    global diagnosticCentre
    if(request.method == 'GET'):
        diagnosticCentre = dc
        print(diagnosticCentre)
        rec = db[dc]
        x = list(rec.find())
        if(len(x) == 0):
            print("empty")
            if(request.is_json):
                return jsonify({}),400
            else:
                return jsonify(status = "Diagnostic Centre doesn't EXIST!")
        else:
            for i in x:
                del i["_id"]
            return json.dumps(x), 200
    else:
        return jsonify({}),405

@app.route('/diacen/<string:loc>/<string:test>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def filterByTest(loc,test):
    if(request.method == 'GET'):
        testCentres=[]
        centers = list(record.find({"address":loc}))
        print(centers)
        for i in centers:
            print(i['name'])
            rec = db[i['name']]
            res = list(rec.find({"name":test}))
            print("res: ",res)
            if(len(res)!=0):
                for i in res:
                    del i["_id"]
                testCentres.append(res)
        print(testCentres)
        if(len(testCentres)!=0):
            return json.dumps(testCentres), 200 
        else:
            if(request.is_json):
                return jsonify({}),400
            else:
                return jsonify(status = "No centres perform this test near you :(")
    else:
        return jsonify({}),405  


@app.route('/diacen/<string:slot>/<string:centre>/<string:test>/<string:userID>/<int:day>/<string:atHome>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def bookSlot(slot,centre,test,userID,day,atHome):
    if(request.method == 'POST'):
        diaCen = db[centre]
        x = list(diaCen.find({"name":test}))
        if( day == 1):
            d = 'Today'
        elif( day == 2):
            d = 'Tomorrow'
        else:
            d = 'Day After'
        for i in x:
            rec = list(i['time slots'])
            for j in range(0,len(rec)):
                if(rec[j][0]==slot):
                    print("j[0]",rec[j][0])
                    print("slot",slot)
                    if(atHome=='Yes'):
                        if(rec[j][day][0] == None):
                            return jsonify(status = "At home not available")
                        else:
                            if(rec[j][day][0]!=0): #if no.of appointments at home is not 0 for this day 
                                print("before booking",rec[j][day][0])
                                rec[j][day][0]-=1
                                diaCen.update({"name":test},{'$set':{'time slots.'+str(j)+'.'+str(day)+'.0':rec[j][day][0]}})
                                print("after booking",rec[j][day][0])
                                user_id = book.insert_one({'userID' : userID, 'centre' : centre, 'test' : test, 'time slot' : slot, 'At home': 'Yes', 'Day': d})
                                break
                            else:
                                return jsonify(status = "Please try other slots")
                    else:
                        if(rec[j][day][1]!=0): #if no.of appointments at home is not 0 for this day 
                            print("before booking",rec[j][day][1])
                            rec[j][day][1]-=1
                            diaCen.update({"name":test},{'$set':{'time slots.'+str(j)+'.'+str(day)+'.1':rec[j][day][1]}})
                            print("after booking",rec[j][day][1])
                            user_id = book.insert_one({'userID' : userID, 'centre' : centre, 'test' : test, 'time slot' : slot, 'At home': 'No', 'Day': d})
                            break
                        else:
                            return jsonify(status = "Please try other slots")
        l = u.find_one({"user_id" : userID})
        parameterDict = { 'adminAddress': 'nayakpriya98@gmail.com', 'userEmail': l['email'], 'userName': l['fname'], 'test': test, 'centre': centre, 'day':d} 
        sendReport(parameterDict)
        return jsonify({}),200
    else:
        return jsonify({}),405

@app.route('/diacen/<string:userID>/<string:centre>/<string:test>/<string:day>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def cancelSlot(userID, centre, test, day):
    if(request.method == 'POST'):
        rec = book.find_one({'userID' : userID, 'centre' : centre, 'test' : test, 'Day' : day })
        print("Rec is", rec)
        if(rec['At home']=="Yes"):
            index = 0
        else:
            index = 1
        if(day == "Today"):
            day = 1
        elif(day == "Tomorrow"):
            day = 2
        else:
            day = 3
        if(rec):
            ts = rec['time slot']
            
            start = int(str(ts[:2])+str(ts[3:5]))
            print("start",start)
            curr = "13:00:56"
            # curr = str(datetime.datetime.now().time())
            print("now",curr)
            curr = int(str(curr[:2])+str(curr[3:5]))
            print("curr",curr)
            diff = curr - start
            print(diff)
            # if(diff >= 0):
            if(diff >= 600): #1080 is 18 hours in minutes
                # status_msg = "You can only cancel minimum 18 hours prior to appointment"
                # return jsonify({"result":status_msg}),200
                return "0", 200
            else:
                book.delete_one({"userID" : userID, "centre": centre})
                #now update the appointments in centre 
                cen = db[centre]
                x = cen.find_one({"name": test})
                rec = x['time slots']
                print("rec is",rec)
                for j in range(0,len(rec)):
                    if(rec[j][0]==ts):
                        cen.update({"name":test},{'$set':{'time slots.'+str(j)+'.'+str(day)+'.'+str(index):(rec[j][day][index]+1)}})
                return "1", 200
                # status_msg ="Deleted appointment "
                # return jsonify({"result":status_msg}),200
        else:
            return Response(status=400)

    else:
        return jsonify({}),405

@app.route('/viewbookings/<string:userID>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def viewBookings(userID):
    print(request.method)
    if(request.method == 'GET'):
        # print(userID)
        print("view")
        print(userID)
        rec = list(book.find({'userID' : userID}))
        print(rec)
        if(len(rec)!=0):
            for i in rec:
                del i["_id"]
            return json.dumps(rec), 200 
        else:
            return jsonify(status = "No appointments yet!")


if(__name__ == "__main__"):
    app.run(debug=True)