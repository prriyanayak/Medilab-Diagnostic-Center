# connection  to MongoDB
from operator import itemgetter
from pymongo import MongoClient
import re
import json
import base64
import string
import binascii
import datetime

from flask import Flask, request, Response, abort, render_template
from sendEmail import sendReport, sendOTP
from flask_cors import CORS, cross_origin
from random import randint

app = Flask(__name__)

try: 
    client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true") 
    print("Connection established successfully!")
except:
    print("Connection not established!")
    exit(0)

db = client.get_database('DCCMS_SE')
record = db['Diagnostic Centres']
diagnosticCentre = ""


app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/uploadSchedule/<record_centre>', methods = ['GET','POST','DELETE','PUT'])
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

if __name__ == '__main__':
    app.run(port="8080", debug=True)
