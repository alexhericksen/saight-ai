"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useUser } from "@/hooks/useUser"
import { TIMEZONE_OPTIONS, INDUSTRY_OPTIONS, PROFESSION_OPTIONS } from "@/lib/constants/userOptions"
import { toast } from "sonner"

// Define the props interface
interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab?: "account" | "billing" | "industry"
}

export function SettingsDialog({ open, onOpenChange, initialTab = "account" }: SettingsDialogProps) {
  const { user, updateUserSettings } = useUser();
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    timezone: "",
    industry: "",
    profession: "",
    company: "",
  })

  // Load user data when dialog opens
  useEffect(() => {
    if (open && user) {
      setFormData({
        city: user.user_metadata?.city || "",
        state: user.user_metadata?.state || "",
        timezone: user.user_metadata?.timezone || "",
        industry: user.user_metadata?.industry || "",
        profession: user.user_metadata?.profession || "",
        company: user.user_metadata?.company || "",
      })
    }
  }, [open, user])

  // Sync activeTab with initialTab when dialog opens or initialTab changes
  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await updateUserSettings(formData)
      toast.success("Settings saved successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to save settings")
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "account" ? "default" : "outline"}
            onClick={() => setActiveTab("account")}
            className="flex-1"
          >
            Account
          </Button>
          <Button
            variant={activeTab === "billing" ? "default" : "outline"}
            onClick={() => setActiveTab("billing")}
            className="flex-1"
          >
            Billing
          </Button>
          <Button
            variant={activeTab === "industry" ? "default" : "outline"}
            onClick={() => setActiveTab("industry")}
            className="flex-1"
          >
            Industry
          </Button>
        </div>

        {/* Account Tab Content */}
        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label>My Location</Label>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <Input 
                    placeholder="City" 
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="w-1/2">
                  <Input 
                    placeholder="State" 
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>My Timezone</Label>
              <Select 
                value={formData.timezone} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Billing Tab Content */}
        {activeTab === "billing" && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Current Plan</h3>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
          </div>
        )}

        {/* Industry Tab Content */}
        {activeTab === "industry" && (
          <div className="space-y-4">
            {/* Industry Dropdown */}
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Profession Dropdown */}
            <div className="space-y-2">
              <Label>Profession</Label>
              <Select 
                value={formData.profession} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Company Text Input */}
            <div className="space-y-2">
              <Label>Company</Label>
              <Input 
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Exit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 