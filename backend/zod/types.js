const z = require("zod")

const userSchema = z.object({
    "username": z.string(),
    "password": z.string()
})

const todoSchema = z.object({
    "title": z.string(),
    "description": z.string(),
})

module.exports = {
    userSchema, todoSchema
}

