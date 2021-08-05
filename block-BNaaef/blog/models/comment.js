let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    content: String,
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    likes: {type: Number, default: 0}
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);
