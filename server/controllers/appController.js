import UserModel from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'

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

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then((err, user) => {
                if (err) reject(new Error(err))
                if (user) reject({ error: "Please use unique username" });

                resolve();
            }).catch(err => reject({ error: "exist username findone error" }));
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }).then((err, email) => {
                if (err) reject(new Error(err))
                if (email) reject({ error: "Please use unique Email" });

                resolve();
            }).catch(error => reject({ error: "exist username findone error" }));
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {

                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then((result) => {
                                    res.status(201).send({ msg: "User Register Successfully" })
                                }).catch(error => res.status(500).send({ error }))

                        }).catch((error) => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                }
            }).catch((error) => {
                return res.status(500).send({ error })
            })
    }
    catch (error) {
        return res.status(500).send(error);
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
        UserModel.findOne({ username }).then((user) => {
            bcrypt.compare(password, user.password).then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(400).send({ error: "Password does not match" });
                }

                // create jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username,
                }, ENV.JWT_SECRET, { expiresIn: "24h" });

                return res.status(200).send({
                    msg: "Login Success",
                    username: user.username,
                    token
                });
            })
                .catch((error) => {
                    return res.status(400).send({ error: "Don't have password" });
                })
        })
        .catch( (error) => {
            return res.status(400).send({ error: "Username not found" });
        })
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
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