'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { CountryDropdown, type Country } from '@/components/ui/country-dropdown'
import { countries } from 'country-data-list'
import { BackgroundGradient } from './ui/shadcn-io/background-gradient'

const membershipSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  country: z.string().min(1, 'Please select a country'),
})

type MembershipFormData = z.infer<typeof membershipSchema>

export function MembershipForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
  })

  const selectedCountry = watch('country')

  const onSubmit = async (data: MembershipFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string }
        throw new Error(errorData.message || 'Failed to submit form')
      }

      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-3xl">
      <BackgroundGradient className="rounded-[22px] w-full sm:p-10 bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Join Hellenic Next</CardTitle>
          <CardDescription>
            Become part of our global community of Greek professionals. Fill out the form below to
            get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Hellenic Next!</h3>
              <p className="text-muted-foreground text-center mb-6">
                You&apos;ve been successfully added to our mailing list. Stay tuned for updates and events!
              </p>
              <Button onClick={() => setSubmitStatus('idle')}>Add Another Member</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitStatus === 'error' && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-destructive">Submission Failed</h4>
                    <p className="text-sm text-destructive/90 mt-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="John"
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Doe"
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john.doe@example.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">
                  I am based in... <span className="text-destructive">*</span>
                </Label>
                <CountryDropdown
                  placeholder="Select a country"
                  defaultValue={
                    selectedCountry
                      ? countries.all.find((c) => c.alpha2 === selectedCountry)?.alpha3
                      : undefined
                  }
                  onChange={(country: Country) =>
                    setValue('country', country.alpha2, { shouldValidate: true })
                  }
                />
                {errors.country && (
                  <p className="text-sm text-destructive">{errors.country.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </BackgroundGradient>
    </Card>
  )
}
