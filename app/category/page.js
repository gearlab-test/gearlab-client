'use client';
import { useRouter } from 'next/navigation';
import { Bike, Car } from 'lucide-react';

export default function CategoryPage() {
  const router = useRouter();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-primary mb-4 uppercase tracking-tight">
          Select Your Path
        </h2>
        <p className="text-gray-400 text-lg">Choose a category to begin your customization journey.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {[
          { type: 'bike', icon: <Bike size={64} />, label: 'Bicycles & Motorbikes' },
          { type: 'car', icon: <Car size={64} />, label: 'Performance Cars' }
        ].map(item => (
          <button 
            key={item.type} 
            onClick={() => router.push(`/vehicles?type=${item.type}`)}
            className="flex-1 group relative p-12 bg-surface border border-border rounded-[2rem] overflow-hidden transition-all hover:border-primary/50 hover:bg-surface-hover hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              {item.icon}
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 p-6 rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="font-orbitron text-2xl font-bold mb-2 uppercase">{item.type}s</h3>
              <p className="text-sm text-gray-500 font-medium tracking-wide">{item.label}</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        ))}
      </div>
    </main>
  );
}