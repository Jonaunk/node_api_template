export const config = {
    jwtSecret: process.env.JWT_SECRET as string || "My_Secret_Key",

}

export default config;