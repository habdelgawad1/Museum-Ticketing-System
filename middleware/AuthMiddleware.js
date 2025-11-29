const sanitizeInput = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/'/g, "''").toLowerCase();
  };
 
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  const isStrongPassword = (password) => {
    if (!password) return false;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passRegex.test(password.trim());
  };
 
  const validateRequired = (fields, requiredKeys) => {
    for (const key of requiredKeys) {
      if (!fields[key] || !String(fields[key]).trim()) {
        return `${key} is required`;
      }
    }
    return null; 
  };
 
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!isValidEmail(email)) return 'Invalid email format';
    return null;
  };
 
  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (!isStrongPassword(password))
      return 'Password must have 8+ chars, upper, lower, number, and special char';
    return null;
  };

  const validateSignup = (req, res, next) => {
        let { name, email, password } = req.body;
        name = sanitizeInput(name);
        email = sanitizeInput(email);
        password = sanitizeInput(password);

        const requiredError = validateRequired(req.body, ['name', 'email', 'password']);
        if (requiredError) {
            return res.status(400).json({ error: requiredError });
        }

        const emailError = isValidEmail(email);
        if (emailError) {
            return res.status(400).json({ error: emailError });
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
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
            return res.status(400).json({ error: requiredError });
        }

        const emailError = validateEmail(email);
        if (emailError) {
            return res.status(400).json({ error: emailError });
        }

        req.body.email = email;
        next();
    };

    const validateUserUpdate = (req, res, next) => {
        if (req.body.name) updates.name = sanitizeInput(req.body.name);
        if (req.body.email) {
            updates.email = sanitizeInput(req.body.email);
            const emailError = validateEmail(updates.email);
            if (emailError) {
                return res.status(400).json({ error: emailError });
            }
        }

        if (req.body.password) {
            const passwordError = validatePassword(req.body.password);
            if (passwordError) {
                return res.status(400).json({ error: passwordError });
            }
        req.body = { ...req.body, ...updates };
        next();
    }; 
};

module.exports = {
    validateSignup,
    validateLogin,
    validateUserUpdate
};