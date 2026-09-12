import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { getColorForCategory, getWordDefinition } from '../services/api';

const WordDisplay = ({ wordData, categories }) => {
  const [definition, setDefinition] = useState('');
  const [loadingDefinition, setLoadingDefinition] = useState(false);

  useEffect(() => {
    const fetchDefinition = async () => {
      if (wordData && wordData.word) {
        // Use stored definition if available
        if (wordData.definition) {
          setDefinition(wordData.definition);
          return;
        }
        
        // Otherwise fetch from API
        setLoadingDefinition(true);
        try {
          const result = await getWordDefinition(wordData.word);
          setDefinition(result.definition || 'Definition not available');
        } catch (error) {
          setDefinition('Definition not available');
        }
        setLoadingDefinition(false);
      }
    };
    fetchDefinition();
  }, [wordData, getWordDefinition]);

  if (!wordData) return null;

  const { word, stressedVowel, colorCategory } = wordData;
  const color = getColorForCategory(categories, colorCategory);
  
  // Get the phonetic sound from the category
  const category = categories.find(c => c.name === colorCategory);
  const phoneticSound = category ? category.sound : '';

  // Function to underline stressed vowel in the word
  const renderWordWithUnderline = () => {
    const lowerWord = word.toLowerCase();
    const lowerVowel = stressedVowel.toLowerCase();
    
    // Use vowelPosition if available, otherwise fall back to indexOf
    let index = wordData.vowelPosition !== undefined ? wordData.vowelPosition : lowerWord.indexOf(lowerVowel);

    if (index === -1) {
      return <span>{word}</span>;
    }

    const before = word.slice(0, index);
    const stressed = word.slice(index, index + stressedVowel.length);
    const after = word.slice(index + stressedVowel.length);
    
    return (
      <span>
        {before}
        <span 
          className="underline decoration-2 underline-offset-4"
          style={{
            textDecorationColor: color
          }}
        >
          {stressed}
        </span>
        {after}
      </span>
    );
  };

  return (
    <Card className="p-8 text-center">
      <div 
        className="text-6xl font-bold mb-6 py-8 rounded-xl transition-all duration-300 bg-slate-50"
        style={{ 
          color: color,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}
      >
        {renderWordWithUnderline()}
      </div>
      <div className="space-y-2">
        <p className="text-xl font-semibold" style={{ color: color }}>
          {phoneticSound}
        </p>
        <p className="text-sm text-muted-foreground">
          Category Name: <span className="font-medium">{colorCategory}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Handy Meaning: <span className="font-medium italic">
            {loadingDefinition ? 'Loading...' : definition}
          </span>
        </p>
      </div>
    </Card>
  );
};

export default WordDisplay;