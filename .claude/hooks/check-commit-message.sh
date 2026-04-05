#!/bin/bash
# Validates that git commit messages follow commitlint conventional commits format.
# Runs as a PreToolUse hook on Bash tool calls.

input=$(cat)
cmd=$(echo "$input" | jq -r ".tool_input.command // empty")

# Only check git commit commands
if ! echo "$cmd" | grep -qE "git +commit"; then
  exit 0
fi

msg=""

# Strategy 1: heredoc pattern — Claude typically uses <<'EOF' ... EOF
if echo "$cmd" | grep -q "<<"; then
  msg=$(printf '%s' "$cmd" | awk "
    /<<'?\"?EOF'?\"?/ { found=1; next }
    found && /^[[:space:]]*(Co-Authored-By|EOF)/ { exit }
    found && /[^[:space:]]/ { gsub(/^[[:space:]]+/, \"\"); print; exit }
  ")
fi

# Strategy 2: -m "message" (double quotes)
if [ -z "$msg" ]; then
  msg=$(printf '%s' "$cmd" | sed -n 's/.*-m "\([^"]*\)".*/\1/p' | head -1)
fi

# Strategy 3: -m 'message' (single quotes)
if [ -z "$msg" ]; then
  msg=$(printf '%s' "$cmd" | sed -n "s/.*-m '\\([^']*\\)'.*/\\1/p" | head -1)
fi

# Skip if message extraction failed (e.g. --amend without -m)
[ -z "$msg" ] && exit 0

# Trim whitespace
msg=$(echo "$msg" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

# Validate conventional commits: <type>(<scope>): <subject>
if ! echo "$msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\([^)]+\))?: .+"; then
  reason="Commit message does not follow commitlint conventional commits format. Got: [$msg]. Required: <type>(<scope>): <subject> — valid types: feat, fix, docs, style, refactor, perf, test, chore, build, ci, revert. Example: feat(auth): add OAuth2 login"
  jq -n --arg r "$reason" \
    '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":$r}}'
fi
