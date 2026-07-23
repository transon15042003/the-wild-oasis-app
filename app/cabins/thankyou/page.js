import Link from "next/link";
import { ROUTES } from "@/app/_lib/constants";

export default function Page() {
    return (
        <div className="text-center space-y-6 mt-4">
            <h1 className="text-3xl font-semibold">
                Thank you for your reservation!
            </h1>
            <Link
                href={ROUTES.reservations}
                className="underline text-xl text-accent-500 inline-block"
            >
                Manage your reservations &rarr;
            </Link>
        </div>
    );
}
