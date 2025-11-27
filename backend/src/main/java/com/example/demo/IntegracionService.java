package com.example.demo;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class IntegracionService {

    private final RestTemplate restTemplate = new RestTemplate();

    // --- INTEGRACIÓN SRI ---
    
    public boolean verificarRuc(String ruc) {
        // URL Real: https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/existePorNumeroRuc?numeroRuc=
        // Simulamos respuesta true para el ejercicio si la API real falla o requiere token
        return ruc.length() == 13 && ruc.endsWith("001");
    }

    public Map<String, Object> obtenerInfoPersona(String ruc) {
        // En un caso real, aquí se parsea el JSON del SRI
        Map<String, Object> data = new HashMap<>();
        data.put("nombre", "CIUDADANO EJEMPLO");
        data.put("tipo", "PERSONA NATURAL");
        return data;
    }

    public Map<String, Object> obtenerVehiculo(String placa) {
        // Lógica de consumo SOAP/REST del SRI
        Map<String, Object> auto = new HashMap<>();
        auto.put("placa", placa);
        auto.put("marca", "CHEVROLET");
        auto.put("modelo", "SAIL");
        return auto;
    }

    // --- INTEGRACIÓN ANT CON CACHÉ ---
    
    /**
     * PATRÓN DE CACHÉ (Requerimiento Crítico):
     * Dado que la web de la ANT tiene baja disponibilidad, usamos @Cacheable.
     * 1. Spring revisa si existe la clave 'cedula' en la memoria 'puntosANT'.
     * 2. Si existe, devuelve el valor SIN ejecutar el método (sin llamar a la ANT).
     * 3. Si NO existe, ejecuta el método, llama a la ANT, y guarda el resultado.
     */
    @Cacheable(value = "puntosANT", key = "#cedula", unless = "#result == null")
    public Map<String, Object> consultarPuntosLicencia(String cedula) {
        // String urlAnt = "https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_identificacion=" + cedula;
        
        System.out.println("--- LLAMANDO A ANT (No estaba en caché) ---");
        
        try {
            // Simulamos la llamada lenta/inestable a la ANT
            Thread.sleep(2000); // Simular demora de red
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("puntos", 30);
            resultado.put("origen", "API EXTERNA (ANT)");
            return resultado;
            
        } catch (Exception e) {
            System.err.println("ANT no disponible: " + e.getMessage());
            return null; 
        }
    }
}