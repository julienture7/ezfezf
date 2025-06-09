'use client'

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // For Gender
import { toast } from 'react-hot-toast'
import { Loader2, UserCircle } from 'lucide-react'
import Image from 'next/image'

// Based on what getUserProfile returns and UserProfileUpdateData expects
interface ProfileData {
  id?: string;
  email?: string;
  name?: string | null; // username, typically not editable here
  fullName?: string | null;
  image?: string | null;
  dateOfBirth?: string | null; // ISO string from API (e.g., "2023-10-25T00:00:00.000Z")
  gender?: string | null; // Prisma Gender enum (MALE, FEMALE, OTHER, PREFER_NOT_SAY)
  phone?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  role?: string;
}

const initialProfileData: ProfileData = {
  email: '',
  fullName: '',
  image: null,
  dateOfBirth: null,
  gender: null,
  phone: '',
  address: '',
  emergencyContact: '',
};

// Form data can be a subset or slightly different structure if needed for form inputs
type FormData = Omit<ProfileData, 'id' | 'email' | 'name' | 'image' | 'role' | 'createdAt' | 'updatedAt'>;


export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [formData, setFormData] = useState<FormData>(initialProfileData);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial fetch
  const [isUpdating, setIsUpdating] = useState(false); // For update operation
  const [error, setError] = useState<string | null>(null);
  // Success message state removed, relying on toast for transient messages

  // Helper to format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (isoDate?: string | null) => {
    if (!isoDate) return '';
    try {
      return new Date(isoDate).toISOString().split('T')[0];
    } catch (e) {
      return ''; // Invalid date string
    }
  };

  // Helper to format date for sending to API (ensure it's just date part if time is not relevant)
  const formatDateForAPI = (dateStr?: string | null) => {
    if (!dateStr) return undefined; // Or null, depending on API expectation for clearing date
    // Assuming API expects ISO string or can handle YYYY-MM-DD for Date fields
    return new Date(dateStr).toISOString();
  };


  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch profile: ${response.statusText}`);
        }
        const data: ProfileData = await response.json();
        setProfileData(data);
        setFormData({
          fullName: data.fullName || '',
          dateOfBirth: formatDateForInput(data.dateOfBirth), // Format for input
          gender: data.gender || undefined,
          phone: data.phone || '',
          address: data.address || '',
          emergencyContact: data.emergencyContact || '',
        });
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message || 'Could not load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    // Clear previous success message by not setting one here, toast will handle it

    const payload: UserProfileUpdateData = {
      fullName: formData.fullName || undefined,
      // Send date as ISO string or YYYY-MM-DD if API handles it.
      // The lib/api/user.ts expects a string that can be parsed by new Date().
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : undefined,
      gender: formData.gender || undefined,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      emergencyContact: formData.emergencyContact || undefined,
    };

    // Filter out undefined values to only send updated fields
    Object.keys(payload).forEach(key => {
        if (payload[key as keyof UserProfileUpdateData] === undefined) {
            delete payload[key as keyof UserProfileUpdateData];
        }
    });


    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile.');
      }

      const updatedProfile: ProfileData = await response.json();
      setProfileData(updatedProfile);
      setFormData({ // Re-initialize form with potentially updated and re-formatted data
        fullName: updatedProfile.fullName || '',
        dateOfBirth: formatDateForInput(updatedProfile.dateOfBirth),
        gender: updatedProfile.gender || undefined,
        phone: updatedProfile.phone || '',
        address: updatedProfile.address || '',
        emergencyContact: updatedProfile.emergencyContact || '',
      });
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Could not update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your personal information and profile settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            {profileData.image ? (
              <Image
                src={profileData.image}
                alt={profileData.fullName || profileData.name || 'User Avatar'}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <UserCircle className="h-20 w-20 text-gray-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold">{profileData.fullName || profileData.name || 'User'}</h2>
              <p className="text-sm text-gray-500">{profileData.email}</p>
              <p className="text-xs text-gray-400">Role: {profileData.role}</p>
            </div>
          </div>
           {/* Avatar Upload Placeholder - to be implemented later */}
           <div className="mt-2">
             <Label htmlFor="avatar-upload" className="text-sm text-blue-600 hover:underline cursor-pointer">
               Change Avatar (Feature coming soon)
             </Label>
             <Input id="avatar-upload" type="file" className="hidden" disabled />
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ''}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (cannot be changed)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email || ''}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender || undefined}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREFER_NOT_SAY">Prefer not to say</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input // Or Textarea if address can be long/multiline
                  id="address"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  placeholder="Your address"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact || ''}
                  onChange={handleInputChange}
                  placeholder="Emergency contact person and number"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
