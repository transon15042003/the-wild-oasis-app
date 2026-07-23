import React from "react";
// import { unstable_noStore as noStore } from 'next/cache';

import CabinCard from "@/app/_components/CabinCard";
import {
    CAPACITY_FILTER,
    CAPACITY_MEDIUM_MAX,
    CAPACITY_SMALL_MAX,
} from "@/app/_lib/constants";
import { getCabins } from "@/app/_lib/data-service";

export default async function CabinList({ filter }) {
    // noStore();
    const cabins = await getCabins();
    //   console.log(cabins);
    if (cabins.length === 0) return null;
    let displayedCabins = cabins;

    if (filter === CAPACITY_FILTER.small) {
        displayedCabins = cabins.filter(
            (cabin) => cabin.max_capacity <= CAPACITY_SMALL_MAX
        );
    }

    if (filter === CAPACITY_FILTER.medium) {
        displayedCabins = cabins.filter(
            (cabin) =>
                cabin.max_capacity <= CAPACITY_MEDIUM_MAX &&
                cabin.max_capacity > CAPACITY_SMALL_MAX
        );
    }

    if (filter === CAPACITY_FILTER.large) {
        displayedCabins = cabins.filter(
            (cabin) => cabin.max_capacity > CAPACITY_MEDIUM_MAX
        );
    }

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
            {displayedCabins.map((cabin) => (
                <CabinCard cabin={cabin} key={cabin.id} />
            ))}
        </div>
    );
}
