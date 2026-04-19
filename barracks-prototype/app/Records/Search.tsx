"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";

type SortOption = {
  value: string;
  label: string;
};

type SearchFilterProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: string;
  onCategoryChange?: (value: string) => void;
  categoryOptions?: string[];
  categoryLabel?: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  disabled?: boolean;
  disabledMessage?: string;
};

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  categoryFilter,
  onCategoryChange,
  categoryOptions = [],
  categoryLabel = "Filter",
  sortBy,
  onSortChange,
  sortOptions,
  disabled = false,
  disabledMessage = "Nothing to search",
}: SearchFilterProps) {
  const hasCategories = categoryOptions.length > 0 && onCategoryChange;

  return (
    <div className={`flex flex-row items-center gap-2 ${disabled ? "group relative" : ""}`}>
      <div className="flex flex-row items-center gap-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            disabled={disabled}
            className={`
              pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition
              ${disabled
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white focus:ring-2 focus:ring-emerald-400"
              }
            `}
          />
        </div>

        {hasCategories && !disabled && (
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-gray-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? `${categoryLabel}: All` : `${categoryLabel}: ${option}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {!disabled && (
          <div className="relative">
            <ArrowUpDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg bg-gray-700 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {disabled && (
        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-gray-800 text-gray-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-600">
          {disabledMessage}
        </div>
      )}
    </div>
  );
}
