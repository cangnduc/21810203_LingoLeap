import React, { useState } from "react";
import {
  useGetUserQuery,
  useGetUserProfileQuery,
  useUpdateUserMutation,
} from "@/app/services/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/validator/updateUserSchema.validator";
import UserProfileDetails from "./UserProfileDetails";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaGlobe,
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const UserDisplay = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { data: user, isLoading: userLoading } = useGetUserQuery();
  const { data: userProfile, isLoading: userProfileLoading } =
    useGetUserProfileQuery(undefined, { skip: !showProfile });
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      dateOfBirth: user?.dateOfBirth || "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        country: user?.address?.country,
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateUser(data).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user)
    return (
      <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">No user data available</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Basic User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <FaPencilAlt className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FaUser className="text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input {...register("firstName")} className="w-full" />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input {...register("lastName")} className="w-full" />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      {...register("phoneNumber")}
                      className="pl-10 w-full"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Street
                  </label>
                  <Input {...register("address.street")} className="w-full" />
                  {errors.address?.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.street.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <div className="relative">
                      <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        {...register("address.city")}
                        className="pl-10 w-full"
                      />
                    </div>
                    {errors.address?.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        {...register("address.country")}
                        className="pl-10 w-full"
                      />
                    </div>
                    {errors.address?.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.country.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                className="flex items-center justify-center gap-2"
              >
                <FaSave />
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold">{user.username}</h3>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                  <FaEnvelope className="text-blue-500" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-500 dark:text-gray-400">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      First Name
                    </p>
                    <p className="font-medium">{user.firstName || "Not set"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last Name
                    </p>
                    <p className="font-medium">{user.lastName || "Not set"}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium">
                      {user.phoneNumber || "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-500 dark:text-gray-400">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Street
                    </p>
                    <p className="font-medium">
                      {user.address?.street || "Not set"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      City
                    </p>
                    <p className="font-medium">
                      {user.address?.city || "Not set"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Country
                    </p>
                    <p className="font-medium">
                      {user.address?.country || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showProfile && (
          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              onClick={() => setShowProfile(true)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <FaChevronDown />
              Show Full Details
            </Button>
          </div>
        )}
      </div>

      {/* Full User Details */}
      {showProfile && !isEditing && (
        <>
          <Button
            onClick={() => setShowProfile(false)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <FaChevronUp />
            Hide Full Details
          </Button>
          <UserProfileDetails userProfile={userProfile} />
        </>
      )}
    </div>
  );
};

export default UserDisplay;
