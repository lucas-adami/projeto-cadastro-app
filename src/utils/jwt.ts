import { jwtDecode, JwtPayload } from 'jwt-decode'

interface JWTPayload {
    userId: number;
    email: string;
    iat: number;
    exp: number
}

export const decodeJwt = (token: string): JWTPayload => {
    const decoded = jwtDecode<JWTPayload>(token)
    return decoded
}

export const isTokenValid = async (token: string) => {
    try {
        const decode = decodeJwt(token)
        const timeLogged = Math.floor(Date.now() / 1000)
        return decode.exp > timeLogged
    } catch (error) {
        return false
    }
}

