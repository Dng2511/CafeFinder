import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Http } from '../services/Http';
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

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const CreateCafe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Tọa độ mặc định (Ví dụ: Hà Nội). Bạn có thể dùng Geolocation để lấy vị trí hiện tại của user
  const [position, setPosition] = useState({ lat: 21.0285, lng: 105.8542 });
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
    open_time: '',
    close_time: '',
    has_wifi: false,
    has_parking: false,
    has_air_conditioning: false,
    has_power_outlet: false,
    is_quiet: false,
    no_smoking: false,
  });   
  const [images, setImages] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleFileChange = (e) => {
    setImages(e.target.files);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        data.append('lat', position.lat);
        data.append('lon', position.lng);
        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]);
            }
        }
        await Http.post('/requests', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('カフェの登録リクエストが正常に送信されました！');
        navigate('/');
    } catch (error) {
        console.error(error);
        alert("Error:" + error.response?.data?.message || error.message);
    } finally {
        setLoading(false);
    }
    };
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">新規カフェ登録</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        
        {/* === THÔNG TIN CƠ BẢN === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="name">カフェ名 (*)</Label>
                <Input id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="address">住所 (*)</Label>
                <Input id="address" name="address" required value={formData.address} onChange={handleChange} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <Label htmlFor="phone_number">電話番号</Label>
                <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="open_time">開店時間</Label>
                <Input type="time" id="open_time" name="open_time" value={formData.open_time} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="close_time">閉店時間</Label>
                <Input type="time" id="close_time" name="close_time" value={formData.close_time} onChange={handleChange} />
            </div>
        </div>

        {/* === TIỆN ÍCH (CHECKBOX) === */}
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
                    <label key={item.key} className="flex items-center space-x-2 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            name={item.key} 
                            checked={formData[item.key]} 
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span>{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* === BẢN ĐỒ CHỌN VỊ TRÍ === */}
        <div>
            <Label>地図上の位置（クリックして選択）</Label>
            <div className="h-[300px] w-full mt-2 border rounded overflow-hidden relative z-0">
                <MapContainer center={[21.0285, 105.8542]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            <p className="text-sm text-gray-500 mt-1">
                選択された座標: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </p>
        </div>

        {/* === UPLOAD ẢNH === */}
        <div>
          <Label htmlFor="images">画像</Label>
          <Input id="images" type="file" multiple accept="image/*" onChange={handleFileChange} />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
          {loading ? "送信中..." : "リクエストを送信"}
        </Button>
      </form>
    </div>
  );
};

export default CreateCafe;