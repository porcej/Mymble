/**
 * Fetch API
 *   Wraps fetch for use with Dieavas admin API
 * @Mymble
 * @author joe@kt3i.com
 * @version 0.0.1
 * @license MIT
 */
import { useAuthStore } from '@/stores';

/**
 * fetch api request entry points
 */
export const fetchApi = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

/**
 * Request - wraps fetch to handle an api with authentication 
 *
 * @params {String} method http method GET|POST|PUT|DELETE
 * @returns {Promise} Handled API Response
 */
function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.body = JSON.stringify(body);
        }
        return fetch(url, requestOptions).then(handleResponse);
    }
}

// helper functions

/**
 * authHeader - return auth header with jwt if user is logged in and request
 *              is to the api url
 *
 * @params {String} url requested url
 * @returns {Object} Header Object with Authorization set to bearer token
 */
function authHeader(url) {
    // 
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

/**
 * handleResponse - unwraps json and handles fetch responses
 *
 * @params {String} url requested url
 * @returns {Object} response data or Promise rejection on error
 */
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const { user, logout } = useAuthStore();
            if ([401, 403].includes(response.status) && user) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}    
