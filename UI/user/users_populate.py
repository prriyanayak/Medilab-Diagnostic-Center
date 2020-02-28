from pymongo import MongoClient

client = MongoClient("mongodb+srv://codefundo:codefundo@cluster0-qx5uu.azure.mongodb.net/test?retryWrites=true")

db  = client["DCCMS_SE"]
col = db["Users"]

user_db = [
    {
        "fname": "Rhythm Girdhar",
        "email": "ridhigirdhar3@gmail.com",
        "password": "xyz123!!!",
        "phone": "9591050000",
        "age" : 21,
        "address" : "#145, ST Bed Layout, koramangala",
        "user_id" : "1"
    },

    {
        "fname": "Priya Nayak",
        "email": "nayakpriya98@gmail.com",
        "password": "xyz321!!!",
        "phone": "8888444411",
        "age" : 21,
        "address" : "Gokulam Apartments, kanakapura road",
        "user_id" : "2"
    },
        
    {
        "fname": "Prerana JK",
        "email": "jkprerana@gmail.com",
        "password": "xyz144!!!",
        "phone": "9876543218",
        "age" : 23,
        "address" : "#212, 2nd main Somenagar, Rajajinagar",
        "user_id" : "3"
    },    
    
    {
        "fname": "Preeti Agrawal",
        "email": "preetiagrawal13@gmail.com",
        "password": "YouAreLame123",
        "phone": "8970987657",
        "age" : 24,
        "address" : "140, Vijaya bank Layout, bilekehalli",
        "user_id" : "4"
    },    

    {
        "fname": "Rachna Aithal",
        "email": "raithal@gmail.com",
        "password": "IwantSleep8888",
        "phone": "9591050000",
        "age" : 15,
        "address" : "Mantri Alpyne, Uttarahalli main road",
        "user_id" : "5"
    },

    {
        "fname": "Rhiya",
        "email": "rhiyaramesh@gmail.com",
        "password": "hello123*",
        "phone": "7778885460",
        "age" : 35,
        "address" : "Sam Atithi Pavithi, Girinagar, Banashankari",
        "user_id" : "6"
    },


]

x = col.insert_many(user_db)
print(x)