#!/bin/bash

# Skills for Elegant Frontend Training C-Suite Agents
# Run this script to install required skills for the company

# Human-in-the-Loop Workflow Skills
# These skills enable approval workflows, human oversight, and review-before-execute patterns
npx skills add latestaiagents-agent-skills-human-in-loop-agents

# Routine MCP Server - for connecting to Routine (calendars, tasks, notes)
# Requires Routine desktop app to be running
npx skills add routineco/mcp-server

# Alternative: Notes MCP Server (if Routine not available)
npx skills add sayranovv-notes-mcp-server

echo "Skills installation complete!"
echo ""
echo "To configure MCP servers, add to your MCP client config:"
echo ""
echo "For Routine MCP:"
echo '{
  "mcpServers": {
    "routine": {
      "command": "npx",
      "args": ["routine-mcp-server"]
    }
  }
}'
