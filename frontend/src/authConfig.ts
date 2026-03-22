// src/auth/msalConfig.ts

export const msalConfig = {
  auth: {
    clientId: "46e7c75f-d5ec-4764-81ff-4c6da7fbeb05",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:5173",
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};
