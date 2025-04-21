import Blogs from "../models/blogSchema.js";
import User from "../models/userSchema.js";

// Create Blog
export const createBlog = async(req, res) => {
   try {
       const { title, content, authorName, profession, category } = req.body;

       // Validate the input fields
       if(!title || !content || !authorName || !profession || !category) {
          return res.status(422).json({ message: "Please fill all the data", success: false});
        };

        // Find the author by name
        const author = await User.findOne({name:authorName.trim()});

        if(!author) {
            return res.status(404).json({message: "Author not found", success: false});
        }

        // Create a new blog
        const newBlog = new Blogs({
            title, content, authorName, profession, category
        })

        await newBlog.save();

        console.log("New blog created successfully");
        return res.status(201).json({message: "Blog created successfully", blog: newBlog, success: true});

    } catch(error) {
      console.log("Error in blog creation: ", error.message);
      return res.status(500).json({message: "Server Error", success: false});
    }
};



// Get Blogs
export const getBlogs = async(req, res) => {
    try {
        const blogs = await Blogs.find();
        return res.status(200).json({message: "Blogs successfully fetched", blogs, success: true});
    } catch(error) {
        console.log("Error in fetching blogs", error.message);
        return res.status(500).json({message: "Server Error", success: false});
    }
};



// Update Blog
export const updateBlog = async(req, res) => {
    try {
        const { id } = req.params;

        // Find the blog by id
        const blog = await Blogs.findById(id);
        if(!blog) {
            return res.status(404).json({message: "Blog not found", success: false});
        }

        // Authorization check: only the author can edit
        if(blog.authorName !== req.rootUser.name) {
            return res.status(403).json({message: "Unauthorized: You can only edit your blog", success: false});
        }

        // Update blog with new data
        const updatedBlog = await Blogs.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({message: "Blog updated successfully", blog: updatedBlog, success: true});
    } catch(error) {
        console.log("Error in updating blog", error.message);
        return res.status(500).json({message: "Server Error", success: false});
    }
};



// Delete Blog
export const deleteBlog = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the blog by id
      const blog = await Blogs.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found", success: false });
      }
  
      // Authorization check: only the author can delete
      if (blog.authorName !== req.rootUser.name) {
        return res.status(403).json({ message: "Unauthorized: You can only delete your own blog", success: false });
      }
  
      await Blogs.findByIdAndDelete(id);
  
      return res.status(200).json({ message: "Blog deleted successfully", success: true });
    } catch (error) {
      console.log("Delete blog error:", error);
      return res.status(500).json({ message: "Server error", success: false });
    }
};
  