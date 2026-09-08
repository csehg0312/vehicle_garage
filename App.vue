<template>
    <div class="app-shell">
        <aside class="sidebar">
            <div class="brand"><span class="brand-mark">VG</span><span>Vehicle Garage</span></div>
            <nav aria-label="Main navigation">
                <RouterLink to="/garage" class="nav-link"><span>▦</span> Garage</RouterLink>
            </nav>
            <div class="sidebar-note"><span class="status-dot"></span><span>Local garage<br><small>Saved on this device</small></span></div>
        </aside>
        <div class="page-wrap">
            <header class="topbar"><div><span class="eyebrow">PERSONAL OWNERSHIP JOURNAL</span><h1>Keep your garage in order.</h1></div><button class="avatar" aria-label="Open profile">CG</button></header>
            <main class="content"><RouterView /></main>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
:root { font-family: 'DM Sans', sans-serif; color: #1d2925; background: #f4f6f1; font-synthesis: none; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, a { font: inherit; }
.app-shell { display: flex; min-height: 100vh; }
.sidebar { width: 240px; background: #173b32; color: #e5eee4; padding: 28px 20px; display: flex; flex-direction: column; flex-shrink: 0; }
.brand { display: flex; align-items: center; gap: 10px; font-family: 'Space Grotesk'; font-weight: 600; letter-spacing: -.3px; }
.brand-mark { display: grid; place-items: center; width: 30px; height: 30px; color: #173b32; background: #d6e66c; border-radius: 7px; font-size: 11px; font-weight: 700; }
nav { margin-top: 60px; }.nav-link { display: flex; align-items: center; gap: 12px; color: #fff; text-decoration: none; background: #2b594b; border-radius: 8px; padding: 12px 14px; font-weight: 600; }.nav-link span { font-size: 20px; color: #d6e66c; }
.sidebar-note { margin-top: auto; display: flex; gap: 9px; align-items: center; font-size: 12px; color: #b4c9bd; border-top: 1px solid #386052; padding-top: 18px; }.sidebar-note small { color: #829f91; }.status-dot { width: 7px; height: 7px; background: #b9d849; border-radius: 50%; }
.page-wrap { flex: 1; min-width: 0; }.topbar { display: flex; justify-content: space-between; align-items: flex-start; padding: 42px clamp(24px, 5vw, 72px) 26px; background: #fbfcf9; border-bottom: 1px solid #e4e9e0; }.eyebrow { color: #7b8b80; font-size: 10px; letter-spacing: 1.7px; font-weight: 700; }.topbar h1 { font-family: 'Space Grotesk'; font-size: clamp(24px, 3vw, 36px); margin: 10px 0 0; letter-spacing: -1.5px; }.avatar { width: 38px; height: 38px; border: 0; border-radius: 50%; background: #dce6d9; color: #315b4e; font-size: 12px; font-weight: 700; }.content { max-width: 1180px; padding: 36px clamp(24px, 5vw, 72px) 72px; }
@media (max-width: 680px) { .sidebar { width: 100%; height: auto; padding: 16px 20px; flex-direction: row; align-items: center; }.sidebar nav { margin: 0 0 0 auto; }.sidebar-note { display: none; }.app-shell { display: block; }.nav-link { padding: 8px 10px; }.nav-link span { font-size: 17px; }.topbar { padding-top: 28px; } }
</style>