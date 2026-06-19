package config;

import entidades.Usuario;
import entidades.Rol;
import repositorios.UsuarioRepository;
import repositorios.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;

@Configuration
@Profile("dev") // <--- ¡Esto es clave! Solo corre si activas el perfil 'dev'
public class DataInitializer {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Rol adminRol = rolRepository.findByNombre("ROLE_ADMIN")
                        .orElseGet(() -> rolRepository.save(new Rol("ROLE_ADMIN")));

                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("Admin123456"));
                admin.setEnabled(true);
                admin.setRoles(Collections.singleton(adminRol));

                usuarioRepository.save(admin);
                System.out.println(">>> Usuario admin creado para DESARROLLO.");
            }
        };
    }
}