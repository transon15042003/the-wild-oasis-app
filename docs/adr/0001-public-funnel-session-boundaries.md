# Keep public funnel free of root session providers

We optimize Lighthouse Performance on the public booking funnel (`/`, `/cabins`, `/cabins/[id]`) for Mobile. Putting `auth()` (or a root `SessionProvider`) in the shared Header/layout would dynamize or inflate JS on those routes, so Account Login/Account state lives in a narrow `SessionProvider` island around `AccountNav` only; `ReservationProvider` is scoped to the cabin segment layout; cabin catalog data is cached for about one hour (`revalidate` / `unstable_cache`).

## Considered Options

- **Server `auth()` in root Header** — correct Login vs Account without client session JS, but risks making the whole public tree dynamic and hurting TTFB/cache goals.
- **Client island around `AccountNav` (chosen)** — keeps `/` and `/cabins` static/ISR-friendly; session client cost stays in one nav island; UX still shows Login or Account.
- **Always show Login on public nav** — cheapest for Performance, but signed-in Guests see Login until they open Account.
- **Keep global `SessionProvider` + `ReservationProvider`** — least refactor; leaves reservation client state and session wiring on every page, including Home.

## Consequences

- Account and reservation client context must not be re-introduced into `app/layout.js` without revisiting this decision.
- Cabin list/detail content can lag admin changes by up to ~1 hour unless we add on-demand revalidation later.
- Cabin detail may still call `auth()` inside the reservation slot (behind `Suspense`); that is intentional and narrower than root-layout auth.
