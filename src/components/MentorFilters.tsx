import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface MentorFiltersProps {
  filters;
  onFiltersChange: (filters) => void;
  onSearch: (query: string) => void;
}

const popularExpertise = [
  "Computer Science", "Business", "Medicine", "Engineering", 
  "Data Science", "Marketing", "Design", "Finance"
];

export function MentorFilters({ filters, onFiltersChange, onSearch }: MentorFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleExpertiseFilter = (expertise: string) => {
    onFiltersChange({
      ...filters,
      expertise: filters.expertise === expertise ? undefined : expertise,
      page: 1
    });
  };

  const handleExperienceMinChange = (value: string) => {
    const min = parseInt(value, 10);
    onFiltersChange({
      ...filters,
      experience_min: min,
      experience_max: Math.max(min, filters.experience_max ?? 20),
      page: 1,
    });
  };

  const handleExperienceMaxChange = (value: string) => {
    const max = parseInt(value, 10);
    onFiltersChange({
      ...filters,
      experience_min: Math.min(filters.experience_min ?? 0, max),
      experience_max: max,
      page: 1,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    onFiltersChange({ page: 1 });
    onSearch("");
  };

  const activeFiltersCount = [
    filters.expertise,
    filters.experience_min !== undefined && filters.experience_min > 0,
    filters.experience_max !== undefined && filters.experience_max < 20
  ].filter(Boolean).length;

  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, expertise, or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Expertise Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Expertise Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {popularExpertise.map((expertise) => (
                <Badge
                  key={expertise}
                  variant={filters.expertise === expertise.toLowerCase() ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.expertise === expertise.toLowerCase()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "hover:bg-blue-50 hover:border-blue-300"
                  }`}
                  onClick={() => handleExpertiseFilter(expertise.toLowerCase())}
                >
                  {expertise}
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="min-exp" className="text-sm font-medium text-gray-700">
                Min Experience
              </label>
              <Select
                value={String(filters.experience_min ?? 0)}
                onValueChange={handleExperienceMinChange}
              >
                <SelectTrigger id="min-exp" className="border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Min years" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => (
                    <SelectItem key={`min-${i}`} value={String(i)}>
                      {i} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="max-exp" className="text-sm font-medium text-gray-700">
                Max Experience
              </label>
              <Select
                value={String(filters.experience_max ?? 20)}
                onValueChange={handleExperienceMaxChange}
              >
                <SelectTrigger id="max-exp" className="border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Max years" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => (
                    <SelectItem key={`max-${i}`} value={String(i)}>
                      {i === 20 ? "20+ years" : `${i} years`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
