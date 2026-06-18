package servicio;

import entidades.EstadoTrabajador;
import entidades.Trabajador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TrabajadorService {
    List<Trabajador> findAll();
    Page<Trabajador> findAll(Pageable pageable);
    Page<Trabajador> buscar(String searchTerm, Pageable pageable);
    Trabajador findOne(Long id);
    void save(Trabajador trabajador);
    void delete(Long id);
    void cambiarEstado(Long id, EstadoTrabajador nuevoEstado);
}
