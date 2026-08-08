import { removeCookie } from './cookies';

export const clearAllAuthData = () => {
    removeCookie('token');
    removeCookie('refresh_token');
};
