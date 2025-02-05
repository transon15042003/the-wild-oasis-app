import { Suspense } from "react";

import Reservation from "@/app/_components/Reservation";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

export const generateMetadata = async ({ params }) => {
    const { name } = await getCabin(params.cabin_id);
    return {
        title: `Cabin ${name}`,
    };
};

export const generateStaticParams = async () => {
    const cabins = await getCabins();
    const ids = cabins.map((cabin) => ({ cabin_id: cabin.id.toString() }));
    return ids;
};

export default async function Page({ params }) {
    const cabin = await getCabin(params.cabin_id);

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <Cabin cabin={cabin} />

            <div>
                <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
                    Reserve {cabin.name} today. Pay on arrival.
                </h2>

                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}
