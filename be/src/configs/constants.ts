
export const DATABASE_URL=process.env.DATABASE_URL??"default-dbUrl";
export const JWTSECRET=process.env.AUTH_SECRET??"secret";
// export const JUDGE0_URL=`http://${process.env.MACHINE_PUBLIC_IP}:2358/`
export const JUDGE0_URL=process.env.JUDGE0_MACHINE_URL;