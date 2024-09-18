import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(password: string, age: number): Promise<string> {
    const passwordWithAge = `${age}:${password}`;
    return bcrypt.hash(passwordWithAge, saltRounds);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string, age: number): Promise<boolean> {
    const passwordWithAge = `${age}:${plainPassword}`;
    return await bcrypt.compare(passwordWithAge, hashedPassword);
}
