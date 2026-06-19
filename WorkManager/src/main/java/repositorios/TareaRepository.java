package repositorios;

import entidades.Tarea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    Page<Tarea> findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(String titulo, String descripcion, Pageable pageable);

    Page<Tarea> findByTrabajadorUsuarioUsername(String username, Pageable pageable);
}