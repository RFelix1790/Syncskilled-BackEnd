export const cookieBase = {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
}

export function setAuthCookies(res, accessToken, refreshToken){
    res.cookie('access_token', accessToken, cookieBase)
    res.cookie('refresh_token', refreshToken, cookieBase)
}

export function clearAuthCookies(res){
    res.clearCookie('access_token', cookieBase)
    res.clearCookie('refresh_token', cookieBase)
}