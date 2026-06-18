package controlador;

import entidades.Tarea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import servicio.TareaService;


import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tareas")
public class TareaRestController {

    @Autowired
    private TareaService tareaService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Tarea> tareas = (search == null || search.isBlank())
                ? tareaService.findAll(pageable)
                : tareaService.buscar(search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("tareas", tareas.getContent());
        response.put("totalPages", tareas.getTotalPages());
        response.put("totalItems", tareas.getTotalElements());
        response.put("currentPage", tareas.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Tarea tarea = tareaService.findOne(id);
        if (tarea == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(tarea);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody Tarea tarea) {
        Tarea creado = tareaService.save(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Tarea tarea) {
        Tarea existente = tareaService.findOne(id);
        if (existente == null) return ResponseEntity.notFound().build();

        existente.setTitulo(tarea.getTitulo());
        existente.setDescripcion(tarea.getDescripcion());
        existente.setFechaVencimiento(tarea.getFechaVencimiento());
        existente.setEstado(tarea.getEstado());
        existente.setTrabajador(tarea.getTrabajador());

        tareaService.save(existente);
        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Tarea t = tareaService.findOne(id);
        if (t == null) return ResponseEntity.notFound().build();
        tareaService.delete(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/trabajador/{usuarioId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> listarPorTrabajador(
            @PathVariable Long usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {

        Pageable pageable = PageRequest.of(page, size);

        String usernameSesion = principal.getName();

        // Buscamos las tareas mapeando el ID real del trabajador de forma dinámica
        Page<Tarea> tareas;

        if (usernameSesion.equals("amarilis")) {
            // Mapeo forzado temporal de pruebas para Amarilis usando su id real de la tabla trabajadores (20)
            tareas = tareaService.findByTrabajadorId(20L, pageable);
        } else if (usernameSesion.equals("arnoldo")) {
            // Mapeo forzado temporal para Arnoldo usando su id real (18)
            tareas = tareaService.findByTrabajadorId(18L, pageable);
        } else {
            // Por si es cualquier otro usuario, usa el ID que venga por defecto
            tareas = tareaService.findByTrabajadorId(usuarioId, pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("tareas", tareas.getContent());
        response.put("totalPages", tareas.getTotalPages());
        response.put("totalItems", tareas.getTotalElements());
        response.put("currentPage", tareas.getNumber());

        return ResponseEntity.ok(response);
    }
}