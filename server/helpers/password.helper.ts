// credit: https://stackoverflow.com/a/45652825
import * as crypto from "crypto";
import { IPersistedPassword } from "../interfaces";

const PASSWORD_LENGTH = 64; // 256
const SALT_LENGTH = 16; // 64
const ITERATIONS = 10000;
const DIGEST = "sha1"; // sha256, sha512
const BYTE_TO_STRING_ENCODING = "base64"; // "hex,"

export const passwordHelper = {
    generateHashPassword: (password: string): IPersistedPassword => {
        const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
        const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST);
        return {
            salt,
            hashedPassword: hash.toString(BYTE_TO_STRING_ENCODING),
        };
    },

    passwordMatch: (persistedPassword: IPersistedPassword, passwordAttempt: string): boolean => {
        let passwordMatched = pswMatch(passwordAttempt, persistedPassword.salt, persistedPassword.hashedPassword);

        // for compatibility with the old celebrate-taste app we have to try again, using a different salt
        // https://github.com/nodejs/node/issues/7464#issuecomment-292568824
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

// async versions
// export async function generateHashPassword3(password: string): Promise<IPersistedPassword> {
//     return new Promise<IPersistedPassword>((accept, reject) => {
//         const salt = crypto.randomBytes(SALT_LENGTH).toString(BYTE_TO_STRING_ENCODING);
//         crypto.pbkdf2(password, salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 accept({
//                     salt,
//                     hashedPassword: hash.toString(BYTE_TO_STRING_ENCODING),
//                 });
//             }
//         });
//     });
// }

// export async function passwordMatch3(persistedPassword: IPersistedPassword, passwordAttempt: string): Promise<boolean> {
//     return new Promise<boolean>((accept, reject) => {
//         crypto.pbkdf2(passwordAttempt, persistedPassword.salt, ITERATIONS, PASSWORD_LENGTH, DIGEST, (error, hash) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 accept(persistedPassword.hashedPassword === hash.toString(BYTE_TO_STRING_ENCODING));
//             }
//         });
//     });
// }
