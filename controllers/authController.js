import User from "../models/userSchema.js"; 
import bcrypt from "bcryptjs";

// sign-up
export const signUp = async(req, res) => {
    try {
       const { name, number, email, password, passwordAgain } = req.body;

        // validate input fields
        if(!name || !number || !email || !password || !passwordAgain) {
            return res.status(422).json({ message:"Please fill all the data", success: false });
        };

        // check if user is present
        const preuser = await User.findOne({email:email});

        if(preuser) {
            return res.status(422).json({ message:"This user already exists", success: false });
        } else if(password !== passwordAgain) {
            return res.status(422).json({ message:"Password and Password Again do not match", success: false });
        } else {
            // create new user
            const newUser = new User({
                name, number, email, password, passwordAgain
            });

            // password hashing process   

            await newUser.save();

            console.log("User Registered Successfully");
            return res.status(201).json({ message: "User Registered Successfully", success: true});
        }

    } catch(error) {
        console.log("Error in user registration:", error.message);
        return res.status(500).json({ message:"Server Error", success: false });
    }
};



// sign-in
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the details", success: false });
        }

        // find user by email
        const userSignin = await User.findOne({ email });

        if (userSignin) {
            const isMatch = await bcrypt.compare(password, userSignin.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials", success: false });
            } else {
                const token = await userSignin.generateAuthToken();

                res.cookie("BlogApp", token, {
                    expires: new Date(Date.now() + 86400000),
                    httpOnly: true
                });

                // Remove sensitive info before sending user data
                const { password, ...userWithoutPassword } = userSignin._doc;

                console.log("User Signed In Successfully");
                return res.status(201).json({ 
                    message: "User Signed In Successfully", 
                    success: true,
                    user: userWithoutPassword // return user info
                });
            }

        } else {
            console.log("Error in sign-in");
            return res.status(400).json({ message: "User Does Not Exist", success: false });
        }
    } catch (error) {
        console.error("Unexpected error during login:", error.message);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};



//sign-out
export const signOut = async(req, res) => {
    try {
        const token = req.token;

        req.rootUser.tokens = req.rootUser.tokens.filter((currEle) => currEle.token !== token);

        await req.rootUser.save();

        res.clearCookie("BlogApp", { path: "/" });

        console.log("User Signed Out Successfully");
        return res.status(200).json({ message: "User Signed Out successfully", success: true });
    } catch (error) {
        console.log("Error in User Sign-out:", error.message);
        return res.status(500).json({ message: "Sign-out failed", success: false });
    }
};
