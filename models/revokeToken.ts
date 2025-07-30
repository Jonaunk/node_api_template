
/**
 * Almacena los tokens JWT que han sido revocados.
 * Utiliza un Set para búsquedas eficientes.
 */
const revokedTokens: Set<string> = new Set();

/**
 * Agrega un token al conjunto de tokens revocados.
 * @param {string} token - El token JWT a revocar.
 */
export const addRevokeToken = (token: string): void => {
    revokedTokens.add(token);
}


/**
 * Verifica si un token ha sido revocado.
 * @param {string} token - El token JWT a verificar.
 * @returns {boolean} true si el token está revocado, false en caso contrario.
 */
export const isTokenRevoked = (token: string): boolean => {
    return revokedTokens.has(token);
}