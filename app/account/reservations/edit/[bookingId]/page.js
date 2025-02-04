import SubmitButton from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/actions";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
    // CHANGE
    const { bookingId } = params;
    const { num_guests, observations, cabin_id } = await getBooking(bookingId);
    const { max_capacity } = await getCabin(cabin_id);

    return (
        <div>
            <h2 className="font-semibold text-2xl text-accent-400 mb-7">
                Edit Reservation #{bookingId}
            </h2>

            <form
                action={updateReservation}
                className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
            >
                <div>
                    <input
                        name="bookingId"
                        id="bookingId"
                        type="hidden"
                        defaultValue={bookingId}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="numGuests">How many guests?</label>
                    <select
                        defaultValue={num_guests}
                        name="numGuests"
                        id="numGuests"
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                        required
                    >
                        <option value="" key="">
                            Select number of guests...
                        </option>
                        {Array.from(
                            { length: max_capacity },
                            (_, i) => i + 1
                        ).map((x) => (
                            <option value={x} key={x}>
                                {x} {x === 1 ? "guest" : "guests"}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="observations">
                        Anything we should know about your stay?
                    </label>
                    <textarea
                        name="observations"
                        id="observations"
                        defaultValue={observations}
                        className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
                    />
                </div>

                <div className="flex justify-end items-center gap-6">
                    <SubmitButton pendingText="Updating...">
                        Update reservation
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
