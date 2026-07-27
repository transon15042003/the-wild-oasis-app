import { ReservationProvider } from "@/app/_contexts/ReservationContext";

export default function CabinsLayout({ children }) {
    return <ReservationProvider>{children}</ReservationProvider>;
}
