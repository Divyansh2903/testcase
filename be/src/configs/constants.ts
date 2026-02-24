
export const DATABASE_URL=process.env.DATABASE_URL??"default-dbUrl";
export const JWTSECRET=process.env.AUTH_SECRET??"secret";
// export const JUDGE0_URL=`http://${process.env.MACHINE_PUBLIC_IP}:2358/`
export const JUDGE0_URL=process.env.JUDGE0_MACHINE_URL;

export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_COOKIE_MAX_AGE_DAYS = 7;
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";