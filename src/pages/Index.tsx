import { CarrierFilter } from '@/components/CarrierFilter';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <CarrierFilter />
      </main>
      <AppFooter />
    </div>
  );
};

export default Index;
