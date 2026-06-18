package servicio;

import entidades.Trabajador;
import entidades.Usuario;
import entidades.Rol;
import repositorios.TrabajadorRepository;
import repositorios.UsuarioRepository;
import repositorios.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TrabajadorServiceImpl implements TrabajadorService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<Trabajador> findAll() {
        return trabajadorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trabajador> findAll(Pageable pageable) {
        // Trae únicamente los que tengan activo = true
        return trabajadorRepository.findByActivoTrue(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trabajador> buscar(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return trabajadorRepository.findByActivoTrue(pageable);
        }
        return trabajadorRepository.buscar(searchTerm, pageable);
    }

    @Override
    @Transactional
    public void save(Trabajador trabajador) {
        trabajadorRepository.save(trabajador);

        String usernameLimpio = trabajador.getEmail().split("@")[0].toLowerCase();

        if (!usuarioRepository.existsByUsername(usernameLimpio)) {
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setUsername(usernameLimpio);
            nuevoUsuario.setEnabled(true);

            String claveTemporal = "User" + trabajador.getTelefono();
            nuevoUsuario.setPassword(passwordEncoder.encode(claveTemporal));

            Rol rolUser = rolRepository.findByNombre("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: El rol ROLE_USER no existe en la BD."));

            Set<Rol> roles = new HashSet<>();
            roles.add(rolUser);
            nuevoUsuario.setRoles(roles);

            usuarioRepository.save(nuevoUsuario);

            System.out.println("=================================================");
            System.out.println("¡USUARIO DE ACCESO CREADO AUTOMÁTICAMENTE!");
            System.out.println("Username: " + usernameLimpio);
            System.out.println("Password Temporal: " + claveTemporal);
            System.out.println("=================================================");
        }
    }

    @Override
    @Transactional
    public void delete(Long id) {

        Trabajador trabajador = trabajadorRepository.findById(id).orElse(null);
        if (trabajador != null) {

            trabajador.setActivo(false);
            trabajadorRepository.save(trabajador);

            String usernameLimpio = trabajador.getEmail().split("@")[0].toLowerCase();
            usuarioRepository.findByUsername(usernameLimpio).ifPresent(usuario -> {
                usuario.setEnabled(false);
                usuarioRepository.save(usuario);
                System.out.println("Cuenta de usuario '" + usernameLimpio + "' inhabilitada.");
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Trabajador findOne(Long id) {
        return trabajadorRepository.findById(id).orElse(null);
    }
}