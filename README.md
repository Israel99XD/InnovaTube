# InnovaTube
## Alcance
La empresa “InnovaTube” requiere crear una aplicación web que permita registrarse de manera pública y autenticarse con el propósito de listar y buscar videos de la plataforma YouTube. Además, debe contar con una sección de favoritos donde se listarán todos los videos que el usuario seleccione en la sección principal.

# Datos a considerar

## Registro de usuarios
- Nombre y Apellido
- Nombre de usuario
- Correo electrónico
- Contraseña
- Confirmación de contraseña
- ReCaptcha ([https://www.google.com/recaptcha/about/](https://www.google.com/recaptcha/about/))

## Inicio de sesión
- Nombre de usuario o correo electrónico
- Contraseña
- Recuperado de contraseña (Falto este apartado)

## Sección Principal

### Navegación
- Nombre de usuario autenticado.
- Opción para cerrar sesión

### Área de trabajo
- Listado de videos con buscador
  - Opción para marcar video como favorito
- Listado de favoritos con buscador
  - Opción para desmarcar video como favorito

## Arquitectura del proyecto
## FRONTEND
- Angular 19.2.0
- biblioteca de componentes de interfaz de usuario
- PrimeNG
- Tailwinds

## BACKEND
- Node JS
- Express
# DIAGRAMA DE COMPONENTES
![{1792C87D-0DA9-4205-B1E6-D88C78B042B0}](https://github.com/user-attachments/assets/199d2c4b-ba29-4680-a847-a9ecfdf82763)

# FrontEnd desplegado en Vercel
## https://innovat-chi.vercel.app/

# BackEnd desplegado en On Render (No muestra nada ya que no tiene metodo GET principal)
## https://innovatube-hq5c.onrender.com
