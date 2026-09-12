import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { getColorForCategory } from '../services/api';
import { X, PlusCircle, BookmarkCheck } from 'lucide-react';

const WordHistory = ({ history, onClear, categories, onWordClick, savedWords = [] }) => {
  if (history.length === 0) return null;

  const isWordSaved = (word) => {
    return savedWords.includes(word.toLowerCase());
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Word History</h3>
        <button
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      </div>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {history.map((item, index) => {
            const color = getColorForCategory(categories, item.colorCategory);
            const saved = isWordSaved(item.word);
            return (
              <div
                key={`${item.word}-${index}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium">{item.word}</span>
                
                {/* Save button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWordClick && onWordClick(item, e);
                  }}
                  className={`ml-auto p-1 rounded-full transition-colors ${
                    saved 
                      ? 'text-green-500 hover:bg-green-50' 
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={saved ? 'Saved' : 'Save to list'}
                >
                  {saved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <PlusCircle className="w-4 h-4" />
                  )}
                </button>
                
                <span className="text-sm text-muted-foreground">
                  {item.colorCategory}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default WordHistory;