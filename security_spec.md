# Security Specification - ZöldReceptek

## Data Invariants
1. A recipe must have valid data (name, image, etc.).
2. A user can only access their own profile.
3. Only admins can modify recipes and app configuration.
4. Users cannot self-promote to Admin or self-subscribe.

## The "Dirty Dozen" Payloads (Denial Tests)
1. Update recipe name as a non-admin user. (Reject)
2. Create a recipe with a 2MB base64 image string (size check). (Reject)
3. Set `isAdmin: true` on user's own profile. (Reject)
4. Set `isSubscribed: true` on user's own profile. (Reject)
5. Read another user's profile document. (Reject)
6. Delete a recipe as a non-admin user. (Reject)
7. Update `plannerUseCount` to -1. (Reject)
8. Create a recipe without required fields. (Reject)
9. Update `createdAt` field on a recipe. (Reject)
10. Update `subscriptionTerms` as a non-admin. (Reject)
11. Access `/users/` list as a regular user. (Reject)
12. Read private app config as an unauthenticated user. (Reject)

## Implementation Notes
- Use `isAdmin()` helper check against a list of admin UIDs or email lookup (lookup is safer but more expensive, let's use a collection `/admins/{uid}`).
- I will seed the user's UID into `admins` collection when they first sign in if their email matches the admin email.
