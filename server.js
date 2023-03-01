// 1.0 Before creating this file, the "package.json" is modified to implement "import" statement from ES6 ("type" : "module")

// 1.1 Import all the modules that we need and a file "resturants" that contains the routes
import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

// 1.2 We create the app that will use express
const app = express();

app.use(cors());
app.use(express.json()); // 1.3 Body-parser is now included in express so we use express.json to "parse" (translate) the json sended files to make them readable

app.use("/api/v1/restaurants", restaurants) // 1.4 Set the main route that people will access to the api, the route is on the restaurants file
app.use("*", (req, res) => res.status(404).json({ error: "not found"})); // 1.5 Set a "*" (wild card, for any route) in case people access to non-existing route, we return an error

export default app; // 1.6 We export the server file to use it as a module on other files