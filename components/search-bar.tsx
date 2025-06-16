"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchProductsSimple } from "@/sanity/queries"; // Usar la versión simple primero
import type { Product } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const SearchBarcomp = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Función para realizar la búsqueda
  const performSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Usar la función simple primero
      const searchResults = await searchProductsSimple(searchQuery);
      setResults(searchResults || []);
    } catch (error) {
      console.error("Error searching products:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleProductClick = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/product/${slug}`);
  };

  const handleViewAllResults = () => {
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar el regalo perfecto.."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:border-transparent bg-white text-sm"
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-shop_light_green" />
              <span className="ml-2 text-sm text-gray-600">Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2">
                {results.slice(0, 5).map((product) => (
                  <button
                    key={product._id}
                    onClick={() =>
                      handleProductClick(product.slug?.current || "")
                    }
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    {product.images?.[0] && (
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={
                            urlFor(product.images[0]).url() ||
                            "/placeholder.svg"
                          }
                          alt={product.name || "Product"}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {Array.isArray(product.categories)
                          ? product.categories.join(", ")
                          : product.categories || "Sin categoría"}
                      </p>
                      <p className="text-sm font-semibold text-shop_dark_green">
                        ${product.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {results.length > 5 && (
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleViewAllResults}
                    className="w-full text-center py-2 text-sm text-shop_light_green hover:text-shop_dark_green font-medium"
                  >
                    Ver todos los resultados ({results.length})
                  </button>
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No se encontraron productos</p>
              <p className="text-xs text-gray-400">
                Intenta con otros términos
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBarcomp;
