# Contact Management Application

A responsive contact management dashboard built with Angular that allows users to view and search contacts, and display detailed contact information.

## Features

- Display a list of contacts with basic information
- Search for contacts by name, email, or phone
- View detailed contact information for a selected contact
- Responsive design that works on desktop and mobile devices
- Mock API integration

## Technologies Used

- Angular 17
- TypeScript
- RxJS
- SCSS
- Angular Testing Library

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

## Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/contact-management-app.git
   cd contact-management-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── core/                     # Core modules and services
│   │   ├── services/             # Application-wide services
│   │   │   └── contacts.service.ts
│   │   ├── features/             # Feature modules
│   │   │   └── contacts/         # Contacts feature
│   │   │       ├── components/   # Reusable components
│   │   │       │   ├── contact-list/
│   │   │       │   └── contact-details/
│   │   │       ├── pages/        # Page components
│   │   │       │   └── contacts-page/
│   │   │       ├── contacts.module.ts
│   │   │       └── contacts-routing.module.ts
│   │   ├── shared/               # Shared modules, components, directives, pipes
│   │   │   └── models/           # Shared models
│   │   │       └── contact.model.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   └── styles.scss               # Global styles
```

## Running Tests

To run unit tests:

```
npm run test
```

## Assumptions

- The mock API is already set up at mockapi.io and will return data in the expected format
- Each contact can have multiple phone numbers and email addresses
- One phone number and one email address can be marked as primary
- The design follows the provided Figma template with some adaptations for responsive behavior

## Notes

- Error handling is simplified for the exercise but would be more comprehensive in a production application
- A full implementation would include features like adding, editing, and deleting contacts
- Cross-device support is implemented through responsive design, but a more comprehensive solution would include device-specific optimizations

## License

This project is licensed under the MIT License - see the LICENSE file for details.
