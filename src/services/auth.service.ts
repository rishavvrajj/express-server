import { MIN_PASSWORD_LENGTH } from '../constants/auth';
import { AppError } from '../errors/AppError';
import { signAccessToken } from '../libs/jwt';
import { createUser, findUserByEmail, findUserByEmailWithPassword } from '../repositories/user.repository';
import bcrypt from 'bcrypt';

export async function registerUser(email: string, password: string): Promise<void> {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser(normalizedEmail, passwordHash);
}

export async function logInUser(email: string, password: string): Promise<{ accessToken: string }> {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmailWithPassword(normalizedEmail);

  if (!user?.password_hash) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
}