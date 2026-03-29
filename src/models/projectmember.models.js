import mongoose , {Schema} from "mongoose"
import {AvailableUserRole,TaskStatusEnum} from "../constants.js"

const projectMemberSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailableUserRole,
        default:UserRolesEnum.MEMBER
    }
},{timestamps:true})

const ProjectMember = mongoose.model("ProjectMember","ProjectMemberSchema");

export {ProjectMember}
