# WorkManager backend

Run:

```powershell
cd WorkManager
./mvnw.cmd spring-boot:run
```

Or build + run jar:

```powershell
cd WorkManager
./mvnw.cmd -DskipTests package
java -jar target/WorkManager-0.0.1-SNAPSHOT.jar
```

API endpoints useful for testing:

- POST /api/auth/login
  - body: { "username": "admin", "password": "12345" }
  - returns JSON with `token` and `username` and `roles`

- GET /api/auth/me
  - header: `Authorization: Bearer <token>`
  - returns current user object

- GET /api/trabajadores
  - requires role `ROLE_USER` or `ROLE_ADMIN`; header: `Authorization: Bearer <token>`

- POST /api/trabajadores
  - requires `ROLE_ADMIN`.
  - sample body:
    ```json
    {
      "nombre": "Prueba",
      "apellido": "Usuario",
      "email": "prueba@example.com",
      "telefono": 12345678,
      "sexo": "F",
      "salario": 1200.0,
      "fecha": "2026-06-16"
    }
    ```

Quick curl example (login + call me):

```bash
# login and show token
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"12345"}'

# use the token (replace <token>)
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/auth/me
```

If the DB doesn't contain test users, you can register via `/api/auth/registro` or seed the DB.
