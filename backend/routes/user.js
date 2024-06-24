const { Router } = require("express")
const router =  Router()
const mongoose = require("mongoose")
const { User, Todos } = require("../db/index.js")
const { userSignin, userSignup, userAuthMiddleware } = require("../middlewares/user.js")
const jwt = require("jsonwebtoken")
require("dotenv").config({path: "../.env"})

const JWT_SECRET = process.env.JWT_SECRET
const { ObjectId } = mongoose.Types; 

router.post("/signup", userSignup, async (req, res) => {

    const username = req.body.username
    const password = req.body.password

    const todo = await Todos.create({
        todos: []
    })

    await User.create({
        username,
        password,
        todoObjectId: todo._id
    })

    res.json({msg: "User created successfully!"})

})

router.post("/signin", userSignin, (req, res) => {

    const username = req.body.username
    const token = jwt.sign({username}, JWT_SECRET)

    res.json({token})

})

router.use(userAuthMiddleware)
// All routes below will use this middleware 

router.get("/todos", async (req, res) => {

    const username = req.headers.username
    const user = await User.findOne({
        username
    })
    const response = await Todos.findOne({
        _id: user.todoObjectId
    })
    res.json(response.todos)

})

router.post("/todos", async (req, res) => {
    
    const { title, description, completed } = req.body;
    const username = req.headers.username

    const response = await User.findOne({username})

    newTodoId = new ObjectId()

    await Todos.updateOne({ _id: response.todoObjectId },
        {$push: {todos: {
            _id: newTodoId,
            title,
            description,
            completed
        }}}
    )

    res.json({msg: "Todo created successfully!",
        "todoId": newTodoId
    })

})

router.put("/todos/:todoId", async (req, res) => {
    
    const todoId = req.params.todoId
    const { title, description, completed } = req.body;
    const username = req.headers.username
    const response = await User.findOne({username})
    
    await Todos.updateOne(
        { _id: response.todoObjectId, 'todos._id': todoId },
        { $set: { 'todos.$': {
            _id: todoId,
            title,
            description,
            completed
        } } }
    );

    res.json({msg: "Todo updated successfully!",
        "todoId": todoId
    })

})

router.delete("/todos/:todoId", async (req, res) => {

    const todoId = req.params.todoId
    const username = req.headers.username
    const response = await User.findOne({username})

    await Todos.updateOne(
        { _id: response.todoObjectId },
        { $pull: { todos: { _id: todoId } } }
    );

    res.json({msg: "Todo deleted successfully!",
        "todoId": todoId
    })

})


module.exports = router