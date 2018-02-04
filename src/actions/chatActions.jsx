export const RECEIVE_USER = 'RECEIVE_USER';

export const receiveSessionUser = (data) => {
  return {
    type: RECEIVE_USER,
    user: data
  };
};
