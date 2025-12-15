/**
 * StatsCards 컴포넌트
 * 계좌 잔고, 당일 손익, 승률, 활성 포지션 수 등 핵심 매매 지표를 카드 형태로 표시합니다.
 */
export const StatsCards = () => {
    // 데모용 데이터 (나중에 Props나 Context로 주입받아야 함)
    const stats = [
        { label: 'TOTAL BALANCE', value: '$124,500.25', color: 'white' },
        { label: "TODAY'S PNL", value: '+$1,250.50', color: 'var(--accent-green)' },
        { label: 'WIN RATE', value: '68%', color: 'white' },
        { label: 'ACTIVE POSITIONS', value: '5', color: 'white' },
    ];

    return (
        <div className="stats-grid">
            {stats.map((s, i) => (
                <div key={i} className="panel" style={{ padding: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {s.label}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: s.color }}>
                        {s.value}
                    </div>
                </div>
            ))}
        </div>
    );
};
