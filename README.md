# 🛢️ Well Telemetry Dashboard

Dashboard para visualización de datos de telemetría de pozos petroleros a partir de archivos LAS.

---

## 🚀 Tecnologías

- Backend: Node.js + Express + MongoDB
- Frontend: React + Recharts
- Base de datos: MongoDB (local o in-memory opcional)

---

## 📊 Overview

This project ingests historical well data in LAS (Log ASCII Standard) format, processes and validates it, and exposes a REST API along with a frontend dashboard to visualize pressure and temperature behavior.

The solution is designed with scalability, performance, and portability in mind.

---

## 🧠 Funcionalidaes

- Parsing de archivos LAS (incluyendo WRAP)
- Reconstrucción de timestamps: timestamp = STRT + TIME
-  Visualización de curvas en múltiples ejes
- Selector dinámico de eje (time vs timestamp)
- Dashboard con múltiples gráficas sincronizadas
- API optimizada con:
- paginación
- queries por rango dinámico
- indexación

---

## 🏗️ Arquitectura

- Ingesta por streaming (Node.js)
- Inserciones en batch (optimización)
- MongoDB con índices en:
- `timestamp`
- `time`
- Frontend desacoplado con consumo REST

---

## ⚙️ Requisitos

- Node.js >= 18
- npm o yarn

---

## 🚀 Ejecución rápida

### 1. Clonar repo

```bash
git clone https://github.com/tu-usuario/well-telemetry-dashboard.git
cd well-telemetry-dashboard

