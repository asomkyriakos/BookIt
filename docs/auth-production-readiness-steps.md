# Authorization / Authentication Production Readiness Steps

Παρακατω ειναι τα βηματα, με τη σωστη σειρα, για να γινει production-ready το authorization και authentication του app.

## Backend

1. **Βαλε Spring Security**

   Προσθεσε `spring-boot-starter-security`. Απο εδω και περα το backend, οχι το frontend, αποφασιζει ποιος εχει προσβαση.

2. **Φτιαξε σωστο login με email/password**

   Το login πρεπει να ψαχνει χρηστη με `email`, οχι με `id`. Αν το password ειναι σωστο, να δημιουργει session ή token.

3. **Χρησιμοποιησε BCrypt για passwords**

   Μην χρησιμοποιεις SHA-256. Τα passwords πρεπει να αποθηκευονται με `BCryptPasswordEncoder`.

4. **Μην επιστρεφεις ποτε password απο API**

   Μην επιστρεφεις απευθειας το `User` entity. Φτιαξε DTO, π.χ. `UserResponse`, χωρις `password`.

5. **Διαλεξε auth τροπο**

   Η πιο καθαρη λυση για αυτο το app:

   - backend session cookie
   - `HttpOnly`
   - `Secure` σε production
   - `SameSite=Lax` ή `Strict`

   Ετσι το token δεν το βλεπει ποτε η JavaScript.

6. **Φτιαξε endpoint `/api/auth/me`**

   Το frontend θα το καλει για να μαθει:

   - αν ο χρηστης ειναι logged in
   - ποιο ειναι το `id`
   - ποιο ειναι το `role`

7. **Φτιαξε logout**

   Το logout πρεπει να ακυρωνει το backend session/cookie, οχι απλως να καθαριζει localStorage.

8. **Προστατεψε ολα τα private endpoints**

   Παραδειγματα:

   - `/api/users/**` μονο authenticated
   - create/delete event μονο `ADMIN` ή `ORGANIZER`
   - ticket creation μονο `ADMIN` ή owner organizer
   - user list μονο `ADMIN`

9. **Βαλε ownership checks**

   Δεν αρκει το role. Πρεπει να ελεγχεις και αν το resource ανηκει στον χρηστη.

   Παραδειγματα:

   - user `5` δεν πρεπει να μπορει να κανει update τον user `7`
   - organizer δεν πρεπει να μπορει να αλλαξει event αλλου organizer

10. **Μην δεχεσαι role απο απλο user update**

    Το `role` δεν πρεπει να αλλαζει απο `PATCH /api/users`. Θελει ξεχωριστο admin-only endpoint.

11. **Φτιαξε registration σωστα**

    Το register πρεπει:

    - να κανει hash το password
    - να δινει default role `USER`
    - να αγνοει role που στελνει ο client
    - να ελεγχει duplicate email

12. **Βαλε σωστα error responses**

    Οχι `RuntimeException("failed")`.

    Θελεις καθαρα status codes:

    - `401 Unauthorized` για λαθος login
    - `403 Forbidden` για λαθος permissions
    - `404 Not Found` οταν δεν υπαρχει resource

13. **Κλειδωσε CORS για production**

    Το CORS να παιρνει origins απο env/config. Οχι hardcoded μονο `localhost`.

14. **Βαλε security headers**

    Με Spring Security μπορεις να εχεις βασικα headers για browser protection.

15. **Βγαλε plaintext mock passwords**

    Το `data.sql` να έχει hashed passwords και να χρησιμοποιείται μόνο για development/demo δεδομένα.

## Frontend

1. **Σταματα να χρησιμοποιεις `localStorage.isLoggedIn`**

   Αυτο δεν ειναι ασφαλεια. Ο χρηστης μπορει να το αλλαξει μονος του απο DevTools.

2. **Μετα το login, βασισου στο backend cookie/session**

   Το frontend στελνει email/password. Αν πετυχει, το backend βαζει cookie. Το frontend απλως κανει redirect.

3. **Φτιαξε AuthContext**

   Ενα κεντρικο `AuthContext` να κραταει:

   - `currentUser`
   - `isLoading`
   - `isAuthenticated`
   - `role`
   - `login`
   - `logout`
   - `refreshUser`

4. **Στο app startup καλεσε `/api/auth/me`**

   Οταν ανοιγει η εφαρμογη, το frontend πρεπει να ρωταει το backend ποιος ειναι ο χρηστης.

5. **Φτιαξε PrivateRoute με βαση το `/me`**

   Το route guard να μη διαβαζει localStorage. Να ελεγχει το `AuthContext`.

6. **Φτιαξε RoleRoute**

   Για pages οπως admin, organizer tools, user profile:

   - αν δεν ειναι logged in, redirect σε `/login`
   - αν δεν εχει σωστο role, δειξε `/403`

7. **Στειλε cookies στα fetch requests**

   Αν χρησιμοποιησεις session cookies, τα fetch πρεπει να εχουν:

   ```ts
   credentials: "include"
   ```

8. **Μην κρατας password σε frontend state**

   Το password να υπαρχει μονο στο form submit. Μην το βαζεις σε global state, logs ή user object.

9. **Μην κανεις `console.log` auth responses**

   Βγαλε logs απο login/register, ειδικα σε production.

10. **Κρυψε UI με βαση το role, αλλα μην το θεωρεις ασφαλεια**

    Το frontend μπορει να κρυβει κουμπια, αλλα το backend πρεπει παλι να ελεγχει permissions.

11. **Χειρισου 401/403 παντου**

    Αν API επιστρεψει:

    - `401`: redirect στο login
    - `403`: δειξε forbidden page
    - οχι απλο crash

12. **Φτιαξε καθαρο logout flow**

    Το frontend καλει `/api/auth/logout`, μετα καθαριζει `AuthContext` και παει login/welcome.

## Σωστη σειρα υλοποιησης

1. Spring Security dependency.
2. BCrypt password encoder.
3. User DTOs χωρις password.
4. Register με hashed password και default role.
5. Login με email/password.
6. Session cookie ή JWT.
7. `/api/auth/me`.
8. `/api/auth/logout`.
9. Backend route protection.
10. Role checks.
11. Ownership checks.
12. Frontend AuthContext.
13. PrivateRoute/RoleRoute.
14. Remove localStorage auth.
15. Production CORS/security headers.
16. Tests για login, logout, protected endpoints, role access και IDOR cases.

## Βασικη αρχη

Η ασφαλεια πρεπει να ζει στο backend. Το frontend κανει μονο UX.
