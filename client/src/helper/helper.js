import axios from 'axios';
import { jwtDecode } from 'jwt-decode'

axios.defaults.baseURL = "http://localhost:8080";
// make api request

// to get username form token
export async function getUsername() {
    const token = localStorage.getItem('token');

    if (!token) return Promise.reject("Can't find token");
    let decode = jwtDecode(token);
    return decode;
}

// authenticate function
export async function authenticate(username) {
    try {
        return await axios.post('/api/authenticate', { username });
    }
    catch (error) {
        return { error: 'Authentication failed. Username does not exist...!' };
    }
}


// to get user detail
export async function getUser({ username }) {
    try {
        const response = await axios.get(`/api/user/${username}`);
        return response.data;
    }
    catch (error) {
        return { error: 'Error fetching user data. Please try again.' };
    }
}

// register user function
export async function registerUser(credential) {
    try {
        const { data: { msg }, status } = await axios.post(`/api/register`, credential);

        let { username, email } = credential;

        if (status === 201) {
            await axios.post('/api/registerMail', { username, userEmail: email, text: msg });
        }

        return msg;
    }
    catch (error) {
        return { error: 'Error registering user. Please try again.' };
    }
}

// login function
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const response = await axios.post('/api/login', { username, password });
            return response.data;
        }
    }
    catch (error) {
        return { error: "Password doesn't Match. Please try again." };
    }
}


// update user function
export async function updateUser(responseData) {
    try {
        const token = await localStorage.getItem('token');
        const response = await axios.put('/api/updateUser', responseData, {headers: {"Authorization" : `Bearer ${token}`}});
        return response.data;
    }
    catch (error) {
        return { error: "Couldn't Update Profile." };
    }
}

// generate OTP
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // send mail with otp
        if (status === 201) {
            let { email } = await getUser({ username });
            let text = `Your password recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password recovery OTP" });
        }

        return code;
    }
    catch (error) {
        return { error: "Couldn't generate OTP." };
    }
}

// verify OTP
export async function verifyOTP({username, code}) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return {data, status};
    }
    catch (error) {
        return { error: "Couldn't verify OTP." };
    }
}

// reset password
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return { data, status };
    }
    catch (error) {
        return { error: "Couldn't reset Password." };
    }
}
