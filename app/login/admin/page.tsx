"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Loader2, KeyRound, UserCog } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [step, setStep] = useState<"credentials" | "twoFactor">("credentials")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [adminType, setAdminType] = useState<"admin" | "superadmin">("admin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (step === "credentials") {
      if (!email.trim() || !password) {
        setError("Email and password are required")
        return
      }
      
      // For demo, simulate 2FA step for superadmin only
      if (adminType === "superadmin" || email.includes("superadmin")) {
        setStep("twoFactor")
        return
      }
    } else if (step === "twoFactor") {
      if (!twoFactorCode.trim()) {
        setError("Two-factor code is required")
        return
      }
      
      // Validate 2FA code - demo only accepts "123456"
      if (twoFactorCode.trim() !== "123456") {
        setError("Invalid verification code")
        return
      }
    }
    
    setIsLoading(true)

    try {
      let loginEmail = email;
      
      // For demo purposes, if user selected superadmin but entered a generic admin email,
      // redirect them to the correct format
      if (adminType === "superadmin" && !email.includes("superadmin")) {
        loginEmail = "superadmin@carshare.com";
      }
      
      const user = await login(loginEmail, password)

      if (user.role !== "admin" && user.role !== "superadmin") {
        setError("This login is for administrators only.")
        setStep("credentials")
        return
      }
      
      // Log successful login for security auditing
      console.log(`Admin login: ${user.role} ${user.email} logged in at ${new Date().toISOString()}`)
      
      router.push("/admin")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Authentication failed")
      } else {
        setError("Authentication failed")
      }
      // Reset to credentials step on failure
      setStep("credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <ShieldCheck className="h-12 w-12 text-blue-500" />
          <h1 className="text-2xl font-bold text-white ml-3">Admin Access</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="admin" className="w-full mb-6" onValueChange={(value) => setAdminType(value as "admin" | "superadmin")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="flex items-center">
              <UserCog className="mr-2 h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="superadmin" className="flex items-center">
              <KeyRound className="mr-2 h-4 w-4" />
              Super Admin
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="admin" className="mt-4 text-center text-sm text-gray-400">
            Standard administrator access
          </TabsContent>
          <TabsContent value="superadmin" className="mt-4 text-center text-sm text-gray-400">
            Enhanced permissions with two-factor auth
          </TabsContent>
        </Tabs>

        {step === "credentials" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={adminType === "admin" ? "admin@carshare.com" : "superadmin@carshare.com"}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                adminType === "superadmin" ? "Continue to Verification" : "Admin Login"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-white mb-2">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Enter the 6-digit code from your authenticator app</p>
              <p className="text-xs text-gray-500 mt-1">(Use code 123456 for demo)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twoFactorCode" className="text-white">Verification Code</Label>
              <Input
                id="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                required
                className="bg-gray-700 border-gray-600 text-white text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                className="w-1/2 bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => setStep("credentials")}
                disabled={isLoading}
              >
                Back
              </Button>
              
              <Button 
                type="submit" 
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>This is a restricted area for administrators only.</p>
          <p>Unauthorized access attempts are logged and monitored.</p>
        </div>
      </div>
    </div>
  )
} 