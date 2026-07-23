import Image from "next/image";
import { signInAction } from "../_lib/actions";
import { GOOGLE_LOGO_URL } from "../_lib/constants";

function SignInButton() {
    return (
        <form action={signInAction}>
            <button className="flex items-center gap-6 text-lg border border-primary-300 px-10 py-4 font-medium">
                <Image
                    src={GOOGLE_LOGO_URL}
                    alt="Google logo"
                    height="24"
                    width="24"
                />
                <span>Continue with Google</span>
            </button>
        </form>
    );
}

export default SignInButton;
