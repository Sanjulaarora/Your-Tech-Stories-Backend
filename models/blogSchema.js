import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    authorName: {
        type: String,
        required:true,
        trim: true
    },
    profession: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true
    }, 
}, { timestamps: true });


const Blogs = mongoose.model("blogs", blogSchema);

export default Blogs;