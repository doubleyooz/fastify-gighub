import * as bcrypt from 'bcrypt';

export const hashPassword = async (
    password: string,
    salt?: number,
): Promise<string> => {
    return await bcrypt.hash(
        password,
        salt ?? Number(process.env.HASH_SALT) ?? 10,
    );
};

export const matchPassword = async (
    password: string,
    supposedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(supposedPassword, password);
};
