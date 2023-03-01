// 3.0 Create the restaurants.route file to define all the routes that we need for our project

import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js" // 6.0 import the RestaurantsCtrl file that we are about to create
import ReviewsCtrl from "./reviews.controller.js" // 8.0 import the class object "ReviewsCtrl" with their methods from the file "reviews.controller"

const router = express.Router(); // 3.1 The express.Router() function is used to create a new router object. This function is used when you want to create a new router object in your program to handle requests. 

// router.route("/").get((req, res) => res.send("hello world")); // 3.2 demonstration route, if you go to the route "/" it will show a text: "hello world"
router.route("/").get(RestaurantsCtrl.apiGetRestaurants); // 6.1 method created in the class object ResturantsCtrl that will return the api request of the restaurants 
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById); // 12.0 we add this route to get an specific restaurant by specifying the id on the body usisng params, and also get all the reviews asociated with the restaurant
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines); // 12.1 we add a route to return a list of cuisines, beacuse on the front end we will have a dropdown menu that memorizes and lists all types of cuisine and the user can select them

router // 8.1 create the routes to post, update and delete a review with the methods of the class object "ReviewsCtrl" that we are about to create (not yet created)
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router;