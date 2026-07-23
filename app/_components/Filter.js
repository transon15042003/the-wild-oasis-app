"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
    CAPACITY_FILTER,
    CAPACITY_FILTER_PARAM,
    CAPACITY_FILTERS,
} from "@/app/_lib/constants";

export default function Filter() {
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const filter =
        searchParams.get(CAPACITY_FILTER_PARAM) || CAPACITY_FILTER.all;

    function handleFilter(nextFilter) {
        const params = new URLSearchParams(searchParams);
        params.set(CAPACITY_FILTER_PARAM, nextFilter);
        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="border border-primary-800 flex">
            {CAPACITY_FILTERS.map(({ value, label }) => (
                <Button
                    key={value}
                    filter={value}
                    handleFilter={handleFilter}
                    activeFilter={filter}
                >
                    {label}
                </Button>
            ))}
        </div>
    );
}

function Button({ children, filter, handleFilter, activeFilter }) {
    return (
        <button
            className={`py-2 px-5 hover:bg-primary-700 ${activeFilter === filter ? "bg-primary-700 text-primary-50" : ""}`}
            onClick={() => handleFilter(filter)}
        >
            {children}
        </button>
    );
}
