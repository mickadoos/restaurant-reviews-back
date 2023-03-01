import mongodb from "mongodb"; // 10.0 import mongodb to get access to ObjectId
const ObjectId = mongodb.ObjectId; // 10.1 converts a string to a mongo object id

let reviews; // 10.2 we are going to fill it with review references

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews"); // 10.3 the reviews collection does not exitst, but its OK, it will create the collection when trying to connect if it does not exist
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = {  // 10.4 on the addReview method we will fill a reviewDoc with the necessary information to store it in the database 
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        restaurant_id: new ObjectId(restaurantId), // 10.5 the restaurant id (string) will get converted to a MongoDB ObjectId
      };

      return await reviews.insertOne(reviewDoc); // 10.6 we will insert the review into the database

    } catch (e) {
        console.error(`Unable to post review: ${e}`);
        return { error: e } ;
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
        const updateResponse = await reviews.updateOne(
            { user_id: userId, _id: new ObjectId(reviewId)}, // 10.7 with the method updateOne we update we check for the correct userId and review id to ensure the updated review is created by the same user
            { $set: { text: text, date: date } },   // and with "$set" operator for mongodb, we set the new text and date
        )

        return updateResponse;

    } catch (e) {
        console.error(`Unable to update review: ${e}`);
        return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
        const deleteResponse = await reviews.deleteOne({ // 10.8 ont he deleteReview method we use the deleteOne method to find a review by the user id and the review id to delete it from the database
            _id: new ObjectId(reviewId),
            user_id: userId
        })

        return deleteResponse; // 10.9 we return the deleted review 

    } catch (e) {
        console.error(`Unable to delete review: ${e}`);
        return { error: e };
    }
  }
}
