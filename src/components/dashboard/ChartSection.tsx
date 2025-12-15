import { Search } from 'lucide-react';
import { CandleChart } from './CandleChart';

/**
 * ChartSection 컴포넌트
 * 캔들 차트를 감싸고 있는 컨테이너로, 상단의 심볼 검색바(Overlay) 등을 포함합니다.
 */
export const ChartSection = () => {
    return (
        <div className="panel" style={{ position: 'relative', minHeight: '400px' }}>
            {/* 차트 상단 오버레이: 심볼 정보 및 검색 (현재는 데모용 정적 표시) */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 10,
                display: 'flex',
                gap: '0.5rem'
            }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Search size={16} />
                    <span style={{ fontSize: '0.85rem' }}>BTC/USDT</span>
                </div>
            </div>

            {/* 실제 차트가 렌더링되는 영역 */}
            <div style={{ width: '100%', height: '100%' }}>
                <CandleChart />
            </div>
        </div>
    );
};
