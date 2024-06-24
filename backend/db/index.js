require("dotenv").config({path: "../.env"})
const mongoose = require("mongoose")

DATABASE_URL = process.env.DATABASE_URL

mongoose.connect(DATABASE_URL)

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    todoObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todos"
    }
})

const TodosSchema = new mongoose.Schema({
    todos: [{
        title: String,
        description: String,
        completed: Boolean
    }]
})

const User = mongoose.model("User", UserSchema)
const Todos = mongoose.model("Todos", TodosSchema)


module.exports = { User, Todos } 