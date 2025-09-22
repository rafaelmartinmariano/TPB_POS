import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

type Variant = {
  id: number;
  variant: string;
  size: string;
  price: string;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | null;
  has_variant: boolean;
  variants?: Variant[];
};

type ProductListProps = {
  products: Product[];
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8 }}>
        <View className="flex-row flex-wrap justify-between">
            {products.map((item) => (
            <View
                key={item.id}
                className="bg-white p-3 mb-3 rounded-lg shadow w-[23%] h-72"
            >
                {/* Product Image */}
                {item.image_url ? (
                <View className="h-32 w-full bg-gray-100 rounded-md mb-2 overflow-hidden">
                    <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-full rounded-md mb-2"
                        resizeMode="contain"
                    />
                </View>
                ) : null}

                {/* Product Name */}
                <Text className="text-base font-bold text-gray-800">{item.name}</Text>

                {/* Description */}
                {item.description && (
                <Text className="text-xs text-gray-500 mb-1">{item.description}</Text>
                )}

                {/* Price or Variants */}
                {item.has_variant && item.variants ? (
                    <View className="mt-1">
                        <Text className="text-xs font-semibold text-gray-600">Variants:</Text>
                        <View className="flex-row flex-wrap mt-1">
                            {item.variants.map((variant) => (
                                <View
                                key={variant.id}
                                className="bg-gray-100 rounded px-2 py-1 mr-2 mb-2"
                                >
                                    <Text className="text-gray-700 text-xs">
                                        {variant.variant} ({variant.size}) - ₱{parseInt(variant.price, 10)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : (
                    <Text className="text-gray-700 text-sm mt-1">₱{item.price}</Text>
                )}
            </View>
            ))}
        </View>
    </ScrollView>
  );
};

export default ProductList;