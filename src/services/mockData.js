// Realistic developer data for CommitStreak
// Demonstrates authentic coding streak, commit activity, language distributions, and repositories.

export const SAMPLE_PROFILE = {
  username: "alexrivera-dev",
  name: "Alex Rivera",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  bio: "Full-stack engineer crafting scalable distributed systems & high-performance developer tools. Open source advocate.",
  location: "San Francisco, CA",
  company: "Veloce Systems",
  blog: "https://alexrivera.dev",
  twitter: "@alex_rivera",
  email: "alex@example.com",
  htmlUrl: "https://github.com",
  followers: 428,
  following: 112,
  publicRepos: 24,
  publicGists: 9,
  joinedDate: "2021-03-15T00:00:00Z",
  totalCommitsYear: 1482,
  currentStreak: 47,
  longestStreak: 94,
  activeDaysThisYear: 284,
  streakStartDate: "2026-07-28",
};

// Generate 52 weeks of authentic contribution calendar data
export function generateContributions() {
  const contributions = [];
  const today = new Date();
  // 52 weeks * 7 days = 364 days ago
  const totalDays = 364;
  
  // Create realistic patterns (higher activity on weekdays, active streak in recent 47 days)
  for (let i = totalDays; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    
    let count = 0;
    const isRecentStreak = i <= 47; // within active 47-day streak
    
    if (isRecentStreak) {
      // Must have at least 1 commit during the streak!
      const base = dayOfWeek === 0 || dayOfWeek === 6 ? 2 : 5;
      count = base + Math.floor(Math.random() * 6);
    } else {
      // General historical activity
      const weekendModifier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.35 : 0.85;
      if (Math.random() < weekendModifier) {
        count = Math.floor(Math.random() * 9) + 1;
        // occasional burst day
        if (Math.random() < 0.08) count += Math.floor(Math.random() * 8);
      } else {
        count = 0;
      }
    }
    
    let level = 0;
    if (count >= 8) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    contributions.push({
      date: dateStr,
      count,
      level,
      dayOfWeek,
    });
  }
  return contributions;
}

export const SAMPLE_CONTRIBUTIONS = generateContributions();

export const SAMPLE_WEEKLY_ACTIVITY = [
  { day: 'Mon', commits: 52, prs: 6, reviews: 14 },
  { day: 'Tue', commits: 68, prs: 8, reviews: 18 },
  { day: 'Wed', commits: 84, prs: 11, reviews: 22 },
  { day: 'Thu', commits: 71, prs: 9, reviews: 16 },
  { day: 'Fri', commits: 59, prs: 7, reviews: 12 },
  { day: 'Sat', commits: 28, prs: 3, reviews: 5 },
  { day: 'Sun', commits: 34, prs: 4, reviews: 7 },
];

export const SAMPLE_MONTHLY_ACTIVITY = [
  { month: 'Jan', commits: 98, streak: 14 },
  { month: 'Feb', commits: 112, streak: 18 },
  { month: 'Mar', commits: 145, streak: 26 },
  { month: 'Apr', commits: 128, streak: 21 },
  { month: 'May', commits: 164, streak: 35 },
  { month: 'Jun', commits: 139, streak: 28 },
  { month: 'Jul', commits: 155, streak: 30 },
  { month: 'Aug', commits: 182, streak: 47 },
  { month: 'Sep', commits: 174, streak: 47 },
  { month: 'Oct', commits: 140, streak: 24 },
  { month: 'Nov', commits: 120, streak: 19 },
  { month: 'Dec', commits: 125, streak: 22 },
];

export const SAMPLE_LANGUAGES = [
  { name: 'TypeScript', percentage: 41.5, color: '#3178c6', lines: '142,800' },
  { name: 'Go', percentage: 26.2, color: '#00add8', lines: '90,200' },
  { name: 'Rust', percentage: 14.8, color: '#dea584', lines: '51,000' },
  { name: 'Python', percentage: 10.1, color: '#3572A5', lines: '34,800' },
  { name: 'HTML/CSS', percentage: 4.6, color: '#e34c26', lines: '15,900' },
  { name: 'Shell', percentage: 2.8, color: '#89e051', lines: '9,600' },
];

export const SAMPLE_REPOSITORIES = [
  {
    id: 1,
    name: "cloud-pulse-engine",
    description: "High-throughput telemetry and distributed log streaming engine built with Go and Apache Kafka.",
    language: "Go",
    languageColor: "#00add8",
    stars: 384,
    forks: 47,
    openIssues: 5,
    updatedAt: "2026-09-12T18:40:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/cloud-pulse-engine",
    topics: ["distributed-systems", "telemetry", "go", "kafka", "observability"],
    commitsCount: 312,
    license: "Apache-2.0"
  },
  {
    id: 2,
    name: "commitstreak-dashboard",
    description: "Daily GitHub coding monitor and productivity timeline for ambitious developers.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 526,
    forks: 89,
    openIssues: 3,
    updatedAt: "2026-09-13T20:15:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/commitstreak-dashboard",
    topics: ["react", "vite", "developer-tools", "tailwind", "analytics"],
    commitsCount: 184,
    license: "MIT"
  },
  {
    id: 3,
    name: "micro-cache-rs",
    description: "Lock-free, ultra-low latency in-memory LRU and TinyLFU cache written in safe Rust.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 219,
    forks: 23,
    openIssues: 1,
    updatedAt: "2026-09-08T11:22:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/micro-cache-rs",
    topics: ["rust", "caching", "concurrency", "performance"],
    commitsCount: 96,
    license: "MIT"
  },
  {
    id: 4,
    name: "prompt-forge-cli",
    description: "Command-line toolkit for testing, versioning, and evaluating LLM system prompts against benchmark datasets.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 165,
    forks: 18,
    openIssues: 4,
    updatedAt: "2026-09-05T14:10:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/prompt-forge-cli",
    topics: ["llm", "cli", "python", "ai-tools"],
    commitsCount: 78,
    license: "MIT"
  },
  {
    id: 5,
    name: "neo-query-builder",
    description: "Zero-dependency type-safe SQL query composer with compile-time schema validation for PostgreSQL.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 142,
    forks: 14,
    openIssues: 2,
    updatedAt: "2026-08-29T16:04:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/neo-query-builder",
    topics: ["typescript", "sql", "postgres", "orm-alternative"],
    commitsCount: 124,
    license: "MIT"
  },
  {
    id: 6,
    name: "dotfiles-hyper-minimal",
    description: "Reproducible developer environment configurations, Neovim LSP setup, Tmux, and Fish shell scripts.",
    language: "Shell",
    languageColor: "#89e051",
    stars: 97,
    forks: 12,
    openIssues: 0,
    updatedAt: "2026-09-01T08:30:00Z",
    isPrivate: false,
    defaultBranch: "main",
    htmlUrl: "https://github.com/alexrivera-dev/dotfiles-hyper-minimal",
    topics: ["neovim", "dotfiles", "tmux", "productivity"],
    commitsCount: 245,
    license: "Unlicense"
  }
];

export const SAMPLE_RECENT_COMMITS = [
  {
    id: "c1",
    sha: "8f42d1b",
    message: "perf(cache): optimize memory footprint by replacing hashmap with compact bitset",
    repoName: "micro-cache-rs",
    branch: "main",
    timestamp: "2026-09-13T19:42:00Z",
    url: "https://github.com",
    additions: 124,
    deletions: 48,
  },
  {
    id: "c2",
    sha: "3a91e5c",
    message: "feat(journal): add interactive timeline tag filtering and export to markdown",
    repoName: "commitstreak-dashboard",
    branch: "main",
    timestamp: "2026-09-13T16:20:00Z",
    url: "https://github.com",
    additions: 215,
    deletions: 32,
  },
  {
    id: "c3",
    sha: "e7208fa",
    message: "fix(stream): prevent buffer deadlock under burst backpressure conditions",
    repoName: "cloud-pulse-engine",
    branch: "patch/buffer-backpressure",
    timestamp: "2026-09-12T22:15:00Z",
    url: "https://github.com",
    additions: 54,
    deletions: 19,
  },
  {
    id: "c4",
    sha: "4b870cd",
    message: "docs: add architecture diagram and benchmark results for TinyLFU eviction",
    repoName: "micro-cache-rs",
    branch: "main",
    timestamp: "2026-09-12T14:05:00Z",
    url: "https://github.com",
    additions: 89,
    deletions: 12,
  },
  {
    id: "c5",
    sha: "1d55e90",
    message: "refactor(compiler): simplify AST transformer for composite where clauses",
    repoName: "neo-query-builder",
    branch: "main",
    timestamp: "2026-09-11T18:30:00Z",
    url: "https://github.com",
    additions: 76,
    deletions: 92,
  },
  {
    id: "c6",
    sha: "99ac711",
    message: "test(eval): add regression assertions for multi-turn prompt templates",
    repoName: "prompt-forge-cli",
    branch: "main",
    timestamp: "2026-09-10T11:45:00Z",
    url: "https://github.com",
    additions: 142,
    deletions: 15,
  }
];

export const INITIAL_JOURNAL_ENTRIES = [
  {
    id: "j-101",
    date: "2026-09-13",
    topic: "Lock-Free Ring Buffers & Thread Synchronization",
    problemsSolved: "Fixed a race condition in the multi-producer single-consumer ring buffer where cache invalidation was degrading write throughput under high CPU core contention.",
    technologies: ["Rust", "AtomicPrimitives", "Concurrency", "Benchmarking"],
    whatLearned: "Learned that using crossbeam's cache-padded structures prevents false sharing across L1/L2 CPU caches, reducing latency from 140ns to 18ns.",
    commitMessage: "perf(cache): optimize memory footprint with atomic bitset (8f42d1b)",
    personalNotes: "Streak day 47 locked in! Feeling very locked-in with systems programming lately. Next up: implement generational arena allocator.",
    repoName: "micro-cache-rs"
  },
  {
    id: "j-102",
    date: "2026-09-12",
    topic: "TCP Backpressure & Stream Throttling",
    problemsSolved: "Engineered a reactive token bucket algorithm to gracefully back off WebSocket telemetry ingestion when downstream Kafka brokers experience disk I/O spikes.",
    technologies: ["Go", "Kafka", "Goroutines", "Docker"],
    whatLearned: "Context cancellation Propagation across deep nested goroutines requires strict select loops to avoid orphan goroutines leaking memory.",
    commitMessage: "fix(stream): prevent buffer deadlock under burst backpressure (e7208fa)",
    personalNotes: "Struggled for 2 hours with a goroutine leak until I inspected pprof runtime goroutine dumps. Always profile first!",
    repoName: "cloud-pulse-engine"
  },
  {
    id: "j-103",
    date: "2026-09-11",
    topic: "Type-Safe AST Query Transformation",
    problemsSolved: "Implemented recursive type inferences that detect misspelled SQL column names at TypeScript compile time rather than runtime.",
    technologies: ["TypeScript", "CompilerAPI", "PostgreSQL"],
    whatLearned: "Conditional mapped types with key remapping in TypeScript 5+ allow deep object paths to be transformed cleanly into valid SQL dot-notation aliases.",
    commitMessage: "refactor(compiler): simplify AST transformer for composite where clauses (1d55e90)",
    personalNotes: "Pushed 3 clean commits. The developer experience when writing type-safe SQL is unmatched.",
    repoName: "neo-query-builder"
  },
  {
    id: "j-104",
    date: "2026-09-10",
    topic: "Automated LLM Benchmark Matrix Runner",
    problemsSolved: "Built an asynchronous batch evaluator using Python's asyncio and tenacity library to run 500 test cases with exponential retry against API rate limits.",
    technologies: ["Python", "AsyncIO", "LLM APIs", "Rich CLI"],
    whatLearned: "Batching requests with asyncio.Semaphore is significantly more reliable than blindly spawning tasks when hitting strict token-per-minute provider quotas.",
    commitMessage: "test(eval): add regression assertions for multi-turn prompt templates (99ac711)",
    personalNotes: "Day 44 streak. Really happy with the terminal progress indicators built using Rich.",
    repoName: "prompt-forge-cli"
  }
];
