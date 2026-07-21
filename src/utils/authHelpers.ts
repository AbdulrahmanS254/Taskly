export const clearAllAuthData = () => {
    // Clear LocalStorage & SessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refresh_token');

    // Clear Cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
};