import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const getRandomWord = async () => {
  try {
    const response = await axios.get(`${API}/words/random`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random word:', error);
    throw error;
  }
};

export const analyzeWord = async (word) => {
  try {
    const response = await axios.get(`${API}/words/analyze/${word}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error analyzing word:', error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getWordDefinition = async (word) => {
  try {
    const response = await axios.get(`${API}/words/definition/${word}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching definition:', error);
    return { word, definition: 'Definition not available' };
  }
};

export const getColorForCategory = (categories, categoryName) => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.color : '#6B7280';
};

export const getWordsByCategory = async (categoryName) => {
  try {
    const response = await axios.get(`${API}/words/`, { params: { category: categoryName } });
    return response.data;
  } catch (error) {
    console.error('Error fetching words by category:', error);
    throw error;
  }
};

// Savings Lists API
export const getAllSavingLists = async () => {
  try {
    const response = await axios.get(`${API}/savings/lists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saving lists:', error);
    throw error;
  }
};

export const createSavingList = async (name) => {
  try {
    const response = await axios.post(`${API}/savings/lists`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating saving list:', error);
    throw error;
  }
};

export const addWordToList = async (listId, wordData) => {
  try {
    const response = await axios.post(`${API}/savings/lists/${listId}/words`, wordData);
    return response.data;
  } catch (error) {
    console.error('Error adding word to list:', error);
    throw error;
  }
};

export const removeWordFromList = async (listId, word) => {
  try {
    const response = await axios.delete(`${API}/savings/lists/${listId}/words/${word}`);
    return response.data;
  } catch (error) {
    console.error('Error removing word from list:', error);
    throw error;
  }
};

export const deleteSavingList = async (listId) => {
  try {
    const response = await axios.delete(`${API}/savings/lists/${listId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting saving list:', error);
    throw error;
  }
};