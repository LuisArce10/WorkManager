package controlador;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import entidades.EstadoTrabajador;
import entidades.Trabajador;
import servicio.TrabajadorService;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/trabajadores")
public class TrabajadorRestController {

    @Autowired
    private TrabajadorService trabajadorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Trabajador> trabajadores = (search == null || search.isBlank())
                ? trabajadorService.findAll(pageable)
                : trabajadorService.buscar(search, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("trabajadores", trabajadores.getContent());
        response.put("totalPages", trabajadores.getTotalPages());
        response.put("totalItems", trabajadores.getTotalElements());
        response.put("currentPage", trabajadores.getNumber());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Trabajador trabajador = trabajadorService.findOne(id);
        if (trabajador == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(trabajador);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@Valid @RequestBody Trabajador trabajador) {
        if (trabajador.getEstado() == null) {
            trabajador.setEstado(EstadoTrabajador.ACTIVO);
        }
        trabajadorService.save(trabajador);
        return ResponseEntity.status(HttpStatus.CREATED).body(trabajador);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @Valid @RequestBody Trabajador trabajador) {
        Trabajador existente = trabajadorService.findOne(id);
        if (existente == null) return ResponseEntity.notFound().build();

        existente.setNombre(trabajador.getNombre());
        existente.setApellido(trabajador.getApellido());
        existente.setEmail(trabajador.getEmail());
        existente.setTelefono(trabajador.getTelefono());
        existente.setSexo(trabajador.getSexo());
        existente.setSalario(trabajador.getSalario());
        existente.setFecha(trabajador.getFecha());
        existente.setEstado(trabajador.getEstado());

        trabajadorService.save(existente);
        return ResponseEntity.ok(existente);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Trabajador trabajador = trabajadorService.findOne(id);
        if (trabajador == null) return ResponseEntity.notFound().build();
        if (trabajador.getEstado() == EstadoTrabajador.CESADO) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El trabajador ya se encuentra cesado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        trabajadorService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Trabajador cesado exitosamente");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        Trabajador trabajador = trabajadorService.findOne(id);
        if (trabajador == null) return ResponseEntity.notFound().build();

        String nuevoEstadoStr = body.get("estado");
        if (nuevoEstadoStr == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "El campo 'estado' es requerido"));
        }

        try {
            EstadoTrabajador nuevoEstado = EstadoTrabajador.valueOf(nuevoEstadoStr.toUpperCase());
            trabajadorService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(Map.of("mensaje", "Estado actualizado a " + nuevoEstado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Estado no válido: " + nuevoEstadoStr));
        }
    }
}
