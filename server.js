const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

app.post('/verify-recaptcha', async (req, res) => {
    const { recaptchaToken, name, email, phone, subject, message } = req.body;
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: RECAPTCHA_SECRET,
                response: recaptchaToken
            }
        });
        if (response.data.success) {
            // Procesar formulario (e.g., enviar email)
            console.log('Formulario válido:', { name, email, phone, subject, message });
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});