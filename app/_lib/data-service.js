import { eachDayOfInterval } from "date-fns";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import {
    BOOKING_STATUS,
    CABINS_REVALIDATE_SECONDS,
    COUNTRIES_API_URL,
    COUNTRIES_REVALIDATE_SECONDS,
    TABLES,
} from "./constants";
import { supabase } from "./supabase";
/////////////
// GET

async function fetchCabin(id) {
    const { data, error } = await supabase
        .from(TABLES.cabins)
        .select("*")
        .eq("id", id)
        .single();

    // For testing
    // await new Promise((res) => setTimeout(res, 2000));

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}

const getCachedCabin = unstable_cache(
    async (id) => fetchCabin(id),
    ["cabin"],
    { revalidate: CABINS_REVALIDATE_SECONDS, tags: ["cabins"] }
);

export async function getCabin(id) {
    const data = await getCachedCabin(String(id));

    if (!data) return notFound();
    return data;
}

export async function getCabinPrice(id) {
    const { data, error } = await supabase
        .from(TABLES.cabins)
        .select("regular_price, discount")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
    }

    return data;
}

export const getCabins = unstable_cache(
    async function () {
        const { data, error } = await supabase
            .from(TABLES.cabins)
            .select("id, name, max_capacity, regular_price, discount, image")
            .order("name");

        if (error) {
            console.error(error);
            throw new Error("Cabins could not be loaded");
        }

        // For testing
        // await new Promise((res) => setTimeout(res, 2000));

        return data;
    },
    ["cabins"],
    { revalidate: CABINS_REVALIDATE_SECONDS, tags: ["cabins"] }
);

// Guests are uniquely identified by their email address
export async function getGuest(email) {
    const { data, error } = await supabase
        .from(TABLES.guests)
        .select("*")
        .eq("email", email)
        .single();

    // No error here! We handle the possibility of no guest in the sign in callback
    return data;
}

export async function getBooking(id) {
    const { data, error, count } = await supabase
        .from(TABLES.bookings)
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not get loaded");
    }

    return data;
}

export async function getBookings(guest_id) {
    const { data, error, count } = await supabase
        .from(TABLES.bookings)
        // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
        .select(
            "id, created_at, start_date, end_date, num_nights, num_guests, total_price, guest_id, cabin_id, cabins(name, image)"
        )
        .eq("guest_id", guest_id)
        .order("start_date");

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    return data;
}

export async function getBookedDatesByCabinId(cabin_id) {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today = today.toISOString();

    // await new Promise((res) => setTimeout(res, 2000));

    // Getting all bookings
    const { data, error } = await supabase
        .from(TABLES.bookings)
        .select("*")
        .eq("cabin_id", cabin_id)
        .or(
            `start_date.gte.${today},status.eq.${BOOKING_STATUS.checkedIn}`
        );

    if (error) {
        console.error(error);
        throw new Error("Bookings could not get loaded");
    }

    // Converting to actual dates to be displayed in the date picker
    const bookedDates = data
        .map((booking) => {
            return eachDayOfInterval({
                start: new Date(booking.start_date),
                end: new Date(booking.end_date),
            });
        })
        .flat();

    return bookedDates;
}

export async function getSettings() {
    const { data, error } = await supabase
        .from(TABLES.settings)
        .select("*")
        .single();

    if (error) {
        console.error(error);
        throw new Error("Settings could not be loaded");
    }

    return data;
}

export async function getCountries() {
    const res = await fetch(COUNTRIES_API_URL, {
        next: { revalidate: COUNTRIES_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
        throw new Error("Could not fetch countries");
    }

    const { data, error } = await res.json();

    if (error || !Array.isArray(data)) {
        throw new Error("Could not fetch countries");
    }

    return data;
}

/////////////
// CREATE

export async function createGuest(newGuest) {
    const { data, error } = await supabase
        .from(TABLES.guests)
        .insert([newGuest]);

    if (error) {
        console.error(error);
        throw new Error("Guest could not be created");
    }

    return data;
}

export async function createBooking(newBooking) {
    const { data, error } = await supabase
        .from(TABLES.bookings)
        .insert([newBooking])
        // So that the newly created object gets returned!
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not be created");
    }

    return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
    const { data, error } = await supabase
        .from(TABLES.guests)
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Guest could not be updated");
    }
    return data;
}

export async function updateBooking(id, updatedFields) {
    const { data, error } = await supabase
        .from(TABLES.bookings)
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not be updated");
    }
    return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
    const { data, error } = await supabase
        .from(TABLES.bookings)
        .delete()
        .eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Booking could not be deleted");
    }
    return data;
}
