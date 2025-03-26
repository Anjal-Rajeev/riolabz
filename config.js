export const PORT = process.env.PORT || 3000;
export const PROJECT_NAME = process.env.PROJECT_NAME;
export const SHORT_CODE = process.env.SHORT_CODE;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const COLLECTIONS = {
  USERS: "users",
  USER_TOKEN: "userTokens",
  CATEGORY: "categories",
  PRIVILEGE: "privilege",
};

export const PRIVILEGE = {
  ADMIN: "67e450ac7522fdbd212a6c62",
  USER: "67e450b97522fdbd212a6c63",
};
