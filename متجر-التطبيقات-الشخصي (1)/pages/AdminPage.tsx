
import React, { useState, useEffect, useCallback } from 'react';
import type { AppInfo } from '../types';
import { PlusIcon, TrashIcon } from '../components/icons';
import { Link } from 'react-router-dom';

// NOTE: This is NOT secure. The password is in the client-side code.
// For a real app, use a proper backend authentication system.
const ADMIN_PASSWORD = 'admin';

const AdminLogin: React.FC<{ onLogin: (password: string) => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            onLogin(password);
        } else {
            setError('كلمة المرور غير صحيحة.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-white mb-6">تسجيل دخول المسؤول</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        دخول
                    </button>
                    <div className="text-center mt-4">
                       <Link to="/" className="text-sm text-gray-400 hover:text-cyan-400">العودة للصفحة الرئيسية</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [apps, setApps] = useState<AppInfo[]>([]);
    const [newApp, setNewApp] = useState<Omit<AppInfo, 'id'>>({
        name: '', description: '', downloadUrl: '', imageUrl: '', size: '', category: ''
    });

    const fetchInitialData = useCallback(async () => {
        try {
            const response = await fetch('./data/apps.json');
            const data: AppInfo[] = await response.json();
            setApps(data);
        } catch (error) {
            console.error("Could not load initial app data:", error);
            // Start with an empty list if fetching fails
            setApps([]);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewApp(prev => ({ ...prev, [name]: value }));
    };

    const handleAddApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(newApp).some(val => val === '')) {
            alert('يرجى ملء جميع الحقول.');
            return;
        }
        const appToAdd: AppInfo = { ...newApp, id: Date.now().toString() };
        setApps(prev => [...prev, appToAdd]);
        setNewApp({ name: '', description: '', downloadUrl: '', imageUrl: '', size: '', category: '' });
    };

    const handleDeleteApp = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا التطبيق؟')) {
            setApps(prev => prev.filter(app => app.id !== id));
        }
    };
    
    const handleSaveAndDownload = () => {
        const jsonString = JSON.stringify(apps, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apps.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('تم تجهيز ملف apps.json للتنزيل. يرجى استبدال الملف القديم في مجلد public/data/ ثم إعادة نشر الموقع.');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
                     <div>
                        <Link to="/" className="text-sm text-cyan-400 hover:underline mr-4">عرض الموقع</Link>
                        <button onClick={onLogout} className="text-sm text-red-500 hover:underline">تسجيل الخروج</button>
                    </div>
                </div>

                {/* Add App Form */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
                    <h2 className="text-xl font-semibold mb-4">إضافة تطبيق جديد</h2>
                    <form onSubmit={handleAddApp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={newApp.name} onChange={handleInputChange} placeholder="اسم التطبيق" className="bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input name="category" value={newApp.category} onChange={handleInputChange} placeholder="الفئة" className="bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <textarea name="description" value={newApp.description} onChange={handleInputChange} placeholder="الوصف" className="md:col-span-2 bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                        <input name="imageUrl" value={newApp.imageUrl} onChange={handleInputChange} placeholder="رابط الصورة" className="bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input name="downloadUrl" value={newApp.downloadUrl} onChange={handleInputChange} placeholder="رابط التحميل" className="bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <input name="size" value={newApp.size} onChange={handleInputChange} placeholder="حجم التطبيق (مثال: 50 ميجابايت)" className="bg-gray-700 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <button type="submit" className="md:col-span-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                            <PlusIcon /> إضافة التطبيق
                        </button>
                    </form>
                </div>

                {/* App List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">التطبيقات الحالية ({apps.length})</h2>
                    <div className="space-y-3">
                        {apps.map(app => (
                            <div key={app.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={app.imageUrl} alt={app.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                                    <div>
                                        <p className="font-bold text-white">{app.name}</p>
                                        <p className="text-sm text-gray-400">{app.category}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteApp(app.id)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={handleSaveAndDownload} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        حفظ وتنزيل ملف apps.json
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAdminAuthenticated') === 'true');

    const handleLogin = () => {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('isAdminAuthenticated');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return <AdminPanel onLogout={handleLogout} />;
};

export default AdminPage;