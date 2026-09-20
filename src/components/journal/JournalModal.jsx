import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Tag, GitCommit, CheckCircle2, Lightbulb, Wrench, FileText } from 'lucide-react';
import Modal from '../common/Modal';

export default function JournalModal({ isOpen, onClose, onSave, editingEntry = null }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    problemsSolved: '',
    technologies: '',
    whatLearned: '',
    commitMessage: '',
    personalNotes: '',
    repoName: '',
  });

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        date: editingEntry.date || new Date().toISOString().split('T')[0],
        topic: editingEntry.topic || '',
        problemsSolved: editingEntry.problemsSolved || '',
        technologies: Array.isArray(editingEntry.technologies) 
          ? editingEntry.technologies.join(', ') 
          : (editingEntry.technologies || ''),
        whatLearned: editingEntry.whatLearned || '',
        commitMessage: editingEntry.commitMessage || '',
        personalNotes: editingEntry.personalNotes || '',
        repoName: editingEntry.repoName || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        topic: '',
        problemsSolved: '',
        technologies: '',
        whatLearned: '',
        commitMessage: '',
        personalNotes: '',
        repoName: '',
      });
    }
  }, [editingEntry, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    onSave({
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEntry ? 'Edit Coding Journal Entry' : 'Log Today\'s Coding Session'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Row 1: Date & Repository */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              Session Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-blue-500" />
              Repository (optional)
            </label>
            <input
              type="text"
              name="repoName"
              placeholder="e.g. cloud-pulse-engine"
              value={formData.repoName}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
            />
          </div>
        </div>

        {/* Row 2: Coding Topic */}
        <div>
          <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            Today's Coding Topic *
          </label>
          <input
            type="text"
            name="topic"
            placeholder="e.g. Distributed Lock-Free Buffers in Rust"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
          />
        </div>

        {/* Row 3: Problems Solved */}
        <div>
          <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            Problems Solved
          </label>
          <textarea
            name="problemsSolved"
            rows={2}
            placeholder="What technical bug, obstacle, or architectural challenge did you solve?"
            value={formData.problemsSolved}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all duration-150"
          />
        </div>

        {/* Row 4: Technologies Practiced */}
        <div>
          <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-purple-500" />
            Technologies Practiced (comma separated)
          </label>
          <input
            type="text"
            name="technologies"
            placeholder="e.g. Rust, Concurrency, Atomic, Docker"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
          />
        </div>

        {/* Row 5: What I Learned */}
        <div>
          <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            What I Learned
          </label>
          <textarea
            name="whatLearned"
            rows={2}
            placeholder="Key insights, gotchas, or concepts discovered today..."
            value={formData.whatLearned}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all duration-150"
          />
        </div>

        {/* Row 6: Commit Message & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-emerald-500" />
              GitHub Commit Message / SHA
            </label>
            <input
              type="text"
              name="commitMessage"
              placeholder="e.g. feat: implement atomic CAS (3a91e5c)"
              value={formData.commitMessage}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono transition-all duration-150"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gh-lightMuted dark:text-gh-darkMuted mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              Personal Streak Notes
            </label>
            <input
              type="text"
              name="personalNotes"
              placeholder="e.g. Streak day 47! Great flow state today."
              value={formData.personalNotes}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-xs rounded-md border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkPanel text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all duration-150"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-gh-lightBorder dark:border-gh-darkBorder flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium rounded-md border border-gh-lightBorder dark:border-gh-darkBorder text-gh-lightText dark:text-gh-darkText hover:bg-gray-50 dark:hover:bg-gh-darkCard transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all duration-150"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {editingEntry ? 'Update Entry' : 'Publish Entry'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
