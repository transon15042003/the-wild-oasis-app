"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

export default function Filter() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const filter = searchParams.get("capacity") || "all";

    function handleFilter(filter) {
        const params = new URLSearchParams(searchParams);
        params.set("capacity", filter);
        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="border border-primary-800 flex">
            <Button filter="all" handleFilter={handleFilter} activeFilter={filter}>All</Button>
            <Button filter="small" handleFilter={handleFilter} activeFilter={filter}>1&mdash;3 guests</Button>
            <Button filter="medium" handleFilter={handleFilter} activeFilter={filter}>3&mdash;6 guests</Button>
            <Button filter="large" handleFilter={handleFilter} activeFilter={filter}>7&mdash;10 guests</Button>
        </div>
    )
}

function Button({ children, filter, handleFilter, activeFilter }) {
    return (
        <button className={`py-2 px-5 hover:bg-primary-700 ${activeFilter === filter ? "bg-primary-700 text-primary-50" : ""}`} onClick={() => handleFilter(filter)}>{children}</button>
    )
}
