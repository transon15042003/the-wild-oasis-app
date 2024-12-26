import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token, user }) {
            // Tùy chỉnh session nếu cần
            return session;
        },
        authorized({ auth, request }) {
            return auth?.user?.name ? true : false;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);