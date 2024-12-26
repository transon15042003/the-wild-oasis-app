import { ReservationProvider } from "@/app/_contexts/ReservationContext";
import "@/app/_styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/app/_contexts/AuthContext";
import Header from "./_components/Header";

const josefin = Josefin_Sans({
    subsets: ["latin"],
    display: "swap",
});

export const metadata = {
    // title: "The Wild Oasis",
    title: {
        template: "%s | The Wild Oasis",
        default: "Welcome to The Wild Oasis",
    },
    description: "The Wild Oasis",
};

export default function RootLayout({ children }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <html lang="en">
                    <body
                        className={`${josefin.className} bg-primary-950 text-primary-100 flex flex-col min-h-screen antialiased`}
                    >
                        <Header />
                        <div className="flex-1 px-8 py-12 grid">
                            <main className="max-w-7xl mx-auto w-full">
                                <ReservationProvider>
                                    {children}
                                </ReservationProvider>
                            </main>
                        </div>
                    </body>
                </html>
            </AuthProvider>
        </SessionProvider>
    );
}
