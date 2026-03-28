# AI-Native Conversational Recruitment Platform

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

## Overview

A modern, conversational recruitment platform built with Django where users interact entirely through natural language chat. No forms, no manual data entry - just conversation. The platform uses AI to interpret intent, extract structured data, and provide semantic matching with explainable reasoning.

---

## Core Principles

- **Conversational First**: Every interaction happens through natural dialogue
- **No Forms**: AI extracts structured data from free-text conversation
- **Semantic Matching**: Matches based on meaning, not just keywords
- **Explainable AI**: Every match includes reasoning
- **Iterative Refinement**: Users refine searches through conversation
- **Human + AI Collaboration**: AI recommends, humans decide

---

## User Flows

### Employer Flow (Primary)

1. **Start Chat**: "I need to hire a senior backend engineer"
2. **AI Clarification**: Asks clarifying questions naturally
3. **Job Building**: AI builds job posting behind the scenes
4. **Match Presentation**: Shows candidate matches with cards + narrative
5. **Refinement**: "Find candidates with more Python experience" → matches update instantly
6. **Actions**: Contact, view profile, refine search from chat

### Candidate Flow

1. **Start Chat**: "I'm a full-stack developer looking for remote work"
2. **Profile Building**: AI extracts skills, experience through conversation
3. **Resume Upload**: Optional upload, AI parses automatically
4. **Match Presentation**: Shows relevant jobs with cards + reasoning
5. **Refinement**: "Only show me startup roles" → matches update instantly
6. **Actions**: Apply via chat, save role, view details

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Backend | Django + Django Channels |
| Frontend | Django Templates + HTMX + Alpine.js |
| Real-time | WebSockets via Channels |
| AI | OpenAI GPT-4 (function calling) |
| Database | PostgreSQL (pgvector for embeddings) |
| Cache/Channel Layer | Redis |
| Async Tasks | Celery |
| Storage | AWS S3 (resumes, documents) |

### System Layers

| Layer | Purpose | Components |
|-------|---------|------------|
| Input | Accept user data | Free-text chat, file uploads |
| Interpretation | Convert text to structured data | LLM parser, intent detection, embedding generator |
| Intelligence | Compute matches & reasoning | Matching engine, scoring algorithms, explanation generator |
| Interaction | Conversational interface | WebSocket chat, iterative refinement |
| Persistence | Store data & feedback | PostgreSQL, vector storage, conversation history |

---

## Project Structure

```
project/
├── accounts/           # User auth, roles, profiles
│   ├── models.py       # Custom User model
│   └── views.py        # Auth views
│
├── chat/               # Core conversational engine
│   ├── consumers.py    # WebSocket message handler
│   ├── routing.py      # WebSocket URL routing
│   ├── models.py       # Conversation model
│   ├── services/
│   │   ├── intent.py           # Intent detection via OpenAI
│   │   ├── response.py         # Response formatting with cards
│   │   ├── state.py            # Conversation state management
│   │   ├── context.py          # Context persistence
│   │   ├── actions.py          # Quick action handlers
│   │   ├── refinement.py       # Search refinement logic
│   │   └── fallback.py         # Graceful error handling
│   └── templates/chat/
│       ├── employer_chat.html
│       ├── candidate_chat.html
│       └── components/
│           ├── message.html
│           ├── candidate_card.html
│           ├── job_card.html
│           └── quick_actions.html
│
├── jobs/               # Job postings & matching
│   ├── models.py       # Job model with draft/active status
│   ├── services/
│   │   ├── job_builder.py      # Build jobs from conversation
│   │   ├── matching.py         # Matching engine
│   │   ├── scoring.py          # Weighted scoring algorithms
│   │   ├── match_calculator.py # Real-time match computation
│   │   └── filter_updater.py   # Dynamic filter updates
│   └── templates/jobs/
│
├── applications/       # Job applications & AI services
│   └── services/
│       ├── ai_match.py         # AI matching logic
│       ├── embeddings.py       # Vector embedding generation
│       └── parser.py           # Resume parsing
│
├── candidates/         # Candidate management
│   ├── models.py       # Candidate profile model
│   └── services/
│       ├── profile_builder.py  # Build profiles from conversation
│       └── query.py            # Candidate search queries
│
├── companies/          # Company management
│   └── models.py       # Company profile
│
├── notifications/      # Email & in-app notifications
│   └── services/
│       └── email.py            # Notification delivery
│
├── shortlisting/       # Candidate shortlist management
│   └── services/
│       └── shortlist.py
│
├── feedback/           # User feedback collection
│   └── models.py       # Feedback for AI training
│
├── search/             # Vector-based semantic search
│   └── services/
│       └── vector_search.py
│
├── config/             # Django configuration
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── asgi.py         # ASGI config for Channels
│   └── urls.py
│
├── static/
│   ├── css/
│   │   └── chat.css
│   └── js/
│       └── chat.py     # WebSocket client + HTMX handlers
│
├── templates/
│   └── base.html       # Base template with HTMX + Alpine.js
│
└── manage.py
```

---

## Data Models

### Conversation Model
Stores complete conversation state for resumable sessions

| Field | Type | Description |
|-------|------|-------------|
| user | FK(User) | Owner of conversation |
| session_type | CharField | employer or candidate |
| context | JSONField | Current filters, preferences, draft job |
| messages | JSONField | Full message history |
| active_context | JSONField | Current job/post being built |
| status | CharField | active, completed, expired |
| created_at | DateTime | Timestamp |
| updated_at | DateTime | Last activity |

### Job Model (Enhanced)
Supports draft state and conversational building

| Field | Type | Description |
|-------|------|-------------|
| employer | FK(User) | Job poster |
| status | CharField | draft, active, filled, closed |
| raw_text_description | TextField | Original conversation |
| structured_data | JSONField | AI-extracted job details |
| embedding | BinaryField | Vector for semantic search |
| is_active | Boolean | Searchable flag |

### Match Model
Stores match results with explainability

| Field | Type | Description |
|-------|------|-------------|
| candidate | FK(Candidate) | Matched candidate |
| job | FK(Job) | Matched job |
| overall_score | Float | Weighted match score |
| skill_match_score | Float | Skills alignment |
| culture_fit_score | Float | Culture compatibility |
| reasoning | TextField | Human-readable explanation |
| match_breakdown | JSONField | Detailed scoring components |
| status | CharField | pending, viewed, shortlisted, rejected |

---

## WebSocket Message Protocol

### Client to Server
```json
{
    "type": "message",
    "content": "I need a senior backend engineer",
    "conversation_id": "uuid"
}
```

### Server to Client - Text Response
```json
{
    "type": "text",
    "content": "What programming languages are required?",
    "thinking": false
}
```

### Server to Client - Match Cards
```json
{
    "type": "matches",
    "content": "Here are the top 3 matches...",
    "cards": [
        {
            "type": "candidate",
            "id": 123,
            "name": "Sarah Chen",
            "title": "Senior Backend Engineer",
            "skills": ["Python", "AWS", "PostgreSQL"],
            "match_score": 94,
            "match_reason": "Strong Python and AWS experience",
            "html": "<div class='card'>...</div>"
        }
    ],
    "actions": ["refine", "contact", "view_profile"]
}
```

### Server to Client - Thinking Indicator
```json
{
    "type": "thinking",
    "status": "typing"
}
```

---

## API Endpoints

### Chat & Conversation
| Method | Endpoint | Description |
|--------|----------|-------------|
| WS | /ws/chat/{conversation_id}/ | WebSocket chat connection |
| GET | /chat/employer/ | Employer chat interface |
| GET | /chat/candidate/ | Candidate chat interface |
| POST | /api/conversations/ | Create new conversation |
| GET | /api/conversations/{id}/ | Resume conversation |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/jobs/activate/ | Activate draft job (start matching) |
| GET | /api/jobs/{id}/matches/ | Get matches for job |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/candidates/{id}/preview/ | Quick profile view |
| POST | /api/candidates/{id}/contact/ | Send contact message |

### Actions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/actions/shortlist/ | Add candidate to shortlist |
| POST | /api/actions/apply/ | Apply to job from chat |
| POST | /api/actions/refine/ | Update search criteria |

---

## AI Services Architecture

### Intent Detection Service
Classifies user intent using OpenAI function calling

**Intents:**
- start_job_posting - Employer wants to create job
- refine_search - Modify existing search criteria
- view_details - See more about match
- confirm_action - Confirm job posting, application
- general_chat - Casual conversation

### Job Builder Service
Extracts structured job data from conversation

**Extracted fields:**
- title, skills, experience_years, seniority_level
- employment_type, location, salary_range
- benefits, culture_traits, responsibilities

### Matching Engine
Multi-dimensional scoring with explainability

**Scoring dimensions:**
- Skills match (40% weight)
- Experience level (30% weight)
- Culture fit (20% weight)
- Preferences (10% weight)

**Output:** Overall score + breakdown + human-readable reasoning

### Response Formatter
Generates conversational responses with rich cards

**Components:**
- Natural language narration
- Candidate/job cards with key details
- Quick action buttons
- Refinement suggestions

---

## Frontend Components

### HTMX Integration
- Dynamic card updates without page reload
- Form submissions via HTMX triggers
- WebSocket message injection into DOM

### Alpine.js Components

**Chat Component:**
- Manages WebSocket connection
- Handles message sending/receiving
- Renders cards and actions
- Maintains scroll position

**Card Components:**
- Candidate card with match score and reasoning
- Job card with key details
- Job summary card for confirmation
- Action buttons with event handlers

### Styling Guidelines
- Clean, simple chat interface
- Cards: minimal, legible, with clear match score
- Buttons: consistent, context-aware
- Typing indicator for AI responses
- Mobile-responsive layout

---

## Implementation Stages

### Stage 1: Foundation
- Conversation model and migrations
- Django Channels configuration
- WebSocket consumers and routing
- Basic chat template with HTMX + Alpine.js
- Conversation state management

### Stage 2: AI Integration
- OpenAI client setup
- Intent detection with function calling
- Response formatting service
- Context management
- Card HTML generation

### Stage 3: Employer Job Posting
- Job builder from conversation
- Draft job management
- Question generation for gaps
- Job confirmation flow

### Stage 4: Matching Engine
- Enhanced matching service
- Real-time match computation
- Candidate retrieval
- Weighted scoring algorithms

### Stage 5: Match Presentation
- Card generation system
- Quick action handlers
- Refinement logic
- Real-time match updates

### Stage 6: Candidate Flow
- Profile building through conversation
- Resume upload integration
- Candidate job matching
- Apply flow

### Stage 7: Production Readiness
- Error handling and fallbacks
- Performance optimization
- Deployment configuration
- Monitoring and analytics

---

## Deployment Configuration

### Development
- SQLite database
- In-memory channel layer
- Local file storage
- Debug mode enabled

### Production
- PostgreSQL with pgvector
- Redis channel layer
- AWS S3 for file storage
- Gunicorn + Uvicorn for ASGI
- Nginx reverse proxy
- Docker containers

### Environment Variables
```
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_key
AWS_STORAGE_BUCKET_NAME=your_bucket
```

---

## Key Differentiators

1. **Purely Conversational**: No forms, no manual data entry
2. **Explainable AI**: Every match includes reasoning, not just scores
3. **Real-time Refinement**: Updates instantly as user converses
4. **Unified Experience**: Same conversational interface for employers and candidates
5. **Progressive Building**: Jobs and profiles built naturally through dialogue

---

## Roadmap

- [ ] Stage 1: Foundation & WebSocket chat
- [ ] Stage 2: AI integration with OpenAI
- [ ] Stage 3: Employer job posting flow
- [ ] Stage 4: Matching engine implementation
- [ ] Stage 5: Match presentation & refinement
- [ ] Stage 6: Candidate flow
- [ ] Stage 7: Production deployment
- [ ] Multi-conversation support
- [ ] Analytics dashboard
- [ ] Advanced culture-fit scoring