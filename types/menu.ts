export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  is_available: boolean;
  created_at?: string;
  is_popular?: boolean;
}
