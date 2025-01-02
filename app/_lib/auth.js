import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({ auth, request }) {
            return auth?.user?.name ? true : false;
        },
        async signIn({ user, account, profile }) {
            try {
                const existingUser = await getGuest(user.email);

                if (!existingUser) {
                    await createGuest({
                        email: user.email,
                        full_name: user.name,
                    });
                }

                return true;
            } catch {
                return false;
            }
        },
        async session({ session, token, user }) {
            // Tùy chỉnh session
            const guest = await getGuest(session.user.email);
            session.user.id = guest.id;

            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
