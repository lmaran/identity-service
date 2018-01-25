"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const PASSWORD_LENGTH = 64;
const SALT_LENGTH = 16;
const ITERATIONS = 10000;
const DIGEST = "sha1";
const BYTE_TO_STRING_ENCODING = "base64";
exports.passwordHelper = {
    generateHashPassword: (password) => {
        const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
        const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST);
        return {
            salt,
            hashedPassword: hash.toString(BYTE_TO_STRING_ENCODING),
        };
    },
    passwordMatch: (persistedPassword, passwordAttempt) => {
        let passwordMatched = pswMatch(passwordAttempt, persistedPassword.salt, persistedPassword.hashedPassword);
        if (!passwordMatched) {
            const newSalt = new Buffer(persistedPassword.salt, "base64");
            passwordMatched = pswMatch(passwordAttempt, newSalt, persistedPassword.hashedPassword);
        }
        return passwordMatched;
    },
};
const pswMatch = (plainTextPsw, salt, hashedPsw) => {
    const hashedResult = crypto.pbkdf2Sync(plainTextPsw, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST);
    return hashedPsw === hashedResult.toString(BYTE_TO_STRING_ENCODING);
};
