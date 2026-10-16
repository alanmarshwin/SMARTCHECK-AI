import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Tag
} from 'lucide-react';
import { ChecklistItem, CheckCategory, DocumentType } from '../types/compliance';

interface ChecklistEditorProps {
  customChecklist: ChecklistItem[];
  setCustomChecklist: (items: ChecklistItem[]) => void;
  onResetDefaults: () => void;
  onDone: () => void;
}

export const ChecklistEditor: React.FC<ChecklistEditorProps> = ({
  customChecklist,
  setCustomChecklist,
  onResetDefaults,
  onDone
}) => {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CheckCategory>('section');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemWeight, setNewItemWeight] = useState(15);
  const [newItemKeywords, setNewItemKeywords] = useState('');
  const [newItemHelpFix, setNewItemHelpFix] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const keywords = newItemKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newItemLabel.trim(),
      category: newItemCategory,
      description: newItemDesc.trim() || `Check for presence of ${newItemLabel}`,
      required: newItemRequired,
      weight: Number(newItemWeight) || 10,
      keywords: keywords.length > 0 ? keywords : [newItemLabel.toLowerCase().trim()],
      helpFix: newItemHelpFix.trim() || `Ensure the ${newItemLabel} section is included and populated with complete details.`
    };

    setCustomChecklist([...customChecklist, newItem]);
    setNewItemLabel('');
    setNewItemDesc('');
    setNewItemKeywords('');
    setNewItemHelpFix('');
    setIsAdding(false);
  };

  const handleDeleteItem = (id: string) => {
    setCustomChecklist(customChecklist.filter((c) => c.id !== id));
  };

  const handleToggleRequired = (id: string) => {
    setCustomChecklist(
      customChecklist.map((c) => (c.id === id ? { ...c, required: !c.required } : c))
    );
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customChecklist, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'smartcheck-checklist-rules.json');
    dlAnchorElem.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomChecklist(parsed);
          }
        } catch (err) {
          alert('Invalid checklist JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const totalPoints = customChecklist.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sliders className="h-6 w-6 text-indigo-400" />
            <span>Custom Checklist & Policy Editor</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize requirements, weights, and keywords for automated compliance auditing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>

          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <Upload className="h-3.5 w-3.5" />
            Import JSON
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={onDone}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Done & Apply
          </button>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400">Total Rules:</span>{' '}
            <strong className="text-white">{customChecklist.length}</strong>
          </div>
          <div>
            <span className="text-slate-400">Mandatory Rules:</span>{' '}
            <strong className="text-rose-400">
              {customChecklist.filter((c) => c.required).length}
            </strong>
          </div>
          <div>
            <span className="text-slate-400">Total Max Weight:</span>{' '}
            <strong className="text-indigo-400">{totalPoints} pts</strong>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Cancel' : 'Add New Rule'}
        </button>
      </div>

      {/* Add New Rule Form */}
      {isAdding && (
        <form
          onSubmit={handleAddItem}
          className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-5 shadow-lg space-y-4 animate-in fade-in"
        >
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-400" />
            <span>Create New Compliance Requirement</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rule Label / Section Name *
              </label>
              <input
                type="text"
                required
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="e.g. Ethical Considerations, Financial Plan"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="section">Document Section (Header)</option>
                <option value="required_field">Required Field / Identity</option>
                <option value="quality">Quality & Completeness</option>
                <option value="policy">Policy / Compliance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Compliance Criteria
            </label>
            <input
              type="text"
              value={newItemDesc}
              onChange={(e) => setNewItemDesc(e.target.value)}
              placeholder="e.g. Explicit statement addressing IRB approval or data privacy considerations."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Matching Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={newItemKeywords}
                onChange={(e) => setNewItemKeywords(e.target.value)}
                placeholder="e.g. ethics, irb, privacy, data security, gdpr"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={newItemRequired}
                  onChange={(e) => setNewItemRequired(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Mandatory (Penalty on omission)</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Score Weight:</span>
                <input
                  type="number"
                  min={5}
                  max={40}
                  value={newItemWeight}
                  onChange={(e) => setNewItemWeight(Number(e.target.value))}
                  className="w-16 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
                />
                <span className="text-xs text-slate-500">pts</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Suggested Fix (Help text when check fails)
            </label>
            <input
              type="text"
              value={newItemHelpFix}
              onChange={(e) => setNewItemHelpFix(e.target.value)}
              placeholder="e.g. Add a dedicated 'Ethical Considerations' section discussing user consent and safety."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {customChecklist.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{index + 1}.</span>
                <span className="font-semibold text-white text-sm">{item.label}</span>
                <span
                  onClick={() => handleToggleRequired(item.id)}
                  className={`cursor-pointer rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    item.required
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Click to toggle mandatory/recommended"
                >
                  {item.required ? 'Mandatory' : 'Optional'}
                </span>
                <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{item.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Tag className="h-3 w-3" />
                <span>Keywords: {item.keywords.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-indigo-400">
                {item.weight} pts
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
                title="Remove this requirement"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
