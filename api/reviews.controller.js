import ReviewsDAO from "../dao/reviewsDAO.js" // 9.0 import the review data acces object, it's still not created

export default class ReviewsController {
    static async apiPostReview (req, res, next) {
        try {
            const restaurantId = req.body.restaurant_id; // 9.1 in the first post method, we get information from the "body" of the request: id, text review, user's name
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date(); // 9.2 get the actual date that the review is posted

            const ReviewResponse = await ReviewsDAO.addReview( // 9.3 we send the info assigned to the variables that we get from the body request and we send them through a response 
                restaurantId,                                  // using the method "addReview" (still to create) to the database
                userInfo,
                review,
                date,
            )
            res.json({ status: "success "})
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
        
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id; // 9.4 on the second method we update the review, getting the information of the review id, the text review and the date that is updated
            const text = req.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview( // 9.5 we call the update method from the ReviewsDAO class to send the updated review to the database
                reviewId,
                req.body.user_id, // 9.6 we get the user id to ensure the that the is the same user that created the review
                text,
                date,
            )

            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }

            res.json({ status: "success" });

        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id;  // 9.7 on the deleteReview method we get the review Id from the query
            const userId = req.body.user_id; // 9.8 for this tutorial we get the user id from the body, but this is not standard and you don't should get the user id (private info) from the body
            console.log(reviewId);           // of the url (public), is not used in production
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId
            )
            
            res.json({ status: "success" });

        } catch (e) {
            res.status(500).json({ error: e.message });

        }
    }

}