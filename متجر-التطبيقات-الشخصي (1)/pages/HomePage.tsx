
import React, { useState, useEffect } from 'react';
import type { AppInfo } from '../types';
import AppCard from '../components/AppCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const response = await fetch('./data/apps.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AppInfo[] = await response.json();
        setApps(data);
        setError(null);
      } catch (e) {
        if (e instanceof Error) {
            setError(`فشل في تحميل التطبيقات: ${e.message}`);
        } else {
            setError('فشل في تحميل التطبيقات بسبب خطأ غير معروف.');
        }
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center text-xl text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4">جاري تحميل التطبيقات...</p>
          </div>
        )}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {apps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
        {!loading && !error && apps.length === 0 && (
            <p className="text-center text-xl text-gray-500 mt-10">لا توجد تطبيقات لعرضها حالياً.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;