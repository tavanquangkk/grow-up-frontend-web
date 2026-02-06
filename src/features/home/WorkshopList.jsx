import React, { useEffect, useState } from 'react';
import { 
  getUpComingWorkshops, 
  createWorkshop, 
  getRecommendedUsers, 
  followUser 
} from '../../api/workshop';
import { MdEvent, MdPerson, MdAccessTime, MdAdd, MdPersonAdd } from 'react-icons/md';
import WorkshopModal from './WorkshopModal';

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [workshopData, userData] = await Promise.all([
        getUpComingWorkshops(),
        getRecommendedUsers()
      ]);
      setWorkshops(workshopData);
      setRecommendedUsers(userData || []);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateWorkshop = async (data) => {
    try {
      await createWorkshop(data);
      setIsModalOpen(false);
      fetchData(); // リストを更新
    } catch (err) {
      alert('作成に失敗しました: ' + (err.message || 'エラー'));
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      // フォロー成功後、おすすめリストから消すか、状態を更新する
      setRecommendedUsers(recommendedUsers.filter(u => u.id !== userId));
    } catch (err) {
      alert('フォローに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content: Workshops */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">開催予定の勉強会</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center active:scale-95"
          >
            <MdAdd className="mr-1 text-xl" /> 勉強会を企画
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 group">
              <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:from-orange-500 group-hover:to-orange-600 transition-all"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors">{workshop.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">
                  {workshop.description || '説明はありません'}
                </p>
                
                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MdEvent className="mr-2 text-orange-400" />
                    {new Date(workshop.date).toLocaleDateString('ja-JP', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <MdAccessTime className="mr-2 text-orange-400" />
                    {new Date(workshop.date).toLocaleTimeString('ja-JP', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center">
                    <MdPerson className="mr-2 text-orange-400" />
                    主催: <span className="ml-1 font-medium text-gray-700">{workshop.hostName || '不明'}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 px-4 bg-orange-50 text-orange-600 rounded-xl font-bold hover:bg-orange-100 transition-colors border border-transparent hover:border-orange-200">
                  詳細を見る
                </button>
              </div>
            </div>
          ))}
        </div>

        {workshops.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">現在開催予定の勉強会はありません</p>
          </div>
        )}
      </div>

      {/* Sidebar: Recommended Users */}
      <div className="w-full lg:w-80 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <MdPersonAdd className="mr-2 text-orange-500" /> おすすめユーザー
        </h3>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
          {recommendedUsers.length > 0 ? recommendedUsers.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div className="flex items-center min-w-0">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.department || '所属未設定'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleFollow(user.id)}
                className="ml-2 p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-90"
              >
                <MdPersonAdd size={18} />
              </button>
            </div>
          )) : (
            <p className="text-sm text-gray-400 text-center py-4">おすすめのユーザーはいません</p>
          )}
        </div>
        
        {/* Quick Stats or Tips */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-lg">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">Growth Tip</p>
          <p className="text-sm leading-relaxed italic">
            "知識を共有することは、自分自身の理解を深める最も効果的な方法の一つです。"
          </p>
        </div>
      </div>

      <WorkshopModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateWorkshop} 
      />
    </div>
  );
};

export default WorkshopList;