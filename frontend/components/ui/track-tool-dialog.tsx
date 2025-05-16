'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableTools, getUserTools, addTool, removeTool, type Tool, type AvailableTool } from '@/lib/tools';

export function TrackToolDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [availableTools, setAvailableTools] = useState<AvailableTool[]>([]);
  const [trackedTools, setTrackedTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [newTool, setNewTool] = useState({
    domain: '',
    name: '',
    category: '',
    detail: ''
  });
  // Tab state: 'track' or 'tracking'
  const [activeTab, setActiveTab] = useState<'track' | 'tracking'>('track');

  useEffect(() => {
    const fetchTools = async () => {
      const [availableData, trackedData] = await Promise.all([
        getAvailableTools(),
        getUserTools()
      ]);
      setAvailableTools(availableData);
      setTrackedTools(trackedData);
    };
    if (open) {
      fetchTools();
      setActiveTab('track'); // Always default to 'track' tab when opened
    }
  }, [open]);

  const handleSave = async () => {
    if (selectedTool) {
      const tool = availableTools.find(t => t.id === selectedTool);
      if (tool) {
        const addedTool = await addTool({
          domain: tool.domain,
          name: tool.name
        });
        if (addedTool) {
          setTrackedTools([...trackedTools, addedTool]);
        }
      }
    } else if (newTool.domain && newTool.name) {
      const addedTool = await addTool({
        domain: newTool.domain,
        name: newTool.name,
        category: newTool.category || undefined,
        detail: newTool.detail || undefined
      });
      if (addedTool) {
        setTrackedTools([...trackedTools, addedTool]);
        setAvailableTools([...availableTools, {
          id: addedTool.id,
          domain: addedTool.domain,
          name: addedTool.name
        }]);
      }
    }
    onOpenChange(false);
  };

  const handleRemoveTool = async (toolId: string) => {
    const success = await removeTool(toolId);
    if (success) {
      setTrackedTools(trackedTools.filter(tool => tool.id !== toolId));
    }
  };

  // Tab button style helper
  const tabBtn = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${active ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] min-h-[520px] flex flex-col justify-start">
        {/* Centered heading at the very top */}
        <div className="w-full text-center text-lg font-semibold mb-2">🛠️ Manage Tracked Tools</div>
        {/* Tab buttons at the top, styled like page tabs */}
        <div className="flex justify-center gap-2 mb-4">
          <button className={tabBtn(activeTab === 'track')} onClick={() => setActiveTab('track')}>Track New Tool</button>
          <button className={tabBtn(activeTab === 'tracking')} onClick={() => setActiveTab('tracking')}>Currently Tracking</button>
        </div>
        {/* Consistent pop-up size for both tabs */}
        <div className="flex-1 flex flex-col justify-between">
          {activeTab === 'track' && (
            <div className="flex flex-col items-center" style={{ fontSize: '0.8em' }}>
              <div className="w-full max-w-xl space-y-4">
                {/* Tools card with dropdown and inputs */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                  {/* Dropdown replaces 'Tool' header */}
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger className="w-full justify-center">
                      <SelectValue placeholder="Select a Tool" className="text-center" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Small explainer text below dropdown */}
                  <div className="text-center text-xs text-gray-500 my-1 py-0" style={{ fontSize: '0.75em' }}>
                    Tool not in the list? Add it below:
                  </div>
                  <div className="space-y-2 mt-2 ml-4">
                    <Input
                      placeholder="Domain: example.com"
                      value={newTool.domain}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTool({ ...newTool, domain: e.target.value })}
                    />
                    <Input
                      placeholder="Concise but descriptive name, example: 'ChatGPT web'"
                      value={newTool.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTool({ ...newTool, name: e.target.value })}
                    />
                  </div>
                </div>
                {/* Use card with lighter heading and simplified dropdowns */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                  <div className="text-left mb-2 font-semibold flex items-center gap-2">
                    Use <span className="text-xs font-normal text-gray-400">(Recommended)</span>
                  </div>
                  <div className="space-y-2 ml-4">
                    <Select
                      value={newTool.category}
                      onValueChange={(value: string) => setNewTool({ ...newTool, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creation">Creation</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTool.detail}
                      onValueChange={(value: string) => setNewTool({ ...newTool, detail: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Detail" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="analysis">Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Centered Cancel/Save buttons at the bottom of the pop-up */}
              <div className="flex justify-center space-x-2 pt-6 w-full absolute left-0 right-0 bottom-6">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          )}
          {activeTab === 'tracking' && (
            <div className="space-y-4 w-full max-w-xl mx-auto" style={{ fontSize: '0.8em' }}>
              <div className="font-medium text-center mb-2">Currently Tracking:</div>
              <div className="space-y-2">
                {trackedTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{tool.name}</div>
                      <div className="text-xs text-gray-500">{tool.domain}</div>
                      <div className="text-xs text-gray-500">
                        {tool.category} - {tool.detail}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTool(tool.id)}
                    >
                      -
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 