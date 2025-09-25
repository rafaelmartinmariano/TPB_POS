import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ProductList from "./ProductList";

type Category = {
  id: number;
  name: string;
};

const CategoriesWithProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categories_url = "http://192.168.0.17/api/categories";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(categories_url);
        const json = await res.json();
        setCategories(json.data);

        // Auto-select first category
        if (json.data.length > 0) {
          setSelectedCategory(json.data[0].id);
          fetchProducts(json.data[0].id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products of selected category
  const fetchProducts = async (categoryId: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        categories_url + `/${categoryId}/products`
      );
      const json = await res.json();
      setProducts(json.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-gray-50">
      {/* Categories Navigation (Horizontal) */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.id);
              fetchProducts(item.id);
            }}
            className={`px-4 py-2 mr-2 rounded-full ${selectedCategory === item.id ? "bg-blue-500" : "bg-gray-200"
              }`}
          >
            <Text
              className={`${selectedCategory === item.id ? "text-white" : "text-gray-800"
                } font-medium`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-5" />
      ) : (
        <ProductList products={products} />
      )}
    </View>
  );
};

export default CategoriesWithProducts;