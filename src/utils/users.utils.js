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
        isValid = false;
    }
    if (!/[A-Z]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos una letra mayúscula"
        isValid = false;
    }
    if (!/[a-z]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos una letra minúscula";
        isValid = false;
    }
    if (!/[0-9]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos un número";
        isValid = false;
    }
    if (!/[#?!@$%^&*\-]/.test(password)) {
        errorMessage = "La contraseña debe contener al menos un símbolo especial (#?!@$%^&*-)";
        isValid = false;
    }

    return { 
        "isValid": isValid, 
        "message": errorMessage 
    }
}