import Link from "next/link";
import { ROUTES } from "@/app/_lib/constants";

function NotFound() {
  return (
    <main className='text-center space-y-6 mt-4'>
      <h1 className='text-3xl font-semibold'>
        This cabin could not be found :(
      </h1>
      <Link
        href={ROUTES.cabins}
        className='inline-block bg-accent-500 text-primary-800 px-6 py-3 text-lg'
      >
        Back to all cabins
      </Link>
    </main>
  );
}

export default NotFound;
