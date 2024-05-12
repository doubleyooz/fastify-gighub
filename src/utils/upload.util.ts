import { randomBytes } from 'node:crypto';

export const uniqueFileName = (filename: string) => {
    const hash = randomBytes(16);

    return `${hash.toString('hex')}-${filename}`;
};
