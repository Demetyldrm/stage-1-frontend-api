export const signUp = (email, password, username) => {
  return new Promise((resolve, reject) => {
    if (!email || !password || !username) {
      reject({ message: "All fields are required" });
    } else {
      resolve({
        data: {
          _id: "fake-user-id",
          name: username,
          email: email,
        },
        message: "Registration successful!",
      });
    }
  });
};

export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    resolve({ message: "registration successfull" });
  });
};

export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    resolve({ token: "a fake token" });
  });
};

export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    resolve({
      data: { name: "fake user", email: "fake@example,com", _id: "fake-id" },
    });
  });
};
