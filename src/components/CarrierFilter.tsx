import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, FilterX, Sparkles, Search } from 'lucide-react';
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

  const downloadData = () => {
    if (results.length === 0) {
      toast({
        title: "No Data",
        description: "No results to download. Please filter some data first.",
        variant: "destructive"
      });
      return;
    }

    const csvHeaders = [
      'DOT Number', 'Carrier Operation', 'Phone', 'Fax', 'Cell Phone', 
      'Company Officer 1', 'Company Officer 2', 'Business Org Description',
      'Truck Units', 'Power Units', 'Total Intrastate Drivers', 'Total Drivers',
      'Class Definition', 'Legal Name', 'DBA Name', 'Physical Street', 'Physical City',
      'Physical Country', 'Physical State', 'Physical Zip', 'Mailing Street',
      'Mailing State', 'Mailing City', 'Mailing Country', 'Mailing Zip',
      'Mailing County', 'Email Address'
    ];
    
    const csvData = results.map(row => [
      row.dot_number || '',
      row.carrier_operation || '',
      row.phone || '',
      row.fax || '',
      row.cell_phone || '',
      row.company_officer_1 || '',
      row.company_officer_2 || '',
      row.business_org_desc || '',
      row.truck_units || '',
      row.power_units || '',
      row.total_intrastate_drivers || '',
      row.total_drivers || '',
      row.classdef || '',
      row.legal_name || '',
      row.dba_name || '',
      row.phy_street || '',
      row.phy_city || '',
      row.phy_country || '',
      row.phy_state || '',
      row.phy_zip || '',
      row.carrier_mailing_street || '',
      row.carrier_mailing_state || '',
      row.carrier_mailing_city || '',
      row.carrier_mailing_country || '',
      row.carrier_mailing_zip || '',
      row.carrier_mailing_cnty || '',
      row.email_address || ''
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `carrier_data_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Complete",
        description: `Downloaded ${results.length} carrier records successfully.`,
      });
    }
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-medium shadow-glow animate-float">
            <Sparkles className="h-4 w-4" />
            <span>Advanced Carrier Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Intelligent Carrier Filtering
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, filter, and analyze carrier data with our powerful search engine. 
            Get instant insights with beautiful visualizations.
          </p>
        </div>

        <Card className="glass-effect shadow-elegant animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
              <Search className="h-6 w-6 text-primary" />
              <span>Filter Carriers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:200ms]">
                <div className="space-y-3 group">
                  <Label htmlFor="carrierOp" className="text-sm font-medium">Carrier Operation</Label>
                  <Select
                    value={filters.carrierOp || 'all'}
                    onValueChange={(value) => handleInputChange('carrierOp', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger className="glass-effect hover:shadow-accent transition-all duration-300 group-hover:scale-[1.02]">
                      <SelectValue placeholder="Select operation type" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectItem value="all">All Operations</SelectItem>
                      {CARRIER_OPERATIONS.map(op => (
                        <SelectItem key={op} value={op} className="hover:bg-accent/10">{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="powerUnits" className="text-sm font-medium">Minimum Power Units</Label>
                  <Input
                    id="powerUnits"
                    type="number"
                    min="0"
                    placeholder="Enter minimum power units"
                    value={filters.powerUnits || ''}
                    onChange={(e) => handleInputChange('powerUnits', parseInt(e.target.value) || 0)}
                    className="glass-effect hover:shadow-accent transition-all duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="totalDrivers" className="text-sm font-medium">Minimum Total Drivers</Label>
                  <Input
                    id="totalDrivers"
                    type="number"
                    min="0"
                    placeholder="Enter minimum drivers"
                    value={filters.totalDrivers || ''}
                    onChange={(e) => handleInputChange('totalDrivers', parseInt(e.target.value) || 0)}
                    className="glass-effect hover:shadow-accent transition-all duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="classDef" className="text-sm font-medium">Class Definition</Label>
                  <Select
                    value={filters.classDef || 'all'}
                    onValueChange={(value) => handleInputChange('classDef', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger className="glass-effect hover:shadow-accent transition-all duration-300 group-hover:scale-[1.02]">
                      <SelectValue placeholder="Select class definition" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectItem value="all">All Classes</SelectItem>
                      {CLASS_DEFINITIONS.map(classDef => (
                        <SelectItem key={classDef} value={classDef} className="hover:bg-accent/10">{classDef}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 group">
                  <Label htmlFor="state" className="text-sm font-medium">State</Label>
                  <Select
                    value={filters.state || 'all'}
                    onValueChange={(value) => handleInputChange('state', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger className="glass-effect hover:shadow-accent transition-all duration-300 group-hover:scale-[1.02]">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="glass-effect">
                      <SelectItem value="all">All States</SelectItem>
                      {US_STATES.map(state => (
                        <SelectItem key={state} value={state} className="hover:bg-accent/10">{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 justify-center animate-fade-in-up [animation-delay:400ms]">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="min-w-40 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Filtering...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Filter Carriers
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  className="glass-effect hover:shadow-accent transition-all duration-300 hover:scale-105"
                >
                  <FilterX className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card className="glass-effect shadow-elegant animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span>Results</span>
                  {totalCount > 0 && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({totalCount} found{totalCount > 50 ? ', showing first 50' : ''})
                    </span>
                  )}
                </CardTitle>
                {results.length > 0 && (
                  <Button
                    onClick={downloadData}
                    variant="outline"
                    size="sm"
                    className="glass-effect hover:shadow-accent transition-all duration-300 hover:scale-105"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <CarrierTable data={results} />
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">No carriers found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your filters and search again.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};