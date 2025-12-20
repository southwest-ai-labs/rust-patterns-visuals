# 💬 Community Discussions Guide

Welcome to the Rust.Hub community! GitHub Discussions is our primary communication hub.

## Discussion Categories

### 📚 Lessons (Q&A)
Ask questions about specific lessons or concepts
- Tag with lesson ID (e.g., `lesson_01_match`)
- Include code snippets for context
- Be specific about what's confusing

### 💡 Show & Tell
Share your solutions and projects
- Post completed challenges
- Showcase personal projects using Rust
- Get feedback from the community

### 🚀 Feature Requests
Suggest improvements to the platform
- Describe the learning benefit
- Explain your use case
- Consider implementation complexity

### 🐛 Bug Reports
Report issues (prefer Issues for bugs, but discussions work too)

### 🎓 General
Everything else
- Career advice
- Learning strategies
- Rust ecosystem discussions

## Guidelines

### Be Respectful
- Everyone is learning at their own pace
- No "RTFM" responses
- Assume good faith

### Provide Context
```rust
// ✅ Good: Minimal reproducible example
fn example() {
    let x = vec![1, 2, 3];
    // Why doesn't this work?
    let y = x;
    println!("{:?}", x); // error here
}

// ❌ Bad: "My code doesn't work, help!"
```

### Search First
Before posting, search existing discussions for similar questions.

### Mark Solutions
If your question is answered, mark the best reply as the answer!

## Integration with Platform

### Lesson Discussions
Each lesson has a built-in discussion button that links to:
```
/discussions/categories/lessons?q=lesson_{id}
```

### AI-Powered Summaries
Our AI tutor can reference community discussions to provide better answers.

### Reputation System
Helpful community members earn:
- 🏆 Recognition badges
- 🎯 Higher visibility
- 🚀 Early access to new features

## Moderation

We're a welcoming community. Please report:
- Spam
- Harassment
- Off-topic content
- Unhelpful negativity

Moderators: @southwest-ai-labs team

## Tips for Getting Help

1. **Show your work** - Share what you've tried
2. **Minimal example** - Strip down to the core issue
3. **Error messages** - Include full compiler output
4. **Environment** - Rust version, OS, etc.
5. **Learning goal** - What are you trying to understand?

## Contributing to Discussions

### Answering Questions
- Link to official Rust docs when relevant
- Explain the "why" not just the "how"
- Encourage experimentation
- Share your own learning experience

### Voting
- Upvote helpful questions (helps others find them)
- Upvote clear, educational answers
- Downvote spam/abuse only

## Examples of Great Discussions

### Good Question Format
```markdown
**Lesson**: Control Flow Mastery - Match & If Let
**Issue**: I don't understand when to use `if let` vs `match`

I'm working through the Option examples and I see both:

[code example]

When should I use one over the other? Is it just preference?
```

### Good Answer Format
```markdown
Great question! Here's the key difference:

1. **`if let`** - When you care about ONE pattern
   [simple example]

2. **`match`** - When you need exhaustive handling
   [exhaustive example]

Rule of thumb: If you find yourself writing `_ => ()`,
consider `if let` instead.

Related reading: [Rust Book Chapter X]
```

## Getting Started

1. Click "Discussions" tab in the repo
2. Search for your topic
3. If not found, click "New Discussion"
4. Choose the right category
5. Write a clear title and description
6. Post and engage!

---

**Let's learn together! 🦀**
