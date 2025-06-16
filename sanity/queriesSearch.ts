import { client } from "./lib/client";

// Función para buscar productos - versión corregida
export async function searchProducts(query: string) {
  const searchQuery = `
    *[_type == "product" && (
      name match $searchTerm ||
      description match $searchTerm
    )] | order(_score desc, name asc) [0...20] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description
    }
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Versión alternativa si las categorías son referencias
export async function searchProductsWithCategories(query: string) {
  const searchQuery = `
    *[_type == "product" && (
      name match $searchTerm ||
      description match $searchTerm
    )] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      "categories": categories[]->name,
      images,
      description
    } | order(_score desc, name asc) [0...20]
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Función más simple para empezar
export async function searchProductsSimple(query: string) {
  const searchQuery = `
    *[_type == "product" && name match $searchTerm] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description
    } [0...20]
  `;

  try {
    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
    });
    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category: string) {
  const query = `
    *[_type == "product" && $category in categories] {
      _id,
      name,
      slug,
      price,
      discount,
      stock,
      status,
      categories,
      images,
      description
    }
  `;

  try {
    const results = await client.fetch(query, {
      category: category,
    });
    return results;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}
