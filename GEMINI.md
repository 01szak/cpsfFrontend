# GEMINI.md

## Project Overview

**Project Name:** CPSF Frontend (Camper Place Management System)
**Primary Purpose:** A management dashboard for camper place owners/administrators to handle reservations, track statistics, and manage facility settings.

### Main Technologies
- **Framework:** Angular 19 (Standalone components architecture)
- **UI Library:** Angular Material
- **State Management:** Reactive programming with RxJS
- **Data Visualization:** ngx-charts & Chart.js
- **Date Handling:** Moment.js with Polish locale (`pl-PL`)
- **Authentication:** JWT-based authentication with `AuthInterceptor`
- **Styling:** SCSS (SASS)

### Architecture
The project follows a feature-based modular structure:
- **`src/app/core/`**: Shared singleton services, interceptors, and data models.
- **`src/app/features/`**: Domain-specific features like `auth`, `reservations`, `statistics`, `settings`, and `users`.
- **`src/app/shared/`**: Reusable UI components (buttons, data-tables, popups) and base classes.
- **`src/app/app.routes.ts`**: Centralized routing configuration with a protected `admin-page` layout.

## Building and Running

### Development Environment
- **Start Development Server:** `npm start` or `ng serve`
  - Runs at `http://localhost:4200/`
  - Uses `src/proxy.conf.json` for API proxying.
- **Build for Production:** `npm run build` or `ng build`
  - Artifacts are stored in the `dist/` directory.

### Testing
- **Unit Tests:** `npm test` or `ng test` (uses Karma/Jasmine).

## Development Conventions

### Coding Style
- **Dependency Injection:** Prefers `inject()` function over constructor injection in many services and components.
- **Reactive Patterns:** Extensive use of `BehaviorSubject` and `Observable` for data streaming and UI updates.
- **Base Classes:** Uses `BackendService<T>` as a generic base for CRUD operations to ensure consistency across features.
- **Localization:** Default locale is set to Polish (`pl-PL`). Date formats are strictly defined in `app.config.ts`.

### Feature Organization
Each feature folder typically contains:
- Components (`.ts`, `.html`, `.css`/`.scss`)
- Feature-specific services
- Feature-specific models or routes (if applicable)

### API Communication
- All API calls should go through services extending `BackendService`.
- Authentication is handled automatically via `AuthInterceptor` using a JWT token stored in `sessionStorage`.

### UI/UX
- Consistent use of Angular Material components.
- Shared data table components (`regular-table.component`) for list views.
- Success/Error feedback via `MatSnackBar` using custom `SnackBarComponent`.
