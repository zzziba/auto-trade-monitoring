import { TrendingUp, Wifi } from 'lucide-react';

/**
 * Header 컴포넌트
 * 대시보드 상단의 로고, API 연결 상태, 네트워크 지연 시간(Latency)을 표시합니다.
 */
export const Header = () => {
    return (
        <header className="header-section">
            {/* 왼쪽: 로고 및 타이틀 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp color="var(--accent-green)" size={28} />
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '1px' }}>
                    AUTO-TRADE MONITOR
                </h1>
            </div>

            {/* 오른쪽: 시스템 상태 표시 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* API 연결 상태 배지 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(0, 188, 212, 0.1)',
                    border: '1px solid var(--accent-blue)',
                    borderRadius: '4px',
                    color: 'var(--accent-blue)',
                    fontSize: '0.8rem',
                    fontWeight: 600
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 8px currentColor' }} />
                    API CONNECTED
                </div>

                {/* 네트워크 지연 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Wifi size={14} />
                    <span>Latency: 45ms</span>
                </div>
            </div>
        </header>
    );
};
