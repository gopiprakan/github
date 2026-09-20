import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  ChevronRight,
  ArrowLeft,
  GitBranch,
  GitCommit,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  Edit3,
  Sparkles,
  Key,
  FolderPlus,
  X,
  Code
} from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  fetchRepoContents,
  fetchFileContent,
  commitFileChange,
  deleteRepoFile,
  fetchRepoBranches
} from '../../services/githubApi';

function getFileIcon(name, isDir) {
  if (isDir) return <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />;
  const ext = name.split('.').pop()?.toLowerCase();
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'html', 'css', 'json', 'yml', 'yaml'].includes(ext)) {
    return <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />;
  }
  if (['md', 'txt', 'rtf', 'doc', 'docx'].includes(ext)) {
    return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
  }
  if (['csv', 'xlsx', 'tsv'].includes(ext)) {
    return <FileSpreadsheet className="w-4 h-4 text-green-600 shrink-0" />;
  }
  if (['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(ext)) {
    return <FileImage className="w-4 h-4 text-purple-500 shrink-0" />;
  }
  return <FileText className="w-4 h-4 text-gh-lightMuted dark:text-gh-darkMuted shrink-0" />;
}

export default function RepoFileManagerModal({ repo, isOpen, onClose, onRepoUpdated }) {
  const { monitoredUsername, ownerToken, setIsAuthModalOpen } = useAuth();

  // Navigation & File Tree state
  const [currentPath, setCurrentPath] = useState('');
  const [contents, setContents] = useState([]);
  const [loadingContents, setLoadingContents] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(repo?.defaultBranch || 'main');

  // File Editor state
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Commit state
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitFeedback, setCommitFeedback] = useState(null);

  // New File modal/flow
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');

  // Delete File modal
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [deleteCommitMsg, setDeleteCommitMsg] = useState('');

  const textareaRef = useRef(null);

  // Sync default branch when repo changes
  useEffect(() => {
    if (repo?.defaultBranch) {
      setSelectedBranch(repo.defaultBranch);
    }
  }, [repo]);

  // Load branches
  useEffect(() => {
    if (!isOpen || !repo) return;
    const loadBranches = async () => {
      const owner = repo.owner?.login || monitoredUsername;
      const res = await fetchRepoBranches(owner, repo.name, ownerToken);
      if (res.data && res.data.length > 0) {
        setBranches(res.data.map(b => b.name));
      } else {
        setBranches([repo.defaultBranch || 'main']);
      }
    };
    loadBranches();
  }, [isOpen, repo, monitoredUsername, ownerToken]);

  // Load directory contents when currentPath or selectedBranch changes
  const loadDirectory = async (path = currentPath) => {
    if (!repo) return;
    setLoadingContents(true);
    setCommitFeedback(null);
    const owner = repo.owner?.login || monitoredUsername;
    try {
      const res = await fetchRepoContents(owner, repo.name, path, selectedBranch, ownerToken);
      if (res.data && Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a, b) => {
          if (a.type === 'dir' && b.type !== 'dir') return -1;
          if (a.type !== 'dir' && b.type === 'dir') return 1;
          return a.name.localeCompare(b.name);
        });
        setContents(sorted);
      } else {
        setContents([]);
        if (res.error) {
          setCommitFeedback({ type: 'error', message: res.error });
        }
      }
    } catch (err) {
      console.error('Failed to load repo contents:', err);
      setContents([]);
    } finally {
      setLoadingContents(false);
    }
  };

  useEffect(() => {
    if (isOpen && repo) {
      loadDirectory(currentPath);
    }
  }, [isOpen, repo, currentPath, selectedBranch]);

  // Open file in editor
  const handleOpenFile = async (fileItem) => {
    setLoadingFile(true);
    setCommitFeedback(null);
    setPreviewMode(false);
    const owner = repo.owner?.login || monitoredUsername;
    try {
      const res = await fetchFileContent(owner, repo.name, fileItem.path, selectedBranch, ownerToken);
      if (res.error) {
        setCommitFeedback({ type: 'error', message: res.error });
      } else {
        setActiveFile({
          path: fileItem.path,
          name: fileItem.name,
          sha: res.sha,
          size: res.size,
          downloadUrl: res.downloadUrl,
          htmlUrl: res.htmlUrl,
        });
        setFileContent(res.content || '');
        setOriginalContent(res.content || '');
        setCommitMessage(`Update ${fileItem.name}`);
      }
    } catch (err) {
      setCommitFeedback({ type: 'error', message: err.message });
    } finally {
      setLoadingFile(false);
    }
  };

  const handleNavigateDir = (dirPath) => {
    setCurrentPath(dirPath);
    setActiveFile(null);
    setCommitFeedback(null);
  };

  const handleNavigateUp = () => {
    if (!currentPath) return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
    setActiveFile(null);
    setCommitFeedback(null);
  };

  const handleCommitFile = async (e) => {
    e?.preventDefault();
    if (!activeFile || !repo) return;

    if (!ownerToken) {
      setCommitFeedback({
        type: 'error',
        message: 'A GitHub Personal Access Token is required to push commits to GitHub.',
      });
      return;
    }

    setIsCommitting(true);
    setCommitFeedback(null);

    const owner = repo.owner?.login || monitoredUsername;
    const message = commitMessage.trim() || `Update ${activeFile.name}`;

    try {
      const res = await commitFileChange(
        owner,
        repo.name,
        activeFile.path,
        fileContent,
        message,
        activeFile.sha,
        selectedBranch,
        ownerToken
      );

      if (res.success) {
        const commitSha = res.commit?.sha || res.content?.sha;
        const commitUrl = commitSha
          ? `https://github.com/${owner}/${repo.name}/commit/${commitSha}`
          : `https://github.com/${owner}/${repo.name}`;

        setCommitFeedback({
          type: 'success',
          message: `Successfully committed "${activeFile.name}" to GitHub (${selectedBranch})!`,
          commitUrl,
        });

        if (res.content?.sha) {
          setActiveFile(prev => ({ ...prev, sha: res.content.sha }));
        }
        setOriginalContent(fileContent);

        if (onRepoUpdated) onRepoUpdated();
      } else {
        setCommitFeedback({
          type: 'error',
          message: res.error || 'Commit failed. Ensure token has "repo" write permissions.',
        });
      }
    } catch (err) {
      setCommitFeedback({ type: 'error', message: err.message });
    } finally {
      setIsCommitting(false);
    }
  };

  const handleCreateNewFile = async (e) => {
    e.preventDefault();
    if (!newFilePath.trim() || !repo) return;

    if (!ownerToken) {
      setCommitFeedback({
        type: 'error',
        message: 'GitHub Personal Access Token required to create files on GitHub.',
      });
      return;
    }

    setIsCommitting(true);
    setCommitFeedback(null);

    const fullPath = currentPath
      ? `${currentPath.replace(/\/+$/, '')}/${newFilePath.trim().replace(/^\/+/, '')}`
      : newFilePath.trim().replace(/^\/+/, '');

    const fileName = fullPath.split('/').pop();
    const owner = repo.owner?.login || monitoredUsername;
    const initialContent = `# ${fileName}\n\nCreated with CommitStreak live GitHub editor.\n`;
    const message = `Create ${fullPath}`;

    try {
      const res = await commitFileChange(
        owner,
        repo.name,
        fullPath,
        initialContent,
        message,
        null,
        selectedBranch,
        ownerToken
      );

      if (res.success) {
        setIsCreatingFile(false);
        setNewFilePath('');
        setCommitFeedback({
          type: 'success',
          message: `Created file "${fullPath}" on GitHub!`,
          commitUrl: `https://github.com/${owner}/${repo.name}/blob/${selectedBranch}/${fullPath}`,
        });

        setActiveFile({
          path: fullPath,
          name: fileName,
          sha: res.content?.sha,
          size: initialContent.length,
        });
        setFileContent(initialContent);
        setOriginalContent(initialContent);
        setCommitMessage(`Update ${fileName}`);

        loadDirectory(currentPath);
        if (onRepoUpdated) onRepoUpdated();
      } else {
        setCommitFeedback({ type: 'error', message: res.error || 'Failed to create file.' });
      }
    } catch (err) {
      setCommitFeedback({ type: 'error', message: err.message });
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!activeFile || !repo) return;

    if (!ownerToken) {
      setCommitFeedback({
        type: 'error',
        message: 'GitHub Personal Access Token required to delete files.',
      });
      return;
    }

    setIsCommitting(true);
    setCommitFeedback(null);

    const owner = repo.owner?.login || monitoredUsername;
    const message = deleteCommitMsg.trim() || `Delete ${activeFile.path}`;

    try {
      const res = await deleteRepoFile(
        owner,
        repo.name,
        activeFile.path,
        message,
        activeFile.sha,
        selectedBranch,
        ownerToken
      );

      if (res.success) {
        setIsDeletingFile(false);
        setCommitFeedback({
          type: 'success',
          message: `Successfully deleted "${activeFile.path}" on GitHub!`,
        });
        setActiveFile(null);
        setFileContent('');
        loadDirectory(currentPath);
        if (onRepoUpdated) onRepoUpdated();
      } else {
        setCommitFeedback({ type: 'error', message: res.error || 'Failed to delete file.' });
      }
    } catch (err) {
      setCommitFeedback({ type: 'error', message: err.message });
    } finally {
      setIsCommitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newContent = fileContent.substring(0, start) + '  ' + fileContent.substring(end);
      setFileContent(newContent);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  if (!repo) return null;

  const isModified = activeFile && fileContent !== originalContent;
  const breadcrumbs = currentPath.split('/').filter(Boolean);
  const isMarkdown = activeFile?.name?.endsWith('.md') || activeFile?.name?.endsWith('.markdown');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Code & File Editor — ${repo.name}`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-3.5">
        {/* Token Write Status / Warning Banner */}
        {!ownerToken ? (
          <div className="p-3 rounded-md border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Read-Only Mode:</strong> To commit edits or modify files directly on GitHub, connect a PAT with <code className="font-mono font-bold">repo</code> scope.
              </span>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1.5 shrink-0 transition-all duration-150"
            >
              <Key className="w-3 h-3" /> Connect Token
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-md border border-emerald-300/80 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              GitHub Live Sync Active — Edits commit directly to GitHub as <strong className="font-mono">@{monitoredUsername}</strong>.
            </span>
            <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded">
              Branch: {selectedBranch}
            </span>
          </div>
        )}

        {/* Feedback alert */}
        {commitFeedback && (
          <div
            className={`p-2.5 rounded-md text-xs flex items-center justify-between gap-2 ${
              commitFeedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {commitFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{commitFeedback.message}</span>
            </div>
            {commitFeedback.commitUrl && (
              <a
                href={commitFeedback.commitUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1 shrink-0 text-[11px] transition-all duration-150"
              >
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Header Bar: Branch selector, Breadcrumbs, Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard">
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center gap-1 text-xs font-mono flex-wrap overflow-x-auto">
            <button
              onClick={() => handleNavigateDir('')}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors duration-150"
            >
              {repo.name}
            </button>
            {breadcrumbs.map((crumb, idx) => {
              const crumbPath = breadcrumbs.slice(0, idx + 1).join('/');
              return (
                <React.Fragment key={crumbPath}>
                  <ChevronRight className="w-3.5 h-3.5 text-gh-lightMuted dark:text-gh-darkMuted shrink-0" />
                  <button
                    onClick={() => handleNavigateDir(crumbPath)}
                    className="text-gh-lightText dark:text-gh-darkText hover:text-emerald-500 hover:underline transition-colors duration-150"
                  >
                    {crumb}
                  </button>
                </React.Fragment>
              );
            })}
            {activeFile && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gh-lightMuted dark:text-gh-darkMuted shrink-0" />
                <span className="font-semibold text-gh-lightText dark:text-gh-darkText">
                  {activeFile.name}
                </span>
                {isModified && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                    ● modified
                  </span>
                )}
              </>
            )}
          </div>

          {/* Branch selector & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder px-2 py-1 rounded-md text-xs font-mono">
              <GitBranch className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-gh-lightText dark:text-gh-darkText focus:outline-none text-xs cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                if (activeFile) {
                  handleOpenFile(activeFile);
                } else {
                  loadDirectory(currentPath);
                }
              }}
              title="Refresh files"
              className="p-1 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel hover:bg-gray-100 dark:hover:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted transition-all duration-150"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsCreatingFile(true)}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New File</span>
            </button>
          </div>
        </div>

        {/* Main Explorer + Editor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 min-h-[460px] max-h-[550px]">
          {/* Left: Directory & Files Tree */}
          <div className="md:col-span-4 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-2.5 flex flex-col justify-between overflow-hidden">
            <div className="space-y-0.5 overflow-y-auto flex-1 pr-1">
              {currentPath && (
                <button
                  onClick={handleNavigateUp}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard text-left transition-colors duration-150"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>.. (back up)</span>
                </button>
              )}

              {loadingContents ? (
                <div className="p-6 text-center text-xs text-gh-lightMuted dark:text-gh-darkMuted flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>Loading files...</span>
                </div>
              ) : contents.length === 0 ? (
                <div className="p-6 text-center text-xs text-gh-lightMuted dark:text-gh-darkMuted">
                  Directory is empty or branch has no files.
                </div>
              ) : (
                contents.map((item) => {
                  const isDir = item.type === 'dir';
                  const isSelected = activeFile?.path === item.path;

                  return (
                    <button
                      key={item.sha || item.path}
                      onClick={() => {
                        if (isDir) {
                          handleNavigateDir(item.path);
                        } else {
                          handleOpenFile(item);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-left transition-all duration-150 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800'
                          : 'hover:bg-gray-100 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getFileIcon(item.name, isDir)}
                        <span className="truncate font-mono">{item.name}</span>
                      </div>
                      {!isDir && item.size !== undefined && (
                        <span className="text-[10px] text-gh-lightMuted dark:text-gh-darkMuted font-mono shrink-0 ml-2">
                          {item.size < 1024 ? `${item.size} B` : `${(item.size / 1024).toFixed(1)} KB`}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Total items badge */}
            <div className="pt-2 border-t border-gh-lightBorder dark:border-gh-darkBorder text-[11px] text-gh-lightMuted dark:text-gh-darkMuted flex items-center justify-between">
              <span>{contents.length} items</span>
              <a
                href={`https://github.com/${repo.owner?.login || monitoredUsername}/${repo.name}/tree/${selectedBranch}/${currentPath}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors duration-150"
              >
                <span>GitHub Tree</span> <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Right: Code Editor & Preview */}
          <div className="md:col-span-8 rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel flex flex-col overflow-hidden">
            {activeFile ? (
              <>
                {/* Editor Header Bar */}
                <div className="p-2 border-b border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50/70 dark:bg-gh-darkCard/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-semibold text-gh-lightText dark:text-gh-darkText truncate">
                      {activeFile.name}
                    </span>
                    <Badge variant="outline" size="xs">
                      {activeFile.size < 1024 ? `${activeFile.size} B` : `${(activeFile.size / 1024).toFixed(1)} KB`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Preview toggle for Markdown */}
                    {isMarkdown && (
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all duration-150 ${
                          previewMode
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-gh-darkPanel border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText'
                        }`}
                      >
                        {previewMode ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{previewMode ? 'Edit' : 'Preview'}</span>
                      </button>
                    )}

                    {/* Delete file button */}
                    <button
                      onClick={() => {
                        setDeleteCommitMsg(`Delete ${activeFile.name}`);
                        setIsDeletingFile(true);
                      }}
                      title="Delete this file from GitHub"
                      className="p-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://github.com/${repo.owner?.login || monitoredUsername}/${repo.name}/blob/${selectedBranch}/${activeFile.path}`}
                      target="_blank"
                      rel="noreferrer"
                      title="View file on GitHub"
                      className="p-1 rounded-md text-gh-lightMuted dark:text-gh-darkMuted hover:bg-gray-100 dark:hover:bg-gh-darkCard border border-gh-lightBorder dark:border-gh-darkBorder transition-all duration-150"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-y-auto relative bg-gh-lightBg dark:bg-gh-darkBg p-3">
                  {loadingFile ? (
                    <div className="h-full flex items-center justify-center text-xs text-gh-lightMuted dark:text-gh-darkMuted gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                      <span>Loading file content...</span>
                    </div>
                  ) : previewMode && isMarkdown ? (
                    <div className="prose dark:prose-invert max-w-none text-xs p-2 font-sans leading-relaxed whitespace-pre-wrap">
                      {fileContent || <span className="italic text-gh-lightMuted">File is empty.</span>}
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef}
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      placeholder="Enter file code..."
                      className="w-full h-full min-h-[300px] resize-none bg-transparent font-mono text-xs text-gh-lightText dark:text-gh-darkText focus:outline-none leading-relaxed border-none selection:bg-emerald-500/30"
                    />
                  )}
                </div>

                {/* Commit Action Bar */}
                <form
                  onSubmit={handleCommitFile}
                  className="p-2.5 border-t border-gh-lightBorder dark:border-gh-darkBorder bg-gray-50 dark:bg-gh-darkCard flex flex-col sm:flex-row items-center gap-2"
                >
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Commit message (e.g. Update README.md)"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full pl-3 pr-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCommitting || !isModified}
                    className={`w-full sm:w-auto px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 shrink-0 ${
                      isModified && !isCommitting
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-gray-200 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isCommitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Pushing to GitHub...</span>
                      </>
                    ) : (
                      <>
                        <GitCommit className="w-3.5 h-3.5" />
                        <span>Commit to GitHub</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2.5">
                <Code className="w-10 h-10 text-emerald-500/40" />
                <h4 className="text-sm font-semibold text-gh-lightText dark:text-gh-darkText">
                  Select a File to View & Edit
                </h4>
                <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted max-w-sm">
                  Click on any file in the left explorer to view code, edit lines, and commit changes live directly to this GitHub repository.
                </p>
                <button
                  onClick={() => setIsCreatingFile(true)}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition-all duration-150"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Create New File */}
        {isCreatingFile && (
          <div className="p-3 rounded-md border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4" /> Create New File in Repository
              </h4>
              <button
                onClick={() => setIsCreatingFile(false)}
                className="text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFile} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. src/utils/helper.js or README.md"
                value={newFilePath}
                onChange={(e) => setNewFilePath(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
              />
              <button
                type="submit"
                disabled={isCommitting || !newFilePath.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 shrink-0 transition-all duration-150"
              >
                {isCommitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Create & Commit</span>
              </button>
            </form>
          </div>
        )}

        {/* Modal: Delete File confirmation */}
        {isDeletingFile && activeFile && (
          <div className="p-3 rounded-md border border-red-300 dark:border-red-800 bg-red-50/40 dark:bg-red-950/30 space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Confirm File Deletion on GitHub
              </h4>
              <button
                onClick={() => setIsDeletingFile(false)}
                className="text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300">
              Are you sure you want to delete <strong className="font-mono">{activeFile.path}</strong> from the <strong className="font-mono">{selectedBranch}</strong> branch?
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder={`Delete ${activeFile.name}`}
                value={deleteCommitMsg}
                onChange={(e) => setDeleteCommitMsg(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText font-mono focus:outline-none transition-all duration-150"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeletingFile(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteFile}
                  disabled={isCommitting}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1.5 transition-all duration-150"
                >
                  {isCommitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
