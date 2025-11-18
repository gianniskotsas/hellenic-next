import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface MemberRequestBody {
  firstName: string
  lastName: string
  email: string
  country: string
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
