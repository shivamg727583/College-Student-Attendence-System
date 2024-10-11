// store/userReducer.js
const initialState = {
    userType: "Teacher",
    isLoggedIn: true,
  };
  
  export const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOGIN':
        return {
          ...state,
          userType: action.payload.userType, 
          isLoggedIn: true,
        };
      case 'LOGOUT':
        return {
          ...state,
          userType: null,
          isLoggedIn: false,
        };
      default:
        return state;
    }
  };
  