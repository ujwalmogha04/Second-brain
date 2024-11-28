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

const contentSchema = z.object({
    link : z.string().url(),
    tag :z.array(z.string().length(24)),
    type : z.string(),
    title : z.string()
})

export {
    userSignUpSchema,
    userSigninSchema,
    contentSchema
}