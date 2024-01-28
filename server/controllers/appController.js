import UserModel from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import ENV from '../config.js'


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
            .catch((error) => {
                return res.status(400).send({ error: "Username not found" });
            })
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


/** GET: http://localhost:8080/api/user/mohabbatrj */
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        if (!username) return res.status(400).send({ error: "Invalid Username" });

        UserModel.findOne({ username }).then((user) => {
            if (!user) return res.status(404).send({ error: "Couldn't find the User" });

            // remove password from the user
            // mongoose return unneccesary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());
            return res.status(200).send(rest);
        }).catch((error) => {
            return res.status(500).send({ error: "Internal Server Error" });
        });
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
        const  userId  = req.query.id;
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