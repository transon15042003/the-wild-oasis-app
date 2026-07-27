"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { ROUTES } from "@/app/_lib/constants";
import Image from "next/image";
import Link from "next/link";

function AccountNavInner() {
    const { data: session } = useSession();

    return (
        <li>
            {session?.user?.name ? (
                <Link
                    href={ROUTES.account}
                    className="hover:text-accent-400 transition-colors flex items-center gap-4"
                >
                    <Image
                        className="h-8 rounded-full"
                        src={session.user.image}
                        alt={session.user.name}
                        width={32}
                        height={32}
                    />
                    <span>Account</span>
                </Link>
            ) : (
                <Link
                    href={ROUTES.login}
                    className="hover:text-accent-400 transition-colors"
                >
                    Login
                </Link>
            )}
        </li>
    );
}

export default function AccountNav() {
    return (
        <SessionProvider>
            <AccountNavInner />
        </SessionProvider>
    );
}
