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

        let existUsername;
        let existEmail;

        // Check for existing user
        try {
            existUsername = await UserModel.findOne({ username }).exec();

            if (existUsername) {
                throw new Error("Please use a unique username");
            }
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).send({ error: error.message });
        }

        // Check for existing email
        try {
            existEmail = await UserModel.findOne({ email }).exec();

            if (existEmail) {
                throw new Error("Please use a unique email");
            }
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).send({ error: error.message });
        }

        // Continue with your code if both username and email are unique
        try {
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new UserModel({
                    username,
                    password: hashedPassword,
                    profile: profile || '',
                    email,
                });

                // Return save result as a response
                const result = await user.save();
                return res.status(201).send({ msg: "User Register Successfully", result });
            }
            else {
                return res.status(201).send({ msg: "Please user valid password", result });
            }
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).send({ error: "Unable to hash password or save user" });
        }

    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send({ error: "Internal Server Error" });
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