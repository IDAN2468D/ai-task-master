'use client';

import {
    User, Sparkles, Bell, Shield, Paintbrush, Mail, CheckCircle2, LogOut, CreditCard,
    Globe, Monitor, Smartphone, Moon, Sun, Palette, Languages, Clock, Calendar,
    BellRing, BellOff, MessageSquare, Zap, AlertTriangle, Trophy,
    Lock, Key, Eye, EyeOff, Fingerprint, ShieldCheck, History, Trash2,
    Crown, Star, Rocket, Check, ArrowLeft, Download, BarChart3, Heart, HardDrive
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { logoutUser, updateProfile } from '@/actions/authActions';
import { disconnectGoogleDrive, isGoogleConnected, getGoogleAuthUrl } from '@/actions/googleDriveActions';

// ─── Toggle Switch Component ───
function Toggle({ enabled, onToggle, size = 'md' }: { enabled: boolean; onToggle: () => void; size?: 'md' | 'sm' }) {
    const sizes = {
        md: { track: 'w-14 h-8', knob: 'w-6 h-6', translate: enabled ? 'translate-x-0' : 'translate-x-6' },
        sm: { track: 'w-11 h-6', knob: 'w-4 h-4', translate: enabled ? 'translate-x-0' : 'translate-x-5' },
    };
    const s = sizes[size];
    return (
        <button onClick={onToggle} className={`${s.track} rounded-full p-1 cursor-pointer flex transition-colors duration-300 shadow-inner ${enabled ? 'bg-[#4318FF] justify-start shadow-[#4318FF]/20' : 'bg-slate-200 dark:bg-slate-700 justify-end'}`}>
            <motion.div layout className={`${s.knob} bg-white rounded-full shadow-md`} />
        </button>
    );
}

// ─── Section Header ───
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm font-bold text-slate-500">{subtitle}</p>
        </div>
    );
}

// ─── Setting Row ───
function SettingRow({ icon: Icon, iconColor, title, subtitle, children }: {
    icon: any; iconColor: string; title: string; subtitle: string; children: React.ReactNode;
}) {
    return (
        <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconColor + '15' }}>
                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">{title}</h4>
                    <p className="text-[11px] font-bold text-slate-500 truncate">{subtitle}</p>
                </div>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    );
}

export default function ProfileClient({ user }: { user: { name: string, email: string, image?: string } }) {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'הפרופיל שלי', icon: User },
        { id: 'preferences', label: 'העדפות', icon: Paintbrush },
        { id: 'ai', label: 'כיוון AI', icon: Sparkles },
        { id: 'notifications', label: 'התראות', icon: Bell },
        { id: 'security', label: 'אבטחה', icon: Shield },
        { id: 'billing', label: 'חיוב ותוכנית', icon: CreditCard },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-6 pt-16">
            {/* Header */}
            <div className="mb-12 relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
                        הגדרות <label className="text-gradient-primary">חשבון</label>
                    </h2>
                    <p className="text-slate-500 font-medium">נהל את הפרטים האישיים, העדפות AI והאבטחה שלך.</p>
                </div>
                <div className="flex flex-row items-center gap-3 self-start">
                    <Link href="/" className="px-5 py-2.5 bg-white dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm flex flex-row items-center gap-2">
                        קח אותי הביתה
                    </Link>
                    <form action={logoutUser}>
                        <button type="submit" className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl border border-red-200 dark:border-red-800/30 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm flex flex-row items-center gap-2">
                            <LogOut className="w-4 h-4" />
                            התנתק
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id ? 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/30 -translate-x-2' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-[#111C44] hover:text-slate-800 dark:hover:text-white'}`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="vibrant-card p-8 md:p-10 min-h-[600px] relative overflow-hidden"
                    >
                        {activeTab === 'account' && <AccountSettings user={user} />}
                        {activeTab === 'preferences' && <PreferencesSettings />}
                        {activeTab === 'ai' && <AITuningSettings />}
                        {activeTab === 'notifications' && <NotificationsSettings />}
                        {activeTab === 'security' && <SecuritySettings user={user} />}
                        {activeTab === 'billing' && <BillingSettings />}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 1. ACCOUNT SETTINGS (existing)
// ═══════════════════════════════════════════
function AccountSettings({ user }: { user: { name: string, email: string, image?: string } }) {
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [name, setName] = useState(user.name);
    const [image, setImage] = useState(user.image || '');
    const [isSaving, setIsSaving] = useState(false);

    const firstName = name.split(' ')[0] || '';
    const lastName = name.split(' ').slice(1).join(' ') || '';

    useEffect(() => {
        isGoogleConnected().then(setIsDriveConnected);
    }, []);

    const handleToggleDrive = async () => {
        if (isDriveConnected) {
            await disconnectGoogleDrive();
            setIsDriveConnected(false);
        } else {
            const url = await getGoogleAuthUrl();
            window.location.href = url;
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (e.g., max 5MB for the original)
            if (file.size > 5 * 1024 * 1024) {
                alert('הקובץ גדול מדי. נא לבחור תמונה קטנה מ-5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize to max 400px (plenty for a profile pic)
                    const MAX_SIZE = 400;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setImage(compressedBase64);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        const result = await updateProfile(formData);
        if (result.success) {
            alert('הפרופיל עודכן בהצלחה! ✨');
        } else {
            alert('שגיאה בעדכון הפרופיל: ' + result.error);
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-10 relative z-10">
            <SectionHeader title="פרופיל ציבורי" subtitle="זה יוצג בסביבת העבודה שלך." />

            {/* Google Drive Status */}
            <div className="p-6 bg-[#4318FF]/5 border border-[#4318FF]/20 rounded-3xl flex items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-[#111C44] rounded-2xl flex items-center justify-center shadow-sm">
                        <HardDrive className={`w-6 h-6 ${isDriveConnected ? 'text-[#4318FF]' : 'text-slate-400'}`} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white">חיבור ל-Google Drive</h4>
                        <p className="text-[11px] font-bold text-slate-500">
                            {isDriveConnected ? 'מחובר - ניתן לייצא משימות ישירות לענן' : 'לא מחובר - חבר כדי לגבות ולייצא משימות'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggleDrive}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${isDriveConnected ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-[#4318FF] text-white shadow-lg shadow-[#4318FF]/20 hover:-translate-y-0.5'}`}
                >
                    {isDriveConnected ? 'נתק חיבור' : 'חבר עכשיו'}
                </button>
            </div>

            <div className="flex items-center gap-8">
                <input type="file" id="profile-image" hidden accept="image/*" onChange={handleImageChange} />
                <div
                    onClick={() => document.getElementById('profile-image')?.click()}
                    className="w-24 h-24 rounded-3xl bg-gradient-stat-2 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#00E5FF]/30 relative group cursor-pointer overflow-hidden"
                >
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        user.name.charAt(0)
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <User className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => document.getElementById('profile-image')?.click()}
                        className="px-6 py-2.5 bg-[#4318FF] text-white font-bold text-sm rounded-xl hover:shadow-[0_10px_20px_rgba(67,24,255,0.3)] hover:-translate-y-0.5 transition-all"
                    >
                        שנה תמונה
                    </button>
                    <button
                        onClick={() => setImage('')}
                        className="px-6 py-2.5 bg-slate-100 dark:bg-[#111C44] text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        הסר
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">שם פרטי</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                            const newFirstName = e.target.value;
                            setName(`${newFirstName} ${lastName}`);
                        }}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">שם משפחה</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                            const newLastName = e.target.value;
                            setName(`${firstName} ${newLastName}`);
                        }}
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-[#4318FF] text-slate-800 dark:text-white font-bold text-sm focus:outline-none transition-colors shadow-inner"
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">חיבור אימייל</label>
                    <div className="relative">
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="email" value={user.email} disabled className="w-full pr-12 pl-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 font-bold text-sm focus:outline-none transition-colors shadow-inner grayscale" />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-start">
                <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    שמור שינויים
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 2. PREFERENCES SETTINGS (NEW)
// ═══════════════════════════════════════════
function PreferencesSettings() {
    const [language, setLanguage] = useState('he');
    const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
    const [startOfWeek, setStartOfWeek] = useState('sunday');
    const [compactMode, setCompactMode] = useState(false);
    const [animations, setAnimations] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [defaultView, setDefaultView] = useState('kanban');
    const [defaultPriority, setDefaultPriority] = useState('Medium');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('taskflow-preferences') || '{}');
        if (saved.language) setLanguage(saved.language);
        if (saved.dateFormat) setDateFormat(saved.dateFormat);
        if (saved.startOfWeek) setStartOfWeek(saved.startOfWeek);
        if (saved.compactMode !== undefined) setCompactMode(saved.compactMode);
        if (saved.animations !== undefined) setAnimations(saved.animations);
        if (saved.soundEffects !== undefined) setSoundEffects(saved.soundEffects);
        if (saved.defaultView) setDefaultView(saved.defaultView);
        if (saved.defaultPriority) setDefaultPriority(saved.defaultPriority);
    }, []);

    const save = () => {
        localStorage.setItem('taskflow-preferences', JSON.stringify({
            language, dateFormat, startOfWeek, compactMode, animations, soundEffects, defaultView, defaultPriority
        }));
        alert('ההעדפות נשמרו בהצלחה! ✨');
    };

    return (
        <div className="space-y-8 relative z-10">
            <SectionHeader title="העדפות כלליות" subtitle="התאם את המראה וההתנהגות של סביבת העבודה." />

            {/* Appearance Section */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Palette className="w-3 h-3" /> מראה וממשק
                </p>
                <div className="space-y-3">
                    <SettingRow icon={Monitor} iconColor="#4318FF" title="תצוגה ברירת מחדל" subtitle="איך לוח הבקרה יוצג">
                        <select value={defaultView} onChange={e => setDefaultView(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="kanban">לוח קנבאן</option>
                            <option value="list">רשימה</option>
                            <option value="calendar">לוח שנה</option>
                        </select>
                    </SettingRow>

                    <SettingRow icon={Smartphone} iconColor="#00E5FF" title="מצב קומפקטי" subtitle="הקטנת רווחים ושדות לתצוגה צפופה יותר">
                        <Toggle enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
                    </SettingRow>

                    <SettingRow icon={Zap} iconColor="#FF7D00" title="אנימציות" subtitle="אנימציות כניסה, מעברים ואפקטים חזותיים">
                        <Toggle enabled={animations} onToggle={() => setAnimations(!animations)} />
                    </SettingRow>

                    <SettingRow icon={BellRing} iconColor="#7C3AED" title="צלילי מערכת" subtitle="צליל בעת השלמת משימה ואירועים חשובים">
                        <Toggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
                    </SettingRow>
                </div>
            </div>

            {/* Regional Section */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> אזוריות ותאריכים
                </p>
                <div className="space-y-3">
                    <SettingRow icon={Languages} iconColor="#10B981" title="שפת ממשק" subtitle="שפת התצוגה של האפליקציה">
                        <select value={language} onChange={e => setLanguage(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="he">עברית 🇮🇱</option>
                            <option value="en">English 🇺🇸</option>
                        </select>
                    </SettingRow>

                    <SettingRow icon={Calendar} iconColor="#EC4899" title="פורמט תאריך" subtitle="אופן הצגת התאריכים">
                        <select value={dateFormat} onChange={e => setDateFormat(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                    </SettingRow>

                    <SettingRow icon={Clock} iconColor="#F59E0B" title="תחילת השבוע" subtitle="היום הראשון בלוח השנה">
                        <select value={startOfWeek} onChange={e => setStartOfWeek(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="sunday">ראשון</option>
                            <option value="monday">שני</option>
                        </select>
                    </SettingRow>
                </div>
            </div>

            {/* Defaults Section */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> ברירות מחדל למשימות
                </p>
                <div className="space-y-3">
                    <SettingRow icon={AlertTriangle} iconColor="#EF4444" title="עדיפות ברירת מחדל" subtitle="עדיפות אוטומטית למשימות חדשות">
                        <select value={defaultPriority} onChange={e => setDefaultPriority(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="Low">נמוכה</option>
                            <option value="Medium">בינונית</option>
                            <option value="High">גבוהה</option>
                        </select>
                    </SettingRow>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-start">
                <button onClick={save} className="px-8 py-3.5 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> שמור העדפות
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 3. AI TUNING SETTINGS (existing)
// ═══════════════════════════════════════════
function AITuningSettings() {
    const [autoClassify, setAutoClassify] = useState(true);
    const [autoSubtasks, setAutoSubtasks] = useState(true);
    const [personality, setPersonality] = useState('professional');
    const [dailySummary, setDailySummary] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            alert('הגדרות ה-AI עודכנו בהצלחה! 🧠');
            setIsSaving(false);
        }, 500);
    };

    return (
        <div className="space-y-8 relative z-10">
            <SectionHeader title="מוח AI של Gemini" subtitle="הגדר כיצד סוכן ה-AI מתקשר עם סביבת העבודה שלך." />

            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> יכולות AI
                </p>
                <div className="space-y-3">
                    <SettingRow icon={Sparkles} iconColor="#FF00E5" title="סיווג אוטומטי" subtitle="AI יקצה קטגוריות ועדיפויות למשימות חדשות">
                        <Toggle enabled={autoClassify} onToggle={() => setAutoClassify(!autoClassify)} />
                    </SettingRow>

                    <SettingRow icon={Zap} iconColor="#4318FF" title="יצירת תתי-משימות אוטומטית" subtitle="AI יפרק משימות מורכבות לצעדים">
                        <Toggle enabled={autoSubtasks} onToggle={() => setAutoSubtasks(!autoSubtasks)} />
                    </SettingRow>

                    <SettingRow icon={BarChart3} iconColor="#00E5FF" title="סיכום יומי AI" subtitle="קבלת תקציר יומי של ביצועים והמלצות">
                        <Toggle enabled={dailySummary} onToggle={() => setDailySummary(!dailySummary)} />
                    </SettingRow>
                </div>
            </div>

            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">טון פרסונה של עוזר AI</p>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { id: 'professional', emoji: '👔', label: 'מקצועי', color: '#4318FF' },
                        { id: 'direct', emoji: '⚡', label: 'ישיר ותמציתי', color: '#FF7D00' },
                        { id: 'friendly', emoji: '🌈', label: 'ידידותי ומוטיבציוני', color: '#00E5FF' },
                    ].map(p => (
                        <button key={p.id} onClick={() => setPersonality(p.id)}
                            className={`p-4 rounded-2xl border-2 text-center transition-all ${personality === p.id ? `border-[${p.color}] bg-[${p.color}]/5` : 'border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100'}`}
                            style={personality === p.id ? { borderColor: p.color, backgroundColor: p.color + '10' } : {}}>
                            <span className="block text-xl mb-1">{p.emoji}</span>
                            <span className="text-xs font-bold" style={personality === p.id ? { color: p.color } : {}}>{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-1">מפתח Google Gemini API</label>
                <input type="password" defaultValue="************************" readOnly className="w-full px-5 py-4 bg-slate-50 dark:bg-[#0B1437]/50 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 font-mono text-sm focus:outline-none shadow-inner opacity-70" />
                <p className="text-[10px] font-bold text-[#FF00E5] pr-1">מפתח ה-API מנוהל דרך משתני סביבה מאובטחים (.env).</p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-gradient-stat-2 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_15px_30px_rgba(0,229,255,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    שמור הגדרות AI
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 4. NOTIFICATIONS SETTINGS (NEW)
// ═══════════════════════════════════════════
function NotificationsSettings() {
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [pushNotifs, setPushNotifs] = useState(false);
    const [deadlineReminder, setDeadlineReminder] = useState(true);
    const [dailyDigest, setDailyDigest] = useState(true);
    const [weeklyReport, setWeeklyReport] = useState(true);
    const [achievementAlerts, setAchievementAlerts] = useState(true);
    const [breakReminders, setBreakReminders] = useState(true);
    const [aiSuggestions, setAiSuggestions] = useState(true);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [quietStart, setQuietStart] = useState('22:00');
    const [quietEnd, setQuietEnd] = useState('08:00');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            alert('הגדרות ההתראות נשמרו! 🔔');
            setIsSaving(false);
        }, 500);
    };

    return (
        <div className="space-y-8 relative z-10">
            <SectionHeader title="מרכז התראות" subtitle="שליטה מלאה על ההתראות שלך - מה, מתי ואיך." />

            {/* Channels */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <BellRing className="w-3 h-3" /> ערוצי התראות
                </p>
                <div className="space-y-3">
                    <SettingRow icon={Mail} iconColor="#4318FF" title="התראות אימייל" subtitle="קבלת עדכונים ישירות למייל">
                        <Toggle enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
                    </SettingRow>

                    <SettingRow icon={Smartphone} iconColor="#00E5FF" title="דחיפות Push" subtitle="התראות מיידיות בדפדפן (דורש אישור)">
                        <Toggle enabled={pushNotifs} onToggle={() => setPushNotifs(!pushNotifs)} />
                    </SettingRow>
                </div>
            </div>

            {/* Types */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> סוגי התראות
                </p>
                <div className="space-y-3">
                    <SettingRow icon={AlertTriangle} iconColor="#EF4444" title="תזכורות דד-ליין" subtitle="התראה כשמשימה מתקרבת לתאריך היעד">
                        <Toggle enabled={deadlineReminder} onToggle={() => setDeadlineReminder(!deadlineReminder)} />
                    </SettingRow>

                    <SettingRow icon={BarChart3} iconColor="#FF7D00" title="סיכום יומי" subtitle="תקציר יומי של משימות שהושלמו ומה נותר">
                        <Toggle enabled={dailyDigest} onToggle={() => setDailyDigest(!dailyDigest)} />
                    </SettingRow>

                    <SettingRow icon={Calendar} iconColor="#7C3AED" title="דוח שבועי" subtitle="ניתוח ביצועים שבועי עם גרפים ותובנות">
                        <Toggle enabled={weeklyReport} onToggle={() => setWeeklyReport(!weeklyReport)} />
                    </SettingRow>

                    <SettingRow icon={Trophy} iconColor="#F59E0B" title="הישגים ותגים" subtitle="חגיגה כשאתה פותח הישג חדש">
                        <Toggle enabled={achievementAlerts} onToggle={() => setAchievementAlerts(!achievementAlerts)} />
                    </SettingRow>

                    <SettingRow icon={Heart} iconColor="#10B981" title="תזכורות הפסקה" subtitle="תזכורת לקום ולנוע כל 45 דקות">
                        <Toggle enabled={breakReminders} onToggle={() => setBreakReminders(!breakReminders)} />
                    </SettingRow>

                    <SettingRow icon={Sparkles} iconColor="#EC4899" title="הצעות AI" subtitle="הצעות חכמות לשיפור פרודוקטיביות">
                        <Toggle enabled={aiSuggestions} onToggle={() => setAiSuggestions(!aiSuggestions)} />
                    </SettingRow>
                </div>
            </div>

            {/* Schedule */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> תזמון
                </p>
                <div className="space-y-3">
                    <SettingRow icon={BellRing} iconColor="#4318FF" title="שעת תזכורת יומית" subtitle="מתי לשלוח את הסיכום היומי">
                        <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF] [color-scheme:light] dark:[color-scheme:dark]" />
                    </SettingRow>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/15">
                                <BellOff className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800 dark:text-white">שעות שקט</h4>
                                <p className="text-[11px] font-bold text-slate-500">אין התראות בשעות אלה</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">מ-</label>
                                <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF] [color-scheme:light] dark:[color-scheme:dark]" />
                            </div>
                            <span className="text-slate-400 font-bold mt-4">→</span>
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">עד-</label>
                                <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF] [color-scheme:light] dark:[color-scheme:dark]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-start">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-gradient-stat-1 text-white font-black uppercase tracking-wider text-[11px] rounded-xl hover:shadow-[0_15px_30px_rgba(67,24,255,0.3)] hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4" />
                    )}
                    שמור הגדרות
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 5. SECURITY SETTINGS (NEW)
// ═══════════════════════════════════════════
function SecuritySettings({ user }: { user: { name: string; email: string } }) {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState('30');

    const loginHistory = [
        { device: 'Chrome — Windows 10', location: 'תל אביב, ישראל', time: 'היום, 23:20', current: true },
        { device: 'Safari — iPhone 15', location: 'תל אביב, ישראל', time: 'אתמול, 14:05', current: false },
        { device: 'Chrome — MacBook Pro', location: 'ירושלים, ישראל', time: '3 ימים', current: false },
    ];

    return (
        <div className="space-y-8 relative z-10">
            <SectionHeader title="אבטחה ופרטיות" subtitle="הגן על החשבון שלך עם שכבות אבטחה מתקדמות." />

            {/* Password */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Key className="w-3 h-3" /> שינוי סיסמה
                </p>
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 p-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">סיסמה נוכחית</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type={showCurrentPw ? 'text' : 'password'} placeholder="••••••••"
                                className="w-full pr-11 pl-11 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]" />
                            <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute left-4 top-1/2 -translate-y-1/2">
                                {showCurrentPw ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">סיסמה חדשה</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type={showNewPw ? 'text' : 'password'} placeholder="לפחות 8 תווים"
                                className="w-full pr-11 pl-11 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]" />
                            <button onClick={() => setShowNewPw(!showNewPw)} className="absolute left-4 top-1/2 -translate-y-1/2">
                                {showNewPw ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => alert('הסיסמה עודכנה בהצלחה! (סימולציה)')}
                        className="px-6 py-3 bg-[#4318FF] text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Key className="w-3 h-3" /> עדכן סיסמה
                    </button>
                </div>
            </div>

            {/* 2FA & Security Options */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3" /> אפשרויות אבטחה
                </p>
                <div className="space-y-3">
                    <SettingRow icon={Fingerprint} iconColor="#4318FF" title="אימות דו-שלבי (2FA)" subtitle="הוסף שכבת אבטחה עם קוד חד-פעמי">
                        <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
                    </SettingRow>

                    <SettingRow icon={Bell} iconColor="#EF4444" title="התראות כניסה" subtitle="קבל התראה כשמישהו נכנס לחשבונך">
                        <Toggle enabled={loginAlerts} onToggle={() => setLoginAlerts(!loginAlerts)} />
                    </SettingRow>

                    <SettingRow icon={Clock} iconColor="#F59E0B" title="פקיעת סשן" subtitle="מתי לנתק אוטומטית (דקות)">
                        <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#4318FF]">
                            <option value="15">15 דקות</option>
                            <option value="30">30 דקות</option>
                            <option value="60">שעה</option>
                            <option value="1440">24 שעות</option>
                        </select>
                    </SettingRow>
                </div>
            </div>

            {/* Login History */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <History className="w-3 h-3" /> היסטוריית כניסות
                </p>
                <div className="space-y-2">
                    {loginHistory.map((entry, i) => (
                        <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between ${entry.current ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/10'}`}>
                            <div className="flex items-center gap-3">
                                <Monitor className={`w-5 h-5 ${entry.current ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        {entry.device}
                                        {entry.current && <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">נוכחי</span>}
                                    </p>
                                    <p className="text-[11px] font-bold text-slate-500">{entry.location} • {entry.time}</p>
                                </div>
                            </div>
                            {!entry.current && (
                                <button
                                    onClick={() => alert('סשן נסגר בהצלחה.')}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors" title="סיים סשן"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-red-200 dark:border-red-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> אזור מסוכן
                </p>
                <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-2xl flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-black text-red-600 dark:text-red-400">מחיקת חשבון</h4>
                        <p className="text-[11px] font-bold text-red-500/70">מחיקה זו היא בלתי הפיכה. כל הנתונים שלך יימחקו לצמיתות.</p>
                    </div>
                    <button
                        onClick={() => alert('פעולה זו חסומה בגרסת ההדגמה.')}
                        className="px-5 py-2.5 bg-red-500 text-white font-black uppercase tracking-wider text-[10px] rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2 flex-shrink-0"
                    >
                        <Trash2 className="w-3 h-3" /> מחק חשבון
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// 6. BILLING SETTINGS (NEW)
// ═══════════════════════════════════════════
function BillingSettings() {
    const [selectedPlan, setSelectedPlan] = useState('pro');

    const plans = [
        {
            id: 'free', name: 'חינם', price: '₪0', period: 'לתמיד',
            color: '#94a3b8', icon: Star,
            features: ['עד 25 משימות', 'תצוגת קנבאן', 'מצב כהה', 'ייצוא CSV'],
            limitations: ['ללא AI', 'ללא אנליטיקס', 'ללא תזכורות חכמות'],
        },
        {
            id: 'pro', name: 'Pro', price: '₪29', period: 'לחודש', popular: true,
            color: '#4318FF', icon: Rocket,
            features: ['משימות ללא הגבלה', 'AI Companion מלא', 'אנליטיקס מתקדם', 'לוח שנה חכם', 'תזכורות חכמות', 'הישגים ותגים', 'ערכות נושא', 'ייצוא CSV + JSON'],
            limitations: [],
        },
        {
            id: 'team', name: 'Team', price: '₪79', period: 'לחודש',
            color: '#FF00E5', icon: Crown,
            features: ['הכל ב-Pro +', 'שיתוף משימות', 'ניהול צוות', 'API מתקדם', 'תמיכה ייעודית', 'SSO (Google/GitHub)', 'דוחות מנהלים'],
            limitations: [],
        },
    ];

    const handleDownloadInvoice = (invoiceId: string, date: string, amount: string) => {
        const content = `
TAASKFLOW INVOICE
-----------------
Invoice Number: ${invoiceId}
Billing Date: ${date}
Amount Paid: ${amount}
Status: PAID
        
Thank you for using TaskFlow Pro!
        `.trim();

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${invoiceId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8 relative z-10">
            <SectionHeader title="חיוב ותוכנית" subtitle="נהל את המנוי שלך ובחר את התוכנית המתאימה." />

            {/* Current Plan Banner */}
            <div className="p-6 bg-gradient-to-r from-[#4318FF] to-[#7C3AED] rounded-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 blur-3xl rounded-full -ml-20 -mt-20" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">התוכנית הנוכחית שלך</p>
                        <h3 className="text-3xl font-black flex items-center gap-2">
                            <Rocket className="w-7 h-7" /> Pro
                        </h3>
                        <p className="text-sm font-bold text-white/80 mt-1">₪29/חודש • מתחדש ב-1 באפריל 2026</p>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">ניצול</p>
                        <p className="text-2xl font-black">∞</p>
                        <p className="text-xs font-bold text-white/60">משימות ללא הגבלה</p>
                    </div>
                </div>
            </div>

            {/* Plans */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">בחר תוכנית</p>
                <div className="grid md:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-6 rounded-2xl border-2 text-right transition-all ${selectedPlan === plan.id ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg hover:scale-[1.01]'}`}
                            style={{
                                borderColor: selectedPlan === plan.id ? plan.color : undefined,
                                backgroundColor: selectedPlan === plan.id ? plan.color + '08' : undefined,
                            }}>
                            {plan.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#4318FF] text-white text-[9px] font-black uppercase tracking-wider rounded-full">הכי פופולרי</span>
                            )}

                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: plan.color + '15' }}>
                                <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                            </div>

                            <h4 className="text-lg font-black text-slate-800 dark:text-white">{plan.name}</h4>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                                <span className="text-xs font-bold text-slate-500">/{plan.period}</span>
                            </div>

                            <div className="space-y-2">
                                {plan.features.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {f}
                                    </div>
                                ))}
                                {plan.limitations.map((l, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400 line-through">
                                        <span className="w-3 h-3 flex-shrink-0 text-center text-[10px]">✕</span> {l}
                                    </div>
                                ))}
                            </div>

                            {selectedPlan === plan.id && (
                                <div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: plan.color }}>
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> אמצעי תשלום
                </p>
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-black text-xs">VISA</div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                            <p className="text-[11px] font-bold text-slate-500">תוקף 12/2027</p>
                        </div>
                    </div>
                    <button
                        onClick={() => alert('אמצעי תשלום יעודכן בקרוב.')}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        שנה כרטיס
                    </button>
                </div>
            </div>

            {/* Billing History */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <History className="w-3 h-3" /> היסטוריית חיובים
                    </p>
                    <button
                        onClick={() => {
                            alert('מוריד דוח שנתי...');
                            handleDownloadInvoice('ANNUAL-2026', '01/01/2026', '₪348.00');
                        }}
                        className="text-xs font-bold text-[#4318FF] hover:underline flex items-center gap-1"
                    >
                        <Download className="w-3 h-3" /> הורד הכל
                    </button>
                </div>
                <div className="space-y-2">
                    {[
                        { date: '01/03/2026', amount: '₪29.00', status: 'שולם', invoice: 'INV-2026-003' },
                        { date: '01/02/2026', amount: '₪29.00', status: 'שולם', invoice: 'INV-2026-002' },
                        { date: '01/01/2026', amount: '₪29.00', status: 'שולם', invoice: 'INV-2026-001' },
                    ].map((bill, i) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{bill.invoice}</p>
                                    <p className="text-[11px] font-bold text-slate-500">{bill.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-black text-slate-800 dark:text-white">{bill.amount}</span>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md">{bill.status}</span>
                                <button
                                    onClick={() => handleDownloadInvoice(bill.invoice, bill.date, bill.amount)}
                                    className="text-[#4318FF] hover:bg-[#4318FF]/10 p-1.5 rounded-lg transition-colors border-none"
                                >
                                    <Download className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
