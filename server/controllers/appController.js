import UserModel from "../models/User.model.js";
import bcrypt from 'bcrypt';

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "mohabbatrj",
  "password" : "123456@",
  "email": "example@gmail.com",
  "firstName" : "mohabbat",
  "lastName": "rj",
  "mobile": 03081474911,
  "address" : "911 WB Vehari",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Check for empty username, password, and email
        if (!username) {
            return res.status(400).send({ error: "Username is required field." });
        }
        if (!password) {
            return res.status(400).send({ error: "Password is required field." });
        }
        if (!email) {
            return res.status(400).send({ error: "Email are required field." });
        }

        // Check the existing username
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        // Check for existing email
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ error: "Please use a unique email" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email
            });

            try {
                const result = await user.save();
                res.status(201).send({ msg: "User registered successfully" });
            } catch (error) {
                // Handle save error separately
                res.status(500).send({ error: "Error saving user to the database" });
            }
        }
    } catch (error) {
        // Handle other errors (e.g., invalid JSON in request body) separately
        res.status(500).send({ error: "Internal server error" });
    }
}




/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "mohabbatrj",
  "password" : "123456@"
}
*/
export async function login(req, res) {
    res.json('login route');
}


/** GET: http://localhost:8080/api/user/mohabbatrj */
export async function getUser(req, res) {
    res.json('getUser route');
}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "id" : "<userid>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    res.json('updateUser route');
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    res.json('generateOTP route');
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    res.json('verifyOTP route');
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    res.json('createResetSession route');
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    res.json('resetPassword route');
}