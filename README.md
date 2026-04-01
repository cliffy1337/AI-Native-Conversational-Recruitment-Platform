# AI-Native Conversational Recruitment Platform

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## Overview

A modern, conversational recruitment platform built with Django where users interact through a hybrid experience of structured workflows and natural language chat. Core workflows such as job applications and profile management remain form-driven, while premium users access an advanced conversational AI interface. The platform uses AI to interpret intent, extract structured data, and provide semantic matching with explainable reasoning.

---

## Core Principles

* **Hybrid Interaction Model**: Combines structured forms with conversational AI
* **Conversational Augmentation**: AI enhances—not replaces—core workflows
* **Semantic Matching**: Matches based on meaning, not just keywords
* **Explainable AI**: Every match includes reasoning
* **Iterative Refinement**: Users refine searches through conversation
* **Human + AI Collaboration**: AI recommends, humans decide
* **Progressive Enhancement**: Chat is a premium, high-value feature layer

---

## User Flows

### Employer Flow (Primary)

1. **Start with Forms or Chat**

   * Forms: Create structured job postings
   * Chat (Premium): "I need to hire a senior backend engineer"
2. **AI Clarification (Chat)**: Asks clarifying questions naturally
3. **Job Building**: AI builds job posting behind the scenes or enhances existing one
4. **Match Presentation**: Shows candidate matches with cards + narrative
5. **Refinement**: "Find candidates with more Python experience" → matches update instantly
6. **Actions**: Contact, view profile, refine search from chat or dashboard

### Candidate Flow

1. **Start with Forms or Chat**

   * Forms: Profile setup, job applications
   * Chat (Premium): "I'm a full-stack developer looking for remote work"
2. **Profile Building (Chat)**: AI extracts skills and experience
3. **Resume Upload**: Optional upload, AI parses automatically
4. **Match Presentation**: Shows relevant jobs with cards + reasoning
5. **Refinement**: "Only show me startup roles" → matches update instantly
6. **Actions**: Apply via chat or traditional UI

---

## Technical Architecture

### Stack

| Layer               | Technology                                       |
| ------------------- | ------------------------------------------------ |
| Backend             | Django + Django Channels + Django REST Framework |
| Frontend            | Django Templates + React (chat interface)        |
| Real-time           | WebSockets via Channels                          |
| API Layer           | Django REST Framework                            |
| AI                  | OpenAI GPT-4 (function calling)                  |
| Database            | PostgreSQL (pgvector for embeddings)             |
| Cache/Channel Layer | Redis                                            |
| Async Tasks         | Celery                                           |
| Storage             | AWS S3 (resumes, documents)                      |
| Frontend Build Tool | Vite                                             |

---

## System Layers

| Layer          | Purpose                         | Components                                                 |
| -------------- | ------------------------------- | ---------------------------------------------------------- |
| Input          | Accept user data                | Forms, chat (React UI), file uploads                       |
| Interpretation | Convert text to structured data | LLM parser, intent detection, embedding generator          |
| Intelligence   | Compute matches & reasoning     | Matching engine, scoring algorithms, explanation generator |
| Interaction    | UI/UX layer                     | Django templates + React chat                              |
| Persistence    | Store data & feedback           | PostgreSQL, vector storage, conversation history           |

---

## Project Structure

```
project/
├── frontend/          # React application (chat UI)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── accounts/           # User auth, roles, profiles
│   ├── models.py
│   └── views.py
│
├── chat/               # Conversational AI system
│   ├── models/         # Conversation, Message, Embeddings
│   ├── services/
│   │   ├── ai_chat_handler.py
│   │   ├── chat_orchestrator.py
│   │   ├── retrieval_service.py
│   ├── api/            # DRF endpoints for React
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── templates/chat/
│   │   └── chat.html   # Mount point for React
│
├── jobs/
├── applications/
├── companies/
├── notifications/
├── shortlisting/
├── feedback/
├── search/
├── config/
├── static/
├── templates/
└── manage.py
```

---

## Data Models

### Conversation Model

Stores complete conversation state for resumable sessions

| Field      | Type      | Description           |
| ---------- | --------- | --------------------- |
| user       | FK(User)  | Owner of conversation |
| context    | JSONField | Filters, preferences  |
| status     | CharField | active, completed     |
| created_at | DateTime  | Timestamp             |

### Message Model (Updated)

Normalized chat message storage

| Field        | Type             | Description             |
| ------------ | ---------------- | ----------------------- |
| conversation | FK(Conversation) | Parent session          |
| role         | CharField        | user, assistant, system |
| content      | TextField        | Message content         |
| created_at   | DateTime         | Timestamp               |

### Embedding Model

Vector storage for semantic retrieval

| Field     | Type        | Description        |
| --------- | ----------- | ------------------ |
| message   | FK(Message) | Linked message     |
| embedding | VectorField | pgvector embedding |

---

## API Endpoints

### Chat (React Integration)

| Method | Endpoint   | Description                   |
| ------ | ---------- | ----------------------------- |
| POST   | /chat/api/ | Send message (React → Django) |
| GET    | /chat/     | Chat UI (React mount point)   |

---

## AI Services Architecture

### Chat Orchestrator (New Core Layer)

Central service coordinating chat flow

**Responsibilities:**

* Message persistence
* Context retrieval (RAG)
* AI interaction
* Response generation

---

## Frontend Components

### React Chat Interface (Premium)

* Mounted inside Django template
* Handles:

  * Message state
  * Async API calls
  * Dynamic UI updates

### Django Templates (Core Platform)

* Forms (applications, profiles)
* Dashboards
* Job management

---

## Implementation Stages

### Stage 1: Foundation

* Django app structure
* Core models
* Form-based workflows

### Stage 2: AI Integration

* OpenAI integration
* Embeddings + semantic search

### Stage 3: Hybrid Chat System (Current)

* React frontend setup via Vite
* Django REST API for chat
* Chat orchestration layer
* Premium chat access control

### Stage 4: Matching Engine

* Real-time match computation
* Scoring algorithms

### Stage 5: Chat UX Enhancement

* Streaming responses
* Conversation history
* Rich UI components

### Stage 6: Candidate Flow

* AI-assisted profile building
* Chat-driven job matching

### Stage 7: Production Readiness

* Performance optimization
* Deployment scaling

---

## Deployment Configuration

### Development

* SQLite database
* React dev server (Vite)
* Django API server
* Debug mode enabled

### Production

* PostgreSQL with pgvector
* Redis
* AWS S3
* Dockerized services
* React build served via Django static files

---

## Key Differentiators

1. **Hybrid UX**: Best of forms + conversational AI
2. **Explainable AI**: Transparent reasoning for matches
3. **Premium AI Layer**: Chat as a monetized feature
4. **Semantic Intelligence**: Vector-based matching
5. **Scalable Architecture**: Decoupled frontend + backend

---

## Roadmap

* [ ] Stage 1: Foundation
* [ ] Stage 2: AI integration
* [ ] Stage 3: Hybrid chat system
* [ ] Stage 4: Matching engine
* [ ] Stage 5: Chat UX improvements
* [ ] Stage 6: Candidate flow
* [ ] Stage 7: Production deployment
* [ ] Full real-time streaming chat
* [ ] Advanced analytics dashboard
* [ ] Multi-tenant SaaS support
