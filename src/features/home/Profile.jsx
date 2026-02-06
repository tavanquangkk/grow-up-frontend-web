import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/workshop';
import { MdPerson, MdBusiness, MdAssignmentInd, MdDescription } from 'react-icons/md';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) return <div>読み込みエラー</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between">
            {/* Avatar */}
            <div className="-mt-16 border-4 border-white rounded-2xl overflow-hidden w-32 h-32 bg-gray-200">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <MdPerson className="text-6xl" />
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <button className="px-6 py-2 border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-colors">
                プロフィールを編集
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 font-medium">@{profile.email.split('@')[0]}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <MdBusiness className="text-2xl text-orange-500 mr-4 mt-1" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">所属部署</p>
                <p className="text-gray-800 font-semibold">{profile.department || '未設定'}</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-gray-50 rounded-xl">
              <MdAssignmentInd className="text-2xl text-orange-500 mr-4 mt-1" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">役職</p>
                <p className="text-gray-800 font-semibold">{profile.position || '未設定'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-2">
              <MdDescription className="text-xl text-orange-500 mr-2" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">自己紹介</p>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {profile.introduction || '自己紹介はまだありません。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
