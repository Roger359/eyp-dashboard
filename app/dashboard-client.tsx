'use client';

import { useState } from 'react';
import { OilData, FilterState } from '@/lib/oil-types';
import { filterExportaciones, filterProductores } from '@/lib/oil-utils';
import Filters from '@/components/filters';
import ExportsBar from '@/components/charts/exports-bar';
import ExportsLine from '@/components/charts/exports-line';
import ExportsPie from '@/components/charts/exports-pie';
import ProductionChart from '@/components/charts/production-chart';
import ReservesChart from '@/components/charts/reserves-chart';
import PopulationChart from '@/components/charts/population-chart';
import FrackingChart from '@/components/charts/fracking-chart';

interface DashboardClientProps {
  oilData: OilData;
}

export default function DashboardClient({ oilData }: DashboardClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    topRange: 'all',
    pibCategories: [],
    selectedCountries: [],
    selectedRegions: []
  });

  // Filter and sort data by specific fields for each chart
  // This ensures Top N filters work correctly for each metric
  const exportsByProduction = filterExportaciones(oilData?.datos?.exportaciones ?? [], filters, 'produccion_bbl_d');
  const exportsByPopulation = filterExportaciones(oilData?.datos?.exportaciones ?? [], filters, 'poblacion_2024_mm');
  const producersByProduction = filterProductores(oilData?.datos?.productores ?? [], filters, 'produccion_bbl_d');
  const producersByReserves = filterProductores(oilData?.datos?.productores ?? [], filters, 'reservas_probadas_MMM_bbl');

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Filters 
            countries={oilData?.paises ?? []} 
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Charts Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Export Charts - Three Variants */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 dark:bg-amber-400 rounded"></span>
            Exportaciones de Crudo - Tres Variantes
          </h2>
          <ExportsBar data={exportsByProduction} />
          <ExportsLine data={exportsByProduction} />
          <ExportsPie data={exportsByProduction} />
        </div>

        {/* Other Charts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-8">
            <span className="w-2 h-8 bg-orange-500 dark:bg-orange-400 rounded"></span>
            Otros Indicadores Petroleros
          </h2>
          <ProductionChart data={producersByProduction} />
          <ReservesChart data={producersByReserves} />
          <PopulationChart data={exportsByPopulation} />
          <FrackingChart data={producersByProduction} />
        </div>
      </div>
    </div>
  );
}
