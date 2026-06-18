# AGENTS.md

Dual-project monorepo: Spring Boot backend + Angular frontend.

## Project layout

- `WorkManager/` — Spring Boot 3.5 backend, Java 17, Maven wrapper
- `workmanager-frontend-fixed/` — Angular 21 frontend, TypeScript, npm

## Common commands

```bash
# Backend
./mvnw spring-boot:run              # inside WorkManager/
./mvnw test                          # requires MySQL running
./mvnw -DskipTests package           # build JAR skip tests

# Frontend
npm install                          # inside workmanager-frontend-fixed/
npm run start                        # dev server on :4200
ng test                              # Vitest (not Jasmine/Karma)
```

## Run order matters

The frontend hardcodes `http://localhost:8080` as the backend URL in every service. Start the backend first, then the frontend. No dev proxy is configured in `angular.json`.

## Backend conventions (non-standard)

- **Package layout**: The main class (`WorkManagerApplication.java`) explicitly scans these packages: `config`, `security`, `controlador`, `servicio`, `repositorios`, `entidades`, `dto`. They are NOT under `com.workmanager.workmanager`. New code must go into these top-level packages.
- **Spanish naming**: Packages and class names use Spanish — `controlador`, `servicio`, `repositorios`, `entidades`, `trabajador`, `tarea`.
- **DDL auto is `update`**: Schema changes happen automatically. Do not deploy to production as-is.
- **JWT**: Uses `jjwt` 0.11.5. Secret and expiration are read from `application.properties`. Tokens carry `roles` claim as a list of strings (e.g. `ROLE_ADMIN`).
- **Roles**: `ROLE_USER`, `ROLE_ADMIN`. Endpoints use `@PreAuthorize("hasRole('ADMIN')")` — note the unprefixed role string, not `ROLE_ADMIN`.
- **CORS**: Configured in both `SecurityConfig` and `WebConfig` for `http://localhost:4200`. If you change the frontend origin, update both places.
- **Lombok**: Enabled via annotation processor in `pom.xml`. Entities use Lombok annotations.
- **Swagger**: Exposed at `/swagger-ui/index.html` (permitted paths in SecurityConfig).

## Backend test quirks

- The `@SpringBootTest` loads the full context including MySQL datasource. **Tests fail without a running MySQL** at `localhost:3306/db_gestion_trabajadores`. There is no H2 or test profile.
- Credentials in `application.properties`: `root` / `mysql`. If your local MySQL differs, change the properties or set env overrides before running tests.

## Frontend conventions

- **Vitest test runner**: Tests use Vitest globals (configured in `tsconfig.spec.json`). Not Jasmine/Karma.
- **Classic DI interceptors**: Uses `HTTP_INTERCEPTORS` token + `withInterceptorsFromDi()`. Not the functional `withInterceptors()` pattern.
- **Component directory naming**: Hyphen-separated (`Trabajador-Lista/`, `Tarea-Form/`), some are PascalCase words (`Login/`, `Registro/`). Follow the existing pattern.
- **Auth flow**: Login posts to `/api/auth/login`, stores token + user JSON in `localStorage`. On app start, `App` component calls `GET /api/auth/me` to restore session (see `src/app/app.ts:16`).
- **Prettier**: `printWidth: 100`, `singleQuote: true`. Run `npx prettier --check .` for validation.

## API summary

| Endpoint                      | Method | Access               |
|-------------------------------|--------|----------------------|
| `/api/auth/login`             | POST   | Public               |
| `/api/auth/registro`          | POST   | Public               |
| `/api/auth/me`                | GET    | Authenticated        |
| `/api/trabajadores`           | GET    | USER, ADMIN          |
| `/api/trabajadores/**` (CUD)  | POST/PUT/DELETE | ADMIN only    |
| `/api/tareas`                 | GET    | USER, ADMIN          |
| `/api/tareas/**` (CUD)        | POST/PUT/DELETE | ADMIN only    |

Worker endpoints paginate with `?page=0&size=10&search=...`. Task endpoints use the same query params.
