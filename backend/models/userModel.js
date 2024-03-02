/* Require mongoose package */
const mongoose = require("mongoose");
/* create Schema user mongoose */
const Schema = mongoose.Schema;
/* Create userSchema use mongoose Schema */
const userSchema = new Schema({
    /* Set user info and type */
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Please enter min 3 characters"] /*min 3 characters but not must set length */
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true} /* Get Create time  use timestamps: true */ )
/* Create user model  use mongoose model*/
const User = mongoose.model("User", userSchema);
/* export  user model */
module.exports = User;