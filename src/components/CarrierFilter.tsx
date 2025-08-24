import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  filterCarriers, 
  type FilterParams, 
  type CarrierData, 
  US_STATES, 
  CARRIER_OPERATIONS, 
  CLASS_DEFINITIONS 
} from '@/services/carrierService';
import { CarrierTable } from './CarrierTable';

export const CarrierFilter: React.FC = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterParams>({});
  const [results, setResults] = useState<CarrierData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (field: keyof FilterParams, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    try {
      const response = await filterCarriers(filters);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
        setResults([]);
        setTotalCount(0);
      } else {
        setResults(response.data);
        setTotalCount(response.count);
        
        if (response.count === 0) {
          toast({
            title: "No Results",
            description: "No carriers found matching your criteria.",
          });
        } else {
          toast({
            title: "Success",
            description: `Found ${response.count} carriers${response.count > 50 ? ' (showing first 50)' : ''}`,
          });
        }
      }
    } catch (error) {
      console.error('Filter error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while filtering carriers.",
        variant: "destructive"
      });
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({});
    setResults([]);
    setTotalCount(0);
    setHasSearched(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Carrier Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrierOp">Carrier Operation</Label>
                <Select
                  value={filters.carrierOp || ''}
                  onValueChange={(value) => handleInputChange('carrierOp', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {CARRIER_OPERATIONS.map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="powerUnits">Minimum Power Units</Label>
                <Input
                  id="powerUnits"
                  type="number"
                  min="0"
                  placeholder="Enter minimum power units"
                  value={filters.powerUnits || ''}
                  onChange={(e) => handleInputChange('powerUnits', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDrivers">Minimum Total Drivers</Label>
                <Input
                  id="totalDrivers"
                  type="number"
                  min="0"
                  placeholder="Enter minimum drivers"
                  value={filters.totalDrivers || ''}
                  onChange={(e) => handleInputChange('totalDrivers', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classDef">Class Definition</Label>
                <Select
                  value={filters.classDef || ''}
                  onValueChange={(value) => handleInputChange('classDef', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class definition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {CLASS_DEFINITIONS.map(classDef => (
                      <SelectItem key={classDef} value={classDef}>{classDef}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={filters.state || ''}
                  onValueChange={(value) => handleInputChange('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {US_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button type="submit" disabled={loading} className="min-w-32">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Filtering...
                  </>
                ) : (
                  'Filter Carriers'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>
              Results 
              {totalCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({totalCount} found{totalCount > 50 ? ', showing first 50' : ''})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <CarrierTable data={results} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No carriers found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your filters and search again.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};