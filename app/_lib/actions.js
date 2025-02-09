"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
    await signIn("google", { redirectTo: "/account" });
    revalidatePath("/");
}

export async function signOutAction() {
    await signOut({ redirectTo: "/" });
    revalidatePath("/");
}

export async function updateProfile(formData) {
    const { user } = await auth();
    if (!user) {
        throw new Error("User is not logged in");
    }

    const national_id = formData.get("national_id");
    const [nationality, country_flag] = formData.get("nationality").split("%");

    if (!/^[a-zA-Z0-9]{6,12}$/.test(national_id)) {
        throw new Error("Invalid national ID");
    }

    const updateData = { national_id, country_flag, nationality };
    const { error } = await supabase
        .from("guests")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

    if (error) {
        throw new Error("Guest could not be updated");
    }

    revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
    const { user } = await auth();
    if (!user) {
        throw new Error("User is not logged in");
    }

    const { cabin_id, start_date, end_date, num_nights, cabin_price } =
        bookingData;
    const num_guests = +formData.get("num_guests");
    const observations = formData.get("observations").slice(0, 200);

    const newBooking = {
        start_date,
        end_date,
        num_nights,
        num_guests,
        cabin_price: cabin_price,
        extras_price: 0,
        total_price: cabin_price,
        status: "unconfirmed",
        has_breakfast: false,
        is_paid: false,
        observations,
        guest_id: user.id,
        cabin_id,
    };

    console.log(newBooking);

    const { error } = await supabase.from("bookings").insert([newBooking]);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/cabins/${cabin_id}`);
    redirect("/cabins/thankyou");
}

export async function deleteBooking(booking_id) {
    const { user } = await auth();
    if (!user) {
        throw new Error("User is not logged in");
    }

    const bookings = await getBookings(user.id);
    const bookingIds = bookings.map((booking) => booking.id);
    if (!bookingIds.includes(booking_id)) {
        throw new Error("Not allowed to delete this booking");
    }

    const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", booking_id);

    if (error) {
        throw new Error("Booking could not be deleted");
    }

    revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
    const { user } = await auth();
    if (!user) {
        throw new Error("User is not logged in");
    }

    const bookingId = +formData.get("bookingId");
    const updatedFields = {
        num_guests: +formData.get("numGuests"),
        observations: formData.get("observations").slice(0, 200),
    };

    const bookings = await getBookings(user.id);
    const bookingIds = bookings.map((booking) => booking.id);
    if (!bookingIds.includes(bookingId)) {
        throw new Error("Not allowed to delete this booking");
    }

    const { error } = await supabase
        .from("bookings")
        .update(updatedFields)
        .eq("id", bookingId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error("Booking could not be updated");
    }

    revalidatePath(`/account/reservations/edit/${bookingId}`);
    redirect("/account/reservations");
}
