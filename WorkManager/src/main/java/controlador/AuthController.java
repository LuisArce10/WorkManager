package controlador;

import entidades.Usuario;
import repositorios.UsuarioRepository;
import servicio.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        System.out.println("USERNAME = [" + username + "]");
        System.out.println("PASSWORD = [" + password + "]");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isEmpty()) {
            System.out.println("USUARIO NO ENCONTRADO");
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        System.out.println("HASH BD = " + usuario.getPassword());

        boolean coincide = passwordEncoder.matches(password, usuario.getPassword());

        System.out.println("COINCIDE = " + coincide);

        if (!coincide) {
            return ResponseEntity.badRequest().body("Contraseña incorrecta");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("username", usuario.getUsername());
        response.put("id", usuario.getId());
        response.put("roles", usuario.getRoles());
        response.put("message", "Login exitoso");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevo = usuarioService.registrarUsuario(usuario);
            nuevo.setPassword(null);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}