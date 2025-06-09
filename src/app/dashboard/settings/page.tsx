'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Settings, Bell, Shield, Palette, Loader2, Download, Trash2, Key, AlertTriangle, Sun, Moon, Monitor } from 'lucide-react'

interface UserSettings {
  id: string
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  appointmentReminders: boolean
  messageNotifications: boolean
  communityUpdates: boolean
  profileVisibility: string
  showHealthData: boolean
  allowDirectMessages: boolean
  theme: string
  language: string
  timezone: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme: setAppTheme, systemTheme, actualTheme } = useTheme()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmText: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data)

      // Sync theme with the app theme context
      if (data.theme && data.theme !== theme) {
        setAppTheme(data.theme)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = async (key: keyof UserSettings, value: boolean | string) => {
    if (!settings) return

    setIsUpdating(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })

      if (!response.ok) throw new Error('Failed to update setting')

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      toast.success('Setting updated successfully')
    } catch (error) {
      console.error('Error updating setting:', error)
      toast.error('Failed to update setting')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    // Update the app theme immediately
    setAppTheme(newTheme)

    // Update in database
    await updateSetting('theme', newTheme)
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      toast.success('Password changed successfully')
      setShowPasswordChange(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDownloadData = async () => {
    try {
      const response = await fetch('/api/user/download-data')
      if (!response.ok) throw new Error('Failed to download data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Data downloaded successfully')
    } catch (error) {
      console.error('Error downloading data:', error)
      toast.error('Failed to download data')
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteData.confirmText !== 'DELETE') {
      toast.error('You must type "DELETE" to confirm')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: deleteData.password,
          confirmText: deleteData.confirmText
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }

      toast.success('Account deleted successfully')
      // Redirect to home page
      window.location.href = '/'
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load settings. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="appointment-notifications">Appointment Reminders</Label>
                <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
              </div>
              <Switch
                id="appointment-notifications"
                checked={settings.appointmentReminders}
                onCheckedChange={(checked) => updateSetting('appointmentReminders', checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="message-notifications">New Messages</Label>
                <p className="text-sm text-gray-500">Notifications for new messages</p>
              </div>
              <Switch
                id="message-notifications"
                checked={settings.messageNotifications}
                onCheckedChange={(checked) => updateSetting('messageNotifications', checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="community-notifications">Community Updates</Label>
                <p className="text-sm text-gray-500">Updates from communities you follow</p>
              </div>
              <Switch
                id="community-notifications"
                checked={settings.communityUpdates}
                onCheckedChange={(checked) => updateSetting('communityUpdates', checked)}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control who can see your information and how it's used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) => updateSetting('profileVisibility', value)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Who can see your profile information</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-health-data">Show Health Data</Label>
                <p className="text-sm text-gray-500">Allow others to see your health statistics</p>
              </div>
              <Switch
                id="show-health-data"
                checked={settings.showHealthData}
                onCheckedChange={(checked) => updateSetting('showHealthData', checked)}
                disabled={isUpdating}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                <p className="text-sm text-gray-500">Let other users send you messages</p>
              </div>
              <Switch
                id="allow-messages"
                checked={settings.allowDirectMessages}
                onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
                disabled={isUpdating}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="flex items-center gap-4">
                <Select
                  value={theme}
                  onValueChange={handleThemeChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {actualTheme === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>Currently: {actualTheme}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {theme === 'system'
                  ? `Following system preference (${systemTheme})`
                  : `Using ${theme} theme`
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => updateSetting('language', value)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => updateSetting('timezone', value)}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPasswordChange(true)}
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>

            {showPasswordChange && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                      size="sm"
                    >
                      {isChangingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Update Password
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPasswordChange(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Download Data */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Download Data</h3>
                <p className="text-sm text-gray-500">Download a copy of your data</p>
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadData}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
              <div>
                <h3 className="font-medium text-red-700">Delete Account</h3>
                <p className="text-sm text-red-500">Permanently delete your account and all data</p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>

            {showDeleteConfirm && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="font-semibold">Confirm Account Deletion</h3>
                  </div>
                  <p className="text-sm text-red-600">
                    This action cannot be undone. This will permanently delete your account and all associated data.
                  </p>
                  {user?.password && (
                    <div className="space-y-2">
                      <Label htmlFor="delete-password">Password</Label>
                      <Input
                        id="delete-password"
                        type="password"
                        value={deleteData.password}
                        onChange={(e) => setDeleteData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirm">Type "DELETE" to confirm</Label>
                    <Input
                      id="delete-confirm"
                      value={deleteData.confirmText}
                      onChange={(e) => setDeleteData(prev => ({ ...prev, confirmText: e.target.value }))}
                      placeholder="Type DELETE"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteData.confirmText !== 'DELETE'}
                      size="sm"
                    >
                      {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Delete Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteData({ password: '', confirmText: '' })
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
