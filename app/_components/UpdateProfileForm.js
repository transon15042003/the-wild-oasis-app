"use client";

import { updateProfile } from "../_lib/actions";
import SubmitButton from "./SubmitButton";
// import Image from "next/image";

export default function UpdateProfileForm({ guest, children }) {
    const { full_name, email, country_flag, national_id } = guest;

    return (
        <form
            action={updateProfile}
            className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
        >
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    disabled
                    defaultValue={full_name}
                    name="full_name"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label>Email address</label>
                <input
                    disabled
                    defaultValue={email}
                    name="email"
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    {country_flag ? (
                        <img
                            src={country_flag}
                            alt="Country flag"
                            className="h-5 rounded-sm"
                        />
                    ) : null}
                </div>
                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="national_id"
                    defaultValue={national_id ?? ""}
                    className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                />
                <p className="text-sm text-primary-300">
                    Optional. 6–12 letters or numbers if provided.
                </p>
            </div>

            <SubmitButton pendingText="Updating...">
                Update profile
            </SubmitButton>
        </form>
    );
}
