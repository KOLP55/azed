import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Type definitions ---
interface AppData {
    id: number;
    name: string;
    rating: number;
    iconUrl: string;
    developer?: string;
    downloads?: string;
    reviewCount?: string;
    ageRating?: string;
    screenshots?: string[];
    category?: string;
    bannerUrl?: string;
    downloadUrl?: string;
}

interface AppCollection {
    featuredApps: AppData[];
    arcadeGames: AppData[];
    lightGames: AppData[];
    allApps: AppData[];
}

// --- SVG Icon Components ---
const APKPureLogo = () => (
    <div className="apk-logo">
        <span className="logo-main">APKPure</span>
        <span className="logo-lite">Lite</span>
    </div>
);
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;
const ArrowBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z" /></svg>;
const LoginArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;


// Detail page icons
const ShareIcon = () => <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m18 16.08c-.76 0-1.44.3-1.96.77l-7.1-4.25c.05-.23.08-.46.08-.7s-.03-.47-.08-.7l7.1-4.25c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.03.47.08.7l-7.1 4.25c-.52-.47-1.2-.77-1.96-.77-1.66 0-3 1.34-3 3s1.34 3 3 3c.76 0 1.44-.3 1.96-.77l7.1 4.25c-.05.23-.08.46-.08.7s.03.47.08.7l-7.1 4.25c-.52-.47-1.2-.77-1.96-.77-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3c0-.24-.03-.47-.08-.7l7.1-4.25c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3z" /></svg>;
const AddWishlistIcon = () => <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" /></svg>;
const DeviceIcon = () => <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z" /></svg>;
const StarIcon = ({ className = '' }: { className?: string }) => <svg className={`star-icon ${className}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;


// --- Initial App Data ---
const initialAppData: AppCollection = {
    featuredApps: [
        { id: 1, name: '8 Ball Pool', rating: 8.5, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLm1pbmljbGlwLjhiaWxscG9vbF9pY29uXzE1OTIzOTAyOTdfMDEx/icon.png?w=100&fakeurl=1', bannerUrl: 'https://image.winudf.com/v2/image1/Y29tLm1pbmljbGlwLjhiaWxscG9vbF9mZWF0dXJlX2dyYXBoaWNfMTYxODg0MDI0OV8wOTg/screen-0.jpg?fakeurl=1&w=1280' },
        { id: 2, name: 'Dream League Soccer 2025', rating: 7.6, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmZpcnN0dG91Y2hnYW1lcy5kbHMyNF9pY29uXzE3MTM0NDEzOTZfMDIy/icon.png?w=100&fakeurl=1', bannerUrl: 'https://image.winudf.com/v2/image1/Y29tLmZpcnN0dG91Y2hnYW1lcy5kbHMyNF9mZWF0dXJlX2dyYXBoaWNfMTcxMzQ0MTM5Nl8wOTY/screen-1.jpg?fakeurl=1&w=1280' },
        { id: 3, name: 'Winner Soccer 2', rating: 0, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnRvdWNoZ2FtZXMuc3NvY2Vlcl9pY29uXzE1NTQ5MDY1NjRfMDc5/icon.png?w=100&fakeurl=1', bannerUrl: 'https://image.winudf.com/v2/image1/Y29tLnRvdWNoZ2FtZXMuc3NvY2Vlcl9mZWF0dXJlX2dyYXBoaWNfMTU1NDkwNjU2NF8wMjY/screen-1.jpg?fakeurl=1&w=1280' },
    ],
    arcadeGames: [
        { id: 4, name: 'Cooking Fever: Restaurant Game', developer: 'Nordcurrent Games', rating: 9.1, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLm5vcmRjdXJyZW50LmNvb2tpbmdmZXZlcl9pY29uXzE2OTk1MzM5MzZfMDYw/icon.png?w=128&fakeurl=1' },
        { id: 5, name: 'لعبة الحرب - Sonic Dash', developer: 'SEGA', rating: 8.6, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnNlZ2Euc29uaWNkYXNoX2ljb25fMTcwNDg4MDIwMl8wMzk/icon.png?w=128&fakeurl=1' },
        { id: 6, name: 'Subway Surfers', developer: 'SYBO Games', rating: 8.7, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmtpbG9vLnN1YndheXN1cmZfaWNvbl8xNzE1OTI3ODg1XzAwMQ/icon.png?w=128&fakeurl=1' },
        { id: 7, name: 'Cooking Madness – ألعاب المطعم', developer: 'ZenLife Games Ltd', rating: 9.3, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmdpcmxnb2dvemVybGlmZWdhbWVzLmNvb2tpbmdtYWRuZXNzX2ljb25fMTY5MzQ3OTEwOF8wNDE/icon.png?w=128&fakeurl=1' },
        { id: 8, name: 'Payback 2 - The Battle Sandbox', developer: 'Apex Designs Games LLP', rating: 8.8, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmFwZXhzZGVzaWducy5wYXliYWNrMl9pY29uXzE1NTI5OTkxNDdfMDM3/icon.png?w=128&fakeurl=1' },
        { id: 9, name: 'Minecraft Trial', developer: 'Mojang', rating: 8.4, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLm1vamFuZy5taW5lY3JhZnR0cmlhbF9pY29uXzE2MDUwMjcyNDFfMDY3/icon.png?w=128&fakeurl=1' },
        { id: 10, name: 'Blockman Go', developer: 'Blockman GO studio', rating: 8.4, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLndhcmhhbW1lci5nYW1lcy5nb19pY29uXzE3MDQ3ODY1NzJfMDU1/icon.png?w=128&fakeurl=1' },
        { id: 11, name: 'لعبة صغيرة - Stickman Party 2-4', developer: 'PlayMax Game Studio', rating: 8.7, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnBsYXltYXguZ2FtZXMuc3RpY2ttYW5wYXJ0eTRfaWNvbl8xNjk1OTg2MzI1XzAwNQ/icon.png?w=128&fakeurl=1' },
        { id: 12, name: 'ePSXe for Android', developer: '.epsxe s.l.', rating: 10.0, iconUrl: 'https://image.winudf.com/v2/image/Y29tLmVwc3hlLmVwc3hlX2ljb25fMTUwODQzMjY3N18wOTE/icon.png?w=128&fakeurl=1' },
    ],
    lightGames: [
        { id: 13, name: 'Big Sports', rating: 3.0, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnNwb3J0cy5iaWdfaWNvbl8xNTU1NjgwOTI1XzAzOA/icon.png?w=100&fakeurl=1' },
        { id: 14, name: 'القرية', rating: 8.8, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmZ1bnBsdXMuZmFtaWx5ZmFybV9pY29uXzE2MDgwMzkzMTlfMDYx/icon.png?w=100&fakeurl=1' },
        { id: 15, name: 'TopTop (توب توب) KSA...', rating: 0, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnRvcHRvcC5zYV9pY29uXzE3MTQwODQ4MjRfMDcy/icon.png?w=100&fakeurl=1' },
        { id: 16, name: 'Plants vs. Zombies™ 2', rating: 7.6, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmVhLmdhbWUucHZ6Ml9yb3dfaWNvbl8xNjk4OTA2MjgxXzA1Nw/icon.png?w=100&fakeurl=1' },
        { id: 17, name: 'مزرعتنا السعيدة', rating: 8.9, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmZ1bnBsdXMuZmFtaWx5ZmFybS5hcmFiaWNfaWNvbl8xNjA3OTYwNjM4XzA4OA/icon.png?w=100&fakeurl=1' },
        { id: 18, name: 'Candy Crush Soda Saga', rating: 9.3, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmtpbmcuY2FuZHljcnVzaHNvZGFzYWdhX2ljb25fMTY4OTg1NzQ3Ml8wNjg/icon.png?w=100&fakeurl=1' },
        { id: 19, name: 'My PlayHome', rating: 8.6, iconUrl: 'https://image.winudf.com/v2/image/Y29tLnNoaW1vbi5teXBsYXlob21lX2ljb25fN180MDk4MA/icon.png?w=100&fakeurl=1' },
        { id: 20, name: 'Candy Crush Saga', rating: 9.2, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLmtpbmcuY2FuZHljcnVzaHNhZ2FfaWNvbl8xNjg5ODU3NDU2XzA0NA/icon.png?w=100&fakeurl=1' },
        { id: 21, name: 'My PlayHome Plus', rating: 6.9, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnNoaW1vbi5teXBsYXlob21lcGx1c19pY29uXzE1ODgwODk5ODdfMDcy/icon.png?w=100&fakeurl=1' },
        { id: 22, name: 'Hay Day', rating: 8.8, iconUrl: 'https://image.winudf.com/v2/image1/Y29tLnN1cGVyY2VsbC5oYXlkYXlfaWNvbl8xNzA5MzExMDIxXzAzNw/icon.png?w=100&fakeurl=1' },
    ],
    allApps: []
};
initialAppData.allApps = [...initialAppData.featuredApps, ...initialAppData.arcadeGames, ...initialAppData.lightGames];

// --- Components ---

const Header = ({ onSearch, onNavigateToLogin }) => (
    <header className="header">
        <div className="header-left">
            <APKPureLogo />
        </div>
        <div className="header-center">
            <div className="search-container">
                <SearchIcon />
                <input
                    type="search"
                    className="search-input"
                    placeholder="APKPure"
                    onChange={(e) => onSearch(e.target.value)}
                    aria-label="Search for apps"
                />
            </div>
        </div>
        <div className="header-right">
            <nav className="nav">
                <a href="#" className="nav-item active">الصفحة الرئيسية</a>
                <a href="#" className="nav-item">ألعاب</a>
                <a href="#" className="nav-item">تطبيقات</a>
                <a href="#" className="nav-item">تطبيق APKPure</a>
                <a href="#" className="nav-item">AIPure</a>
            </nav>
            <button className="icon-button" aria-label="Language">
                <GlobeIcon />
            </button>
            <button className="icon-button" aria-label="تسجيل الدخول" onClick={onNavigateToLogin}>
                <UserIcon />
            </button>
        </div>
    </header>
);

const Carousel = ({ apps, onAppClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        if (apps.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex === apps.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        if (apps.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? apps.length - 1 : prevIndex - 1));
    };

    return (
        <div className="carousel-container">
            <div className="carousel-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {apps.map((app) => (
                    <div key={app.id} className="carousel-item" onClick={() => onAppClick(app)}>
                        <img src={app.bannerUrl} alt={app.name} className="carousel-item-banner" />
                        <div className="carousel-item-info">
                            <div className="app-icon"><img src={app.iconUrl} alt={`${app.name} icon`} /></div>
                            <div>
                                <div className="app-name">{app.name}</div>
                                {app.rating > 0 && <div className="app-rating">★ {app.rating}</div>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {apps.length > 1 && (
                <div className="carousel-nav">
                    <button onClick={prevSlide} className="carousel-nav-button" aria-label="Previous slide"><ChevronLeftIcon /></button>
                    <button onClick={nextSlide} className="carousel-nav-button" aria-label="Next slide"><ChevronRightIcon /></button>
                </div>
            )}
        </div>
    );
};

const AppListItem = ({ app, onClick }) => (
    <div className="app-list-item" onClick={() => onClick(app)}>
        <img src={app.iconUrl} alt={`${app.name} icon`} className="app-list-item-icon" />
        <div className="app-list-item-info">
            <div className="app-name">{app.name}</div>
            <div className="app-developer">{app.developer}</div>
            <div className="app-rating">
                <span>{app.rating}</span>
                <StarIcon />
            </div>
        </div>
    </div>
);

const AppListSection = ({ title, apps, onAppClick }) => (
    <section className="app-list-section">
        <div className="app-section-header">
            <h2 className="app-section-title">{title}</h2>
            <a href="#" className="see-more-link">
                <span>أكثر</span>
                <ChevronLeftIcon/>
            </a>
        </div>
        <div className="app-list-container">
            {apps.map(app => <AppListItem key={app.id} app={app} onClick={onAppClick} />)}
        </div>
    </section>
);

const HorizontalAppCard = ({ app, onClick }) => (
    <div className="horizontal-app-card" onClick={() => onClick(app)}>
        <img src={app.iconUrl} alt={`${app.name} icon`} className="app-icon" />
        <div className="app-name">{app.name}</div>
        <div className="app-rating">
            {app.rating > 0 ? (
                <>
                    <span>{app.rating}</span>
                    <StarIcon />
                </>
            ) : (
                <StarIcon className="unrated" />
            )}
        </div>
    </div>
);

const HorizontalAppSection = ({ title, apps, onAppClick }) => (
    <section className="app-list-section">
        <div className="app-section-header">
            <h2 className="app-section-title">{title}</h2>
             <a href="#" className="see-more-link">
                <span>أكثر</span>
                <ChevronLeftIcon/>
            </a>
        </div>
        <div className="horizontal-app-list-container">
            {apps.map(app => <HorizontalAppCard key={app.id} app={app} onClick={onAppClick} />)}
        </div>
    </section>
);


const AppGridCard = ({ app, onClick }) => (
    <div className="app-grid-card" onClick={() => onClick(app)}>
        <img src={app.iconUrl} alt={`${app.name} icon`} />
        <div className="app-name">{app.name}</div>
        <div className="app-rating">
            <span>{app.rating}</span>
            <StarIcon />
        </div>
    </div>
);


const AppDetail = ({ app, onBack }) => (
    <div className="app-detail-page">
        <header className="app-detail-main-header">
             <button onClick={onBack} className="icon-button back-button" aria-label="Back">
                <ArrowBackIcon />
            </button>
        </header>
        <div className="app-detail-header">
            <img src={app.iconUrl} alt={`${app.name} icon`} className="app-detail-icon" />
            <div className="app-detail-title-group">
                <h1 className="app-detail-title">{app.name}</h1>
                <a href="#" className="app-detail-developer">{app.developer || 'Unknown Developer'}</a>
            </div>
        </div>
        
        <div className="app-stats-bar">
            <div className="app-stat">
                <div className="app-stat-value">
                    <StarIcon/>
                    {app.rating}
                </div>
                <div className="app-stat-label">{app.reviewCount || '8.75 مليون مراجعة'}</div>
            </div>
             <div className="app-stat">
                <div className="app-stat-value">{app.downloads || '500+ مليون'}</div>
                <div className="app-stat-label">عملية تنزيل</div>
            </div>
             <div className="app-stat">
                <div className="app-stat-icon-wrapper"><span style={{border: '1px solid #757575', padding: '0 4px', borderRadius: '3px'}}>12+</span></div>
                <div className="app-stat-label">{app.ageRating || 'مناسب لأعمار 12 وما فوق'}</div>
            </div>
        </div>

        <div className="app-actions">
            {app.downloadUrl ? (
                <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer" className="install-button">
                    تحميل
                </a>
            ) : (
                <button className="install-button" disabled>
                    تحميل
                </button>
            )}
            <div className="app-action-buttons">
                <button className="icon-button-text"><ShareIcon /> مشاركة</button>
                <button className="icon-button-text"><AddWishlistIcon /> إضافة إلى قائمة المفضلات</button>
            </div>
        </div>
        <p className="device-compatibility"><DeviceIcon /> يتوفر هذا التطبيق لبعض أجهزتك</p>

        {app.screenshots && app.screenshots.length > 0 && (
             <div className="screenshots-container">
                 <div className="screenshots-scroller">
                    {app.screenshots.map((ss, index) => <img key={index} src={ss} alt={`Screenshot ${index + 1}`} className="screenshot-image" />)}
                 </div>
            </div>
        )}
    </div>
);

const MainApp = ({ appData, onNavigateToLogin }) => {
    const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const allApps = [...appData.featuredApps, ...appData.arcadeGames, ...appData.lightGames];

    const handleAppClick = (app: AppData) => {
        const fullAppData = allApps.find(a => a.id === app.id) || app;
        setSelectedApp(fullAppData);
    };

    const handleBack = () => {
        setSelectedApp(null);
        setSearchQuery('');
    };
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSelectedApp(null); 
    };
    
    const filteredApps = allApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Header onSearch={handleSearch} onNavigateToLogin={onNavigateToLogin} />
            <main className="main-content">
                {selectedApp ? (
                    <AppDetail app={selectedApp} onBack={handleBack} />
                ) : searchQuery ? (
                     <div className="search-results-grid">
                        {filteredApps.length > 0 ? (
                            filteredApps.map(app => <AppGridCard key={app.id} app={app} onClick={handleAppClick} />)
                        ) : (
                            <p className="no-results">لا توجد نتائج بحث</p>
                        )}
                    </div>
                ) : (
                    <>
                        <Carousel apps={appData.featuredApps} onAppClick={handleAppClick} />
                        <AppListSection title="أركيد ألعاب" apps={appData.arcadeGames} onAppClick={handleAppClick} />
                        <HorizontalAppSection title="خفيفة ألعاب" apps={appData.lightGames} onAppClick={handleAppClick} />
                    </>
                )}
            </main>
        </>
    );
}

const LoginPage = ({ onLogin, onNavigateToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLoginClick = () => {
        onLogin(email, password);
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h1>تسجيل الدخول</h1>
                <p>أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.</p>
                <div className="form-group">
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">كلمة المرور</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="auth-button primary" onClick={handleLoginClick}>
                    <LoginArrowIcon />
                    <span>دخول</span>
                </button>
                <div className="separator">أو</div>
                <button className="auth-button secondary" onClick={onNavigateToSignup}>إنشاء حساب جديد</button>
            </div>
        </div>
    );
}

const SignupPage = ({ onSignup, onNavigateToLogin }) => (
    <div className="auth-page">
        <div className="auth-form">
            <h1>إنشاء حساب جديد</h1>
            <p>أدخل بريدك الإلكتروني وكلمة المرور للبدء.</p>
            <div className="form-group">
                <label htmlFor="signup-email">البريد الإلكتروني</label>
                <input type="email" id="signup-email" placeholder="example@example.com" />
            </div>
            <div className="form-group">
                <label htmlFor="signup-password">كلمة المرور</label>
                <input type="password" id="signup-password" />
            </div>
            <button className="auth-button primary" onClick={onSignup}>
                <LoginArrowIcon />
                <span>إنشاء حساب</span>
            </button>
            <div className="separator"></div>
            <p style={{fontSize: '14px', marginBottom: '0'}}>
                لديك حساب بالفعل؟ <button onClick={onNavigateToLogin} className="auth-link">تسجيل الدخول</button>
            </p>
        </div>
    </div>
);

const AdminPanel = ({ appData, onAddApp, onUpdateApp, onDeleteApp, onLogout, onViewSite }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAppId, setCurrentAppId] = useState<number | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [developer, setDeveloper] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [rating, setRating] = useState('0');
    const [category, setCategory] = useState('arcadeGames');
    const [bannerUrl, setBannerUrl] = useState('');

    const findCategoryForApp = (appId: number) => {
        if (appData.featuredApps.some(app => app.id === appId)) return 'featuredApps';
        if (appData.arcadeGames.some(app => app.id === appId)) return 'arcadeGames';
        if (appData.lightGames.some(app => app.id === appId)) return 'lightGames';
        return 'allApps'; // Fallback
    }

    const resetForm = () => {
        setName('');
        setDeveloper('');
        setIconUrl('');
        setDownloadUrl('');
        setRating('0');
        setCategory('arcadeGames');
        setBannerUrl('');
        setIsEditMode(false);
        setCurrentAppId(null);
    };

    const handleEditClick = (appToEdit: AppData) => {
        setIsEditMode(true);
        setCurrentAppId(appToEdit.id);
        setName(appToEdit.name);
        setDeveloper(appToEdit.developer || '');
        setIconUrl(appToEdit.iconUrl);
        setDownloadUrl(appToEdit.downloadUrl || '');
        setRating(String(appToEdit.rating));
        setCategory(findCategoryForApp(appToEdit.id));
        setBannerUrl(appToEdit.bannerUrl || '');
        window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleDeleteClick = (appId: number) => {
        if (window.confirm('هل أنت متأكد أنك تريد حذف هذا التطبيق؟')) {
            onDeleteApp(appId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const appPayload: AppData = {
            id: isEditMode && currentAppId ? currentAppId : Date.now(),
            name,
            developer,
            iconUrl,
            downloadUrl,
            rating: parseFloat(rating),
            bannerUrl: category === 'featuredApps' ? bannerUrl : undefined,
        };

        if (isEditMode) {
            onUpdateApp(appPayload, findCategoryForApp(appPayload.id), category);
             alert('تم تحديث التطبيق بنجاح!');
        } else {
            onAddApp(appPayload, category);
            alert('تمت إضافة التطبيق بنجاح!');
        }
        resetForm();
    };

    return (
        <div className="admin-panel">
            <div className="admin-container">
                <div className="admin-header">
                    <h1>لوحة التحكم</h1>
                    <div className="nav-buttons">
                        <button onClick={onViewSite} className="nav-button">عرض الموقع</button>
                        <button onClick={onLogout} className="nav-button">تسجيل الخروج</button>
                    </div>
                </div>
                
                {/* --- Add/Edit Form --- */}
                <form onSubmit={handleSubmit} className="admin-form">
                    <h2>{isEditMode ? 'تعديل التطبيق' : 'إضافة تطبيق جديد'}</h2>
                    <div className="form-group">
                        <label htmlFor="appName">اسم التطبيق</label>
                        <input id="appName" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="developer">المطور</label>
                        <input id="developer" type="text" value={developer} onChange={e => setDeveloper(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="iconUrl">رابط الأيقونة</label>
                        <input id="iconUrl" type="url" value={iconUrl} onChange={e => setIconUrl(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="downloadUrl">رابط التحميل</label>
                        <input id="downloadUrl" type="url" value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rating">التقييم (0-10)</label>
                        <input id="rating" type="number" step="0.1" min="0" max="10" value={rating} onChange={e => setRating(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">الفئة</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="arcadeGames">أركيد ألعاب</option>
                            <option value="lightGames">خفيفة ألعاب</option>
                            <option value="featuredApps">التطبيقات المميزة (Carousel)</option>
                        </select>
                    </div>
                    {category === 'featuredApps' && (
                         <div className="form-group">
                            <label htmlFor="bannerUrl">رابط البانر (للتطبيقات المميزة)</label>
                            <input id="bannerUrl" type="url" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} required />
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            {isEditMode ? 'تحديث التطبيق' : 'إضافة التطبيق'}
                        </button>
                        {isEditMode && <button type="button" onClick={resetForm} className="cancel-button">إلغاء</button>}
                    </div>
                </form>

                {/* --- Manage Apps List --- */}
                <div className="manage-apps-section">
                    <h2>إدارة التطبيقات</h2>
                    <div className="manage-app-list">
                        {appData.allApps.map(app => (
                            <div key={app.id} className="manage-app-item">
                                <img src={app.iconUrl} alt="" className="manage-app-icon" />
                                <div className="manage-app-info">
                                    <div className="app-name">{app.name}</div>
                                    <div className="app-developer">{app.developer}</div>
                                </div>
                                <div className="manage-app-actions">
                                    <button onClick={() => handleEditClick(app)} className="edit-btn">تعديل</button>
                                    <button onClick={() => handleDeleteClick(app.id)} className="delete-btn">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [view, setView] = useState('main'); // 'login', 'signup', 'main', 'admin'
    const [appData, setAppData] = useState<AppCollection>(initialAppData);

    useEffect(() => {
        // This ensures allApps is always in sync with the other categories
        setAppData(prev => ({
            ...prev,
            allApps: [...prev.featuredApps, ...prev.arcadeGames, ...prev.lightGames]
        }));
    }, [appData.featuredApps, appData.arcadeGames, appData.lightGames]);

    const handleLogin = (email, password) => {
        if (email === 'ayoub.laasry82@gmail.com' && password === '59488198') {
            setView('admin');
        } else {
            setView('main');
        }
    };
    
    const handleSignup = () => setView('main');
    const navigateToSignup = () => setView('signup');
    const navigateToLogin = () => setView('login');
    const handleLogout = () => setView('login');
    const handleViewSite = () => setView('main');

    const handleAddApp = (newApp: AppData, categoryKey: keyof AppCollection) => {
        setAppData(prevData => {
            if (categoryKey === 'allApps') return prevData;
            const updatedCategory = [...prevData[categoryKey], newApp];
            return {
                ...prevData,
                [categoryKey]: updatedCategory,
            };
        });
    };
    
    const handleUpdateApp = (updatedApp: AppData, oldCategory: keyof AppCollection, newCategory: keyof AppCollection) => {
        setAppData(prevData => {
            const newData = { ...prevData };
            
            // Remove from old category
            if(oldCategory !== 'allApps') {
                newData[oldCategory] = newData[oldCategory].filter(app => app.id !== updatedApp.id);
            }

            // Add to new category
             if(newCategory !== 'allApps') {
                const categoryList = [...newData[newCategory]];
                const existingIndex = categoryList.findIndex(app => app.id === updatedApp.id);
                if (existingIndex > -1) {
                    categoryList[existingIndex] = updatedApp;
                } else {
                    categoryList.push(updatedApp);
                }
                newData[newCategory] = categoryList;
            }
            return newData;
        });
    };

    const handleDeleteApp = (appId: number) => {
        setAppData(prevData => {
            const newData = { ...prevData };
            for (const key in newData) {
                if (Array.isArray(newData[key])) {
                    newData[key] = newData[key].filter(app => app.id !== appId);
                }
            }
            return newData;
        });
    };


    if (view === 'login') {
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={navigateToSignup} />;
    }
    
    if (view === 'signup') {
        return <SignupPage onSignup={handleSignup} onNavigateToLogin={navigateToLogin} />;
    }
    
    if (view === 'admin') {
        return <AdminPanel 
            appData={appData}
            onAddApp={handleAddApp} 
            onUpdateApp={handleUpdateApp}
            onDeleteApp={handleDeleteApp}
            onLogout={handleLogout} 
            onViewSite={handleViewSite} 
        />;
    }

    return <MainApp appData={appData} onNavigateToLogin={navigateToLogin} />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);