import React, { useState, useEffect } from 'react';
import { Settings, Save, Trash2, CheckCircle2, AlertCircle, RefreshCw, Key, Tag, X } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { updateRepoDetails, deleteRepo } from '../../services/githubApi';

export default function EditRepoModal({ repo, isOpen, onClose, onRepoUpdated, onRepoDeleted }) {
  const { monitoredUsername, ownerToken, setIsAuthModalOpen } = useAuth();
  const [description, setDescription] = useState(repo?.description || '');
  const [isPrivate, setIsPrivate] = useState(Boolean(repo?.isPrivate));
  const [defaultBranch, setDefaultBranch] = useState(repo?.defaultBranch || 'main');
  const [topics, setTopics] = useState(repo?.topics || []);
  const [newTopic, setNewTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Danger zone
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    if (repo) {
      setDescription(repo.description || '');
      setIsPrivate(Boolean(repo.isPrivate));
      setDefaultBranch(repo.defaultBranch || 'main');
      setTopics(repo.topics || []);
      setFeedback(null);
      setIsDeleting(false);
      setConfirmName('');
    }
  }, [repo, isOpen]);

  const handleAddTopic = (e) => {
    e.preventDefault();
    const clean = newTopic.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (clean && !topics.includes(clean)) {
      setTopics([...topics, clean]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter(t => t !== topicToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!repo) return;

    if (!ownerToken) {
      setFeedback({
        type: 'error',
        message: 'Personal Access Token required with "repo" scope to modify settings.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const owner = repo.owner?.login || monitoredUsername;
    try {
      const res = await updateRepoDetails(
        owner,
        repo.name,
        {
          description: description.trim(),
          isPrivate,
          defaultBranch,
          topics,
        },
        ownerToken
      );

      if (res.success) {
        setFeedback({ type: 'success', message: 'Repository settings updated successfully on GitHub!' });
        setTimeout(() => {
          if (onRepoUpdated) onRepoUpdated();
          onClose();
        }, 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to update repository settings.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!repo || confirmName !== repo.name) return;

    if (!ownerToken) {
      setFeedback({
        type: 'error',
        message: 'Personal Access Token required to delete repository.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const owner = repo.owner?.login || monitoredUsername;
    try {
      const res = await deleteRepo(owner, repo.name, ownerToken);
      if (res.success) {
        setFeedback({ type: 'success', message: `Repository "${repo.name}" deleted from GitHub.` });
        setTimeout(() => {
          if (onRepoDeleted) onRepoDeleted(repo.name);
          onClose();
        }, 1000);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to delete repository.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!repo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Repository Settings — ${repo.name}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-3.5">
        {!ownerToken && (
          <div className="p-3 rounded-md border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 flex items-center justify-between gap-3 text-xs">
            <span className="text-amber-800 dark:text-amber-300">
              Personal Access Token with <code className="font-mono font-bold">repo</code> scope required.
            </span>
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium shrink-0 transition-all duration-150"
            >
              Connect Token
            </button>
          </div>
        )}

        {feedback && (
          <div
            className={`p-2.5 rounded-md text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this repository do?"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all duration-150"
            />
          </div>

          {/* Topics / Tags */}
          <div>
            <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1">
              Topics & Tags
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {topics.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-xs font-mono rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(t)}
                    className="hover:text-red-500 transition-colors duration-150"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add topic (e.g. react, api)..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic(e);
                  }
                }}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder hover:bg-gray-50 dark:hover:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText transition-all duration-150"
              >
                Add
              </button>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gh-lightText dark:text-gh-darkText mb-1.5">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`p-2 rounded-md border text-xs text-left transition-all duration-150 ${
                  !isPrivate
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500'
                    : 'border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted'
                }`}
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`p-2 rounded-md border text-xs text-left transition-all duration-150 ${
                  isPrivate
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500'
                    : 'border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightMuted'
                }`}
              >
                Private
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-all duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all duration-150"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Repository */}
        <div className="pt-3 border-t border-red-200 dark:border-red-950/80">
          {!isDeleting ? (
            <div className="p-2.5 rounded-md border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-semibold text-red-700 dark:text-red-400">Delete Repository</h5>
                <p className="text-[10px] text-gh-lightMuted dark:text-gh-darkMuted">Permanently remove this repo from GitHub.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-all duration-150"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-md border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 space-y-2.5">
              <h5 className="text-xs font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Are you absolutely sure?
              </h5>
              <p className="text-xs text-red-700 dark:text-red-300">
                Please type <strong className="font-mono">{repo.name}</strong> to confirm deletion.
              </p>
              <input
                type="text"
                placeholder={repo.name}
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded-md border border-red-300 dark:border-red-800 bg-white dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText font-mono focus:outline-none transition-all duration-150"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeleting(false)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={confirmName !== repo.name || isSubmitting}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md text-white flex items-center gap-1.5 transition-all duration-150 ${
                    confirmName === repo.name && !isSubmitting
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Delete on GitHub</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
