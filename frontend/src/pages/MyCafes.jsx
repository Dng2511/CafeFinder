import React, { useState, useEffect, use } from 'react';
import { Http } from '@/services/Http';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

const MyCafes = () => {
    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMyCafes = async () => {
            try {
                const response = await Http.get('/my-cafes');
                setCafes(response.data.data);
            } catch (error) {
                console.error("Error fetching my cafes:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMyCafes();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge variant="success">アクティブ</Badge>;
            case 'pending':
                return <Badge variant="warning">承認待ち</Badge>;
            case 'rejected':
                return <Badge variant="destructive">拒否されました</Badge>;
            default:
                return <Badge>不明</Badge>;
        }
    };
    if (loading) return <div className="text-center py-20"> ローディング中...</div>;
    return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">私のカフェ </h1>

        {cafes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">まだカフェを登録していません。</p>
            <Link to="/create-cafe">
              <Button>今すぐカフェを作成</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {cafes.map((cafe) => (
              <div key={cafe.id} className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-32 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {cafe.main_image && (
                     <img 
                       src={cafe.main_image.startsWith('http') ? cafe.main_image : `http://localhost:3000${cafe.main_image}`} 
                       alt={cafe.name} className="w-full h-full object-cover" 
                     />
                  )}
                </div>

                <div className="flex-1 w-full text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{cafe.name}</h3>
                    {getStatusBadge(cafe.status)}
                  </div>
                  <p className="text-gray-600 text-sm">{cafe.address}</p>
                  {cafe.status === 'rejected' && (
                    <p className="text-red-500 text-sm mt-1">拒否されました。情報を修正してください。</p>
                  )}
                  {cafe.status === 'pending' && (
                    <p className="text-yellow-600 text-sm mt-1">管理者の承認を待っています。</p>
                  )}
                </div>

                <div className="w-full md:w-auto">
                  <Link to={`/edit-cafe/${cafe.id}`}>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Edit size={16} />
                        修正
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCafes;