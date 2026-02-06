import React, { useEffect, useState } from 'react';
import { getMyWorkshops } from '../../api/workshop';
import { MdEdit, MdDelete, MdEvent } from 'react-icons/md';

const MyWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyWorkshops = async () => {
      try {
        const data = await getMyWorkshops();
        setWorkshops(data);
      } catch (err) {
        setError('自分の勉強会の取得に失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyWorkshops();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">自分の勉強会</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">勉強会名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開催日時</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workshops.map((workshop) => (
              <tr key={workshop.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workshop.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <MdEvent className="mr-1 text-orange-500" />
                    {new Date(workshop.date).toLocaleString('ja-JP')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    <MdEdit className="inline text-xl" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <MdDelete className="inline text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {workshops.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">企画・参加している勉強会はありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkshops;
