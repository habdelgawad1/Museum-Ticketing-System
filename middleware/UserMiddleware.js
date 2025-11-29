const sanitizeInput = (value) => {
    if (typeof value !== 'string') return "";{
        return value.trim().replace(/'/g, "''");
    }
};

const isValidEmail = (email) => {
    if (!email){
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isStrongPassword = (password) => {
    if (!password || password.length < 8) {
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const validateUpdateProfile = (req, res, next) => {
    let { userID, name, email, password, phone} = req.body;
    if (!userID || !name || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    email = sanitizeInput(email);
    
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid Email Format"});
    }

    if (password !== undefined && password !== null && String(password).trim() !== "") {
        password = sanitizeInput(password);
        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"});
        }

        req.body = { name, password, email, phone, role};
        next();
    };
}

module.exports = {
    validateUpdateProfile
};