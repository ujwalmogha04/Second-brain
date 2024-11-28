import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
const app = express();
import { contentSchema, userSignUpSchema, userSigninSchema } from "./schema";
import { UserModel, ContentModel } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";


app.use(express.json());


app.post("/api/v1/signup", async (req: Request, res: Response): Promise<any> => {
    const { username, name, password } = req.body;

    const validateSchema = userSignUpSchema.safeParse({ username, password, name })

    if (!validateSchema.success) {
        return res.status(400).json({
            message: "Invalid schema",
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

app.post("/api/v1/signin", async (req, res): Promise<any> => {
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
            return res.status(404).json({
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
        }, process.env.JWT_SECRET as string);

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
app.post("/api/v1/addcontent", userMiddleware, async (req: RequestWithUser, res: Response) => {
    const { link, type, tag, title } = req.body;

    const validateSchema = contentSchema.safeParse({ link, type, tag, title });
    if (!validateSchema.success) {
        return res.json({
            Message: "Invalid Schema",
            error: validateSchema.error.errors
        })
    }
    try {

        const existingContent = await ContentModel.findOne({ link });
        if (existingContent) {
            return res.status(409).json({
                message: "Content already exists with the provided link"
            });
        }

        const newContent = await ContentModel.create({
            link,
            type,
            tag,
            title,
            userId: req.userId,
        });

        return res.status(201).json({
            message: "Content successfully added",
            content: newContent
        });
    }
    catch (error: any) {
        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }
})

//@ts-ignore
app.get("/api/v1/content", userMiddleware, async (req: RequestWithUser, res: Response) => {
    const userId = req.userId;
    try {
        const content = await ContentModel.find({userId}).populate("userId" , "username");

        if (content.length === 0){
            return res.status(404).json({
                message : "No content found for this user"
            })
        }

        res.status(200).json({
            content
        })
    }
    catch (error: any) {
        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }
})

//@ts-ignore
app.delete("/api/v1/content", userMiddleware, async (req : RequestWithUser, res : Response) => {
    const contentId = req.body.contentId;
    const userId = req.userId;
    try {
          const contentToDelete = await ContentModel.findOne({userId , contentId})

          if(!contentToDelete){
            return res.status(404).json({
                 message : "Content not found or not associated with this user"
            })
          }
 
        await ContentModel.deleteOne({_id: contentId})

         return res.status(200).json({
            message : "content deleted"
         })

    }
    catch (error: any) {
        return res.json({
            message: "Internal server error",
            error: error.message
        })
    }
})

app.post("api/v1/brain/share", (req, res) => {

})

app.get("api/v1/brain/:shareLink", (req, res) => {

})


async function main(): Promise<void> {
    try {
        await mongoose.connect(process.env.DB_SECRET as string);
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