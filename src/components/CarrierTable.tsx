import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type CarrierData } from '@/services/carrierService';

interface CarrierTableProps {
  data: CarrierData[];
}

export const CarrierTable: React.FC<CarrierTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Carrier Operation</TableHead>
              <TableHead className="font-semibold text-right">Power Units</TableHead>
              <TableHead className="font-semibold text-right">Total Drivers</TableHead>
              <TableHead className="font-semibold">Class Definition</TableHead>
              <TableHead className="font-semibold">State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((carrier, index) => (
              <TableRow key={startIndex + index}>
                <TableCell className="font-medium">{carrier.CARRIER_OP}</TableCell>
                <TableCell className="text-right">{carrier.POWER_UNITS}</TableCell>
                <TableCell className="text-right">{carrier.TOTAL_DRIVERS}</TableCell>
                <TableCell>{carrier.CLASS_DEF}</TableCell>
                <TableCell>{carrier.STATE}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};