# Wialon Mileage

![Estado del Proyecto](https://img.shields.io/badge/status-en%20desarrollo-green)  
![Licencia](https://img.shields.io/badge/license-MIT-blue)

## Descripción

**Wialon Mileage** es una aplicación full-stack que permite consultar el kilometraje de vehículos (como el "Buick Skylark Convertible") a través de la API de Wialon. El backend, desarrollado en **NestJS**, autentica con la API de Wialon y expone endpoints para obtener el kilometraje. El frontend, construido con **Flutter**, es una interfaz móvil responsiva para iOS y Android, con un diseño oscuro, animaciones fluidas y manejo de estado con `provider`.

## Capturas de Pantalla

### Interfaz de la App
![Interfaz de la App](screenshots/interfaz.jpeg)

### Documentación Swagger
![Swagger](screenshots/documentacion_swagger.jpeg)

### Características Principales
- **Backend (NestJS)**:
  - Autenticación con la API de Wialon mediante token (`POST /wialon/login`).
  - Consulta del kilometraje de un vehículo (`GET /wialon/mileage?vehicleName=...` en vehicleName puedes poner "Buick Skylark Convertible". Ejemplo: http://localhost:3000/wialon/mileage?vehicleName=Buick%20Skylark%20Convertible en postman, petición GET).
  - Documentación interactiva de la API en Swagger (`http://localhost:3000/api`).
  - Soporte CORS para permitir solicitudes desde el frontend.
- **Frontend (Flutter)**:
  - Interfaz con tema oscuro, gradientes y tipografía Poppins.
  - Dropdown para seleccionar el vehículo ("Buick Skylark Convertible", y otros reales comprobados con la API).
  - Botón para consultar el kilometraje con animaciones usando `animate_do`.
  - Indicador de carga y manejo de errores.
  - Comparación del kilometraje actual con el anterior para mostrar mensajes como "Kilometraje inicial", "El kilometraje ha aumentado" o "El kilometraje se mantuvo constante".
- **Arquitectura limpia**: Separación de preocupaciones con modelos, proveedores y servicios.

## Tecnologías Utilizadas

### Backend
- **NestJS**: Framework de Node.js para aplicaciones escalables.
- **TypeScript**: Código tipado y mantenible.
- **Axios**: Para solicitudes HTTP a la API de Wialon.
- **@nestjs/config**: Gestión de variables de entorno.
- **Node.js**: v16 o superior.

### Frontend
- **Flutter**: Framework de Dart para aplicaciones móviles multiplataforma, versión 3.29.2
- **http**: Para solicitudes HTTP al backend.
- **provider**: Gestión de estado.
- **google_fonts**: Tipografía Poppins para un diseño moderno.
- **animate_do**: Animaciones fluidas en la UI.

## Requisitos Previos

- **Node.js**: v16 o superior (`node --version` para verificar).
- **NestJS CLI**: Instalable globalmente con `npm install -g @nestjs/cli`.
- **Flutter SDK**: v3.29.2 con Dart 3.24.x (verifica con `flutter --version`).
- **Git**: Para control de versiones (`git --version` para verificar).
- **Emulador o dispositivo físico**: Android Studio con emulador Android o Xcode para iOS.
- **Token de Wialon**: Proporcionado por el proveedor de servicios de Wialon, necesario para el archivo `.env`.
- **Editor de código**: Visual Studio Code, IntelliJ IDEA, o similar.
- **Conexión a internet**: Para instalar dependencias y comunicarse con la API de Wialon.

## Detalles e instalación

La estructura es: 

ITire/
├── backend/
│   ├── src/
│   │   ├── wialon/
│   │   │   ├── wialon.service.ts
│   │   │   ├── wialon.controller.ts
│   │   │   ├── wialon.module.ts
│   │   │   └── dto/mileage.dto.ts
│   │   └── app.module.ts
│   ├── .env
│   ├── main.ts
│   ├── package.json
│   └── ...
├── client/
│   ├── lib/
│   │   ├── models/
│   │   │   └── mileage_state.dart
│   │   ├── providers/
│   │   │   └── mileage_provider.dart
│   │   ├── screens/
│   │   │   └── mileage_screen.dart
│   │   └── main.dart
│   ├── pubspec.yaml
│   └── ...
├── README.md
└── .gitignore

- Inicia el backend con npm run start:dev
- El servidor corre en http://localhost:3000
- Se puede explorar la documentación de la API en Swagger: Para ello, abrir http://localhost:3000/api para ver los endpoints /wialon/login (POST) y /wialon/mileage (GET), con ejemplos, parámetros, y respuestas
- Para front, flutter run

## Cómo interactúa la app

Selecciona "Buick Skylark Convertible" en el dropdown, u otro.
Presiona "Consultar Kilometraje".
Verifica que muestre el kilometraje (por ejemplo, 483883 km), un mensaje de estado, y el nombre del vehículo.
