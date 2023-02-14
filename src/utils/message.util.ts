import * as messages from './messages.json';

type messageOptions = {
    [key: string]: string;
};
export const getMessage = (path: string) => {
    const m: messageOptions = { ...messages };
    return m[path] || undefined;
};