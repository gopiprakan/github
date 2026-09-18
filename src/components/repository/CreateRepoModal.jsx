import React, { useState } from 'react';
import { BookPlus, CheckCircle2, AlertCircle, RefreshCw, Key, Shield, Sparkles, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { createNewRepo } from '../../services/githubApi';

export default function CreateRepoModal({ isOpen, onClose, onRepoCreated }) {
  const { monitoredUsername, ownerToken, setIsAuthModalOpen } = useAuth();
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [autoInit, setAutoInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setFeedback({ type: 'error', message: 'Repository name is required.' });
      return;
    }

    if (!ownerToken) {
      setFeedback({
        type: 'error',
        message: 'A GitHub Personal Access Token with "repo" scope is required to create repositories on your GitHub account.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await createNewRepo(
        {
          name: repoName.trim(),
          description: description.trim(),
          isPrivate,
          autoInit,
        },
        ownerToken
      );

      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Repository "${res.data.name}" created successfully on GitHub!`,
          repoUrl: res.data.html_url,
        });

        setTimeout(() => {
          if (onRepoCreated) onRepoCreated(res.data);
          onClose();
          setRepoName('');
          setDescription('');
          setFeedback(null);
        }, 1200);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to create repository.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New GitHub Repository"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!ownerToken ? (
          <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Token required: Connect a GitHub PAT with <code className="font-mono font-bold">repo</code> scope to create repos.</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1 shrink-0 text-xs"
            >
              <Key className="w-3 h-3" /> Connect Token
            </button>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Creating repository on GitHub account <strong className="font-mono">@{monitoredUsername}</strong>.
            </span>
          </div>
        )}

        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.repoUrl && (
              <a
                href={feedback.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Open</span> <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Repository Name */}
        <div>
          <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
            Repository Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-mono text-gh-lightMuted dark:text-gh-darkMuted">
              {monitoredUsername ? `${monitoredUsername}/` : 'repo/'}
            </span>
            <input
              type="text"
              placeholder="e.g. awesome-project"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_.]/g, '-'))}
              required
              style={{ paddingLeft: `${(monitoredUsername ? monitoredUsername.length : 4) * 8 + 24}px` }}
              className="w-full pr-3 py-2 text-xs rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p className="text-[11px] text-gh-lightMuted dark:text-gh-darkMuted mt-1">
            Great repository names are short and memorable.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
            Description <span className="text-gh-lightMuted dark:text-gh-darkMuted font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Short description of your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-2">
            Visibility
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                !isPrivate
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                  : 'border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted hover:bg-gray-50 dark:hover:bg-gh-darkCard'
              }`}
            >
              <span className="font-semibold block text-gh-lightText dark:text-gh-darkText">Public</span>
              <span className="text-[10px] text-gh-lightMuted dark:text-gh-darkMuted">Anyone on the internet can see this repository.</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                isPrivate
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                  : 'border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted hover:bg-gray-50 dark:hover:bg-gh-darkCard'
              }`}
            >
              <span className="font-semibold block text-gh-lightText dark:text-gh-darkText">Private</span>
              <span className="text-[10px] text-gh-lightMuted dark:text-gh-darkMuted">You choose who can see and commit to this repository.</span>
            </button>
          </div>
        </div>

        {/* Initialize with README */}
        <label className="flex items-center gap-2 text-xs text-gh-lightText dark:text-gh-darkText cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={autoInit}
            onChange={(e) => setAutoInit(e.target.checked)}
            className="rounded border-gh-lightBorder text-emerald-600 focus:ring-emerald-500"
          />
          <span>Initialize this repository with a README.md file</span>
        </label>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !repoName.trim()}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
              repoName.trim() && !isSubmitting
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gh-darkCard text-gh-lightMuted cursor-not-allowed opacity-60'
            }`}
          >
            {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BookPlus className="w-3.5 h-3.5" />}
            <span>Create Repository</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
