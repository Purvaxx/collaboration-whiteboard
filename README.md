# NexusBoard AI

**NexusBoard AI** is an enterprise-grade, real-time collaborative whiteboard augmented with multimodal AI reasoning.
It combines a high-performance canvas engine, low-latency synchronization, and Gemini-powered analysis to support technical design, architecture reviews, and strategic collaboration.

## Overview

NexusBoard is designed as a **local-first, real-time system**. User interactions are rendered instantly on the client, synchronized across peers via WebSockets, and optionally analyzed by an AI layer that can interpret both the visual canvas and its underlying data model. The system is optimized for correctness, performance, and developer ergonomics, with zero build tooling required for modern browsers.

## Core Features

* **Real-Time Collaboration**
  Low-latency cursor tracking and element synchronization using Socket.io.

* **High-Performance Canvas Engine**
  Custom HTML5 Canvas renderer with coordinate mapping, panning, selection, and real-time manipulation (120fps capable).

* **AI Board Auditor**
  Multimodal Gemini integration that analyzes the board as both an image and structured data to identify architectural gaps, design flaws, or missing components.

* **Conflict-Free Sync Model**
  CRDT-style element updates using unique IDs and state broadcasting, enabling parallel edits without overwrites.

* **Enterprise Modules**
  Infrastructure dashboard, scheduling system with persistence, plugin marketplace simulation, and architecture specification view.

* **Zero-Build Native ESM Architecture**
  Uses import maps and native ES modules; no bundler or build step required.

## Technology Stack

**Frontend**

* React 19 (concurrent features)
* TypeScript
* Tailwind CSS
* Framer Motion
* HTML5 Canvas API

**Backend**

* Node.js
* Express
* Socket.io

**AI**

* Google Gemini API
  (`@google/genai`, `gemini-3-pro-preview`)

**Runtime**

* Native ES Modules (ESM)

---

## Architecture Summary

* **Local-First Rendering:**
  All interactions render immediately on the client for responsiveness.

* **Sync Mesh:**
  A Socket.io layer broadcasts cursor movement, drawing events, and element state updates to connected clients.

* **Intelligence Layer:**
  Captures the canvas as a Base64 image along with structured element metadata and submits both to Gemini for contextual reasoning.

* **Server Role:**
  Express serves static assets and acts as the WebSocket orchestration layer.

---

## Getting Started

### Prerequisites

* Node.js v18 or later
* Google Gemini API key

### Environment Configuration

Create a `.env` file in the project root:

```env
API_KEY=your_gemini_api_key
PORT=5000
```

Ensure `.env` is included in `.gitignore`.

### Install Dependencies

```bash
npm install express socket.io cors
```

### Run the Server

```bash
npx tsx server/index.ts
```

The application will be available at:

```
http://localhost:5000
```

---

## Deployment

The application is deployment-ready and can be hosted on platforms such as Render, Railway, or Heroku.
The Express server handles both static asset serving and WebSocket communication.

## Demo

This section showcases the core capabilities of NexusBoard AI, including real-time collaboration, canvas performance, and AI-assisted analysis.

Video Walkthroughs

**Full Product Overview**

https://github.com/user-attachments/assets/102eccff-c96a-41bd-970d-1cde6ec74cc3

## Notes

* The server is configured to correctly serve the root route (`/`), avoiding common “Cannot GET /” issues.
* API keys must never be committed to source control.

