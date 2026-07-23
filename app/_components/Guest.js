"use client";

import { useAuth } from "@/app/_contexts/AuthContext";
import { ROUTES } from "@/app/_lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function Guest() {
    const session = useAuth();
    // console.log(session);
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
                    <span>Guest area</span>
                </Link>
            ) : (
                <Link
                    href={ROUTES.account}
                    className="hover:text-accent-400 transition-colors"
                >
                    Guest area
                </Link>
            )}
        </li>
    );
}
