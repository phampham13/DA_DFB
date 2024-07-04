export const createAuthHeader = (tokenc) => {
  return {
    token: `Bearer ${tokenc}`,
  };
};
