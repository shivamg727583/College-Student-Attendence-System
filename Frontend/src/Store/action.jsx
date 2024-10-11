// store/actions.js
export const login = (userType) => {
    return {
      type: 'LOGIN',
      payload: {
        userType, // 'admin' or 'teacher'
      },
    };
  };
  
  export const logout = () => {
    return {
      type: 'LOGOUT',
    };
  };
  