As a [user], I want a new view where new vehicle add form is present, so that the views is having a new file named FormView.vue.

Acceptance criteria:

 # Product requirements

 Requirements are implemented in order: define the observable behavior, write the possible test cases, then implement the smallest change that makes those tests pass.

 ## R1: Add a vehicle

 As a garage owner, I want an add-vehicle form, so that I can record another vehicle in my garage.

 ### Acceptance criteria

 - Given the garage view, when I select `Add vehicle`, then the app navigates to `/vehicles/new` and displays the add-vehicle form.
 - Given the add-vehicle form, when I submit valid values for make, model, year, engine, fuel type, odometer, color, and ownership cost, then a new vehicle is added and the app returns to the garage view.
 - Given the add-vehicle form, when a required text field is empty or a numeric value is invalid, then submission is blocked and a useful validation message is displayed.
 - Given the add-vehicle form with entered values, when I select `Cancel`, then the app returns to the garage without adding a vehicle.
 - Given two vehicles with the same make and model, when either is added, then each vehicle receives a unique identifier.

 ### Test cases

 - Navigation test: the garage action opens the form route.
 - Form rendering test: all vehicle fields and actions are present.
 - Store unit test: valid vehicle data is added and receives a unique id.
 - Validation test: missing text, invalid year, negative odometer, and negative ownership cost are rejected.
 - Cancel test: cancel returns to the garage and preserves the vehicle count.
 - Integration test: submitting valid form data adds one vehicle and shows it in the garage.

 ## R2: Reusable input components

 Status: complete

 As a product developer, I want a small reusable base of input, select, combobox, and data-table components, so that product views share consistent behavior and accessibility.

 ### Acceptance criteria

 - Each component is independently importable and has a focused test environment.
 - Inputs expose labels, values, validation state, and disabled state accessibly.
 - Selects and comboboxes expose their current value and support keyboard selection.
 - The data table renders column headers, rows, an empty state, and accessible labels.
 - The components use Reka UI primitives where Reka UI provides the required behavior.

 ### Test cases

 - Each component renders its accessible name and default state.
 - Each component emits or updates its value when the user interacts with it.
 - Disabled controls cannot be changed.
 - Invalid state renders the associated message.
 - The data table renders rows and its empty state.
 - Keyboard interaction works for select and combobox controls.

 ## R3: Google authentication

 As a garage owner, I want to sign in with Google, so that my garage is user-specific.

 ### Acceptance criteria

 - Given a signed-out user, when they open a protected garage route, then the app shows the login view.
 - Given the login view, when the user selects `Continue with Google`, then the configured authentication provider starts the Google sign-in flow.
 - Given a successful sign-in, when the provider returns the user, then the user is redirected to the garage.
 - Given a failed or cancelled sign-in, then the login view displays an actionable error and remains usable.
 - Given a signed-in user, when they sign out, then protected garage data is no longer accessible.

 ### Test cases

 - Guard test: signed-out users are redirected to login.
 - Provider test: the Google sign-in action calls the authentication adapter.
 - Success test: a returned user reaches the garage.
 - Failure test: provider errors render an error message.
 - Sign-out test: sign-out clears the session and protects the garage again.

## R4: Vehicle catalog lookup

Status: requirements defined; provider selection pending

As a garage owner, I want manufacturer, make, model, year, and engine choices from a vehicle database, so that vehicle entry uses accurate catalog data.

### Acceptance criteria

- Given the add-vehicle form, when I select a manufacturer, then the form loads makes from the vehicle catalog.
- Given a selected make, when I select a model, then the form loads models for that make.
- Given a selected model, when I select a year, then the form loads supported engine combinations for that model and year.
- Given catalog results, when I select an engine combination, then the form stores manufacturer, make, model, year, and engine values.
- Given a catalog request fails or returns no matches, then the form shows an actionable message and keeps already entered values.
- Given rapid dependent selections, then stale responses cannot overwrite the latest selection.
- Given an unavailable catalog service, then the form does not submit an unsupported vehicle combination.

### Test cases

- Catalog adapter test: maps provider response into stable manufacturer, make, model, year, and engine types.
- Dependent lookup test: make selection requests makes, model selection requests models, and year selection requests engines.
- Selection test: selected catalog values populate the form and remain submitted together.
- Empty-result test: no matches show an empty state without clearing unrelated fields.
- Failure test: provider failure shows an actionable error and supports retry.
- Race-condition test: latest request wins when dependent lookups finish out of order.
- Submission test: form rejects a vehicle combination not returned by the catalog.