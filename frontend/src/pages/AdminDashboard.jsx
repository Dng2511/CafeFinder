import React, { useState, useEffect } from 'react';
import Http from '@/services/Http'; // Import Http service (đã fix ở bước trước)
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [cafes, setCafes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try{
      setLoading(true);
      const response = await Http.get('/admin/requests?status=pending');
      setRequests(response.data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  const handleProcess = async (id , action) => {
    if(!window.confirm(`本当にこのリクエストを${action === 'approve' ? '承認' : '拒否'}しますか？`)) {
      return;
    }
    try{
      await Http.post(`/admin/requests/${id}`, { action });
      setRequests(requests.filter(req => req.id !== id));
      alert(`リクエストが${action === 'approve' ? '承認' : '拒否'}されました。`); 
    }
    catch (error) {
      console.error(`Error processing request:`, error);
      alert("エラーが発生しました: " + (error.response?.data?.message || error.message));
    }
  };
  if (loading) return <div className="text-center py-20"> ローディング中...</div>;
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              管理者ダッシュボード
            </h1>
            <p className="text-gray-600">
              ようこそ、{user?.username}さん
            </p>
          </div>
          <Button onClick={fetchRequests} variant="outline" className="text-sm">
            更新
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">承認待ち</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{requests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            承認待ちカフェ
            {loading && <span className="text-sm font-normal text-gray-500">(ローディング中...)</span>}
          </h2>

          {loading ? (
             <div className="text-center py-10">ローディング中...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>現在、承認待ちのリクエストはありません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {requests.map((req) => (
                <div key={req.id} className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-lg transition-shadow bg-gray-50">
                  
                  <div className="w-full md:w-48 h-32 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {req.main_image ? (
                        <img 
                        src={req.main_image.startsWith('http') ? req.main_image : `http://localhost:3000${req.main_image}`} 
                        alt={req.name} 
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-800">{req.name}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            承認待ている
                        </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mt-1"> 住所： {req.address}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-2">
                        <span>{req.open_time?.slice(0,5)} - {req.close_time?.slice(0,5)}</span>
                        <span>{req.phone_number || 'N/A'}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {req.has_wifi && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Wifi</span>}
                        {req.has_parking && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Parking</span>}
                        {req.has_air_conditioning && <span className="text-xs bg-gray-200 px-2 py-1 rounded">A/C</span>}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                    <Button 
                      onClick={() => handleProcess(req.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white w-full"
                    >
                      承認
                    </Button>
                    <Button 
                      onClick={() => handleProcess(req.id, 'reject')}
                      variant="destructive"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      拒否
                    </Button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;