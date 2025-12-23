/**
 * Authentication utility functions
 */

export const getStoredToken = () => {
  return localStorage.getItem('accessToken');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isUserLoggedIn = () => {
  return !!getStoredToken();
};

export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

/**
 * Route redirection based on user role after login
 * @param {Object} user - User object with role property
 * @param {Function} navigate - React Router navigate function
 */
export const handlePostLoginRedirect = (user, navigate) => {
  if (user?.role === 'admin') {
    navigate('/admin/dashboard');
  } else {
    navigate('/');
  }
};

