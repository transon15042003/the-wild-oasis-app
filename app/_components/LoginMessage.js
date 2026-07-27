import Link from "next/link";
import { ROUTES } from "@/app/_lib/constants";

function LoginMessage() {
  return (
    <div className="grid bg-primary-800 ">
      <p className="text-center text-xl py-12 self-center">
        Please{" "}
        <Link href={ROUTES.login} className="underline text-accent-500">
          sign in
        </Link>{" "}
        to reserve this
        <br /> cabin right now
      </p>
    </div>
  );
}

export default LoginMessage;
