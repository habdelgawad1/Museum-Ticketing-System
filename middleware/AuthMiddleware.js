const sanitizeInput = (value) => {
    if (typeof value !== 'string') {
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

const validateRequired = (fields, requiredKeys) => {
    for (const key of requiredKeys) {
        if (!fields[key] || !String(fields[key]).trim()) {
            return `Missing required field: ${key}`;
        }
    }
    return null;
};

const validateEmail = (email) => {
    if (!isValidEmail(email)) {
        return 'Invalid email format';
    }
    return null;
};

const validatePassword = (password) => {
    if (!isStrongPassword(password)) {
        return 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
    }
    return null;
};

const validateSignup = (req, res, next) => {
    let { name, email, password} = req.body;
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    password = sanitizeInput(password);

    const requiredError = validateRequired(req.body, ['name', 'email', 'password']);
    if (requiredError) {
        return res.status(400).json({ message: requiredError});
    }

    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ message: emailError});
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ message: passwordError});
    }

    req.body = { name, email, password};
    next();
};

const validateLogin = (req, res, next) => {
    let { email, password } = req.body;
    email = sanitizeInput(email);
    password = sanitizeInput(password);

    const requiredError = validateRequired(req.body, ['email', 'password']);
    if (requiredError) {
        return res.status(400).json({ message: requiredError});
    }

    const emailError = validateEmail(email);
    if (emailError) {
        return res.status(400).json({ message: emailError});
    }

    req.body = { email, password };
    next();
};

module.exports = {
    validateSignup,
    validateLogin
};