import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Adjust path if necessary
import {
  updateUserProfile,
  getUserProfile,
  type UserProfileUpdateData
} from '@/lib/api/user'; // Adjust path if necessary

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await getUserProfile(session.user.id);

    if (!userProfile) {
      // This should ideally not happen if a session exists, implies data inconsistency
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    if (errorMessage.includes('User not found')) { // From getUserProfile lib function
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to fetch user profile', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as UserProfileUpdateData;

    // Basic validation: Ensure at least one field is being updated
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    // Further specific validations can be added here for each field in body
    // For example, checking phone number format, gender enum values, etc.
    // The library function updateUserProfile already handles dateOfBirth format
    // and will throw an error for invalid dates.

    const updatedUserProfile = await updateUserProfile(session.user.id, body);

    return NextResponse.json(updatedUserProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    if (errorMessage.includes('Invalid dateOfBirth format')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    if (errorMessage.includes('User not found, cannot update profile')) { // From updateUserProfile lib
        return NextResponse.json({ error: "User not found, cannot update profile" }, { status: 404 });
    }
    // Other errors from the lib function (e.g. general "Failed to update") will be caught as general 500
    return NextResponse.json({ error: 'Failed to update user profile', details: errorMessage }, { status: 500 });
  }
}
