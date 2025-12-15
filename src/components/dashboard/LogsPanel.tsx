/**
 * LogsPanel 컴포넌트
 * 봇의 실시간 매매 로그(진입, 청산 등)를 리스트 형태로 보여주는 패널입니다.
 */
export const LogsPanel = () => {
    // 데모용 로그 데이터
    const logs = [
        { time: '12:21:06', symbol: 'BTC', qty: '0.1', pnl: '+$50.25', side: 'win' },
        { time: '12:20:48', symbol: 'ETH', qty: '2.5', pnl: '-$12.10', side: 'loss' },
        { time: '12:19:00', symbol: 'SOL', qty: '15.0', pnl: '+$15.00', side: 'win' },
        { time: '12:18:12', symbol: 'BTC', qty: '0.05', pnl: '-$5.00', side: 'loss' },
        { time: '12:21:05', symbol: 'BTC', qty: '0.1', pnl: '+$50.25', side: 'win' },
        { time: '12:20:49', symbol: 'ETH', qty: '2.5', pnl: '-$12.10', side: 'loss' },
    ];

    return (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                LIVE LOGS
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '0.25rem' }}>TIME</th>
                            <th style={{ padding: '0.25rem' }}>SYM</th>
                            <th style={{ padding: '0.25rem', textAlign: 'right' }}>QTY</th>
                            <th style={{ padding: '0.25rem', textAlign: 'right' }}>PNL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                <td style={{ padding: '0.35rem 0.25rem', color: 'var(--text-muted)' }}>{log.time}</td>
                                <td style={{ padding: '0.35rem 0.25rem' }}>{log.symbol}</td>
                                <td style={{ padding: '0.35rem 0.25rem', textAlign: 'right' }}>{log.qty}</td>
                                <td style={{ padding: '0.35rem 0.25rem', textAlign: 'right', color: log.side === 'win' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                    {log.pnl}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
