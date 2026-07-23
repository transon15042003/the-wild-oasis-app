export const ROUTES = {
    home: "/",
    about: "/about",
    login: "/login",
    cabins: "/cabins",
    cabin: (id) => `/cabins/${id}`,
    thankYou: "/cabins/thankyou",
    account: "/account",
    profile: "/account/profile",
    reservations: "/account/reservations",
    editReservation: (id) => `/account/reservations/edit/${id}`,
};
