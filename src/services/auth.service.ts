import { MIN_PASSWORD_LENGTH } from "../constants/auth";
import { AppError } from "../errors/AppError";
import { signAccessToken } from "../libs/jwt";
import { createUser, findUserByEmail, findUserByEmailWithPassword } from "../repositories/user.repository";
import bcrypt from "bcrypt";

export async function registerUser(email: string, password: string): Promise<void> {
    if (!email || !password) {
        throw new AppError(400, "Email and Password requried")
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new AppError(400, `Password should be atleast ${MIN_PASSWORD_LENGTH} character.`)
    };

    const normalizeEmail = email.toLocaleLowerCase().trim()

    const existingUser = await findUserByEmail(normalizeEmail)

    if (existingUser) {
        throw new AppError(409, "Email already present")
    };

    const passwordHash = await bcrypt.hash(password, 10);

    await createUser(normalizeEmail, passwordHash);
};

export async function logInUser(email: string, password: string): Promise<{accessToken: string}> {

    if (!email || !password) {
        throw new AppError(400, "Email and Password are required")
    }

    const normalizeEmail = email.toLowerCase().trim()
    const user = await findUserByEmailWithPassword(normalizeEmail)
    if (!user?.password_hash) {
        throw new AppError(401, "Invalid email or password")
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password_hash)
    if(!isPasswordvalid) {
        throw new AppError(401, "Invalid email or password")
    }

    const accessToken = signAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
    })
    return { accessToken }
}