const jwt = require("jsonwebtoken")
require("dotenv").config({path: "../.env"})
const { User } = require("../db/index.js")

const JWT_SECRET = process.env.JWT_SECRET


function userAuthMiddleware(req, res, next) {

    const token = req.headers.authorization
    try {
        const decodedJSON = jwt.verify(token, JWT_SECRET)
        req.headers.username = decodedJSON.username
        next()
    }
    catch (e) {
        res.json({"msg": "Authentication failed!"})
    }

}

async function userSignup(req, res, next) {

    const username = req.body.username
    const response = await User.findOne({
        username
    })
    response ? res.json({"msg": "Username already exist!"}) : next()

}

async function userSignin(req, res, next) {
    
    const username = req.body.username
    const password = req.body.password

    const response = await User.findOne({
        username,
        password
    })
    response ? next() : res.json({"msg": "User Donot Exist !"})

}

module.exports = { userAuthMiddleware, userSignin, userSignup }