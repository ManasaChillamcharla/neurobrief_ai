const SavedNote = require('../models/SavedNote');
const Summary = require('../models/Summary');

/**
 * @desc    Get custom note associated with a summary ID
 * @route   GET /api/notes/:summaryId
 * @access  Private
 */
const getNoteBySummaryId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { summaryId } = req.params;

    let savedNote = await SavedNote.findOne({ user: userId, summary: summaryId });

    if (!savedNote) {
      // If none saved yet, check if summary has default AI-generated studyNotes to preload
      const summary = await Summary.findOne({ _id: summaryId, user: userId });
      if (!summary) {
        return res.status(404).json({ success: false, message: 'Summary profile not found' });
      }

      // Return a blank note filled with default AI-generated study notes
      return res.json({
        success: true,
        isNew: true,
        note: {
          summary: summaryId,
          noteTitle: `Study Guide - ${summary.title}`,
          noteContent: summary.studyNotes || '# Preloading default revision notes...'
        }
      });
    }

    res.json({
      success: true,
      isNew: false,
      note: savedNote
    });
  } catch (error) {
    console.error(`[Get Note Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

/**
 * @desc    Create or update a custom note
 * @route   POST /api/notes
 * @access  Private
 */
const saveNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { summaryId, noteTitle, noteContent } = req.body;

    if (!summaryId || !noteTitle || !noteContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Summary ID, note title, and note content are required.' 
      });
    }

    // Check if user owns the summary first
    const summary = await Summary.findOne({ _id: summaryId, user: userId });
    if (!summary) {
      return res.status(404).json({ success: false, message: 'Parent summary profile not found.' });
    }

    let savedNote = await SavedNote.findOne({ user: userId, summary: summaryId });

    if (savedNote) {
      // Update existing
      savedNote.noteTitle = noteTitle.trim();
      savedNote.noteContent = noteContent;
      await savedNote.save();
    } else {
      // Create new
      savedNote = await SavedNote.create({
        user: userId,
        summary: summaryId,
        noteTitle: noteTitle.trim(),
        noteContent: noteContent
      });
    }

    res.json({
      success: true,
      message: 'Note saved successfully to Vault.',
      note: savedNote
    });
  } catch (error) {
    console.error(`[Save Note Error] ${error.message}`);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

module.exports = {
  getNoteBySummaryId,
  saveNote
};
