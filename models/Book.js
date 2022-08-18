const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
type
default
require
unique
 */

const bookSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
            maxlength : [20, "{PATH} alanı {VALUE} max: {MAXLENGTH} karakterden küçük olmalı"],
            minlength : [4, "{PATH} alanı {VALUE} min: {MINLENGTH} karakterden büyük olmalı"]
        },
        userId : {
            type : Number,
            required: true
        },
        category : String,
        comments : [{message : String}],
        meta : {
            votes : Number,
            favs : Number
        },
        published : {
            type : Boolean,
            default : false
        },
        publishedAt : {
            type : Date,
            default: Date.now()
        }
    }
);

module.exports = mongoose.model("Book" , bookSchema)