import './index.css';
import { Header } from './components/layout/Header';
import { StatsCards } from './components/dashboard/StatsCards';
import { ChartSection } from './components/dashboard/ChartSection';
import { LogsPanel } from './components/dashboard/LogsPanel';

/**
 * App 컴포넌트 (메인 엔트리)
 * 전체 대시보드 레이아웃을 구성하고 주요 섹션들을 배치합니다.
 */
function App() {
  return (
    <div className="dashboard-grid">
      {/* 1. 상단 헤더 영역 */}
      <Header />

      {/* 2. 메인 콘텐츠 그리드 (좌측: 스탯+차트, 우측: 로그 패널 확장) */}
      <div className="main-content-layout">
        {/* 좌측 칼럼 */}
        <div className="left-column">
          <StatsCards />
          <ChartSection />
        </div>

        {/* 우측 칼럼 (로그 패널 - 상단부터 하단까지 꽉 채움) */}
        <LogsPanel />
      </div>

      {/* 3. 하단 풋터 영역 (활성 포지션 요약 및 컨트롤 패널) */}
      {/* 4. 하단 풋터 영역 (활성 포지션 요약 및 컨트롤 패널) */}
      <footer className="footer-section">
        {/* 활성 포지션 리스트 (최대 3줄 표시) */}
        <div className="panel" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', maxHeight: '160px' }}>
          {[
            { symbol: 'BTC/USDT', side: 'LONG', qty: '0.500', entry: '$68,500', roi: '+12.5%', pnl: '+$4,250' },
            { symbol: 'ETH/USDT', side: 'SHORT', qty: '10.00', entry: '$3,500', roi: '-4.2%', pnl: '-$1,470' },
            { symbol: 'SOL/USDT', side: 'LONG', qty: '150.0', entry: '$145.0', roi: '+8.3%', pnl: '+$1,800' }
          ].map((pos, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem', /* Slightly more padding for larger font */
              background: i % 2 !== 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
              borderRadius: '4px',
              fontSize: '1.35rem' /* 1.5x of 0.9rem */
            }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, width: '120px' }}>{pos.symbol}</div>
                <div style={{ color: pos.side === 'LONG' ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 600, width: '80px' }}>{pos.side}</div>
                <div style={{ fontWeight: 600, width: '100px' }}>{pos.qty}</div>
                <div style={{ width: '120px' }}>{pos.entry}</div>
                <div style={{ color: pos.roi.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)', width: '100px' }}>{pos.roi}</div>
              </div>
              <button style={{
                background: 'rgba(255, 59, 48, 0.1)',
                border: '1px solid var(--accent-red)',
                color: 'var(--accent-red)',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginLeft: '1rem'
              }}>Close</button>
            </div>
          ))}
        </div>

        {/* 봇 제어 패널 */}
        <div className="panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* CONTROL PANEL 텍스트 제거됨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
            PAUSE BOT
            <div style={{ width: 40, height: 22, background: '#2a2e38', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: 18, height: 18, background: 'white', borderRadius: '50%', position: 'absolute', top: 2, left: 2 }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
