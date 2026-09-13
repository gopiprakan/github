import React, { useState } from 'react';
import { Search, Plus, Filter, BookOpen, Sparkles, Code2 } from 'lucide-react';
import JournalStats from '../components/journal/JournalStats';
import JournalItem from '../components/journal/JournalItem';
import JournalModal from '../components/journal/JournalModal';
import { useJournal } from '../context/JournalContext';

export default function JournalPage() {
  const {
    entries,
    filteredEntries,
    allTags,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useJournal();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveEntry = (formData) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, formData);
    } else {
      addEntry(formData);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Journal Header & Stats */}
      <JournalStats
        totalEntries={entries.length}
        streakDays={47}
        onNewEntry={handleOpenAdd}
      />

      {/* Search & Tag Filter Bar */}
      <div className="rounded-2xl border border-gh-lightBorder dark:border-gh-darkBorder bg-white dark:bg-gh-darkPanel p-4 shadow-sm mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gh-lightMuted dark:text-gh-darkMuted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics, challenges, commits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gh-lightBorder dark:border-gh-darkBorder bg-gh-lightBg dark:bg-gh-darkCard text-gh-lightText dark:text-gh-darkText focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-gh-lightMuted dark:text-gh-darkMuted self-end sm:self-auto font-mono">
            Showing {filteredEntries.length} of {entries.length} entries
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-gh-lightMuted dark:text-gh-darkMuted mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by tech:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'bg-gray-100 dark:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted hover:text-gh-lightText dark:hover:text-gh-darkText'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Timeline */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-gh-lightBorder dark:border-gh-darkBorder bg-white/50 dark:bg-gh-darkPanel/50">
          <BookOpen className="w-10 h-10 text-gh-lightMuted dark:text-gh-darkMuted mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-semibold text-gh-lightText dark:text-gh-darkText mb-1">
            No Journal Entries Found
          </h4>
          <p className="text-xs text-gh-lightMuted dark:text-gh-darkMuted max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or tag filter, or record your first session for today.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Log New Session
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {filteredEntries.map((entry) => (
            <JournalItem
              key={entry.id}
              entry={entry}
              onEdit={handleOpenEdit}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}

      {/* Modal form */}
      <JournalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        editingEntry={editingEntry}
      />
    </div>
  );
}
