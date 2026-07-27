# The Wild Oasis

Luxury cabin lodge booking: guests discover cabins, reserve stays, and manage their account.

## Language

**Guest**:
A person who books and stays in a cabin. Persisted when they first authenticate; owns reservations and a guest profile.
_Avoid_: User, customer, client, member (in domain code and data)

**Account**:
The authenticated Guest's private area: home, reservations, and profile. The public name for this area in navigation and page titles.
_Avoid_: Guest area, guest portal, member area

**Profile**:
The Account section where a Guest updates personal details (name, nationality, national ID, etc.).
_Avoid_: Guest profile (in UI copy)

**Login**:
The top-navigation entry for an unauthenticated visitor; leads to the sign-in page.
_Avoid_: Sign in, Guest area (as the top-nav label)

**Sign in**:
The act of authenticating (e.g. with Google) on the dedicated auth page and related CTAs.
_Avoid_: Login, register, sign up (on the auth page and OAuth button copy)

**Cabin capacity guests**:
The count of people occupying a cabin for a stay (e.g. "up to 4 guests"). Not the Guest entity.
_Avoid_: Guests (when meaning the account holder)
