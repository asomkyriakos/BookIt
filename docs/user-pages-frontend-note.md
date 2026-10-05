# User pages frontend note

The Users and User Details pages currently use frontend mock data for:

- account status (`PENDING`, `APPROVED`, or `REJECTED`)
- registration date
- approve and reject actions

The mock values are in `frontend/src/pages/UsersPage/userPresentation.ts`.
Approve and reject changes are kept in memory for the demo and reset after a
full page reload.

The Profile page also uses frontend mock data for phone number and address. A
user can edit their name, phone number, and address. These changes are kept in
memory and reset after a full page reload. The mock profile data is in
`frontend/src/pages/profile/mockProfileData.ts`.

When the backend supports these fields, replace the mock metadata with API
response fields and connect the buttons to authenticated administrator-only
endpoints. Backend authorization must still be implemented; the current
`AdminRoute` is only a frontend navigation guard.

TIN, address, password data, and internal user IDs are intentionally not used by
the administrator-facing user pages. Address is only shown to the signed-in user
on their own Profile page.
