import RestaurantsDAO from "../dao/restaurantsDAO.js"; // 7.0 import the restaurantsDAO file

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) { // 7.1 its called thorugh an URL that there can be a query string "?" taht specififes certain search parameters to filter results
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20; // 7.2 if in the query specifies the restaurantsPerPage then parse it to an int and assign it to a variable
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        if (req.query.cuisine) { // 7.2 we set the filters specified in the url query (?), if theres any
            filters.cuisine = req.query.cuisine;
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({ // 7.3 call the getRestaurants method from the class object imported RestaurantsDAO to access the data of the collection in the db
            filters,                                                                           // this method will return a restaurants list and the total number of the restaurants found filtered by the query parameters search
            page,
            restaurantsPerPage
        })

        let response = { // 7.4 create a response to send to the person/client when the api in the url its called
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants
        }
        res.json(response); // 7.5 send a .json response with the information stored in the object "response" already created
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            let id = req.params.id || {}; // 13.0 in the apiGetRestaurantById method we get the restaurant's id by parameter, the parameters (params) are inside the body and preceded by ":"
            let restaurant = await RestaurantsDAO.getRestaurantById(id); // 13.1 using the getRestaurantById method (still to create), we get the restaurant selected passing the restaurant's id
            if (!restaurant) {
                res.status(404).json({ error: "Not found" });
                return;
            }

            res.json(restaurant);

        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e});
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}