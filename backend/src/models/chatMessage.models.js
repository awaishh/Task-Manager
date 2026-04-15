import mongoose, { Schema } from "mongoose"

const chatMessageSchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    }
}, { timestamps: true })

chatMessageSchema.index({ project: 1, createdAt: -1 })

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema)

export { ChatMessage }
