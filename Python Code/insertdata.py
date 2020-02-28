from pymongo import MongoClient

client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true")

db  = client["DCCMS_SE"]
col = db["Suhas Diagnostic Center"]


dc13 = [
    {
        "name": "FASTING BLOOD SUGAR",
        "at home": "Yes",
        "cost": 70,
        "time slots": ["07:00", "08:00", "09:00", "10:00", "17:00", "18:00", "19:00"]
    },

    {
        "name": "CRP",
        "at home": "No",
        "cost": 450,
        "time slots": "NULL"
    },

    {
        "name": "BLOOD TEST",
        "at home": "Yes",
        "cost": 100,
        "time slots": ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
    },

    {
        "name": "DENGUE IGM",
        "at home": "No",
        "cost": 550,
        "time slots": "NULL"
    },

    {
        "name": "VITAMIN B12",
        "at home": "No",
        "cost": 1100,
        "time slots": "NULL"

    },

    {
        "name": "URINE PREGNANCY TEST",
        "at home": "Yes",
        "cost": 220,
        "time slots": ["07:00", "08:00", "09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"]
    }

]

x = col.insert_many(dc13)
print(x)