import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";


export default withAuth({
    loginPage: "/api/auth/login",
    isReturnToCurrentPath: true,
})


export const config = {
    matcher: ["/dashboard/:path*"]
}

