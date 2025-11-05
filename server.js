const express = require('express');
const path = require('path');
const { Client } = require('pg');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar base de datos PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect((err) => {
    if (err) {
        console.error('Error al conectar a PostgreSQL:', err.message);
        return;
    } else {
        console.log('Conectado a PostgreSQL.');
        client.query(`CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (err, res) => {
            if (err) {
                console.error('Error al crear tabla:', err.message);
            } else {
                console.log('Tabla submissions creada o ya existe.');
            }
        });
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

app.post('/verify-recaptcha', async (req, res) => {
    const { name, email, phone, subject, message, recaptchaToken } = req.body;
    console.log('Recibida solicitud de envío:', { name, email, phone, subject, message });

    // Verificar reCAPTCHA
    try {
        const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: RECAPTCHA_SECRET,
                response: recaptchaToken
            }
        });
        if (!recaptchaResponse.data.success) {
            console.log('reCAPTCHA falló:', recaptchaResponse.data);
            return res.status(400).json({ success: false, error: 'Verificación reCAPTCHA fallida' });
        }
    } catch (error) {
        console.error('Error verificando reCAPTCHA:', error.message);
        return res.status(500).json({ success: false, error: 'Error interno en verificación' });
    }

    // Guardar en base de datos
    try {
        const result = await client.query(
            `INSERT INTO submissions (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [name, email, phone, subject, message]
        );
        console.log(`Mensaje guardado en DB con ID: ${result.rows[0].id}`);
        res.json({ success: true });
    } catch (err) {
        console.error('Error al guardar en DB:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});