export const CAPACITY_FILTER = {
    all: "all",
    small: "small",
    medium: "medium",
    large: "large",
};

export const CAPACITY_FILTER_PARAM = "capacity";

/** Inclusive max capacity for the "small" filter (1–3 guests). */
export const CAPACITY_SMALL_MAX = 3;

/** Inclusive max capacity for the "medium" filter (4–6 guests). */
export const CAPACITY_MEDIUM_MAX = 6;

export const CAPACITY_FILTERS = [
    { value: CAPACITY_FILTER.all, label: "All" },
    { value: CAPACITY_FILTER.small, label: "1\u20143 guests" },
    { value: CAPACITY_FILTER.medium, label: "3\u20146 guests" },
    { value: CAPACITY_FILTER.large, label: "7\u201410 guests" },
];
