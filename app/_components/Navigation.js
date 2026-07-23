import Link from "next/link";
import { ROUTES } from "@/app/_lib/constants";
import Guest from "./Guest";

export default function Navigation({ children }) {
    return (
        <nav className="z-10 text-xl">
            <ul className="flex gap-16 items-center">
                <li>
                    <Link
                        href={ROUTES.cabins}
                        className="hover:text-accent-400 transition-colors"
                    >
                        Cabins
                    </Link>
                </li>
                <li>
                    <Link
                        href={ROUTES.about}
                        className="hover:text-accent-400 transition-colors"
                    >
                        About
                    </Link>
                </li>
                <Guest />
            </ul>
        </nav>
    );
}
