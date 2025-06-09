import { prisma } from '@/lib/prisma';
import type { User, Gender } from '@prisma/client'; // Assuming Gender is an enum in your Prisma schema

export interface UserProfileUpdateData {
  fullName?: string;
  dateOfBirth?: string; // ISO date string e.g. "YYYY-MM-DD"
  gender?: Gender; // Use Prisma-generated Gender type if available
  phone?: string;
  address?: string; // Could be a JSON object or simple string depending on schema
  emergencyContact?: string; // Could be JSON for name/phone or simple string
  // Note: `name` (often username) and `image` are typically handled by NextAuth or a separate profile image upload logic.
  // `email` is also usually managed via account settings / NextAuth rather than a simple profile update.
}

// Get user profile details
export async function getUserProfile(userId: string): Promise<Partial<User> | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true, // Usually non-null for authenticated users
        name: true, // Often the username, can be null
        fullName: true,
        image: true, // Profile image URL
        dateOfBirth: true,
        gender: true,
        phone: true,
        address: true,
        emergencyContact: true,
        role: true,
        // Exclude sensitive fields like passwordHash even if they exist on the model
      },
    });

    if (!user) {
      // This case should be rare for an authenticated user fetching their own profile
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    if (error instanceof Error && error.message.includes('User not found')) {
        throw error;
    }
    throw new Error('Failed to fetch user profile');
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: UserProfileUpdateData): Promise<User> {
  try {
    const updatePayload: any = { ...data };

    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      // Basic validation for date, you might want more robust validation
      if (isNaN(dob.getTime())) {
        throw new Error('Invalid dateOfBirth format. Please use YYYY-MM-DD.');
      }
      updatePayload.dateOfBirth = dob;
    }

    // If address or emergencyContact are JSON fields in your Prisma schema,
    // ensure they are stringified if Prisma doesn't handle it automatically,
    // or parsed if you expect object input and need to store as JSON string.
    // For now, assuming they are simple string fields or Prisma handles JSON conversion.

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });
    return updatedUser;
  } catch (error: any) {
    console.error(`Error updating user profile for ${userId}:`, error);
    // Check for specific Prisma errors, e.g., P2025 (Record to update not found)
    if (error.code === 'P2025') {
        throw new Error('User not found, cannot update profile.');
    }
    if (error instanceof Error && error.message.includes('Invalid dateOfBirth')) {
        throw error;
    }
    throw new Error('Failed to update user profile');
  }
}
