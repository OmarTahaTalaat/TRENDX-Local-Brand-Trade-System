
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
wishlist: [{ product:
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
   } ],
  customer: {
    type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
  }
  
})

wishlistSchema.pre(/^find/, function (next) {
this.populate({
    path: 'wishlist.product',
    select: 'title description price imageCover category'}
    );next() })


  
  const wishlistModel = mongoose.model("Wishlist", wishlistSchema);
  module.exports = wishlistModel;