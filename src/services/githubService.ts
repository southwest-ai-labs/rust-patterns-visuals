
import { UserProgress, AIDynamicChallenge } from '../types';

export interface GithubConfig {
  token: string;
  username: string;
}

// Fix: Added missing Note interface for LessonNotes
export interface Note {
  id: string;
  body: string;
  date: string;
  url: string;
}

// Fix: Added missing Comment interface for LessonDiscussion
export interface Comment {
  id: number;
  user: string;
  avatar: string;
  body: string;
  date: string;
  reactions: {
    plus1: number;
    rocket: number;
  };
}

const REPO_NAME = 'rust-patterns-storage';
const FILE_PATH = 'progress_v2.json';
const COMMUNITY_REPO = 'southwest-ai-labs/rust-patterns-visuals';
const DISCUSSIONS_REPO = 'southwest-ai-labs/rust-patterns-visuals';

const getHeaders = (token: string) => ({
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json',
  'Content-Type': 'application/json',
});

export const checkRepoExists = async (config: GithubConfig): Promise<boolean> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}`, {
      headers: getHeaders(config.token)
    });
    return res.status === 200;
  } catch (e) { return false; }
};

export const createRepo = async (config: GithubConfig): Promise<boolean> => {
  try {
    const res = await fetch(`https://api.github.com/user/repos`, {
      method: 'POST',
      headers: getHeaders(config.token),
      body: JSON.stringify({
        name: REPO_NAME,
        description: 'Sovereign data storage for Rust.Hub progress.',
        private: true,
        auto_init: true
      })
    });
    return res.status === 201;
  } catch (e) { return false; }
};

export const getProgressFile = async (config: GithubConfig): Promise<{ sha?: string, data?: UserProgress } | null> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/${FILE_PATH}`, {
      headers: getHeaders(config.token)
    });
    if (res.status === 404) return { sha: undefined, data: undefined };
    if (res.status === 200) {
      const json = await res.json();
      const decodedContent = decodeURIComponent(escape(atob(json.content)));
      return { sha: json.sha, data: JSON.parse(decodedContent) };
    }
    return null;
  } catch (e) { return null; }
};

export const saveProgress = async (config: GithubConfig, data: UserProgress, sha?: string): Promise<boolean> => {
  try {
    const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const body: any = {
      message: `Neural Sync | MMR: ${data.totalMMR}`,
      content: contentBase64
    };
    if (sha) body.sha = sha;
    const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: getHeaders(config.token),
      body: JSON.stringify(body)
    });
    return res.status === 200 || res.status === 201;
  } catch (e) { return false; }
};

export const forkSolutionToUserRepo = async (config: GithubConfig, title: string, author: string, content: string): Promise<boolean> => {
    try {
        const fileName = `fork_${author}_${title.toLowerCase().replace(/\s+/g, '_')}.md`;
        const mdContent = `# Forked: ${title}\nAuthor: @${author}\n\n${content}`;
        const contentBase64 = btoa(unescape(encodeURIComponent(mdContent)));
        const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/forks/${fileName}`, {
            method: 'PUT',
            headers: getHeaders(config.token),
            body: JSON.stringify({ message: `Forking ${title}`, content: contentBase64 })
        });
        return res.status === 201 || res.status === 200;
    } catch (e) { return false; }
};

// Fix: Added missing saveDynamicChallengeToFork function
export const saveDynamicChallengeToFork = async (config: GithubConfig, challenge: AIDynamicChallenge, feedback: string, score: number): Promise<boolean> => {
    try {
        const fileName = `challenge_${challenge.title.toLowerCase().replace(/\s+/g, '_')}.md`;
        const mdContent = `# Challenge: ${challenge.title}\n\n## Scenario\n${challenge.scenario}\n\n## Feedback\n${feedback}\n\n## Final Score: ${score}/100`;
        const contentBase64 = btoa(unescape(encodeURIComponent(mdContent)));
        const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/challenges/${fileName}`, {
            method: 'PUT',
            headers: getHeaders(config.token),
            body: JSON.stringify({ message: `Archiving Challenge: ${challenge.title}`, content: contentBase64 })
        });
        return res.status === 201 || res.status === 200;
    } catch (e) { return false; }
};

// Fix: Added missing fetchLessonNotes function
export const fetchLessonNotes = async (config: GithubConfig, lessonId: string): Promise<Note[]> => {
    try {
        const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/notes/${lessonId}`, {
            headers: getHeaders(config.token)
        });
        if (res.status === 200) {
            const files = await res.json();
            if (Array.isArray(files)) {
                const notes = await Promise.all(files.map(async (file: any) => {
                    const detailRes = await fetch(file.url, { headers: getHeaders(config.token) });
                    const detailJson = await detailRes.json();
                    const decoded = decodeURIComponent(escape(atob(detailJson.content)));
                    return {
                        id: detailJson.sha,
                        body: decoded,
                        date: new Date().toISOString(),
                        url: detailJson.html_url
                    };
                }));
                return notes.sort((a, b) => b.date.localeCompare(a.date));
            }
        }
        return [];
    } catch (e) { return []; }
};

// Fix: Added missing postLessonNote function
export const postLessonNote = async (config: GithubConfig, lessonId: string, body: string): Promise<Note | null> => {
    try {
        const fileName = `note_${Date.now()}.txt`;
        const contentBase64 = btoa(unescape(encodeURIComponent(body)));
        const res = await fetch(`https://api.github.com/repos/${config.username}/${REPO_NAME}/contents/notes/${lessonId}/${fileName}`, {
            method: 'PUT',
            headers: getHeaders(config.token),
            body: JSON.stringify({ message: `New note for ${lessonId}`, content: contentBase64 })
        });
        if (res.status === 201 || res.status === 200) {
            const json = await res.json();
            return {
                id: json.content.sha,
                body: body,
                date: new Date().toISOString(),
                url: json.content.html_url
            };
        }
        return null;
    } catch (e) { return null; }
};

// Fix: Added missing findDiscussionIssue function
export const findDiscussionIssue = async (token: string | undefined, lessonId: string): Promise<number | null> => {
    try {
        const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
        if (token) headers['Authorization'] = `token ${token}`;

        const res = await fetch(`https://api.github.com/repos/${COMMUNITY_REPO}/issues?labels=lesson:${lessonId}`, {
            headers
        });
        if (res.status === 200) {
            const issues = await res.json();
            if (issues.length > 0) return issues[0].number;
        }
        return null;
    } catch (e) { return null; }
};

// Fix: Added missing fetchComments function
export const fetchComments = async (token: string | undefined, issueId: number): Promise<Comment[]> => {
    try {
        const headers: any = { 'Accept': 'application/vnd.github.v3+json' };
        if (token) headers['Authorization'] = `token ${token}`;

        const res = await fetch(`https://api.github.com/repos/${COMMUNITY_REPO}/issues/${issueId}/comments`, {
            headers
        });
        if (res.status === 200) {
            const comments = await res.json();
            return comments.map((c: any) => ({
                id: c.id,
                user: c.user.login,
                avatar: c.user.avatar_url,
                body: c.body,
                date: c.created_at,
                reactions: {
                    plus1: c.reactions?.['+1'] || 0,
                    rocket: c.reactions?.['rocket'] || 0
                }
            }));
        }
        return [];
    } catch (e) { return []; }
};

// Fix: Added missing postComment function
export const postComment = async (token: string, issueId: number, body: string): Promise<boolean> => {
    try {
        const res = await fetch(`https://api.github.com/repos/${COMMUNITY_REPO}/issues/${issueId}/comments`, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify({ body })
        });
        return res.status === 201;
    } catch (e) { return false; }
};

// Fix: Added missing addReaction function
export const addReaction = async (token: string, commentId: number, content: '+1' | 'rocket'): Promise<boolean> => {
    try {
        const res = await fetch(`https://api.github.com/repos/${COMMUNITY_REPO}/issues/comments/${commentId}/reactions`, {
            method: 'POST',
            headers: {
                ...getHeaders(token),
                'Accept': 'application/vnd.github.squirrel-girl-preview+json'
            },
            body: JSON.stringify({ content })
        });
        return res.status === 201;
    } catch (e) { return false; }
};
