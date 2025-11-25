import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Clock, Phone, Wifi, Car, Wind, ThumbsUp, MessageSquare, Share2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const CafeDetail = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "mika",
      rating: 5,
      comment: "落ち着いた雰囲気で作業しやすい。ラテが最高！",
      date: "2023-10-15",
    },
    {
      id: 2,
      user: "tomo",
      rating: 4,
      comment: "朝は混むので早めが良いです。",
      date: "2023-10-12",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cafes/${id}`);
        const data = await response.json();
        if (data.status === "success") {
          setCafe(data.data);
        }
      } catch (error) {
        console.error("Error fetching cafe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafeDetail();
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newReview = {
      id: reviews.length + 1,
      user: "Guest User",
      rating: 5, // Default rating for now
      comment: newComment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([newReview, ...reviews]);
    setNewComment("");
  };

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!cafe) return <div className="p-8 text-center">カフェが見つかりません</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{cafe.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-medium">4.5</span>
            <span className="text-gray-400 ml-1">(120件のレビュー)</span>
          </div>
          <div className="flex gap-2">
            {cafe.amenities?.has_wifi && <Badge variant="secondary">無料Wi-Fi</Badge>}
            {cafe.amenities?.has_parking && <Badge variant="secondary">駐車場あり</Badge>}
            {cafe.amenities?.has_air_conditioning && <Badge variant="secondary">冷暖房完備</Badge>}
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <ThumbsUp className="w-4 h-4" /> お気に入りに追加
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> 共有
          </Button>
          <Button variant="outline" className="gap-2">
            <Phone className="w-4 h-4" /> 電話
          </Button>
          <Button variant="outline" className="gap-2">
            <Navigation className="w-4 h-4" /> 経路
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photos */}
          <section>
            <h2 className="text-xl font-bold mb-4">写真</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Main Image */}
              <div className="col-span-2 row-span-2 aspect-square rounded-lg overflow-hidden bg-gray-100">
                 <img 
                  src={cafe.images?.main_image || "https://placehold.co/600x400?text=No+Image"} 
                  alt={cafe.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Additional Images */}
              {cafe.images?.additional_images?.slice(0, 4).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={img.url || "https://placehold.co/300x300?text=Image"} 
                    alt={`Interior ${idx}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {/* Placeholder if no additional images */}
              {(!cafe.images?.additional_images || cafe.images.additional_images.length === 0) && (
                 <>
                    <div className="aspect-square rounded-lg bg-gray-200"></div>
                    <div className="aspect-square rounded-lg bg-gray-200"></div>
                    <div className="aspect-square rounded-lg bg-gray-200"></div>
                    <div className="aspect-square rounded-lg bg-gray-200"></div>
                 </>
              )}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-xl font-bold mb-4">レビュー</h2>
            
            {/* Add Comment */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea 
                      placeholder="このカフェの感想をシェアしましょう..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment}>レビューを投稿</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback>{review.user[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-sm">{review.user}</h4>
                            <div className="flex text-yellow-500 text-xs">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">店舗詳細</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="font-medium">住所</p>
                  <p className="text-gray-600">{cafe.address}</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="font-medium">営業時間</p>
                  <p className="text-gray-600">
                    {cafe.opening_hours?.open_time} - {cafe.opening_hours?.close_time}
                  </p>
                  <p className="text-xs text-green-600 mt-1">営業中</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="font-medium">電話番号</p>
                  <p className="text-gray-600">{cafe.phone_number || "03-1234-5678"}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="font-medium mb-2">設備</p>
                <div className="flex flex-wrap gap-2">
                  {cafe.amenities?.has_wifi && (
                    <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      <Wifi className="w-3 h-3" /> Wi-Fi
                    </div>
                  )}
                  {cafe.amenities?.has_parking && (
                    <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      <Car className="w-3 h-3" /> 駐車場
                    </div>
                  )}
                  {cafe.amenities?.has_air_conditioning && (
                    <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                      <Wind className="w-3 h-3" /> 冷暖房
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">アクセス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                地図 (ダミー)
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full text-xs">Googleマップを開く</Button>
                <Button variant="outline" className="w-full text-xs">住所をコピー</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
