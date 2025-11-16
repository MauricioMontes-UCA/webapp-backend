import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export function verifyValidEmail(email) {
    let isValid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        isValid = !isValid;
    }

    return isValid;
}

export function verifyValidPassword(password) {
    let isValid = true;
    let errorMessage = "";

    if (!/.{12,}/.test(password)) {
        errorMessage = "La contraseña debe tener al menos 12 caracteres";
        isValid = !isValid;
    }
    if (!/[A-Z]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos una letra mayúscula"
        isValid = !isValid;
    }
    if (!/[a-z]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos una letra minúscula";
        isValid = !isValid;
    }
    if (!/[0-9]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos un número";
        isValid = !isValid;
    }
    if (!/[#?!@$%^&*\-]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos un símbolo especial (#?!@$%^&*-)";
        isValid = !isValid;
    }

    return { 
        "isValid": isValid, 
        "message": errorMessage 
    }
}