import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  const { cabin_id } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabin_id),
      getBookedDatesByCabinId(cabin_id),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (err) {
    console.error(err);
    return Response.json("Failed to load cabin");
  }
}
