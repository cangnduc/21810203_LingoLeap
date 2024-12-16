import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaTrophy,
  FaBookOpen,
  FaGraduationCap,
  FaChartLine,
  FaGlobe,
  FaUserCircle,
} from "react-icons/fa";

const UserProfileDetails = ({ userProfile }) => {
  // Early return if userProfile is not available
  if (!userProfile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FaUserCircle className="w-5 h-5" />
            Profile data not available
          </p>
        </div>
      </div>
    );
  }

  // Helper function to check if a section has data
  const hasSectionData = (data) => {
    if (Array.isArray(data)) {
      return data && data.length > 0;
    }
    return data && Object.keys(data).length > 0;
  };

  // Helper function to render social links if they exist
  const renderSocialLinks = () => {
    if (!userProfile.socialLinks) return null;

    return (
      <div className="flex items-center gap-4">
        {userProfile.socialLinks.twitter && (
          <a
            href={userProfile.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <FaTwitter className="text-blue-400 text-xl hover:text-blue-500 transition-colors" />
          </a>
        )}
        {userProfile.socialLinks.linkedin && (
          <a
            href={userProfile.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <FaLinkedin className="text-blue-600 text-xl hover:text-blue-700 transition-colors" />
          </a>
        )}
        {userProfile.socialLinks.github && (
          <a
            href={userProfile.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <FaGithub className="text-gray-800 dark:text-white text-xl hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <FaUserCircle />
          Extended Profile
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Bio and Website Section */}
        <div className="space-y-4">
          {userProfile.bio && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                {userProfile.bio}
              </p>
            </div>
          )}

          {userProfile.website && (
            <div className="flex items-center gap-2">
              <FaGlobe className="text-blue-500" />
              <a
                href={userProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {userProfile.website}
              </a>
            </div>
          )}

          {renderSocialLinks()}
        </div>

        {/* Achievements Section */}
        {hasSectionData(userProfile.achievements) && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaTrophy className="text-yellow-500" />
              Achievements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Goals Section */}
        {hasSectionData(userProfile.learningGoals) && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaBookOpen className="text-green-500" />
              Learning Goals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.learningGoals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <p className="text-gray-600 dark:text-gray-300">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Exams Section */}
        {hasSectionData(userProfile.targetExams) && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaGraduationCap className="text-blue-500" />
              Target Exams
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.targetExams.map((exam, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                >
                  <p className="text-gray-600 dark:text-gray-300">{exam}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracking Section */}
        {hasSectionData(userProfile.progressTracking) && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaChartLine className="text-indigo-500" />
              Progress Tracking
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(userProfile.progressTracking).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {value}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!hasSectionData(userProfile.achievements) &&
          !hasSectionData(userProfile.learningGoals) &&
          !hasSectionData(userProfile.targetExams) &&
          !hasSectionData(userProfile.progressTracking) && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No additional profile data available
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default UserProfileDetails;
