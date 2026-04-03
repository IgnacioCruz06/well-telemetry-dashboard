# 🛢️ Well Telemetry Dashboard

Dashboard para visualización de datos de telemetría de pozos petroleros a partir de archivos LAS.

---

## 🚀 Tecnologías

- **Backend:** Node.js + Express + MongoDB  
- **Frontend:** React + Recharts  
- **Base de datos:** MongoDB local con fallback automático en memoria

---

## 📊 Overview

Este proyecto procesa datos históricos de pozos en formato LAS (Log ASCII Standard), los transforma en una estructura de series de tiempo y expone:

- Una API REST optimizada
- Un dashboard interactivo para visualización

La solución está diseñada con enfoque en escalabilidad, rendimiento y facilidad de ejecución.

---

## 🧠 Funcionalidaes

- Parsing de archivos LAS (incluyendo formato WRAP)
- Reconstrucción de timestamps reales:
  timestamp = STRT + TIME
- Almacenamiento dual:
  - `timestamp` → tiempo real
  - `time` → segundos originales
- Visualización multi-eje
- Selector dinámico de eje (timestamp / time)
- Dashboard con múltiples gráficas sincronizadas
- API optimizada con:
  - queries por rango dinámico
  - indexación
  - paginación (solo tablas)

---

## 🏗️ Arquitectura

- Ingesta por streaming (Node.js)
- Inserciones en batch (optimización)
- MongoDB con índices en:
- `timestamp`
- `time`
- Frontend desacoplado con consumo REST

```mermaid
flowchart LR
    A[Archivo LAS] --> B[Backend Node.js]
    B --> C[Parser LAS]
    C --> D[Batch Insert]
    D --> E[(MongoDB)]

    E --> F[API REST]
    F --> G[Frontend React]

    G --> H[Recharts]

---

📁 Estructura del Proyecto

well-telemetry-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── database.ts
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│
├── data/
│   └── *.las
│
└── README.md

---

## ⚙️ Requisitos

- Node.js >= 18
- npm o yarn

---

## 🚀 Ejecución rápida

### 1. Clonar repo

```bash
git clone https://github.com/IgnacioCruz06/well-telemetry-dashboard.git
cd well-telemetry-dashboard
```

--- 
### 2. Base de datos

Opción A: MongoDB local (Recomendado)
Ejecutar MongoDB:
```bash
mongod
```
URI utilizada por defecto:
- mongodb://127.0.0.1:27017/telemetry

Opcipon B: Sin MongoDB (modo automático)
Si MongoDb no está disponible, el sistema utilizará automaticamente:
- mongodb-memory-server
✔ No requiere instalación
⚠️ Los datos no se guardan permanentemente

### 3. Ejecutar Backend

```bash
cd backend
npm run install
npm run dev
```
Servidor disponible en 

### 4. Importar datos LAS (Paso importante)

En otra terminal ejecuta:
```bash
npm run import
```
Este paso:
- procesa el archivo `.las`
- Inserta los registros em la base de datos.

### 5. Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en: http://localhost:5173

### 6. Verificar funcionammiento
## 1. Asegúrate de que:
   - Backend esté corriendo
   - Frontend esté corriendo
   - Datos hayan sido importados exitosamente.

## 2. Abre en el navegador: 
http://localhost:5173

### 7. 🌐 API Endpoints

🔹 Último valor (optimizado <100ms)
```bash
GET http://localhost:3000/v1/telemetry/latest
```

Retorna:
- Presión
- Temperatura
- timestamp

🔹 Rango dinámico (gráficas)
```bash
GET http://localhost:3000/v1/telemetry/range?hours=24&mode=chart
```

✔ Retorna todos los datos del rango
✔ Usado por el dashboard

🔹 Rango dinámico (tablas)
```bash
GET http://localhost:3000/v1/telemetry/range?hours=24&page=1&limit=100
```

✔ Paginado
✔ Optimizado para grandes volúmenes

⚠️ Importante
Las gráficas NO usan paginación
La paginación se usa solo para tablas

### 📊 Visualización

**Custom View**
- Selección libre de curvas

**Operational View**
- Presión
- Perforación
- Flujo

### Características
- Multi-axis charts
- Sincronización de gráficas
- Selector dinámico de eje X

###  Performance
- Indexación en:
- timestamp
- time
- Batch insert
- Queries con .lean()
- Selección parcial de campos
- Respuestas < 100ms

### 🚀 Escalabilidad

Preparado para:
- Sharding por timestamp
- MongoDB Time-Series
- Downsampling
- Streaming de datos
- WebSockets

### 🛠️ Manejo de errores
- Validación de datos
- Try/catch en servicios
- Fallback automático de DB
- Logs de debugging

### 🧠 Decisiones de Ingeniería
- MongoDB → esquema flexible (curvas variables)
- Node.js → procesamiento eficiente por streaming
- Batch insert → reducción de I/O
- Separación de responsabilidades
- API versionada (/v1)


### 📈 Posibles mejoras
- Downsampling backend
- Detección de anomalías
- Autenticación
- Tiempo real (WebSockets)

### 👨‍💻 Autor
**José Ignacio Cruz Reyes**

