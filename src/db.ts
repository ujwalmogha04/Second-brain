import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
    username : {type : String, required : true , unique : true},
    name : {type : String , required : true},
    password : {type : String , required : true}
})

const ContentSchema = new Schema({
    link : { type : String, unique : true },
    type : String,
    title : String,
    tag : [{type : Schema.Types.ObjectId , ref : "Tag"}],
    userId : {type : Schema.Types.ObjectId , ref : "User" }, 
})

const LinkSchema = new Schema ({
    hash : String,
    userId : {type : Schema.Types.ObjectId , ref : "User" }, 
})

const TagSchema = new Schema ({
    title : String,
})

const UserModel = mongoose.model("User" , UserSchema);
const ContentModel = mongoose.model("Content" , ContentSchema);
const LinkModel = mongoose.model("Link" , LinkSchema);
const TagModel = mongoose.model("Tag" , TagSchema);

export  {
    UserModel,
    ContentModel,
    LinkModel,
    TagModel
}