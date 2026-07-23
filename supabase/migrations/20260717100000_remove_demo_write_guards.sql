-- Demo sandbox write guards require Supabase Auth (auth.uid()), but this app
-- uses NextAuth + server-side anon key. Remove guards so sign-in/booking works.

DROP TRIGGER IF EXISTS trg_demo_guard_guests ON public.guests;
DROP TRIGGER IF EXISTS trg_demo_guard_bookings ON public.bookings;
DROP TRIGGER IF EXISTS trg_demo_guard_cabins ON public.cabins;
DROP TRIGGER IF EXISTS trg_demo_guard_settings ON public.settings;
