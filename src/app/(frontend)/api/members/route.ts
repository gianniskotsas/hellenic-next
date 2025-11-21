import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { countries } from 'country-data-list'

interface MemberRequestBody {
  firstName: string
  lastName: string
  email: string
  country: string
}

interface UseSendContactBody {
  email: string
  firstName: string
  lastName: string
  properties: {
    country: string
  }
  subscribed: boolean
}

async function addToUseSend(contactBookId: string, contactData: UseSendContactBody) {
  const response = await fetch(`https://app.usesend.com/api/v1/contactBooks/${contactBookId}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.USESEND_API_KEY}`,
    },
    body: JSON.stringify(contactData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`useSend API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MemberRequestBody
    const { firstName, lastName, email, country } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !country) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Check if email already exists
    const existingMember = await payload.find({
      collection: 'members',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existingMember.docs.length > 0) {
      return NextResponse.json(
        { message: 'A member with this email address already exists' },
        { status: 409 }
      )
    }

    // Create new member
    const member = await payload.create({
      collection: 'members',
      data: {
        firstName,
        lastName,
        email,
        country: country as any, // Country codes are validated by the select options
        status: 'pending' as const,
      },
    })

    // Get country name from alpha2 code
    const countryData = countries.all.find((c) => c.alpha2 === country)
    const countryName = countryData?.name || country

    // Prepare contact data for useSend
    const contactData: UseSendContactBody = {
      email,
      firstName,
      lastName,
      properties: {
        country: countryName,
      },
      subscribed: true,
    }

    // Add to useSend contact books
    try {
      console.log('Country value:', country)
      console.log('Is Netherlands?', country === 'NL')
      console.log('Has NL contact book?', !!process.env.USESEND_CONTACTS_NL)

      // Always add to global contact book
      if (process.env.USESEND_CONTACTS_GLOBAL) {
        console.log('Adding to global contact book:', process.env.USESEND_CONTACTS_GLOBAL)
        await addToUseSend(process.env.USESEND_CONTACTS_GLOBAL, contactData)
        console.log('Successfully added to global contact book')
      }

      // If Netherlands, also add to NL contact book
      if (country === 'NL' && process.env.USESEND_CONTACTS_NL) {
        console.log('Adding to NL contact book:', process.env.USESEND_CONTACTS_NL)
        await addToUseSend(process.env.USESEND_CONTACTS_NL, contactData)
        console.log('Successfully added to NL contact book')
      } else if (country === 'NL') {
        console.log('Netherlands selected but USESEND_CONTACTS_NL is not set')
      }
    } catch (useSendError) {
      // Log the error but don't fail the request since member was created successfully
      console.error('Error adding contact to useSend:', useSendError)
    }

    return NextResponse.json(
      {
        message: 'Membership application submitted successfully',
        member: {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { message: 'An error occurred while processing your application' },
      { status: 500 }
    )
  }
}
