import React, { useState, useEffect } from 'react';
import {
  Cloud, User, Lock, LogOut, Settings, Folder, Image, Video, Music,
  Link as LinkIcon, FileText, Trash2, Download, Share2, Copy, PenTool,
  FolderPlus, MoveRight, CheckSquare, List, Sun, Moon, Shield, Gift,
  History, ChevronLeft, Search, MoreVertical
} from 'lucide-react';

type UserData = {
  username: string;
  password: string;
  role: 'user' | 'admin1' | 'admin2' | 'admin3';
  active: boolean;
};

type FileItem = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'link' | 'document' | 'folder';
  createdAt: string;
  folderId?: string;
};

type View = 'auth' | 'home' | 'mystora' | 'settings' | 'admin' | 'trash';
type Theme = 'sky' | 'night';

export default function App() {
  const [view, setView] = useState<View>('auth');
  const [theme, setTheme] = useState<Theme>('sky');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<'none' | 'multiple' | 'all'>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [giftCode, setGiftCode] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedUsers = localStorage.getItem('stora_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedFiles = localStorage.getItem('stora_files');
    if (savedFiles) setFiles(JSON.parse(savedFiles));
  }, []);

  useEffect(() => {
    localStorage.setItem('stora_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('stora_files', JSON.stringify(files));
  }, [files]);

  const isValidPassword = (pass: string) => /^\d{6,12}$/.test(pass);

  const handleRegister = () => {
    if (!isValidPassword(password)) {
      alert('Sandi HARUS berupa ANGKA, panjang 6–12 digit!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Sandi tidak cocok!');
      return;
    }
    if (users.find(u => u.username === username)) {
      alert('Nama pengguna sudah dipakai!');
      return;
    }
    const newUser: UserData = {
      username,
      password,
      role: users.length === 0 ? 'admin1' : 'user',
      active: true
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('home');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = () => {
    const found = users.find(
      u => u.username === username && u.password === password
    );
    if (!found) {
      alert('Nama pengguna atau sandi salah!');
      return;
    }
    if (!found.active) {
      alert('Akun telah dinonaktifkan!');
      return;
    }
    setCurrentUser(found);
    setView('home');
    setUsername('');
    setPassword('');
  };

  const redeemCode = () => {
    if (giftCode === '#adminstoraclouds123' && currentUser) {
      const newRole = currentUser.role === 'user' ? 'admin2' :
                      currentUser.role === 'admin2' ? 'admin3' : currentUser.role;
      if (newRole === currentUser.role) {
        alert('Sudah menjadi Admin!');
        setGiftCode('');
        return;
      }
      const updated = users.map(u =>
        u.username === currentUser.username ? { ...u, role: newRole } : u
      );
      setUsers(updated);
      setCurrentUser({ ...currentUser, role: newRole });
      alert('Selamat! Naik jadi Admin berhasil!');
    } else {
      alert('Kode tidak valid!');
    }
    setGiftCode('');
  };

  const toggleActive = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    const updated = users.map(u =>
      u.username === targetUser.username ? { ...u, active: !u.active } : u
    );
    setUsers(updated);
  };

  const revokeAdmin = (targetUser: UserData) => {
    if (!currentUser?.role.startsWith('admin')) return;
    if (targetUser.role === 'admin1') {
      alert('Tidak dapat mencabut hak Pemilik Utama!');
      return;
    }
    const updated = users.map(u =>
      u.username === targetUser.username ? { ...u, role: 'user' as const } : u
    );
    setUsers(updated);
  };

  const themeClass = theme === 'sky'
    ? 'bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-800'
    : 'bg-slate-900 text-slate-100';
  const cardClass = theme === 'sky'
    ? 'bg-white/80 shadow-md border border-sky-100'
    : 'bg-slate-800/80 shadow-md border border-slate-700';
  const btnPrimary = theme === 'sky'
    ? 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white'
    : 'bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white';
  const inputClass = theme === 'sky'
    ? 'bg-slate-50 border-sky-200 focus:border-sky-400'
    : 'bg-slate-800 border-slate-600 focus:border-sky-400';

  const filteredFiles = files.filter(f =>
    !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'image': return <Image size={28} className="text-sky-500" />;
      case 'video': return <Video size={28} className="text-indigo-500" />;
      case 'audio': return <Music size={28} className="text-rose-500" />;
      case 'link': return <LinkIcon size={28} className="text-emerald-500" />;
      case 'document': return <FileText size={28} className="text-amber-500" />;
      case 'folder': return <Folder size={28} className="text-yellow-500" />;
    }
  };

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-300`}>
      {view === 'auth' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className={`w-full max-w-md p-8 rounded-2xl ${cardClass}`}>
            <div className="text-center mb-8">
              <Cloud size={48} className="mx-auto text-sky-500 mb-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
                STORA CLOUDS ID
              </h1>
              <p className="text-sm opacity-60 mt-1">Penyimpanan Aman & Cepat</p>
            </div>

            <div className="flex mb-6 rounded-lg overflow-hidden border">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-2 font-medium transition-all ${
                  authTab === 'login' ? btnPrimary : ''
                }`}
              >Masuk</button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-2 font-medium transition-all ${
                  authTab === 'register' ? btnPrimary : ''
                }`}
              >Daftar</button>
            </div>

            {authTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="____________"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className={`w-full py-3 rounded-lg font-semibold ${btnPrimary} transition-transform active:scale-95`}
                >Masuk</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium opacity-70">Nama Pengguna</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="contoh: budi.santoso"
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Kata Sandi (Hanya Angka 6–12)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="6–12 digit angka"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium opacity-70">Ulangi Kata Sandi</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, ''))}
                    placeholder="Sama seperti di atas"
                    maxLength={12}
                    className={`w-full mt-1 px-4 py-3 rounded-lg border ${inputClass} outline-none transition`}
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className={`w-full py-3 rounded-lg font-semibold ${btnPrimary} transition-transform active:scale-95`}
                >Daftar</button>
                <p className="text-xs text-center opacity-50">Akun pertama = Otomatis jadi Admin 1</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view !== 'auth' && currentUser && (
        <header className="sticky top-0 z-50 px-4 py-3 border-b backdrop-blur-md bg-white/70 dark:bg-slate-900/70">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Cloud size={24} className="text-sky-500" />
              <span className="hidden sm:inline">STORA CLOUDS ID</span>
            </button>

            <div className="flex items-center gap-3">
              {view === 'mystora' && (
                <>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari..."
                      className={`pl-9 pr-3 py-2 rounded-lg border ${inputClass} outline-none w-40 sm:w-60`}
                    />
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(!showMenu)}
                      className={`p-2 rounded-lg border hover:bg-sky-100/50 transition`}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {showMenu && (
                      <div className={`absolute right-0 mt-2 w-48 rounded-lg ${cardClass} shadow-lg p-2 z-50`}>
                        <button
                          onClick={() => { setSelectMode('multiple'); setSelectedFiles([]); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left"
                        >
                          <CheckSquare size={16} /> Pilih Beberapa
                        </button>
                        <button
                          onClick={() => { setSelectMode('all'); setSelectedFiles(files.map(f => f.id)); setShowMenu(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-sky-100/50 text-left"
                        >
                          <List size={16} /> Pilih Semua
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{currentUser.username}</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {view === 'home' && currentUser && (
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Selamat Datang, {currentUser.username}! 👋
            </h2>
            <p className="opacity-60">Penyimpananmu aman di STORA CLOUDS ID</p>
            {currentUser.role.startsWith('admin') && (
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                👑 {currentUser.role.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => { setView('mystora'); setSelectMode('none'); setSelectedFiles([]); }}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Folder size={32} className="text-sky-500 mb-3" />
              <h3 className="font-semibold">My Stora</h3>
              <p className="text-xs opacity-50 mt-1">Berkas & Galeri</p>
            </button>

            <button
              onClick={() => setView('settings')}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Settings size={32} className="text-slate-500 mb-3" />
              <h3 className="font-semibold">Pengaturan</h3>
              <p className="text-xs opacity-50 mt-1">Akun & Tema</p>
            </button>

            <button
              onClick={() => setView('trash')}
              className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
            >
              <Trash2 size={32} className="text-rose-500 mb-3" />
              <h3 className="font-semibold">Sampah</h3>
              <p className="text-xs opacity-50 mt-1">Berkas Dihapus</p>
            </button>

            {currentUser.role.startsWith('admin') && (
              <button
                onClick={() => setView('admin')}
                className={`p-6 rounded-xl ${cardClass} hover:scale-105 transition-transform text-left`}
              >
                <Shield size={32} className="text-amber-500 mb-3" />
                <h3 className="font-semibold">Ruang Admin</h3>
                <p className="text-xs opacity-50 mt-1">Kelola Pengguna</p>
              </button>
            )}
          </div>
        </main>
      )}

      {view === 'mystora' && currentUser && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {selectMode !== 'none' && selectedFiles.length > 0 && (
            <div className={`mb-4 p-3 rounded-lg ${cardClass} flex flex-wrap gap-2`}>
              <span className="text-sm font-medium mr-2">{selectedFiles.length} dipilih</span>
              <button
                onClick={() => {
                  if (confirm(`Hapus ${selectedFiles.length} berkas?`)) {
                    setFiles(files.filter(f => !selectedFiles.includes(f.id)));
                    setSelectedFiles([]);
                    setSelectMode('none');
                  }
                }}
                className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <Trash2 size={14} /> Hapus
              </button>
              <button
                onClick={() => {
                  const name = prompt('Nama folder baru:');
                  if (name) {
                    setFiles([...files, {
                      id: `f-${Date.now()}`,
                      name,
                      type: 'folder',
                      createdAt: new Date().toISOString()
                    }]);
                  }
                }}
                className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <FolderPlus size={14} /> Buat Folder
              </button>
              <button
                onClick={() => { alert('Pilih folder tujuan untuk memindahkan'); }}
                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm flex items-center gap-1"
              >
                <MoveRight size={14} /> Pindahkan
              </button>
              <button
                onClick={() => { setSelectMode('none'); setSelectedFiles([]); }}
                className="px-3 py-1.5 bg-slate-400 text-white rounded-lg text-sm"
              >Batal</button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-12 opacity-40">
                <Folder size={48} className="mx-auto mb-3" />
                <p>Belum ada berkas</p>
                <button
                  onClick={() => {
                    const name = prompt('Nama folder pertama:');
                    if (name) {
                      setFiles([...files, {
                        id: `f-${Date.now()}`,
                        name,
                        type: 'folder',
                        createdAt: new Date().toISOString()
                      }]);
                    }
                  }}
                  className={`mt-3 px-4 py-2 rounded-lg ${btnPrimary} text-sm`}
                >+ Buat Folder Pertama</button>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => {
                    if (selectMode !== 'none') {
                      setSelectedFiles(prev =>
                        prev.includes(file.id)
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      );
                    }
                  }}
                  className={`relative p-4 rounded-xl ${cardClass} cursor-pointer transition-all hover:scale-105 ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-sky-500' : ''
                  }`}
                >
                  {selectMode !== 'none' && (
                    <div className="absolute top-2 left-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedFiles.includes(file.id)
                          ? 'bg-sky-500 border-sky-500 text-white'
                          : 'border-slate-300'
                     