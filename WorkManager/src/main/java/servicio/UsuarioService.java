package servicio;


import entidades.Rol;
import entidades.Usuario;
import repositorios.RolRepository;
import repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Usuario registrarUsuario(Usuario usuario) throws Exception {
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new Exception("El nombre de usuario ya está en uso");
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setEnabled(true);
        Rol rolUser = rolRepository.findByNombre("ROLE_USER")
                .orElseThrow(() -> new Exception("Rol ROLE_USER no encontrado en la base de datos"));
        Set<Rol> roles = new HashSet<>();
        roles.add(rolUser);
        usuario.setRoles(roles);
        return usuarioRepository.save(usuario);
    }
}