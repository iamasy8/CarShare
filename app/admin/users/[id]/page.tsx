"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminService } from "@/lib/api/adminService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import type { User, UserRole } from "@/lib/auth-context"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { isAdmin, isSuperAdmin } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    name: string
    email: string
    role: UserRole
    isVerified: boolean
  }>({
    name: "",
    email: "",
    role: "client",
    isVerified: false
  })

  // Check admin permissions
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      router.push("/login")
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await adminService.getUsers(1, { search: params.id })
        const user = response.users.find(u => u.id === parseInt(params.id))
        if (!user) {
          setError("User not found")
          return
        }
        setUser(user)
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        })
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [isAdmin, isSuperAdmin, router, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError(null)

      await adminService.updateUser(parseInt(params.id), formData)
      router.push("/admin/users")
    } catch (err) {
      console.error("Error updating user:", err)
      setError("Failed to update user")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-red-600">{error}</div>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/users")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit User</CardTitle>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/users")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    {isSuperAdmin && (
                      <>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="verified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isVerified: checked }))
                  }
                />
                <Label htmlFor="verified">Verified User</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 