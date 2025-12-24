import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Http } from '@/services/Http';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

const EditCafe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [position, setPosition] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone_number: '',
        open_time: '',
        close_time: '',
        has_wifi: false, has_parking: false, has_air_conditioning: false,
        has_power_outlet: false, is_quiet: false, no_smoking: false,
    });
    const [images, setImages] = useState(null);

    useEffect(() => {
        const fetchCafe = async () => {
            try {
                const response = await Http.get(`/cafes/${id}`);
                const data = response.data.data;
                setFormData({
                    name: data.name,
                    address: data.address,
                    phone_number: data.phone_number || '',
                    
                    // Dùng Optional Chaining (?.) và logic OR (||) để hỗ trợ cả 2 cấu trúc
                    open_time: data.opening_hours?.open_time || data.open_time || '',
                    close_time: data.opening_hours?.close_time || data.close_time || '',
                    
                    // Tương tự với Amenities (có thể nằm trong object amenities hoặc nằm ngoài)
                    has_wifi: data.amenities?.has_wifi || data.has_wifi || false,
                    has_parking: data.amenities?.has_parking || data.has_parking || false,
                    has_air_conditioning: data.amenities?.has_air_conditioning || data.has_air_conditioning || false,
                    
                    // Các trường này thường nằm ngoài (phẳng)
                    has_power_outlet: data.has_power_outlet || false, 
                    is_quiet: data.is_quiet || false,
                    no_smoking: data.no_smoking || false,
                });
                if (data.lat && data.lon) {
                    setPosition({ lat: data.lat, lng: data.lon });
                }
                else{
                    setPosition({ lat: 21.0278, lng: 105.8342 }); 
                }
            } catch (error) {
                console.error("Error fetching cafe details:", error);
                alert("エラーが発生しました: " + (error.response?.data?.message || error.message));
            }
            finally {
                setLoading(false);
            }
        };
        fetchCafe();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            if (position) {
                data.append('lat', position.lat);
                data.append('lon', position.lng);
            }
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    data.append('images', images[i]);
                }
            }
            await Http.put(`/cafes/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("カフェ情報が更新されました。");
            navigate('/my-cafes');
        } catch (error) {
            console.error("Error updating cafe:", error);
            alert("エラーが発生しました: " + (error.response?.data?.message || error.message));
        }
        finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20"> ローディング中...</div>;
    return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">カフェ情報の編集</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label>カフェ名 (*)</Label>
                <Input name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <Label>住所 (*)</Label>
                <Input name="address" required value={formData.address} onChange={handleChange} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label>電話番号</Label>
                <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div>
                <Label>開店時間</Label>
                <Input type="time" name="open_time" value={formData.open_time} onChange={handleChange} />
            </div>
            <div>
                <Label>閉店時間</Label>
                <Input type="time" name="close_time" value={formData.close_time} onChange={handleChange} />
            </div>
        </div>

        <div className="border p-4 rounded-md">
            <Label className="mb-2 block text-lg">設備・サービス</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { key: 'has_wifi', label: '無料Wi-Fi' },
                    { key: 'has_parking', label: '駐車場' },
                    { key: 'has_air_conditioning', label: 'エアコン' },
                    { key: 'has_power_outlet', label: '電源あり' },
                    { key: 'is_quiet', label: '静か' },
                    { key: 'no_smoking', label: '禁煙' },
                ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" name={item.key} checked={formData[item.key]} onChange={handleChange} className="w-4 h-4" />
                        <span>{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

        <div>
            <Label>位置（必要に応じてクリックして更新）</Label>
            <div className="h-[300px] w-full mt-2 border rounded overflow-hidden relative z-0">
                {position && (
                    <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                )}
            </div>
        </div>

        <div>
          <Label>新しい画像をアップロード（古い画像を保持する場合はスキップ）</Label>
          <Input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
        </div>

        <div className="flex gap-4">
            <Button type="button" variant="secondary" className="w-1/3" onClick={() => navigate('/my-cafes')}>キャンセル</Button>
            <Button type="submit" className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
            {submitting ? "保存中..." : "変更を保存して承認をリクエスト"}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCafe;
