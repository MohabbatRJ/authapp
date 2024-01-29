import UserModel from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator';
import { tryReleaseFile } from "mongodb-memory-server-core/lib/util/utils.js";

// middleware verify user
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();
    }
    catch (error) {
        return res.status(400).send({ error: "Authentication Error" });
    }
}

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
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(400).send({ error: "Username not found" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);

        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not match" });
        }

        // Create jwt token
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
        }, ENV.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({
            msg: "Login Success",
            username: user.username,
            token
        });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}



/** GET: http://localhost:8080/api/user/mohabbatrj */
export async function getUser(req, res) {
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).send({ error: "Invalid Username" });
        }

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Couldn't find the User" });
        }

        // Remove password from the user
        // Mongoose returns unnecessary data with object, so convert it into JSON
        const { password, ...rest } = Object.assign({}, user.toJSON());
        return res.status(200).send(rest);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}



/** PUT: http://localhost:8080/api/updateUser 
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
    try {
        // const  userId  = req.query.id;
        const { userId } = req.user;
        console.log(userId);
        if (userId) {
            const body = req.body;

            // Update the data
            const updateResult = await UserModel.updateOne({ _id: userId }, body);

            if (updateResult.modifiedCount>0) {
                return res.status(201).send({ msg: "Record Updated...!" });
            } else {
                return res.status(500).send({ error: "Record Not Update" });
            }
        } else {
            return res.status(401).send({ error: "User Not Found...!" });
        }
    } catch (error) {
        return res.status(401).send({ error: "Internal Server Error" });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    res.status(201).send({ code: req.app.locals.OTP})
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: "Verify Successfully" });
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false; //alow access to this route only once
        return res.status(201).send({ msg: "Access granted!" });
    }
    return res.status(440).send({ error: "Session expired!" });
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        
        if (!req.app.locals.resetSession) {
            return res.status(401).send({ error: "Session expired!" });
        }
        const { username, password } = req.body;

        try {
            const user = await UserModel.findOne({ username });

            if (!user) {
                return res.status(404).send({ error: "Username not found!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const updateResult = await UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword }
            );

            if (updateResult.modifiedCount > 0) {
                req.app.locals.resetSession = false;
                return res.status(201).send({ msg: "Record Updated...!" });
            } else {
                return res.status(500).send({ error: "Internal Server Error" });
            }
        } catch (error) {
            return res.status(500).send({ error: "Internal Server Error" });
        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}
