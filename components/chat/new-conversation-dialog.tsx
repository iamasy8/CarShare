"use client"

import { useState, useEffect } from "react"
import { useMessages } from "@/components/providers/message-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2 } from "lucide-react"
import axios from "axios"
import { User } from "@/types/message"

interface NewConversationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewConversationDialog({ open, onOpenChange }: NewConversationDialogProps) {
  const { createConversation, selectConversation } = useMessages()
  const [isGroup, setIsGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load users for search
  useEffect(() => {
    if (open && searchQuery.length >= 2) {
      const fetchUsers = async () => {
        setIsLoading(true)
        try {
          // Get token from localStorage
          const token = localStorage.getItem('auth_token')
          
          const { data } = await axios.get(`/api/users/search?query=${searchQuery}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'x-auth-token': token || ''
            }
          })
          setAvailableUsers(data.users)
        } catch (error) {
          console.error("Error searching users:", error)
        } finally {
          setIsLoading(false)
        }
      }

      const timer = setTimeout(fetchUsers, 500)
      return () => clearTimeout(timer)
    } else if (searchQuery.length < 2) {
      setAvailableUsers([])
    }
  }, [searchQuery, open])

  const handleSelectUser = (user: User) => {
    // Don't add if already selected
    if (selectedUsers.some(u => u.id === user.id)) {
      return
    }
    
    setSelectedUsers([...selectedUsers, user])
    setSearchQuery("")
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId))
  }

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const userIds = selectedUsers.map(user => user.id)
      
      const conversation = await createConversation(
        userIds,
        isGroup,
        isGroup ? groupName : undefined
      )
      
      // Select the new conversation
      selectConversation(conversation.id)
      
      // Reset form
      setIsGroup(false)
      setGroupName("")
      setSelectedUsers([])
      setSearchQuery("")
      
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating conversation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when dialog closes
      setIsGroup(false)
      setGroupName("")
      setSelectedUsers([])
      setSearchQuery("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is-group" 
              checked={isGroup}
              onCheckedChange={(checked) => setIsGroup(checked as boolean)}
            />
            <Label htmlFor="is-group">Créer un groupe</Label>
          </div>
          
          {isGroup && (
            <div className="space-y-2">
              <Label htmlFor="group-name">Nom du groupe</Label>
              <Input
                id="group-name"
                placeholder="Entrez le nom du groupe"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Participants sélectionnés</Label>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun participant sélectionné</p>
              ) : (
                selectedUsers.map(user => (
                  <div 
                    key={user.id}
                    className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full py-1 pl-1 pr-2"
                  >
                    <Avatar className="h-6 w-6 mr-1">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm mr-1">{user.name}</span>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search-users">Rechercher des utilisateurs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search-users"
                placeholder="Rechercher par nom ou email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoading && (
              <div className="flex justify-center p-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              </div>
            )}
            
            {!isLoading && searchQuery.length >= 2 && availableUsers.length === 0 && (
              <p className="text-sm text-gray-500 p-2">Aucun utilisateur trouvé</p>
            )}
            
            {availableUsers.length > 0 && (
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {availableUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCreateConversation}
            disabled={selectedUsers.length === 0 || isSubmitting || (isGroup && !groupName)}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}