import React, { createContext, useContext, useState, useEffect } from 'react';

const JournalContext = createContext();

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('commitstreak-journal-entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved journal entries:', e);
      }
    }
    return [];
  });

  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('commitstreak-journal-entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (newEntry) => {
    const entryWithMeta = {
      ...newEntry,
      id: `j-${Date.now()}`,
      date: newEntry.date || new Date().toISOString().split('T')[0],
      technologies: Array.isArray(newEntry.technologies) 
        ? newEntry.technologies 
        : (newEntry.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
    };
    setEntries(prev => [entryWithMeta, ...prev]);
    return entryWithMeta;
  };

  const updateEntry = (id, updatedFields) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id !== id) return entry;
      return {
        ...entry,
        ...updatedFields,
        technologies: Array.isArray(updatedFields.technologies)
          ? updatedFields.technologies
          : (updatedFields.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
      };
    }));
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const allTags = ['All', ...new Set(entries.flatMap(e => e.technologies || []))];

  const filteredEntries = entries.filter(entry => {
    const matchesTag = selectedTag === 'All' || (entry.technologies && entry.technologies.includes(selectedTag));
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesTag;

    const matchesSearch =
      entry.topic?.toLowerCase().includes(query) ||
      entry.problemsSolved?.toLowerCase().includes(query) ||
      entry.whatLearned?.toLowerCase().includes(query) ||
      entry.personalNotes?.toLowerCase().includes(query) ||
      entry.commitMessage?.toLowerCase().includes(query) ||
      entry.repoName?.toLowerCase().includes(query);

    return matchesTag && matchesSearch;
  });

  return (
    <JournalContext.Provider
      value={{
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
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal must be used within JournalProvider');
  return ctx;
}
