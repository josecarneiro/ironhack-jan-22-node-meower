# Meower

## Pages

Home - Displays list of latest "meows" ✅
Sign Up - Allows visitors to create an account. ✅
Sign In - Allows existing users to sign in. ✅
Create meow - Display form which allows user to submit new "meow" ✅
Single meow - Allows to read single meow. Allows creator to delete or edit meow. ❌
Edit meow - Allows meow creator to edit single meow. ❌
Profile - Allows us to view single users meows. ❌
Profile edit - Allows us to edit our profile. ❌

## Route Handlers

GET - '/' - Renders home page ✅

GET - '/authentication/sign-up' - Renders sign up page ✅
POST - '/authentication/sign-up' - Handles account registration ✅
GET - '/authentication/sign-in' - Renders sign in page ✅
POST - '/authentication/sign-in' - Handles existing user authentication ✅
POST - '/authentication/sign-out' - Handles user sign-out ✅

GET - '/meow/create' - Renders meow creation page ✅
POST - '/meow/create' - Handles new meow creation ✅
GET - '/meow/:id' - Loads meow from database, renders single meow page ❌
GET - '/meow/:id/edit' - Loads meow from database, renders meow edit page ❌
POST - '/meow/:id/edit' - Handles edit form submission. ❌
POST - '/meow/:id/delete' - Handles deletion. ❌

GET - '/profile/:id' - Loads user with params.id from collection, renders profile page. ❌
GET - '/profile/:id/edit' - Loads user and renders profile edit view. ❌
POST - '/profile/:id/edit' - Handles profile edit form submission. ❌

## Models

User

- name: String, required ✅
- email: String, required ✅
- passwordHashAndSalt: String, required ✅
- picture: String ❌

Publication ❌

- message: String, required, maxlength 300 ✅
- picture: String ❌
- creator: ObjectId of a document in the users collection, required ✅
- createdAt: Date (add timestamps option to the publicationSchema) ✅
- updatedAt: Date (add timestamps option to the publicationSchema) ✅

## Wishlist

- Add date formating helper to HBS
- Like "meows" (Like model). Most liked meows would be featured.
- Sentiment analysis for "meows". If meow is negative, stop publication.
- Share button.
- Required users to confirm email before publishing.
