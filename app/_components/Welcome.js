"use client";

import { useAuth } from "@/app/_contexts/AuthContext";

export default function Welcome() {
    const session = useAuth();
    const firstName = session?.user?.name.split(" ")[0];
    return (
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
            Welcome, {firstName}
        </h2>
    );
}
