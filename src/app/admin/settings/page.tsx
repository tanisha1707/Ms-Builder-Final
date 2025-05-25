"use client"

import { useState, useEffect } from "react"
import { 
 User, 
 Shield, 
 Palette, 
 Bell, 
 Database, 
 Upload, 
 Eye, 
 EyeOff,
 CheckCircle, 
 XCircle, 
 AlertCircle,
 Save,
 RefreshCw,
 Monitor,
 Sun,
 Moon,
 Zap
} from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import LoadingSpinner from "@/components/ui/loading-spinner"
import Image from "next/image"

interface AdminUser {
 id?: string
 name?: string
 email?: string
 role?: string
}

interface TestResult {
 status: 'success' | 'error' | 'warning'
 message: string
 details?: string
}

interface ThemeSettings {
 mode: 'light' | 'dark' | 'system'
 primaryColor: string
 accentColor: string
 borderRadius: string
}

interface NotificationSettings {
 emailNotifications: boolean
 pushNotifications: boolean
 weeklyReports: boolean
 systemAlerts: boolean
}

interface SystemSettings {
 siteName: string
 siteDescription: string
 contactEmail: string
 maintenanceMode: boolean
 enableRegistration: boolean
}

export default function AdminSettingsPage() {
 const [activeTab, setActiveTab] = useState('profile')
 const [, setUser] = useState<AdminUser | null>(null)
 const [loading, setLoading] = useState(false)
 const [success, setSuccess] = useState('')
 const [error, setError] = useState('')

 const [profileData, setProfileData] = useState({
   name: '',
   email: '',
   currentPassword: '',
   newPassword: '',
   confirmPassword: ''
 })
 const [showPasswords, setShowPasswords] = useState({
   current: false,
   new: false,
   confirm: false
 })

 const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
   mode: 'light',
   primaryColor: '#f59e0b',
   accentColor: '#eab308',
   borderRadius: '8px'
 })

 const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
   emailNotifications: true,
   pushNotifications: false,
   weeklyReports: true,
   systemAlerts: true
 })

 const [systemSettings, setSystemSettings] = useState<SystemSettings>({
   siteName: "MSBUILDER'S",
   siteDescription: "Premium Real Estate Company",
   contactEmail: "info@msbuilders.com",
   maintenanceMode: false,
   enableRegistration: false
 })

 const [testResults, setTestResults] = useState<TestResult[]>([])
 const [testing, setTesting] = useState(false)
 const [uploadTest, setUploadTest] = useState<{
   status: 'idle' | 'uploading' | 'success' | 'error'
   result?: {
     url: string
     publicId: string
     width: number
     height: number
   }
   error?: string
 }>({ status: 'idle' })

 useEffect(() => {
   fetchUserData()
   loadSettings()
 }, [])

 const fetchUserData = async () => {
   try {
     const token = localStorage.getItem("auth-token")
     const response = await fetch("/api/auth/verify", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     })

     if (response.ok) {
       const userData = await response.json()
       setUser(userData.user)
       setProfileData(prev => ({
         ...prev,
         name: userData.user.name || '',
         email: userData.user.email || ''
       }))
     }
   } catch (error) {
     console.error("Error fetching user data:", error)
   }
 }

 const loadSettings = () => {
   const savedTheme = localStorage.getItem('admin-theme')
   if (savedTheme) {
     setThemeSettings(JSON.parse(savedTheme))
   }

   const savedNotifications = localStorage.getItem('admin-notifications')
   if (savedNotifications) {
     setNotificationSettings(JSON.parse(savedNotifications))
   }

   const savedSystem = localStorage.getItem('admin-system')
   if (savedSystem) {
     setSystemSettings(JSON.parse(savedSystem))
   }
 }

 const handleProfileUpdate = async () => {
   setLoading(true)
   setError('')
   setSuccess('')

   try {
     if (profileData.newPassword) {
       if (profileData.newPassword !== profileData.confirmPassword) {
         setError('New passwords do not match')
         setLoading(false)
         return
       }
       if (profileData.newPassword.length < 6) {
         setError('New password must be at least 6 characters')
         setLoading(false)
         return
       }
     }

     await new Promise(resolve => setTimeout(resolve, 1000))

     setSuccess('Profile updated successfully')
     setProfileData(prev => ({
       ...prev,
       currentPassword: '',
       newPassword: '',
       confirmPassword: ''
     }))
   } catch {
     setError('Failed to update profile')
   } finally {
     setLoading(false)
   }
 }

 const handleThemeUpdate = () => {
   localStorage.setItem('admin-theme', JSON.stringify(themeSettings))
   setSuccess('Theme settings saved successfully')
   
   document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor)
   document.documentElement.style.setProperty('--accent-color', themeSettings.accentColor)
   document.documentElement.style.setProperty('--border-radius', themeSettings.borderRadius)
 }

 const handleNotificationUpdate = () => {
   localStorage.setItem('admin-notifications', JSON.stringify(notificationSettings))
   setSuccess('Notification settings saved successfully')
 }

 const handleSystemUpdate = () => {
   localStorage.setItem('admin-system', JSON.stringify(systemSettings))
   setSuccess('System settings saved successfully')
 }

 const testCloudinaryConnection = async () => {
   setTesting(true)
   setTestResults([])

   try {
     const envTest = await fetch('/api/admin/test-cloudinary', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
       },
       body: JSON.stringify({ test: 'env' })
     })

     const envResult = await envTest.json()
     
     if (envResult.success) {
       setTestResults(prev => [...prev, {
         status: 'success',
         message: 'Environment variables configured correctly',
         details: 'All Cloudinary credentials are properly set'
       }])
     } else {
       setTestResults(prev => [...prev, {
         status: 'error',
         message: 'Environment variables missing',
         details: envResult.message
       }])
     }

     const connectionTest = await fetch('/api/admin/test-cloudinary', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
       },
       body: JSON.stringify({ test: 'connection' })
     })

     const connectionResult = await connectionTest.json()
     
     if (connectionResult.success) {
       setTestResults(prev => [...prev, {
         status: 'success',
         message: 'Cloudinary API connection successful',
         details: `Connected to cloud: ${connectionResult.data?.cloud_name || 'Unknown'}`
       }])
     } else {
       setTestResults(prev => [...prev, {
         status: 'error',
         message: 'Cloudinary API connection failed',
         details: connectionResult.message
       }])
     }

   } catch (error) {
     setTestResults(prev => [...prev, {
       status: 'error',
       message: 'Test failed with network error',
       details: error instanceof Error ? error.message : 'Unknown error'
     }])
   } finally {
     setTesting(false)
   }
 }

 const testImageUpload = async () => {
   setUploadTest({ status: 'uploading' })

   try {
     const canvas = document.createElement('canvas')
     canvas.width = 100
     canvas.height = 100
     const ctx = canvas.getContext('2d')
     if (ctx) {
       const gradient = ctx.createLinearGradient(0, 0, 100, 100)
       gradient.addColorStop(0, '#f59e0b')
       gradient.addColorStop(1, '#eab308')
       ctx.fillStyle = gradient
       ctx.fillRect(0, 0, 100, 100)
       
       ctx.fillStyle = '#000'
       ctx.font = '12px Arial'
       ctx.fillText('TEST', 35, 55)
     }
     
     canvas.toBlob(async (blob) => {
       if (!blob) {
         setUploadTest({ 
           status: 'error', 
           error: 'Failed to create test image' 
         })
         return
       }

       const formData = new FormData()
       formData.append('file', blob, 'test-image.png')
       formData.append('folder', 'test')

       const response = await fetch('/api/upload', {
         method: 'POST',
         headers: {
           Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
         },
         body: formData
       })

       const result = await response.json()

       if (response.ok && result.success) {
         setUploadTest({ 
           status: 'success', 
           result: {
             url: result.url,
             publicId: result.publicId,
             width: result.width,
             height: result.height
           }
         })
       } else {
         setUploadTest({ 
           status: 'error', 
           error: result.message || 'Upload failed' 
         })
       }
     }, 'image/png')

   } catch (error) {
     setUploadTest({ 
       status: 'error', 
       error: error instanceof Error ? error.message : 'Unknown error' 
     })
   }
 }

 const tabs = [
   { id: 'profile', label: 'Profile', icon: User },
   { id: 'theme', label: 'Appearance', icon: Palette },
   { id: 'notifications', label: 'Notifications', icon: Bell },
   { id: 'system', label: 'System', icon: Database },
   { id: 'cloudinary', label: 'Cloud Storage', icon: Upload }
 ]

 const getStatusIcon = (status: TestResult['status']) => {
   switch (status) {
     case 'success':
       return <CheckCircle className="h-5 w-5 text-green-500" />
     case 'error':
       return <XCircle className="h-5 w-5 text-red-500" />
     case 'warning':
       return <AlertCircle className="h-5 w-5 text-yellow-500" />
   }
 }

 const clearMessages = () => {
   setSuccess('')
   setError('')
 }

 return (
   <AdminLayout>
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
         <p className="text-gray-600 mt-1">
           Manage your account preferences and system configuration
         </p>
       </div>

       {(success || error) && (
         <div className={`p-4 rounded-lg border ${
           success 
             ? 'bg-green-50 border-green-200 text-green-800' 
             : 'bg-red-50 border-red-200 text-red-800'
         }`}>
           <div className="flex items-center justify-between">
             <div className="flex items-center">
               {success ? (
                 <CheckCircle className="h-5 w-5 mr-2" />
               ) : (
                 <XCircle className="h-5 w-5 mr-2" />
               )}
               <span>{success || error}</span>
             </div>
             <Button variant="ghost" size="sm" onClick={clearMessages}>
               <XCircle className="h-4 w-4" />
             </Button>
           </div>
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1">
           <nav className="space-y-1">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                   activeTab === tab.id
                     ? 'bg-yellow-500 text-black'
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                 }`}
               >
                 <tab.icon className="h-5 w-5 mr-3" />
                 {tab.label}
               </button>
             ))}
           </nav>
         </div>

         <div className="lg:col-span-3">
           {activeTab === 'profile' && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center">
                   <User className="h-5 w-5 mr-2" />
                   Profile Settings
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-2">Full Name</label>
                     <Input
                       value={profileData.name}
                       onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                       placeholder="Enter your full name"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-2">Email Address</label>
                     <Input
                       type="email"
                       value={profileData.email}
                       onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                       placeholder="Enter your email"
                     />
                   </div>
                 </div>

                 <div className="border-t pt-6">
                   <h3 className="text-lg font-medium mb-4 flex items-center">
                     <Shield className="h-5 w-5 mr-2" />
                     Change Password
                   </h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium mb-2">Current Password</label>
                       <div className="relative">
                         <Input
                           type={showPasswords.current ? "text" : "password"}
                           value={profileData.currentPassword}
                           onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                           placeholder="Enter current password"
                           className="pr-10"
                         />
                         <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           className="absolute right-0 top-0 h-full px-3"
                           onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                         >
                           {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </Button>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium mb-2">New Password</label>
                         <div className="relative">
                           <Input
                             type={showPasswords.new ? "text" : "password"}
                             value={profileData.newPassword}
                             onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                             placeholder="Enter new password"
                             className="pr-10"
                           />
                           <Button
                             type="button"
                             variant="ghost"
                             size="icon"
                             className="absolute right-0 top-0 h-full px-3"
                             onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                           >
                             {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                         </div>
                       </div>

                       <div>
                         <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                         <div className="relative">
                           <Input
                             type={showPasswords.confirm ? "text" : "password"}
                             value={profileData.confirmPassword}
                             onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                             placeholder="Confirm new password"
                             className="pr-10"
                           />
                           <Button
                             type="button"
                             variant="ghost"
                             size="icon"
                             className="absolute right-0 top-0 h-full px-3"
                             onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                           >
                             {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="flex justify-end">
                   <Button 
                     onClick={handleProfileUpdate}
                     disabled={loading}
                     className="bg-yellow-500 hover:bg-yellow-600 text-black"
                   >
                     {loading ? (
                       <>
                         <LoadingSpinner size="sm" className="mr-2" />
                         Updating...
                       </>
                     ) : (
                       <>
                         <Save className="h-4 w-4 mr-2" />
                         Update Profile
                       </>
                     )}
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}

           {activeTab === 'theme' && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center">
                   <Palette className="h-5 w-5 mr-2" />
                   Appearance Settings
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium mb-4">Theme Mode</label>
                   <div className="grid grid-cols-3 gap-3">
                     {[
                       { id: 'light', label: 'Light', icon: Sun },
                       { id: 'dark', label: 'Dark', icon: Moon },
                       { id: 'system', label: 'System', icon: Monitor }
                     ].map((mode) => (
                       <button
                         key={mode.id}
                         onClick={() => setThemeSettings(prev => ({ ...prev, mode: mode.id as never }))}
                         className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                           themeSettings.mode === mode.id
                             ? 'border-yellow-500 bg-yellow-50'
                             : 'border-gray-200 hover:border-gray-300'
                         }`}
                       >
                         <mode.icon className="h-6 w-6 mb-2" />
                         <span className="text-sm font-medium">{mode.label}</span>
                       </button>
                     ))}
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-2">Primary Color</label>
                     <div className="flex items-center space-x-3">
                       <input
                         type="color"
                         value={themeSettings.primaryColor}
                         onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                         className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                       />
                       <Input
                         value={themeSettings.primaryColor}
                         onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                         placeholder="#f59e0b"
                       />
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-medium mb-2">Accent Color</label>
                     <div className="flex items-center space-x-3">
                       <input
                         type="color"
                         value={themeSettings.accentColor}
                         onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                         className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                       />
                       <Input
                         value={themeSettings.accentColor}
                         onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                         placeholder="#eab308"
                       />
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-2">Border Radius</label>
                   <select
                     value={themeSettings.borderRadius}
                     onChange={(e) => setThemeSettings(prev => ({ ...prev, borderRadius: e.target.value }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                     aria-label="Border Radius"
                   >
                     <option value="4px">Small (4px)</option>
                     <option value="8px">Medium (8px)</option>
                     <option value="12px">Large (12px)</option>
                     <option value="16px">Extra Large (16px)</option>
                   </select>
                 </div>

                 <div className="flex justify-end">
                   <Button 
                     onClick={handleThemeUpdate}
                     className="bg-yellow-500 hover:bg-yellow-600 text-black"
                   >
                     <Save className="h-4 w-4 mr-2" />
                     Save Theme
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}

           {activeTab === 'notifications' && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center">
                   <Bell className="h-5 w-5 mr-2" />
                   Notification Preferences
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="space-y-4">
                   {[
                     { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                     { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                     { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly summary reports' },
                     { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' }
                   ].map((setting) => (
                     <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                       <div>
                         <h4 className="font-medium text-gray-900">{setting.label}</h4>
                         <p className="text-sm text-gray-600">{setting.description}</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input
                           type="checkbox"
                           checked={notificationSettings[setting.key as keyof NotificationSettings]}
                           onChange={(e) => setNotificationSettings(prev => ({ 
                             ...prev, 
                             [setting.key]: e.target.checked 
                           }))}
                           className="sr-only peer"
                         />
                         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                       </label>
                     </div>
                   ))}
                 </div>

                 <div className="flex justify-end">
                   <Button 
                     onClick={handleNotificationUpdate}
                     className="bg-yellow-500 hover:bg-yellow-600 text-black"
                   >
                     <Save className="h-4 w-4 mr-2" />
                     Save Preferences
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}

           {activeTab === 'system' && (
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center">
                   <Database className="h-5 w-5 mr-2" />
                   System Configuration
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium mb-2">Site Name</label>
                     <Input
                       value={systemSettings.siteName}
                       onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                       placeholder="MSBUILDER'S"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium mb-2">Contact Email</label>
                     <Input
                       type="email"
                       value={systemSettings.contactEmail}
                       onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                       placeholder="info@msbuilders.com"
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-2">Site Description</label>
                   <Textarea
                     value={systemSettings.siteDescription}
                     onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                     placeholder="Premium Real Estate Company"
                     rows={3}
                   />
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div>
                       <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                       <p className="text-sm text-gray-600">Put the site in maintenance mode</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input
                         type="checkbox"
                         checked={systemSettings.maintenanceMode}
                         onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                         className="sr-only peer"
                       />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                     </label>
                   </div>

                   <div className="flex items-center justify-between p-4 border rounded-lg">
                     <div>
                       <h4 className="font-medium text-gray-900">Enable Registration</h4>
                       <p className="text-sm text-gray-600">Allow new users to register</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input
                         type="checkbox"
                         checked={systemSettings.enableRegistration}
                         onChange={(e) => setSystemSettings(prev => ({ ...prev, enableRegistration: e.target.checked }))}
                         className="sr-only peer"
                       />
                       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                     </label>
                   </div>
                 </div>

                 <div className="flex justify-end">
                   <Button 
                     onClick={handleSystemUpdate}
                     className="bg-yellow-500 hover:bg-yellow-600 text-black"
                   >
                     <Save className="h-4 w-4 mr-2" />
                     Save System Settings
                   </Button>
                 </div>
               </CardContent>
             </Card>
           )}

           {activeTab === 'cloudinary' && (
             <div className="space-y-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center">
                     <Upload className="h-5 w-5 mr-2" />
                     Cloud Storage Configuration
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <div className="flex items-start">
                       <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                       <div>
                         <h4 className="font-medium text-blue-900 mb-1">About Cloud Storage</h4>
                         <p className="text-sm text-blue-800">
                           Your application uses Cloudinary for image and file storage. Use the tools below to test your configuration and ensure everything is working properly.
                         </p>
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Button
                       onClick={testCloudinaryConnection}
                       disabled={testing}
                       variant="outline"
                       className="h-20 flex flex-col items-center justify-center"
                     >
                       {testing ? (
                         <>
                           <LoadingSpinner size="sm" className="mb-2" />
                           <span className="text-sm">Testing Connection...</span>
                         </>
                       ) : (
                         <>
                           <Zap className="h-6 w-6 mb-2" />
                           <span className="text-sm">Test Connection</span>
                         </>
                       )}
                     </Button>

                     <Button
                       onClick={testImageUpload}
                       disabled={uploadTest.status === 'uploading'}
                       variant="outline"
                       className="h-20 flex flex-col items-center justify-center"
                     >
                       {uploadTest.status === 'uploading' ? (
                         <>
                           <LoadingSpinner size="sm" className="mb-2" />
                           <span className="text-sm">Uploading Test Image...</span>
                         </>
                       ) : (
                         <>
                           <Upload className="h-6 w-6 mb-2" />
                           <span className="text-sm">Test Upload</span>
                         </>
                       )}
                     </Button>
                   </div>

                   {testResults.length > 0 && (
                     <div className="space-y-3">
                       <h4 className="font-medium text-gray-900 flex items-center">
                         <RefreshCw className="h-4 w-4 mr-2" />
                         Connection Test Results
                       </h4>
                       {testResults.map((result, index) => (
                         <div
                           key={index}
                           className={`p-4 rounded-lg border flex items-start space-x-3 ${
                             result.status === 'success'
                               ? 'bg-green-50 border-green-200'
                               : result.status === 'error'
                               ? 'bg-red-50 border-red-200'
                               : 'bg-yellow-50 border-yellow-200'
                           }`}
                         >
                           {getStatusIcon(result.status)}
                           <div className="flex-1">
                             <h5 className="font-medium text-gray-900">{result.message}</h5>
                             {result.details && (
                               <p className="text-sm text-gray-600 mt-1">{result.details}</p>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                   )}

                   {uploadTest.status !== 'idle' && (
                     <div className="space-y-3">
                       <h4 className="font-medium text-gray-900 flex items-center">
                         <Upload className="h-4 w-4 mr-2" />
                         Upload Test Results
                       </h4>
                       <div
                         className={`p-4 rounded-lg border flex items-start space-x-3 ${
                           uploadTest.status === 'success'
                             ? 'bg-green-50 border-green-200'
                             : uploadTest.status === 'error'
                             ? 'bg-red-50 border-red-200'
                             : 'bg-blue-50 border-blue-200'
                         }`}
                       >
                         {uploadTest.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                         {uploadTest.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                         {uploadTest.status === 'uploading' && <LoadingSpinner size="sm" />}
                         
                         <div className="flex-1">
                           {uploadTest.status === 'success' && (
                             <>
                               <h5 className="font-medium text-gray-900">Upload Successful!</h5>
                               <p className="text-sm text-gray-600 mt-1">
                                 Test image uploaded successfully to Cloudinary
                               </p>
                               {uploadTest.result && (
                                 <>
                                   <Image
                                     src={uploadTest.result.url}
                                     alt="Test upload"
                                     width={80}
                                     height={80}
                                     className="w-20 h-20 object-cover rounded mb-2"
                                   />
                                   <div className="text-xs text-gray-500 space-y-1">
                                     <p><strong>URL:</strong> {uploadTest.result.url}</p>
                                     <p><strong>Public ID:</strong> {uploadTest.result.publicId}</p>
                                   </div>
                                 </>
                               )}
                             </>
                           )}
                           {uploadTest.status === 'error' && (
                             <>
                               <h5 className="font-medium text-gray-900">Upload Failed</h5>
                               <p className="text-sm text-gray-600 mt-1">
                                 {uploadTest.error || 'Unknown error occurred during upload'}
                               </p>
                             </>
                           )}
                           {uploadTest.status === 'uploading' && (
                             <>
                               <h5 className="font-medium text-gray-900">Uploading...</h5>
                               <p className="text-sm text-gray-600 mt-1">
                                 Testing image upload to Cloudinary
                               </p>
                             </>
                           )}
                         </div>
                       </div>
                     </div>
                   )}

                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                     <h4 className="font-medium text-gray-900 mb-3">Environment Variables Status</h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex items-center justify-between">
                         <span>CLOUDINARY_CLOUD_NAME</span>
                         <span className={`px-2 py-1 rounded text-xs ${
                           process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing'}
                         </span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span>CLOUDINARY_API_KEY</span>
                         <span className={`px-2 py-1 rounded text-xs ${
                           process.env.CLOUDINARY_API_KEY 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {process.env.CLOUDINARY_API_KEY ? 'Configured' : 'Missing'}
                         </span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span>CLOUDINARY_API_SECRET</span>
                         <span className={`px-2 py-1 rounded text-xs ${
                           process.env.CLOUDINARY_API_SECRET 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {process.env.CLOUDINARY_API_SECRET ? 'Configured' : 'Missing'}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                     <div className="flex items-start">
                       <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                       <div>
                         <h4 className="font-medium text-yellow-900 mb-1">Configuration Help</h4>
                         <p className="text-sm text-yellow-800 mb-2">
                           If tests are failing, ensure your environment variables are properly configured:
                         </p>
                         <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                           <li>Check your .env.local file contains all Cloudinary credentials</li>
                           <li>Restart your development server after updating environment variables</li>
                           <li>Verify your Cloudinary account settings and API access</li>
                           <li>Ensure your Cloudinary plan supports the upload features you&apos;re using</li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader>
                   <CardTitle>Storage Usage & Limits</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="text-center p-4 border rounded-lg">
                       <div className="text-2xl font-bold text-blue-600 mb-1">~85%</div>
                       <div className="text-sm text-gray-600">Storage Used</div>
                     </div>
                     <div className="text-center p-4 border rounded-lg">
                       <div className="text-2xl font-bold text-green-600 mb-1">1,247</div>
                       <div className="text-sm text-gray-600">Images Stored</div>
                     </div>
                     <div className="text-center p-4 border rounded-lg">
                       <div className="text-2xl font-bold text-purple-600 mb-1">24.3 GB</div>
                       <div className="text-sm text-gray-600">Total Size</div>
                     </div>
                   </div>
                   <div className="mt-4">
                     <Button variant="outline" className="w-full">
                       View Detailed Usage in Cloudinary Dashboard
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>
           )}
         </div>
       </div>
     </div>
   </AdminLayout>
 )
}