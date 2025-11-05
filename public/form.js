// Configuración reCAPTCHA v3
const recaptchaConfig = {
    version: 'v3',
    siteKey: '6LdyMAIsAAAAAHcLY89Agn3P0Rl8tcRZd4gvPRGe'
};

// Validación en tiempo real
document.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
        const isValid = validateField(field.id);
        field.setAttribute('aria-invalid', !isValid);
    });
    field.addEventListener('input', () => {
        clearError(field.id);
        field.setAttribute('aria-invalid', 'false');
        if (field.id === 'phone') formatPhone(field);
    });
});

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    // Verificar conexión a internet y reCAPTCHA
    if (!navigator.onLine || typeof grecaptcha === 'undefined') {
        showError('Se requiere conexión a internet para enviar el formulario.');
        btn.disabled = false;
        btn.textContent = 'Enviar';
        return;
    }

    // Validación completa
    const errors = validateForm();
    if (errors.length > 0) {
        displayErrors(errors);
        // Auto-enfocar el primer campo con error
        const firstErrorField = document.getElementById(errors[0].field);
        firstErrorField.focus();
        btn.disabled = false;
        btn.textContent = 'Enviar';
        return;
    }

    // Ejecutar reCAPTCHA v3
    try {
        const recaptchaToken = await grecaptcha.execute(recaptchaConfig.siteKey, { action: 'submit' });
        
        // Enviar a backend
        const response = await fetch('/verify-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.replace(/\D/g, ''),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                recaptchaToken
            })
        });
        const result = await response.json();
        if (result.success) {
            showSuccess('¡Mensaje enviado exitosamente! Gracias por contactarnos.');
            document.getElementById('contactForm').reset();
            // Reset aria-invalid
            document.querySelectorAll('input, textarea').forEach(field => {
                field.setAttribute('aria-invalid', 'false');
            });
        } else {
            showError('Error en la verificación. Inténtalo de nuevo.');
        }
    } catch (error) {
        showError('Error al enviar el formulario. Verifica tu conexión a internet.');
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
            if (!value || value.length < 2) msg = 'Por favor, ingresa un nombre válido.';
            break;
        case 'email':
            if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Por favor, ingresa un email válido.';
            break;
        case 'phone':
            const digits = value.replace(/\D/g, '');
            if (!digits || digits.length < 10) msg = 'Por favor, ingresa un teléfono válido (10 dígitos).';
            break;
        case 'subject':
            if (!value || value.length < 3) msg = 'Por favor, ingresa un asunto válido.';
            break;
        case 'message':
            if (!value || value.length < 10) msg = 'Por favor, ingresa un mensaje de al menos 10 caracteres.';
            break;
    }
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = msg;
    errorElement.classList.toggle('error', !!msg);
    return !msg;
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = '';
    errorElement.classList.remove('error');
}

function validateForm() {
    const errors = [];
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    fields.forEach(field => {
        if (!validateField(field)) {
            errors.push({ field, msg: document.getElementById(field + 'Error').textContent });
        }
    });
    return errors;
}

function displayErrors(errors) {
    errors.forEach(err => {
        const errorElement = document.getElementById(err.field + 'Error');
        errorElement.textContent = err.msg;
        errorElement.classList.add('error');
    });
}

function formatPhone(field) {
    let value = field.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    field.value = value;
}

function showSuccess(message) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.classList.remove('error');
    feedback.classList.add('success');
}

function showError(message) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.classList.remove('success');
    feedback.classList.add('error');
}
