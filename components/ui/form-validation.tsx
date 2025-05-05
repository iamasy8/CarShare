"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { ErrorMessage, securityUtils, validationSchemas } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface FormValidationProps {
  schema: z.ZodSchema<any>
  onSubmit: (data: any) => void
  children: React.ReactNode
  className?: string
}

export function FormValidation({
  schema,
  onSubmit,
  children,
  className,
}: FormValidationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {
    setCsrfToken(securityUtils.generateCSRFToken())
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}

    formData.forEach((value, key) => {
      data[key] = securityUtils.sanitizeInput(value.toString())
    })

    try {
      const validatedData = schema.parse(data)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        ErrorMessage.show("Une erreur est survenue. Veuillez réessayer.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("space-y-4", className)}
      noValidate
      aria-label="Formulaire"
    >
      <input type="hidden" name="csrf_token" value={csrfToken} />
      {children}
      {Object.entries(errors).map(([field, message]) => (
        <div
          key={field}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {message}
        </div>
      ))}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  )
}

// Example usage:
/*
<FormValidation
  schema={z.object({
    email: validationSchemas.email,
    password: validationSchemas.password,
  })}
  onSubmit={async (data) => {
    // Handle form submission
  }}
>
  <input type="email" name="email" required />
  <input type="password" name="password" required />
</FormValidation>
*/ 