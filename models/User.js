const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
type
default
require
unique
 */

const userSchema = new Schema(
    {
        id : {
            type : Number,
            require : true,
            unique : true
        },
        fullName : String,
        age : Number
    }
);

module.exports = mongoose.model("User" , userSchema)