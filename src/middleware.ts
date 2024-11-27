import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from "./config";

interface DecodeToken {
    id : string
} 

interface RequestWithUser extends Request {
    userId?: string;
}


export function userMiddleware( req : RequestWithUser , res : Response , next : NextFunction) {
    const token = req.headers.authorization;

    if(!token){
        return res.status(403).json({
            message : "Token Does not exists"
        })
    }

    try{
         const decode = jwt.verify( token , JWT_SECRET) as DecodeToken;
         if(!decode){
            return res.status(401).json({
                message : "Invalid Token"
            })
         }
        
        req.userId = decode.id;
        next();
    }
    catch (error : any) {
         return res.status(500).json({
            message : "Internal server error",
            error : error.message
         })
    }
}


