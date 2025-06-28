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
import type { User } from '@supabase/supabase-js'

// Define the props interface
interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialTab?: "account" | "billing" | "industry"
  user?: User | null
}

// Example options for dropdowns
const industryOptions = ["AI tech", "Healthcare", "Finance", "Education", "Retail"]
const professionOptions = ["Product Management", "Software Engineer", "Data Scientist", "Designer", "Marketer"]

// Timezone options
const timezoneOptions = [
  "Pacific Time (PT)",
  "Mountain Time (MT)",
  "Central Time (CT)",
  "Eastern Time (ET)",
  "Atlantic Time (AT)",
  "Greenwich Mean Time (GMT)",
  "Central European Time (CET)",
  "Eastern European Time (EET)",
  "India Standard Time (IST)",
  "China Standard Time (CST)",
  "Japan Standard Time (JST)",
  "Australian Eastern Time (AET)",
  "New Zealand Standard Time (NZST)"
]

export function SettingsDialog({ open, onOpenChange, initialTab = "account", user }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [industry, setIndustry] = useState("AI tech")
  const [profession, setProfession] = useState("Product Management")
  const [company, setCompany] = useState("Saight.ai")
  const [timezone, setTimezone] = useState("Pacific Time (PT)")

  // Sync activeTab with initialTab when dialog opens or initialTab changes
  useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

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
              <Label htmlFor="email" className="text-gray-500">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ""} 
                disabled 
                className="bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-500">Change Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Password managed by Google" 
                disabled 
                className="bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label>My Location</Label>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <Input placeholder="City" />
                </div>
                <div className="w-1/2">
                  <Input placeholder="State" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>My Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezoneOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
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
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Profession Dropdown */}
            <div className="space-y-2">
              <Label>Profession</Label>
              <Select value={profession} onValueChange={setProfession}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {professionOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Company Text Input */}
            <div className="space-y-2">
              <Label>Company</Label>
              <Input 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
          >
            Cancel
          </Button>
          <Button className="flex-1">
            Save & Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 