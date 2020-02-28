from pymongo import MongoClient 
from datetime import datetime, date
from werkzeug.utils import secure_filename
from flask import Flask, flash, request, redirect, url_for, jsonify, json
import requests
from flask_cors import CORS, cross_origin

try:
    client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true") 
    print("connection successfull!")

except:
    print("connection not established")

db = client.get_database('DCCMS_SE')
record = db['Diagnostic Centres']
#record1 = db['Bookings']
diagnosticCentre = ""


app = Flask(__name__)
CORS(app, support_credentials=True)
