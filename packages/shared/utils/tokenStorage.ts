import { STORAGE_KEYS, getFromStorage, setInStorage, removeFromStorage } from './storage';

/**
 * Token storage utility
 * Manages access token and user data in localStorage
 */
export const tokenStorage = {
  /**
   * Gets the access token from storage
   */
  getAccessToken: (): string | null => {
    return getFromStorage<string | null>(STORAGE_KEYS.ACCESS_TOKEN, null);
  },

  /**
   * Sets the access token in storage
   */
  setAccessToken: (token: string): boolean => {
    return setInStorage(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  

  /**
   * Clears all authentication data from storage
   */
  clearAll: (): boolean => {
    const tokenCleared = removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    const userCleared = removeFromStorage(STORAGE_KEYS.USER);
    return tokenCleared && userCleared;
  },

  /**
   * Checks if a user is authenticated (has a valid token)
   */
  isAuthenticated: (): boolean => {
    const token = tokenStorage.getAccessToken();
    return !!token;
  },
};
