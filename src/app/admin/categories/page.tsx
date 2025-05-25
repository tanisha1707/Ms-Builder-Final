/* eslint-disable react-hooks/exhaustive-deps */
// src/app/admin/categories/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PropertyCategory {
  id: string
  name: string
  description: string
  icon: string
  count?: number
}

const defaultCategories: PropertyCategory[] = [
  {
    id: "residential",
    name: "Residential",
    description: "Family homes and residential properties",
    icon: "🏠"
  },
  {
    id: "commercial",
    name: "Commercial",
    description: "Business and commercial spaces",
    icon: "🏢"
  },
  {
    id: "apartment",
    name: "Apartment",
    description: "Modern apartments and condos",
    icon: "🏬"
  },
  {
    id: "villa",
    name: "Villa",
    description: "Luxury villas and estates",
    icon: "🏡"
  },
  {
    id: "office",
    name: "Office",
    description: "Professional office spaces",
    icon: "🏛️"
  }
]

export default function PropertyCategoriesPage() {
  const [categories, setCategories] = useState<PropertyCategory[]>(defaultCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "🏢"
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [propertyCounts, setPropertyCounts] = useState<Record<string, number>>({})

  const fetchPropertyCounts = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const counts: Record<string, number> = {}
      
      for (const category of categories) {
        const response = await fetch(`/api/properties?category=${category.name}&limit=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          counts[category.name] = data.pagination?.total || 0
        }
      }
      
      setPropertyCounts(counts)
    } catch (error) {
      console.error("Error fetching property counts:", error)
    }
  }

  useEffect(() => {
    fetchPropertyCounts()
  }, [fetchPropertyCounts])

  const handleEdit = (category: PropertyCategory) => {
    setEditingId(category.id)
  }

  const handleSave = (categoryId: string, updatedData: Partial<PropertyCategory>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, ...updatedData } : cat
    ))
    setEditingId(null)
  }

  const handleDelete = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    const count = propertyCounts[category?.name || ""] || 0
    
    if (count > 0) {
      alert(`Cannot delete category "${category?.name}" because it has ${count} properties. Please move or delete those properties first.`)
      return
    }
    
    if (confirm(`Are you sure you want to delete the "${category?.name}" category?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return
    
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-')
    const category: PropertyCategory = {
      id,
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon
    }
    
    setCategories(prev => [...prev, category])
    setNewCategory({ name: "", description: "", icon: "🏢" })
    setShowAddForm(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Property Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage property categories and their descriptions
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Add New Category Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Luxury Homes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <Input
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🏢"
                    className="text-center"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddCategory} disabled={!newCategory.name.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Category
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      {editingId === category.id ? (
                        <EditableField
                          value={category.name}
                          onSave={(value) => handleSave(category.id, { name: value })}
                          onCancel={() => setEditingId(null)}
                          className="font-semibold text-lg"
                        />
                      ) : (
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      disabled={editingId !== null}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      disabled={editingId !== null}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === category.id ? (
                  <EditableField
                    value={category.description}
                    onSave={(value) => handleSave(category.id, { description: value })}
                    onCancel={() => setEditingId(null)}
                    multiline
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Properties:</span>
                  <span className="font-semibold">
                    {propertyCounts[category.name] || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">About Property Categories</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Categories help organize and filter properties for better user experience</li>
              <li>• You cannot delete categories that have existing properties</li>
              <li>• Category names are used in property listings and filters</li>
              <li>• Icons are displayed in the category selection interface</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

// Editable Field Component
interface EditableFieldProps {
  value: string
  onSave: (value: string) => void
  onCancel: () => void
  multiline?: boolean
  className?: string
}

function EditableField({ value, onSave, onCancel, multiline, className }: EditableFieldProps) {
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    if (editValue.trim()) {
      onSave(editValue.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {multiline ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={className}
          rows={2}
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={className}
        />
      )}
      <Button size="sm" onClick={handleSave}>
        <Save className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="outline" onClick={onCancel}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}