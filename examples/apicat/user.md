## 👥 Información Adicional de Usuarios

Esta sección contiene información específica sobre el manejo de usuarios en nuestro sistema.

### Consideraciones Importantes

- **Autenticación**: Todos los endpoints de usuarios requieren token JWT válido
- **Permisos**: Los usuarios solo pueden modificar su propia información, excepto administradores
- **Límites de Rate**: 100 requests por minuto por usuario

### Códigos de Estado Específicos

| Código | Descripción |
|--------|-------------|
| `200` | Usuario encontrado y retornado exitosamente |
| `404` | Usuario no encontrado |
| `403` | Sin permisos para acceder a este usuario |
| `429` | Límite de requests excedido |

### Ejemplos de Uso Común

```javascript
// Obtener perfil del usuario actual
const userProfile = await fetch('/api/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Actualizar información personal
await fetch('/api/users/me', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'Nuevo Nombre' })
});
```

> 💡 **Tip**: Usa siempre HTTPS en producción para proteger los tokens de autenticación.