// lib/actions/roleCheck.js
export const checkUserRole = (requiredRoles) => {
  return async (session) => {
    if (!session) {
      return { authorized: false, redirect: '/auth/signin' };
    }
    
    if (!requiredRoles.includes(session.user.role)) {
      return { authorized: false, redirect: '/dashboard' };
    }
    
    return { authorized: true };
  };
};