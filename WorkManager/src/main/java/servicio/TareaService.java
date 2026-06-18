package servicio;

import entidades.Tarea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import repositorios.TareaRepository;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    public Page<Tarea> findAll(Pageable pageable) {
        return tareaRepository.findAll(pageable);
    }

    public Page<Tarea> buscar(String text, Pageable pageable) {
        return tareaRepository.findByTituloContainingIgnoreCaseOrDescripcionContainingIgnoreCase(text, text, pageable);
    }

    public Tarea findOne(Long id) {
        return tareaRepository.findById(id).orElse(null);
    }

    public Tarea save(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    public void delete(Long id) {
        tareaRepository.deleteById(id);
    }

    public Page<Tarea> findByTrabajadorId(Long trabajadorId, Pageable pageable) {
        return tareaRepository.findByTrabajadorId(trabajadorId, pageable);
    }
}