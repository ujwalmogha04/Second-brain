import {z} from "Zod";


const userSignUpSchema = z.object({
    username : z.string().email(),
    name : z.string().min(3),
    password : z.string().min(8)
})

const userSigninSchema = z.object({
      username : z.string().min(3),
      password : z.string().min(8)
})

export {
    userSignUpSchema,
    userSigninSchema
}