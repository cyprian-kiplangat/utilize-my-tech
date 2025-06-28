import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Calendar, User, Package, Edit3, Save, X } from 'lucide-react';
import { Perk } from '../types';
import { usePerks } from '../hooks/usePerks';

interface PerkDetailProps {
  perkId: string;
  onBack: () => void;
}

export const PerkDetail: React.FC<PerkDetailProps> = ({ perkId, onBack }) => {
  const { perks, updatePerk } = usePerks();
  const perk = perks.find(p => p.id === perkId);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  if (!perk) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-white mb-2">Perk not found</h2>
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Go back to dashboard
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: Perk['status']) => {
    updatePerk(perk.id, { status: newStatus });
  };

  const handleProgressToggle = (progressKey: keyof Perk['progress']) => {
    const newProgress = {
      ...perk.progress,
      [progressKey]: !perk.progress[progressKey]
    };
    updatePerk(perk.id, { progress: newProgress });
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      const newNotes = [...perk.notes, noteInput.trim()];
      updatePerk(perk.id, { notes: newNotes });
      setNoteInput('');
      setIsEditingNotes(false);
    }
  };

  const handleDeleteNote = (index: number) => {
    const newNotes = perk.notes.filter((_, i) => i !== index);
    updatePerk(perk.id, { notes: newNotes });
  };

  const getDaysUntilExpiry = () => {
    const now = new Date();
    const expiryDate = new Date(perk.expiryDate);
    return Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const progressItems = [
    { key: 'readDocs', label: 'Read Documentation' },
    { key: 'completedTutorial', label: 'Completed Tutorial' },
    { key: 'usedInProject', label: 'Used in Project' },
    { key: 'sharedWithTeam', label: 'Shared with Team' },
  ] as const;

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <h1 className="text-2xl font-bold text-white">{perk.name}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Overview</h2>
            <p className="text-slate-300 mb-6">{perk.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Package size={16} className="text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Provider</p>
                  <p className="text-slate-300">{perk.provider}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Expires</p>
                  <p className={`${isExpiringSoon ? 'text-red-400' : 'text-slate-300'}`}>
                    {new Date(perk.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {perk.link && (
              <a
                href={perk.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
              >
                <ExternalLink size={16} />
                <span>Visit Platform</span>
              </a>
            )}
          </div>

          {/* Learning Notes */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Learning Notes</h2>
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <Edit3 size={14} />
                <span>Add Note</span>
              </button>
            </div>

            {isEditingNotes && (
              <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add your learning notes, insights, or key takeaways..."
                  className="w-full bg-transparent text-slate-300 placeholder-slate-500 resize-none focus:outline-none"
                  rows={3}
                />
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleAddNote}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors duration-200"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNoteInput('');
                    }}
                    className="flex items-center space-x-2 px-3 py-1 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {perk.notes.map((note, index) => (
                <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 group">
                  <p className="text-slate-300">{note}</p>
                  <button
                    onClick={() => handleDeleteNote(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 mt-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {perk.notes.length === 0 && (
                <p className="text-slate-500 text-center py-4">
                  No notes yet. Add insights from your learning journey!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status & Progress */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            <div className="space-y-2">
              {(['unused', 'in-progress', 'completed'] as const).map((status) => (
                <label key={status} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={perk.status === status}
                    onChange={() => handleStatusChange(status)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300 capitalize">{status.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Progress Checklist */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Progress Checklist</h3>
            <div className="space-y-3">
              {progressItems.map((item) => (
                <label key={item.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={perk.progress[item.key]}
                    onChange={() => handleProgressToggle(item.key)}
                    className="rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-slate-300">{item.label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-blue-400 font-medium">
                  {Object.values(perk.progress).filter(Boolean).length}/4
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(Object.values(perk.progress).filter(Boolean).length / 4) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Expiry Warning */}
          {isExpiringSoon && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Expiring Soon!</h3>
              <p className="text-red-300 text-sm">
                This perk expires in {daysUntilExpiry} day{daysUntilExpiry === 1 ? '' : 's'}. 
                Make sure to use it before it's gone!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};