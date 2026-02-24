import React from 'react';
import { Moon, Sun, Volume2, Vibrate, CloudUpload, Download, Trash2, Shield, FileText, Mail, ChevronRight, ExternalLink } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export default function Settings({ settings, setSettings }: SettingsProps) {
  const toggleDarkMode = () => setSettings({ ...settings, darkMode: !settings.darkMode });
  const toggleSound = () => setSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  const toggleVibration = () => setSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-xl font-black tracking-tight">Cài đặt</h1>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-8 pb-32">
        {/* Appearance */}
        <section>
          <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1">Giao diện</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-2xl ${settings.darkMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <p className="font-bold">Chế độ tối</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tiết kiệm pin và dịu mắt hơn</p>
                </div>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`relative flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${settings.darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm">
              <p className="font-bold mb-4">Màu chủ đạo</p>
              <div className="flex flex-wrap gap-3">
                {[
                  '#205eee', // Blue
                  '#ef4444', // Red
                  '#10b981', // Emerald
                  '#f59e0b', // Amber
                  '#8b5cf6', // Purple
                  '#ec4899', // Pink
                  '#06b6d4', // Cyan
                  '#84cc16', // Lime
                  '#1e293b', // Slate
                ].map(color => (
                  <button 
                    key={color}
                    onClick={() => setSettings({ ...settings, accentColor: color })}
                    className={`size-10 rounded-full border-4 transition-all ${settings.accentColor === color ? 'border-white dark:border-slate-400 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <div className="relative size-10 rounded-full overflow-hidden border-4 border-transparent opacity-60 hover:opacity-100 transition-all">
                  <input 
                    type="color" 
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="absolute inset-0 size-full cursor-pointer scale-150"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        {/* <section>
          <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1">Thông báo</h2>
          <div className="space-y-3">
            <SettingToggle 
              icon={<Volume2 size={20} />} 
              label="Hiệu ứng âm thanh" 
              enabled={settings.soundEnabled} 
              onToggle={toggleSound} 
            />
            <SettingToggle 
              icon={<Vibrate size={20} />} 
              label="Rung" 
              enabled={settings.vibrationEnabled} 
              onToggle={toggleVibration} 
            />
          </div>
        </section> */}

        {/* Data Management */}
        <section>
          <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1">Quản lý dữ liệu</h2>
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm">
            {/* <SettingLink icon={<CloudUpload size={20} />} label="Sao lưu & Khôi phục" />
            <SettingLink icon={<Download size={20} />} label="Xuất dữ liệu (.csv)" /> */}
            <SettingLink 
              icon={<Trash2 size={20} />} 
              label="Xóa tất cả lịch sử" 
              danger 
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
                  const savedSettings = localStorage.getItem('app_settings');
                  localStorage.clear();
                  if (savedSettings) localStorage.setItem('app_settings', savedSettings);
                  window.location.reload();
                }
              }}
            />
          </div>
        </section>

        {/* About */}
        {/* <section>
          <h2 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-1">Thông tin</h2>
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/50">
              <span className="font-bold text-slate-500 dark:text-slate-400">Phiên bản</span>
              <span className="font-black text-primary">2.4.0</span>
            </div>
            <SettingLink icon={<Shield size={20} />} label="Chính sách bảo mật" external />
            <SettingLink icon={<FileText size={20} />} label="Điều khoản dịch vụ" external />
            <SettingLink icon={<Mail size={20} />} label="Hỗ trợ & Góp ý" />
          </div>
        </section> */}
      </main>
    </div>
  );
}

function SettingToggle({ icon, label, enabled, onToggle }: { icon: React.ReactNode, label: string, enabled: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
          {icon}
        </div>
        <p className="font-bold">{label}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`relative flex h-8 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function SettingLink({ icon, label, danger, external, onClick }: { icon: React.ReactNode, label: string, danger?: boolean, external?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors last:border-0 ${danger ? 'text-red-500' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-2xl ${danger ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
          {icon}
        </div>
        <span className="font-bold">{label}</span>
      </div>
      {external ? <ExternalLink size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
    </button>
  );
}
