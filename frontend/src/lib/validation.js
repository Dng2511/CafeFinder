/**
 * Form validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password, minLength = 8) => {
  return password && password.length >= minLength;
};

export const validatePasswords = (password, confirmPassword) => {
  return password === confirmPassword;
};

