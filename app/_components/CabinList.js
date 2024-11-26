import React from 'react'
// import { unstable_noStore as noStore } from 'next/cache';

import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";

export default async function CabinList({ filter }) {
    // noStore();
    const cabins = await getCabins();
    // console.log(cabins);
    if (cabins.length === 0) return null;
    let displayedCabins = cabins;

    if (filter === "small") {
        displayedCabins = cabins.filter((cabin) => cabin.max_capacity <= 3);
    }

    if (filter === "medium") {
        displayedCabins = cabins.filter((cabin) => cabin.max_capacity <= 6 && cabin.max_capacity > 3);
    }

    if (filter === "large") {
        displayedCabins = cabins.filter((cabin) => cabin.max_capacity > 6);
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
            {displayedCabins.map((cabin) => (
                <CabinCard cabin={cabin} key={cabin.id} />
            ))}
        </div>
    )
}
