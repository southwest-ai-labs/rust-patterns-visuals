# Contributing to Rust Patterns

This guide outlines the Standard Operating Procedure (SOP) for adding new lessons to the platform.

## 1. File Naming & Location
- All lesson files must be placed in `public/content/` (or equivalent simulated path).
- Naming convention: `lesson{XX}_{topic_slug}.md`
  - Example: `lesson04_borrow_checker.md`

## 2. Registering the Lesson
Before the lesson appears in the app, you must add it to `curriculum.json`:

```json
{
  "id": "unique_id",
  "title": "Lesson Title",
  "filename": "lessonXX_topic.md",
  "difficulty": "Beginner|Intermediate|Rustacean",
  "readTime": "X min"
}
```

## 3. Markdown Syntax Guide

### The "Gem" (Pro Tip)
To highlight a senior-level tip, use a standard blockquote that starts with the 💎 emoji or "Pro Tip".

```markdown
> 💎 **Pro Tip: Zero Cost Abstractions**
>
> Rust iterators compile down to the same machine code as a manual for-loop.
```

### Diagrams (Mermaid)
Use a code block with the language `mermaid`.

    ```mermaid
    graph TD
    A[Start] --> B[End]
    ```

### Interactive Quiz
At the VERY END of the file, add the Quiz block. It must start with the specific separator `<!-- QUIZ START -->`.

Format:
```text
---
<!-- QUIZ START -->
[?] Question text here?
[ ] Wrong option
[x] Correct option (marked with x)
[ ] Another wrong option
```

## 4. Visual Style
- Use H1 (`#`) only for the Lesson Title.
- Use H2 (`##`) for major sections.
- Use `inline code` for variable names and types.
