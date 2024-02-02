import axios from 'axios';


axios.defaults.baseURL = "http://localhost:8080";
// make api request


// authenticate function
export async function authenticate(username) {
    console.log('response', await axios.post('/api/authenticate', { username }))
    try {
        const response = await axios.post('/api/authenticate', { username });
        return response.data;
    }
    catch (error) {
        return handleRequestError(error, 'Authentication failed. Username does not exist...!');
    }
}


// to get user detail
export async function getUser({ username }) {
    try {
        const response = await axios.get(`/api/user/${username}`);
        return response.data;
    }
    catch (error) {
        return handleRequestError(error, 'Error fetching user data. Please try again.');
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
        return handleRequestError(error, 'Error registering user. Please try again.');
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
        return handleRequestError(error, "Password doesn't Match. Please try again.");
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
        return handleRequestError(error, "Couldn't Update Profile.");
    }
}

// generate OTP
export async function generateOTP(username) {
    try {
        const { data: { code }, status } = await axios.get('/api/generateOTP', { params: { username } });

        // send mail with otp
        if (status === 201) {
            let { data: { email } } = await getUser({ username });
            let text = `Your password recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject: "Password recovery OTP" });
        }

        return code;
    }
    catch (error) {
        return handleRequestError(error, "Couldn't generate OTP.");
    }
}

// verify OTP
export async function verifyOTP({username, code}) {
    try {
        const { data, status } = await axios.get('/api/verifyOTP', { params: { username, code } });
        return {data, status};
    }
    catch (error) {
        return handleRequestError(error, "Couldn't verify OTP.");
    }
}

// reset password
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return { data, status };
    }
    catch (error) {
        return handleRequestError(error, "Couldn't reset Password.");
    }
}



// handle error
function handleRequestError(error, defaultMessage) {
    if (error.response) {
        console.error('Server responded with an error status:', error.response.status);
        console.error('Response data:', error.response.data);
    } else if (error.request) {
        console.error('No response received from the server');
    } else {
        console.error('Error during request setup:', error.message);
    }

    throw { error: defaultMessage };
}