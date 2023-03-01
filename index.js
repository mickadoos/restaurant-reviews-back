// 2.0 Connect to the database and start the server

import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv" // 2.1 To acces enviroment variables
import RestaurantsDAO from "./dao/restaurantsDAO.js" // 5.0 import the class obect to access the data with the mwthods that we created in restaurantsDAO.js file (injectDB, getRestaurants)
import ReviewsDAO from "./dao/reviewsDAO.js" // 11.0 import the reviewsDAO file to get the reference of the review when trying to connect to the MongoClient
dotenv.config() // 2.2 to load the env variables
const MongoClient = mongodb.MongoClient // 2.3 acces the client

const port = process.env.PORT || 8000; // 2.4 create a port variables and assign the env variable port from ".env" (PORT=5000) and access the variable thorugh "process.env.VARIABLE" or set a default port = 8000

MongoClient.connect( // 2.5 Connect to the MongoDBCLient and passing the URI (env variable), and options for accessing the database
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50,   // 2.6 only 50 people connect simoultaneously
        wtimeoutMS: 2500, // 2.7 after 2500 ms the request wil timeout
        useNewUrlParser: true 
    }
)
.catch(err => {
    console.log(err.stack) // 2.8 If theres an error, log it and exit the process
    process.exit(1)
})
.then(async client => { // 2.9 after we connected the database and check for errors then we start our web server after connecting to DB by listening to the port we assigned
    await RestaurantsDAO.injectDB(client); // 5.1 this is how we get our inital reference to the restaurants collection in db
    await ReviewsDAO.injectDB(client); // 11.1 we need the get the reference of the reviews by calling the injectDB method and add the reviews collection (the video skips this part)
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
})