# Human-in-the-Loop Workflow for Elegant Frontend Training

This document describes the workflow for human-in-the-loop (HITL) tasks in the Elegant Frontend Training company.

## Overview

The COO is responsible for setting up workflows that enable:
1. **Manual Task Identification**: AI agents identify tasks that require human input
2. **Owner Alerting**: Owners are notified when their attention is needed
3. **Approval Gates**: Human approval before proceeding with sensitive operations
4. **Feedback Loops**: Human feedback incorporated into AI workflows

## Implemented: Agent Content Pipeline Skill

The `agent-content-pipeline` skill has been installed and assigned to the COO agent. This provides a complete human-in-the-loop workflow for content creation:

### Directory Structure
```
elegant/
├── drafts/     # Agent writes drafts here
├── reviewed/   # Human reviews, gives feedback
├── revised/    # pi automatically rewrites based on feedback
├── approved/  # Human-approved, ready to post
├── posted/    # Archive after posting
└── templates/ # Platform templates
```

### Workflow
```
drafts/ → reviewed/ → revised/ → approved/ → posted/
  write     review      pi         approve    post
```

### Commands
- `content list` - Show pending content
- `content review <file>` - Human reviews/approves
- `content edit <file>` - Open in editor
- `content post <file>` - Post to platform
- `content thread <file>` - Add feedback note

### Platforms Supported
- LinkedIn, X (Twitter), Reddit, dev.to, Hashnode

## Paperclip Native Features

### 1. Status-Based Workflow

Use Paperclip issue statuses to track human involvement:

| Status | Meaning |
|--------|---------|
| `todo` | Ready for AI processing |
| `in_progress` | AI is working on it |
| `in_review` | Awaiting human review |
| `done` | Completed |

### 2. Comment-Based Alerts

AI agents can alert owners by posting comments:

```
@owner Please review this task. I've prepared the following options:

1. Option A: [description]
2. Option B: [description]

Please let me know which approach you'd prefer, or if you have any questions.
```

### 3. Approval Requests

For formal sign-offs, use Paperclip approvals:

## Routine Notes MCP Integration

### Setup

1. Install Routine desktop app from https://routine.co/download
2. Run the MCP server:
   ```bash
   npx routine-mcp-server
   ```
3. Configure your AI agent to connect to the MCP server

### Usage

The Routine MCP provides tools for:
- Reading and writing notes
- Managing tasks
- Accessing calendars
- Creating reminders

### Alert Workflow

1. AI identifies a task requiring human input
2. AI creates a note in Routine with task details
3. AI creates a reminder for the owner
4. AI posts a comment in Paperclip alerting the owner

## MCP Integration (Optional)

### Routine Notes MCP

For connecting to Routine (calendars, tasks, notes):

1. Install Routine desktop app from https://routine.co/download
2. Run the MCP server:
   ```bash
   npx routine-mcp-server
   ```
3. Configure your AI agent to connect to the MCP server

### Notes MCP Server (Alternative)

Alternative MCP server for note management:
```bash
npx @sayranovv/notes-mcp-server
```

## skills.sh

The `skills.sh` file in this directory contains commands to install additional skills:

```bash
./skills.sh
```

This will install:
- Human-in-the-loop agent skills
- Routine MCP server
- Notes MCP server (alternative)

## Best Practices

1. **Clear Communication**: Always explain what you need from the human
2. **Provide Options**: When possible, offer choices rather than open-ended questions
3. **Set Expectations**: Indicate when you need a response by
4. **Document Decisions**: After human feedback, document what was decided
5. **Follow Up**: If no response, follow up appropriately

## Example Workflow

```
1. AI is working on task ELE-20 (content creation)
2. AI identifies that content needs legal review
3. AI:
   - Changes status to "in_review"
   - Posts comment: "@legal Please review the attached content for compliance"
   - Creates Routine note with content details
   - Sets reminder for legal team
4. Human reviews and responds
5. AI incorporates feedback and continues
6. AI changes status to "in_progress" or "done"
```
