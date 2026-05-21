import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SummaryContext = createContext();

export const SummaryProvider = ({ children }) => {
  const [summaries, setSummaries] = useState([]);
  const [activeSummary, setActiveSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all summaries (Vault list)
  const fetchSummaries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/summaries');
      if (response.data.success) {
        setSummaries(response.data.summaries);
      }
    } catch (error) {
      console.error('[SummaryContext] Error fetching summaries:', error.message);
      toast.error('Could not reload Vault archives.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch specific summary by ID
  const fetchSummaryById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/summaries/${id}`);
      if (response.data.success) {
        setActiveSummary(response.data.summary);
        return response.data.summary;
      }
    } catch (error) {
      console.error('[SummaryContext] Error fetching summary detail:', error.message);
      toast.error('Failed to load detailed profile.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Summarize raw pasted text
  const summarizeText = async (title, content) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/summaries/text', { title, content });
      if (response.data.success) {
        setActiveSummary(response.data.summary);
        setSummaries(prev => [response.data.summary, ...prev]);
        toast.success('Successfully scanned and indexed text.');
        return response.data.summary;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to process content.';
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 4. Summarize uploaded file
  const summarizeFile = async (title, file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title) {
        formData.append('title', title);
      }

      const response = await axios.post('/api/summaries/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setActiveSummary(response.data.summary);
        setSummaries(prev => [response.data.summary, ...prev]);
        toast.success('File analyzed and saved to Memory Vault.');
        return response.data.summary;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'File processing failed.';
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 5. Delete summary
  const removeSummary = async (id) => {
    try {
      const response = await axios.delete(`/api/summaries/${id}`);
      if (response.data.success) {
        setSummaries(prev => prev.filter(s => s._id !== id));
        if (activeSummary && activeSummary._id === id) {
          setActiveSummary(null);
        }
        toast.success('Summary removed from local vault.');
        return true;
      }
    } catch (error) {
      toast.error('Failed to delete summary record.');
      return false;
    }
  };

  // 6. Semantic Search summaries
  const searchSemantic = async (query) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/summaries/search', { query });
      if (response.data.success) {
        return response.data.matches;
      }
      return [];
    } catch (error) {
      toast.error('Semantic search failed to retrieve files.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 7. Get dashboard analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get('/api/analytics');
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
    } catch (error) {
      console.error('[SummaryContext] Error loading analytics:', error.message);
    }
  }, []);

  // 8. Fetch notes
  const fetchNote = async (summaryId) => {
    try {
      const response = await axios.get(`/api/notes/${summaryId}`);
      if (response.data.success) {
        return response.data.note;
      }
      return null;
    } catch (error) {
      console.error('[SummaryContext] Error loading study note:', error.message);
      return null;
    }
  };

  // 9. Save note
  const saveNote = async (summaryId, noteTitle, noteContent) => {
    try {
      const response = await axios.post('/api/notes', { summaryId, noteTitle, noteContent });
      if (response.data.success) {
        toast.success('Revision blueprint saved successfully.');
        return response.data.note;
      }
    } catch (error) {
      toast.error('Failed to lock notes into Vault.');
      return null;
    }
  };

  return (
    <SummaryContext.Provider value={{
      summaries,
      activeSummary,
      setActiveSummary,
      analytics,
      loading,
      fetchSummaries,
      fetchSummaryById,
      summarizeText,
      summarizeFile,
      removeSummary,
      searchSemantic,
      fetchAnalytics,
      fetchNote,
      saveNote
    }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummaries = () => useContext(SummaryContext);
