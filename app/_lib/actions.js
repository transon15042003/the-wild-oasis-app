"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

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
    const { data, error } = await supabase
        .from("guests")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

    if (error) {
        throw new Error("Guest could not be updated");
    }

    revalidatePath("/account/profile");

    return data;
}
