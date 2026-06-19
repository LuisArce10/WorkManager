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
        return trabajadorRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trabajador> buscar(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return trabajadorRepository.findAll(pageable);
        }
        return trabajadorRepository.buscar(searchTerm, pageable);
    }

    @Override
    @Transactional
    public void save(Trabajador trabajador) {
        String usernameLimpio = trabajador.getEmail().split("@")[0].toLowerCase();
        Usuario usuario;

        if (!usuarioRepository.existsByUsername(usernameLimpio)) {
            usuario = new Usuario();
            usuario.setUsername(usernameLimpio);
            usuario.setEnabled(true);
            usuario.setPassword(passwordEncoder.encode("User" + trabajador.getTelefono()));

            Rol rolUser = rolRepository.findByNombre("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: El rol ROLE_USER no existe."));

            Set<Rol> roles = new HashSet<>();
            roles.add(rolUser);
            usuario.setRoles(roles);

            usuario = usuarioRepository.save(usuario);
        } else {
            usuario = usuarioRepository.findByUsername(usernameLimpio)
                    .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado."));
        }


        trabajador.setUsuario(usuario);

        trabajadorRepository.save(trabajador);
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

    // --- AQUÍ ESTÁ EL MÉTODO QUE TE FALTABA ---
    @Override
    @Transactional
    public void activar(Long id) {
        Trabajador trabajador = trabajadorRepository.findById(id).orElse(null);
        if (trabajador != null) {
            trabajador.setActivo(true);
            trabajadorRepository.save(trabajador);

            String usernameLimpio = trabajador.getEmail().split("@")[0].toLowerCase();
            usuarioRepository.findByUsername(usernameLimpio).ifPresent(usuario -> {
                usuario.setEnabled(true);
                usuarioRepository.save(usuario);
                System.out.println("Cuenta de usuario '" + usernameLimpio + "' reactivada.");
            });
        }
    }
}