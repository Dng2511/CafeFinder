import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, MapPin, Clock, Phone, Wifi, Car, Wind, ThumbsUp, MessageSquare, Share2, Navigation, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addFavorite } from "@/services/Api";

const CafeDetail = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("drink");
  const [menuSearch, setMenuSearch] = useState("");
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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchCafeDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cafes/${id}`);
        const data = await response.json();
        if (data.status === "success") {
          setCafe(data.data);
        }

        const reviewsResponse = await fetch(`http://localhost:3000/reviews/${id}`);
        const reviewsData = await reviewsResponse.json();
        if (reviewsData.code === 200) {
          const mappedReviews = reviewsData.data.map((r) => ({
            id: r.id,
            user: r.user ? r.user.username : (r.guest_name || "Guest"),
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }));
          setReviews(mappedReviews);
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
      date: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setReviews([newReview, ...reviews]);
    setNewComment("");
  };

  const handleFavorite = () => {
    // お気に入り追加のロジックをここに実装
    console.log(`Cafe ${id} added to favorites`);
    const userId = 2; 
    addFavorite({ user_id: userId, cafe_id: id })
      .then((response) => {
        console.log("Added to favorites:", response.data);
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });

  }

  const handleSubmitReview = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 2,
          cafe_id: id,
          rating: reviewRating,
          comment: reviewComment,
          guest_name: "Guest User",
        }),
      });

      if (response.ok) {
        
        
        const data = await response.json();
        console.log(data);
        const newReview = {
          id: data.data.id,
          user: "Guest User",
          rating: data.data.rating,
          comment: data.data.comment,
          date: new Date().toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
        setReviews([newReview, ...reviews]);
        setIsReviewModalOpen(false);
        setReviewComment("");
        setReviewRating(5);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (!cafe) return <div className="p-8 text-center">カフェが見つかりません</div>;

  const filteredMenu = cafe.menu?.filter(item => 
    item.item_name.toLowerCase().includes(menuSearch.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">{cafe.name}</h1>
        <p className="text-gray-500 text-sm mb-3">ブルーボトル風・自家焙煎／静かな作業席／無料Wi-Fi</p>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-medium">{cafe?.rating ?? 0}</span>
            <span className="text-gray-400 ml-1">({cafe?.rating_count ?? 0}件のレビュー)</span>
          </div>
          <div className="flex gap-2">
            {cafe.amenities?.has_wifi && <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200"><Wifi className="w-3 h-3 mr-1"/> 無料Wi-Fi</Badge>}
            {cafe.amenities?.has_parking && <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200"><Car className="w-3 h-3 mr-1"/> 駐車場</Badge>}
            {cafe.amenities?.has_air_conditioning && <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200"><Wind className="w-3 h-3 mr-1"/> 冷暖房</Badge>}
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">テイクアウト</Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="gap-2 rounded-full px-6 text-white" onClick={() => handleFavorite()}>
            お気に入りに追加
          </Button>
          <Button variant="outline" className="gap-2 rounded-full">
            <Share2 className="w-4 h-4" /> 共有
          </Button>
          <Button variant="outline" className="gap-2 rounded-full">
            <Phone className="w-4 h-4" /> 電話
          </Button>
          <Button variant="outline" className="gap-2 rounded-full">
            <Navigation className="w-4 h-4" /> 経路
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Menu Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-4">メニュー</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">メニュー検索</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="例）ラテ、モカ、ケーキ" 
                    className="pl-9 bg-gray-50 border-gray-200"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-32">
                <label className="text-xs text-gray-500 mb-1 block">温度</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>指定なし</option>
                  <option>ホット</option>
                  <option>アイス</option>
                </select>
              </div>
              <div className="w-full md:w-32">
                <label className="text-xs text-gray-500 mb-1 block">並び替え</label>
                <select className="w-full h-10 px-3 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>人気順</option>
                  <option>価格が安い順</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
              {['drink', 'food', 'dessert'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? "bg-primary text-white" 
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {tab === 'drink' ? 'ドリンク' : tab === 'food' ? 'フード' : 'デザート'}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={item.image || "https://placehold.co/150x150?text=Menu"} 
                      alt={item.item_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900">{item.item_name}</h3>
                        <span className="font-bold text-gray-900">¥{parseInt(item.price).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">ホット</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">アイス</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>おすすめ度：</span>
                        <div className="flex text-yellow-400">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 text-gray-200" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" className="h-8 text-xs">
                        注文へ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMenu.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  メニューが見つかりません
                </div>
              )}
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
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
                    src={img.image_url || "https://placehold.co/300x300?text=Image"} 
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

          {/* Menu */}
          <section>
            <h2 className="text-xl font-bold mb-4">メニュー</h2>
            {cafe.menu && cafe.menu.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cafe.menu.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.image || "https://placehold.co/200x200?text=Menu"}
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm">{item.item_name}</h4>
                            <span className="text-sm font-medium">¥{item.price}</span>
                          </div>
                          <div className="flex items-center text-xs mt-2">
                            <div className="flex text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < (item.rating || 0) ? "fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-gray-500">({item.rating_count || 0}件)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600">メニュー情報はありません</div>
            )}
          </section>

          {/* Reviews */}
          <section className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">レビュー</h2>
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white">レビューを投稿</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>レビューを投稿</DialogTitle>
                    <DialogDescription>
                      投稿内容は他のユーザーと共有されます。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cafe-name">店舗名</Label>
                      <Input id="cafe-name" value={cafe.name} disabled />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rating">評価</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="comment">コメント</Label>
                      <Textarea
                        id="comment"
                        placeholder="雰囲気が落ち着いていて作業しやすいです。"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                      店舗詳細へ戻る
                    </Button>
                    <Button onClick={handleSubmitReview} className="text-white">投稿</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Review List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600">{review.user[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{review.user}</h4>
                          <div className="flex text-yellow-400 text-xs mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">店舗情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-4">
                <span className="text-gray-500 w-16 shrink-0">住所</span>
                <p className="text-gray-900">{cafe.address}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-16 shrink-0">営業時間</span>
                <div>
                  <p className="text-gray-900">
                    {cafe.opening_hours?.open_time?.slice(0, 5)} - {cafe.opening_hours?.close_time?.slice(0, 5)}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">(年中無休)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-16 shrink-0">電話</span>
                <p className="text-gray-900">{cafe.phone_number || "03-1234-5678"}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-16 shrink-0">支払い</span>
                <p className="text-gray-900">現金 / クレカ / QR</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-500 w-16 shrink-0">席数</span>
                <p className="text-gray-900">48席 (カウンター8 / テーブル40)</p>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">アクセス</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-4">
                地図 (ダミー)
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full text-xs h-9 bg-white hover:bg-gray-50">Googleマップを開く</Button>
                <Button variant="outline" className="w-full text-xs h-9 bg-white hover:bg-gray-50">住所をコピー</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CafeDetail;
