
import React from 'react';
import type { AppInfo } from '../types';
import { DownloadIcon } from './icons';

interface AppCardProps {
  app: AppInfo;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <img className="w-full h-48 object-cover" src={app.imageUrl} alt={`صورة ${app.name}`} loading="lazy" />
      <div className="p-4 flex flex-col h-full">
        <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
        <p className="text-gray-400 text-sm flex-grow mb-4">{app.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          <span className="bg-gray-700 px-2 py-1 rounded">{app.category}</span>
          <span>{app.size}</span>
        </div>
        <a
          href={app.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
        >
          <DownloadIcon />
          تحميل
        </a>
      </div>
    </div>
  );
};

export default AppCard;
