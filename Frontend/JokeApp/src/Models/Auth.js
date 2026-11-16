let authState = {
    token: null,
    role: null
}

export const setAuth = (token, role) => {
    authState.token = token,
    authState.role = role
};

export const getAuth = () => authState;

export const clearAuth = () => {
    authState.token = null,
    authState.role = null
};