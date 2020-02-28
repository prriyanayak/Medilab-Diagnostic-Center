# connection  to MongoDB
from operator import itemgetter
from pymongo import MongoClient
import re
import json
import base64
import string
import binascii
import datetime

from flask import Flask, request, Response, abort, render_template, jsonify
from sendEmail import sendReport, sendOTP
from flask_cors import CORS, cross_origin
from random import randint

app = Flask(__name__)
CORS(app, support_credentials=True)

try: 
    client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true") 
    print("Connection established successfully!")
except:
    print("Connection not established!")
    exit(0)

db = client.get_database('DCCMS_SE')
record = db['Diagnostic Centres']

@app.route("/generateOTP", methods=["GET", "POST", "DELETE"])
@cross_origin(supports_credentials=True)
def genOTP():
    OTP = randint(1000, 9999)
    data = request.get_json()
    ret_val = {"OTP": OTP}
    col = db["DC Representatives"]
    rep = col.find_one({"dc_name": data['name']})
    repEmail = rep['email']
    adminAddress = "nayakpriya98@gmail.com"
    repName = rep['fullname']
    sendOTP(repEmail, adminAddress, repName, OTP)
    return ret_val, 200

@app.route("/sendEmail/<dcname>/<test>/<name>", methods=["GET", "POST", "DELETE", "OPTIONS"])
@cross_origin(supports_credentials=True)
def sendEmail(dcname, test, name):
    data = request.files
    app.logger.warning(data)
    for i in data.values():
        filename = i.filename
    
    # all this data is got from user db etc        
    col = db["Users"]
    app.logger.warning(name)
    email = col.find_one({"fname": name})
    email = email['email']
    app.logger.warning(email)
    parameterDict = {}
    parameterDict["patientEmail"] = email
    parameterDict["adminAddress"] = "nayakpriya98@gmail.com"
    parameterDict["patientName"]  = name
    parameterDict["test"]         = test
    parameterDict["filename"]     = filename
    parameterDict["dc_name"]      = dcname
    ret_val = sendReport(parameterDict)
    if (ret_val == 1):
        return "1", 200
    else:
        return "0", 200


@app.route("/getNames")
@cross_origin(supports_credentials=True)
def getDCNames():
    collection_name = db["Diagnostic Centres"]
    ret_val = {"names": []}
    for doc in collection_name.find():
        ret_val['names'].append(doc['name'])
    # app.logger.warning(ret_val)
    return ret_val, 200

@app.route("/addDetails", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def addDetailsToDB():
    data = request.get_json(force=True)
    # app.logger.warning(data)
    col = db['DC Representatives']
    if db.col.find_one({"dc_name" : data['dc_name']}) != None:
        app.logger.warning("Representative Exists")
        return "0", 200
    
    col.insert(data)
    return "1", 200


@app.route("/login", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def loginUser():
    data = request.get_json(force=True)
    app.logger.warning(data)
    col = db['DC Representatives']
    user = col.find({"email": data['email'], "password": data['password']})
    
    for res in user:
        dc = res['dc_name']
    if (dc):
        dc_details = {"name": dc}
        return dc_details, 200
    return "0", 200


@app.route('/uploadReport/<record_centre>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def loadtest(record_centre):
    record_centre1 = db[record_centre]
    test_name={"tests": []}
    if(request.method != "GET"):
        response.status_code = 405
        return response
    docs_list  = list(record_centre1.find())
    for i in docs_list:
        test_name["tests"].append(i['name'])
    return json.dumps(test_name),200


@app.route('/uploadReport/<string:record_centre>/<string:testname>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def getname(record_centre,testname):
    record_centre1 = db['Bookings']
    typetest = list(record_centre1.find({'centre' : str(record_centre),'test':str(testname)}))
    patients = []
    for i in typetest:
        patients.append(i['userID'])
    usertable= db['Users']
    
    patientDetails = {}
    for i in patients:
        username= usertable.find_one({'user_id':i})
        if (username != None):
            patientDetails[username['fname']] = username['age']
            
    return jsonify(patientDetails),200

@app.route('/uploadReport/age/<name>',methods=['GET'])
@cross_origin(supports_credentials=True)
def getage(name):
    rec=db['Users']
    age= rec.find_one({'fname':name})
    return jsonify(age['age']),200

@app.route('/uploadSchedule/<record_centre>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def loadtests(record_centre):
    record_centre1 = db[record_centre]
    test_name={"tests": []}
    if(request.method != "GET"):
        response.status_code = 405
        return response
    docs_list  = list(record_centre1.find())
    for i in docs_list:
        test_name["tests"].append(i['name'])
    return test_name,200

@app.route('/uploadSchedule/<record_centre>/<test_name>', methods = ['GET','POST','DELETE','PUT'])
@cross_origin(supports_credentials=True)
def loadcost(record_centre,test_name):
    record_centre1 = db[record_centre]
    typetest = record_centre1.find_one({'name' : test_name})
    cost=str(typetest['cost'])
    return cost


@app.route('/addToDB', methods = ['GET','POST','DELETE','PUT', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def addDetails():
    if (request.is_json):
        data = request.get_json(force=True)
        data['finalinsertion'] = list(data['finalinsertion'].split(","))
        timeslot = []
        timeslotfinal = []
        today = []
        tomorrow = []
        dayafter = []
        for i in range(0, len(data['finalinsertion']), 7):
            time = data['finalinsertion'][i]
            if (data["finalinsertion"][i+1] != "None"):
                today.append(int(data['finalinsertion'][i+1]))
            else:
                today.append('None')

            if (data["finalinsertion"][i+2] != "None"):
                today.append(int(data['finalinsertion'][i+2]))
            else:
                today.append('None')

            if (data["finalinsertion"][i+3] != "None"):
                tomorrow.append(int(data['finalinsertion'][i+3]))
            else:
                tomorrow.append('None')

            if (data["finalinsertion"][i+4] != "None"):
                tomorrow.append(int(data['finalinsertion'][i+4]))
            else:
                tomorrow.append('None')
                
            if (data["finalinsertion"][i+5] != "None"):
                dayafter.append(int(data['finalinsertion'][i+5]))
            else:
                dayafter.append('None')
            
            if (data["finalinsertion"][i+6] != "None"):
                dayafter.append(int(data['finalinsertion'][i+6]))
            else:
                dayafter.append('None')

            app.logger.warning("here")
            timeslot.append(time)
            timeslot.append(today)
            timeslot.append(tomorrow)
            timeslot.append(dayafter) 
            today = []
            tomorrow = []
            dayafter = []                
            timeslotfinal.append(timeslot)
            timeslot = []
        app.logger.warning(timeslotfinal)
        col = db[data['dc_name']]

        res = col.update_one({"name": data['testname']}, {"$set": {"time slots": timeslotfinal}})
        app.logger.warning(res)
        return "1", 200
        
    return "0", 200

@app.route("/sendFeedback", methods=["POST"])
@cross_origin(supports_credentials=True)
def sendfeedback():
    data = request.get_json(force=True)
    col = db["Feedback Client"]
    col.insert_one(data)

    return "1", 200

if __name__ == '__main__':
    app.run(host='127.0.0.1',port=5050,debug=True)
 