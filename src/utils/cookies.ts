const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface SetCookieOptions {
    /** Omit (or pass session: true) for a session cookie cleared on browser close. */
    session?: boolean;
    maxAge?: number;
    path?: string;
}

export function setCookie(
    name: string,
    value: string,
    { session = false, maxAge = DEFAULT_MAX_AGE, path = '/' }: SetCookieOptions = {}
): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    const age = session ? '' : `; Max-Age=${maxAge}`;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=Strict${age}${secure}`;
}

export function getCookie(name: string): string | null {
    const prefix = `${encodeURIComponent(name)}=`;
    const match = document.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(prefix));

    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export function removeCookie(name: string, path = '/'): void {
    document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Max-Age=0; SameSite=Strict`;
}
