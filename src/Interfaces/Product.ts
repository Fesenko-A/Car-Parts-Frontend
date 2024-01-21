import Brand from "./Brand";
import Category from "./Category";
import SpecialTag from "./SpecialTag";

export default interface Product {
  id: number;
  brandId: number;
  brand: Brand;
  name: string;
  description: string;
  specialTagId: number;
  specialTag: SpecialTag;
  categoryId: number;
  category: Category;
  price: number;
  imageUrl: string;
}
