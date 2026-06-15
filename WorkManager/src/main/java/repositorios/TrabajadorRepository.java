package repositorios;


import entidades.Trabajador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {

    @Query("""
        SELECT e FROM Trabajador e
        WHERE lower(e.nombre) LIKE lower(concat('%', :search, '%'))
           OR lower(e.apellido) LIKE lower(concat('%', :search, '%'))
           OR lower(e.email) LIKE lower(concat('%', :search, '%'))
    """)
    Page<Trabajador> buscar(@Param("search") String search, Pageable pageable);
}