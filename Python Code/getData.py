from pymongo import MongoClient


try: 
    client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true") 
    print("Connection established successfully!")
except:
    print("Connection not established!")
    exit(0)

db = client.get_database('DCCMS_SE')

col = db['Lotus Diagnostic Centre']
for i in col.find({"name":"Calcium"}):
    print(i)
