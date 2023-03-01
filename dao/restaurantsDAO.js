// 4.0 DAO stands for Data Access Object, 

import mongodb from "mongodb" // 14.0 import mongodb to use ObjectId and parse the id string to and ObjectId for mongodb
const ObjectId = mongodb.ObjectId;

// import { ObjectId } from "mongodb"; // this lines adds automatically when trying to use new ObjectId, I think its equal to the two lines above

let restaurants // 4.1 create a variable that stores the reference to our database

export default class RestaurantsDAO { // 4.2 we export a class object RestaurantsDAO that has some methods
    static async injectDB(conn) { // 4.3 The first method is "injectDB", how we initially connect to db, its called at the start of the server, we get a reference to our database
        if(restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants"); // 4.4 connect to the sample_restaurants db and specify the restaurants collection
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`, 
            )
        }
    }

    static async getRestaurants({ // 4.5 call when we want the list of all restaurants in the db
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
             if ("name" in filters) { // 4.6 we can search a restaurant with query by their name, cuisine, or zipcode (type searches)
                query = { $text: { $search: filters["name"] } }
             } else if ("cuisine" in filters) {
                query = {"cuisine": { $eq: filters["cuisine"] } } // 4.7 $eq is equals query on mongodb
            } else if ("zipcode" in filters) {
                query = {"address.zipcode": { $eq: filters["zipcode"] } } 
            } 
        } 

        let cursor;

         try {
            cursor = await restaurants
            .find(query) // 4.8 this will find all the restaurants in the db that go along with the query that we passed in
         } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0} // 4.9 if theres an error it will log the error and return an empty list
         }

         const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page); // 4.10 limit the results for restaurantsPerPage (20) and get the actual the page number by .skip 

         try {
            const restaurantsList = await displayCursor.toArray(); // 4.11 set the results to an array
            const totalNumRestaurants = page === 0 ? await restaurants.countDocuments(query) : 0; // 4.12 set the total number of restaurants found by .countDocuments by the specific filters/query 

            return { restaurantsList, totalNumRestaurants };
         } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { restaurantsList: [], totalNumRestaurants: 0 };
         }
    }

    static async getRestaurantById(id) { // 14.1 this method will get a restaurant when passing a restaurant's id
        try {
            const pipeline = [ // 14.2 in mongodb you can create pipelines to help match different collectionts together
                {
                    $match: {  // 14.3 using the "$match" operator to trying to match the restaurant id whith the id that we passed to the function
                        _id: new ObjectId(id)
                    }
                },
                {
                    $lookup: { // 14.4 the operator "$lookup" to add other items (reviews) to add to the result
                        from: "reviews", // "$lookup" is used as a part of mongodb aggregations pipeline, framework for data aggregation modeled on the concept of data processing pipelines, transforms the documents into agregated results
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {  // 14.5 create another pipeline that match the restaurant id and find all the reviews that match the restaurant id
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    }
                                }
                            },
                            {
                                $sort: {
                                    date: -1
                                }
                            }
                        ],
                        as: "reviews",  // 14.6 and we set the all reviews found result listed as "reviews"
                    }
                },
                {
                    $addFields: {
                        reviews: "$reviews" // 14.7 the "$addFields" operator adds a field name "reviews" that will hold all the result reviews found
                    }
                }
            ]

            return await restaurants.aggregate(pipeline).next(); // 14.8 aggregate puts everything together

        } catch (e) {
            console.error(`Something went wrong in getRestaurantById: ${e}`);
            throw e;
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine"); // 14.9 on the getCuisines method we use a promise with "distinct", to get all of each cuisines, get each cuisine one time
            return cuisines;  
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`);
            return cuisines;
        }
    }
}