// Módulo desacoplado para reCAPTCHA (cambiar 'v2' a 'v3' para migrar)
const recaptchaConfig = {
    version: 'v2', // Cambia a 'v3' en el futuro
    siteKey: '6LcMGwIsAAAAAICmNGf1y9jCzTRjpL0rUhMjELuO'
};

// Validación reactiva en blur
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field.id));
    field.addEventListener('input', () => {
        clearError(field.id);
        if (field.id === 'phone') formatPhone(field);
    });
});

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Validación completa
    const errors = validateForm();
    if (errors.length > 0) {
        displayErrors(errors);
        btn.disabled = false;
        btn.textContent = 'Enviar';
        return;
    }

    // Obtener token reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        document.getElementById('captchaError').textContent = 'Completa el reCAPTCHA.';
        btn.disabled = false;
        btn.textContent = 'Enviar';
        return;
    }

    // Simulación: siempre éxito para pruebas
    const result = { success: true };
    if (result.success) {
        document.getElementById('feedback').textContent = 'Mensaje enviado exitosamente.';
        document.getElementById('contactForm').reset();
        grecaptcha.reset(); // Reset reCAPTCHA
    } else {
        document.getElementById('captchaError').textContent = 'Error en verificación.';
    }
    btn.disabled = false;
    btn.textContent = 'Enviar';
});

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    let msg = '';
    switch (fieldId) {
        case 'name':
            if (!value) msg = 'Nombre requerido.';
            break;
        case 'email':
            if (!value || !/\S+@\S+\.\S+/.test(value)) msg = 'Email válido requerido.';
            break;
        case 'phone':
            const digits = value.replace(/\D/g, '');
            if (!digits || digits.length < 10) msg = 'Teléfono válido requerido (10 dígitos).';
            break;
        case 'subject':
            if (!value) msg = 'Asunto requerido.';
            break;
        case 'message':
            if (!value) msg = 'Mensaje requerido.';
            break;
    }
    document.getElementById(fieldId + 'Error').textContent = msg;
    return !msg;
}

function clearError(fieldId) {
    document.getElementById(fieldId + 'Error').textContent = '';
}

function validateForm() {
    const errors = [];
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    fields.forEach(field => {
        if (!validateField(field)) {
            const msg = document.getElementById(field + 'Error').textContent;
            if (msg) errors.push({ field, msg });
        }
    });
    return errors;
}

function displayErrors(errors) {
    errors.forEach(err => {
        document.getElementById(err.field + 'Error').textContent = err.msg;
    });
}

function formatPhone(field) {
    let value = field.value.replace(/\D/g, ''); // Solo dígitos
    if (value.length > 10) value = value.slice(0, 10); // Máx 10 dígitos
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    field.value = value;
}
