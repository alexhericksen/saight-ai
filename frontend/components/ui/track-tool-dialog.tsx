'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableTools, getUserTools, addTool, removeTool, type Tool, type AvailableTool } from '@/lib/tools';

export function TrackToolDialog({ 
  open, 
  onOpenChange,
  onToolAdded 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onToolAdded?: () => void;
}) {
  const [availableTools, setAvailableTools] = useState<AvailableTool[]>([]);
  const [trackedTools, setTrackedTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [newTool, setNewTool] = useState({
    domain: '',
    name: '',
    category: '',
    detail: ''
  });

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
          // Reset form
          setSelectedTool('');
          setNewTool({
            domain: '',
            name: '',
            category: '',
            detail: ''
          });
          onToolAdded?.();
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
        // Reset form
        setSelectedTool('');
        setNewTool({
          domain: '',
          name: '',
          category: '',
          detail: ''
        });
        onToolAdded?.();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] min-h-[520px] flex flex-col justify-start">
        {/* Centered heading at the very top */}
        <div className="w-full text-center text-lg font-semibold mb-2">🛠️ Track New Tool</div>
        {/* Consistent pop-up size */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col items-center" style={{ fontSize: '0.8em' }}>
            <div className="w-full max-w-xl space-y-4">
              {/* Tools card with dropdown and inputs */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                <div className="relative w-full">
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger className="w-full flex items-center justify-center relative hide-default-arrow">
                      <span className="flex items-center mx-auto">
                        <span>Select a Tool</span>
                      </span>
                      <SelectValue className="hidden" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTools.map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Tool fields, full width */}
                <div className="space-y-2 mt-2">
                  <Input
                    className="w-full"
                    placeholder="Domain: example.com"
                    value={newTool.domain}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTool({ ...newTool, domain: e.target.value })}
                  />
                  <Input
                    className="w-full"
                    placeholder="Name (concise but descriptive): example, 'ChatGPT web'"
                    value={newTool.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTool({ ...newTool, name: e.target.value })}
                  />
                </div>
              </div>
              {/* Use card with lighter heading and simplified dropdowns, full width */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
                <div className="text-left mb-2 font-semibold flex items-center gap-2">
                  Use <span className="text-xs font-normal text-gray-400">(Recommended)</span>
                </div>
                <div className="space-y-2">
                  <Select
                    value={newTool.category}
                    onValueChange={(value: string) => setNewTool({ ...newTool, category: value })}
                  >
                    <SelectTrigger className="w-full">
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
                    <SelectTrigger className="w-full">
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
          </div>
          {/* Two bottom buttons, always visible and centered according to full width */}
          <div className="flex w-full justify-center mt-6 mb-2">
            <div className="flex gap-3 w-full max-w-xl justify-center">
              {/* All buttons same width, centered */}
              <Button variant="outline" className="w-32" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button className="w-32" onClick={handleSave}>Save & Exit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --- CSS to hide default SelectPrimitive.Icon in SelectTrigger --- */
<style jsx global>{`
  .hide-default-arrow [data-radix-select-trigger] > svg.h-4.w-4.opacity-50 {
    display: none !important;
  }
`}</style> 