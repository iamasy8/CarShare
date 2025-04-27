"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Loader2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RegisterForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("client")
  const [formError, setFormError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  
  const { register, loading, error, clearError } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validation
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("First name and last name are required")
      return
    }
    
    if (!email.trim()) {
      setFormError("Email is required")
      return
    }
    
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long")
      return
    }
    
    if (password !== confirmPassword) {
      setFormError("Passwords do not match")
      return
    }
    
    try {
      const success = await register({
        firstName,
        lastName,
        email,
        password,
        userType
      }, userType as any)
      
      if (success) {
        setRegistrationSuccess(true)
        // Redirect after a short delay to allow user to see success message
        setTimeout(() => {
          if (userType === "owner") {
            router.push("/welcome") // Owners go to subscription selection
          } else {
            router.push("/dashboard") // Clients go directly to dashboard
          }
        }, 1500)
      }
    } catch (error) {
      // Error is handled in the auth context
      console.error("Registration failed:", error)
    }
  }

  const handleInputChange = () => {
    if (formError) setFormError("")
    if (error) clearError()
  }

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {registrationSuccess && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>
            Registration successful! You will be redirected shortly...
          </AlertDescription>
        </Alert>
      )}
      
      {(error || formError) && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error || formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                handleInputChange()
              }}
              required
              className="w-full"
              placeholder="Enter your first name"
              disabled={loading.register || registrationSuccess}
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                handleInputChange()
              }}
              required
              className="w-full"
              placeholder="Enter your last name"
              disabled={loading.register || registrationSuccess}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                handleInputChange()
              }}
              required
              className="w-full"
              placeholder="Enter your email"
              disabled={loading.register || registrationSuccess}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                handleInputChange()
              }}
              required
              className="w-full"
              placeholder="Create a password (min. 8 characters)"
              disabled={loading.register || registrationSuccess}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                handleInputChange()
              }}
              required
              className="w-full"
              placeholder="Confirm your password"
              disabled={loading.register || registrationSuccess}
            />
          </div>
          
          <div>
            <label htmlFor="userType" className="block text-sm font-medium mb-1">
              Account Type
            </label>
            <Select
              value={userType}
              onValueChange={(value) => {
                setUserType(value)
                handleInputChange()
              }}
              disabled={loading.register || registrationSuccess}
            >
              <SelectTrigger id="userType">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="owner">Car Owner</SelectItem>
              </SelectContent>
            </Select>
            
            {userType === "owner" && (
              <div className="mt-2 flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Car owners will need to complete identity verification and select a subscription plan after registration.
                </span>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading.register || registrationSuccess}
          >
            {loading.register ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 