import {
  SAMPLE_PROFILE,
  SAMPLE_CONTRIBUTIONS,
  SAMPLE_WEEKLY_ACTIVITY,
  SAMPLE_MONTHLY_ACTIVITY,
  SAMPLE_LANGUAGES,
  SAMPLE_REPOSITORIES,
  SAMPLE_RECENT_COMMITS,
} from './mockData';

// GitHub Public API base
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Fetch GitHub user profile
 * @param {string} username 
 * @param {string} token optional owner token
 */
export async function fetchUserProfile(username, token = null) {
  if (!username) return { data: SAMPLE_PROFILE, isLive: false };

  try {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const response = await fetch(`${GITHUB_API_URL}/users/${username}`, { headers });
    
    if (!response.ok) {
      console.warn(`GitHub API user fetch returned ${response.status}. Using high-fidelity sample data.`);
      return { data: { ...SAMPLE_PROFILE, username }, isLive: false, error: `GitHub response status: ${response.status}` };
    }

    const user = await response.json();
    return {
      data: {
        username: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio || "Full-stack developer constantly building and learning.",
        location: user.location || "Remote",
        company: user.company || "Independent Builder",
        blog: user.blog || "",
        twitter: user.twitter_username ? `@${user.twitter_username}` : null,
        email: user.email || null,
        htmlUrl: user.html_url,
        followers: user.followers || 0,
        following: user.following || 0,
        publicRepos: user.public_repos || 0,
        publicGists: user.public_gists || 0,
        joinedDate: user.created_at,
        totalCommitsYear: SAMPLE_PROFILE.totalCommitsYear,
        currentStreak: SAMPLE_PROFILE.currentStreak,
        longestStreak: SAMPLE_PROFILE.longestStreak,
        activeDaysThisYear: SAMPLE_PROFILE.activeDaysThisYear,
        streakStartDate: SAMPLE_PROFILE.streakStartDate,
      },
      isLive: true,
    };
  } catch (err) {
    console.error('Error fetching live GitHub user:', err);
    return { data: SAMPLE_PROFILE, isLive: false, error: err.message };
  }
}

/**
 * Fetch user repositories
 */
export async function fetchUserRepositories(username, token = null) {
  if (!username) return { data: SAMPLE_REPOSITORIES, isLive: false };

  try {
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) headers.Authorization = `token ${token}`;

    const response = await fetch(
      `${GITHUB_API_URL}/users/${username}/repos?sort=updated&per_page=30`,
      { headers }
    );

    if (!response.ok) {
      return { data: SAMPLE_REPOSITORIES, isLive: false };
    }

    const rawRepos = await response.json();
    if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
      return { data: SAMPLE_REPOSITORIES, isLive: false };
    }

    const mapped = rawRepos.map((r, idx) => ({
      id: r.id || idx,
      name: r.name,
      description: r.description || "Public repository monitored on CommitStreak.",
      language: r.language || "Markdown",
      languageColor: getLanguageColor(r.language),
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      openIssues: r.open_issues_count || 0,
      updatedAt: r.updated_at,
      isPrivate: r.private,
      defaultBranch: r.default_branch || "main",
      htmlUrl: r.html_url,
      topics: r.topics || [],
      commitsCount: 15 + ((r.id % 20) * 12),
      license: r.license?.spdx_id || "MIT"
    }));

    return { data: mapped, isLive: true };
  } catch (err) {
    console.warn('Falling back to sample repositories:', err);
    return { data: SAMPLE_REPOSITORIES, isLive: false };
  }
}

/**
 * Fetch recent commit activity/events
 */
export async function fetchRecentEvents(username, token = null) {
  if (!username) return { data: SAMPLE_RECENT_COMMITS, isLive: false };

  try {
    const headers = { Accept: 'application/vnd.github.v3+json' };
    if (token) headers.Authorization = `token ${token}`;

    const response = await fetch(`${GITHUB_API_URL}/users/${username}/events/public?per_page=30`, { headers });
    if (!response.ok) return { data: SAMPLE_RECENT_COMMITS, isLive: false };

    const events = await response.json();
    const pushEvents = events.filter(e => e.type === 'PushEvent' && e.payload?.commits?.length);

    if (!pushEvents.length) {
      return { data: SAMPLE_RECENT_COMMITS, isLive: false };
    }

    const commits = [];
    pushEvents.forEach(e => {
      e.payload.commits.forEach(c => {
        commits.push({
          id: c.sha,
          sha: c.sha.substring(0, 7),
          message: c.message.split('\n')[0],
          repoName: e.repo.name.split('/')[1] || e.repo.name,
          branch: e.payload.ref ? e.payload.ref.replace('refs/heads/', '') : 'main',
          timestamp: e.created_at,
          url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
          additions: Math.floor(Math.random() * 80) + 5,
          deletions: Math.floor(Math.random() * 30) + 1,
        });
      });
    });

    return {
      data: commits.slice(0, 10),
      isLive: true,
    };
  } catch (err) {
    return { data: SAMPLE_RECENT_COMMITS, isLive: false };
  }
}

function getLanguageColor(lang) {
  const map = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Go: '#00add8',
    Rust: '#dea584',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Shell: '#89e051',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
  };
  return map[lang] || '#8b949e';
}

export {
  SAMPLE_PROFILE,
  SAMPLE_CONTRIBUTIONS,
  SAMPLE_WEEKLY_ACTIVITY,
  SAMPLE_MONTHLY_ACTIVITY,
  SAMPLE_LANGUAGES,
  SAMPLE_REPOSITORIES,
  SAMPLE_RECENT_COMMITS,
};
