package servicio;

import entidades.EstadoTrabajador;
import entidades.Trabajador;
import repositorios.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrabajadorServiceImpl implements TrabajadorService {

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Trabajador> findAll() {
        return trabajadorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trabajador> findAll(Pageable pageable) {
        return trabajadorRepository.findByEstadoNot(EstadoTrabajador.CESADO, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Trabajador> buscar(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return trabajadorRepository.findByEstadoNot(EstadoTrabajador.CESADO, pageable);
        }
        return trabajadorRepository.buscar(searchTerm, pageable);
    }

    @Override
    @Transactional
    public void save(Trabajador trabajador) {
        trabajadorRepository.save(trabajador);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        trabajadorRepository.findById(id).ifPresent(trabajador -> {
            trabajador.setEstado(EstadoTrabajador.CESADO);
            trabajadorRepository.save(trabajador);
        });
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, EstadoTrabajador nuevoEstado) {
        trabajadorRepository.findById(id).ifPresent(trabajador -> {
            trabajador.setEstado(nuevoEstado);
            trabajadorRepository.save(trabajador);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Trabajador findOne(Long id) {
        return trabajadorRepository.findById(id).orElse(null);
    }
}
