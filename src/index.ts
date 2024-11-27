import express, { Request, Response } from "express";
import mongoose from "mongoose";
const app = express();
import { userSignUpSchema, userSigninSchema } from "./schema";
import { UserModel } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { JWT_SECRET } from "./config";

app.use(express.json());


app.post("/api/v1/signup", async (req: Request, res: Response) : Promise<any> => {
    const { username, name, password } = req.body;

    const validateSchema = userSignUpSchema.safeParse({ username, password, name })

    if (!validateSchema.success) {
        return res.status(400).json({
            message: "Inavlid schema",
            errors: validateSchema.error.errors
        })
    }

    try {

        const exisitngUser = await UserModel.findOne({ username });

        if (exisitngUser) {
            return res.status(409).json({
                message: "User Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username: username,
            name: name,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "you have succesfully signedup"
        })

    } catch (error: any) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
})

app.post("/api/v1/signin", async (req, res) : Promise<any> => {
    const { username, password } = req.body;

    const validateSchema = userSigninSchema.safeParse({ username, password })

    if (!validateSchema.success) {
        return res.status(400).json({
            Message: "Invalid schema",
            errors: validateSchema.error.errors
        })
    }

    try {
        const exisitngUser = await UserModel.findOne({ username });

        if (!exisitngUser) {
            return res.status(403).json({
                message: "user Does not exists , signup first"
            })
        }

        const matchPassword = await bcrypt.compare(password, exisitngUser.password)

        if (!matchPassword) {
            return res.status(403).json({
                message: "Incorrect Password"
            })
        }
        const token = jwt.sign({
            id: exisitngUser._id
        }, JWT_SECRET);

        return res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error: any) {
        res.status(500).json({
            Message: "Internal server error",
            error: error.message
        })
    }
})

//@ts-ignore
app.post("/api/v1/addcontent", userMiddleware, async (req : Request, res : Response) => {
       const {link , type , tag , title} = req.body;


})

app.get("/api/v1/content", (req, res) => {

})

app.delete("api/v1/content", (req, res) => {

})

app.post("api/v1/brain/share", (req, res) => {

})

app.get("api/v1/brain/:shareLink", (req, res) => {

})


async function main(): Promise<void> {
    try {
        await mongoose.connect("mongodb+srv://Ujwal:Ujwal2510@merncluster.5dodjsu.mongodb.net/Second-Brain");
        console.log("Sucessfully connected to the database");

        app.listen(3000, () => {
            console.log("App is running on port 3000");
        });
    }
    catch (error) {
        console.log("Error while connecting to the database", error);
    }
}

main();