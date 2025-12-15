/**
 * OKX WebSocket 서비스 클래스
 * 실시간 시세 및 캔들 데이터를 수신하기 위해 OKX Public WebSocket API에 연결합니다.
 */
export class OKXWebSocket {
    private ws: WebSocket | null = null;
    // 구독자 목록을 관리하는 Map (키: 토픽, 값: 콜백함수)
    private subscribers: Map<string, (data: any) => void> = new Map();
    private pingInterval: any;

    constructor() {
        this.connect();
    }

    /**
     * WebSocket 연결 초기화
     */
    private connect() {
        this.ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');

        this.ws.onopen = () => {
            console.log('Connected to OKX WebSocket');
            this.startPing();

            // 기본적으로 BTC/USDT 1분봉 채널 구독 요청
            this.sendMessage({
                op: 'subscribe',
                args: [{ channel: 'candle1m', instId: 'BTC-USDT' }]
            });
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // 구독 확인 메시지는 무시
            if (message.event === 'subscribe') return;

            // 실제 데이터 수신 처리
            if (message.arg && message.data) {
                const channel = message.arg.channel;
                // 등록된 구독자에게 데이터 전달 (예: 캔들 데이터)
                if (channel === 'candle1m' && this.subscribers.has('candle')) {
                    this.subscribers.get('candle')!(message.data);
                }
            }
        };

        // 연결 종료 시 3초 후 재연결 시도
        this.ws.onclose = () => {
            console.log('Disconnected from OKX. Reconnecting...');
            clearInterval(this.pingInterval);
            setTimeout(() => this.connect(), 3000);
        };
    }

    /**
     * 연결 유지를 위한 Ping 전송 (20초 주기)
     */
    private startPing() {
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send('ping');
            }
        }, 20000);
    }

    /**
     * WebSocket 메시지 전송 헬퍼 함수
     */
    private sendMessage(msg: any) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        } else {
            // 연결이 아직 안 되었으면 1초 후 재시도
            setTimeout(() => this.sendMessage(msg), 1000);
        }
    }

    /**
     * 캔들 데이터 업데이트 구독 메서드
     * @param callback 데이터 수신 시 호출될 함수
     */
    public onCandleUpdate(callback: (data: any) => void) {
        this.subscribers.set('candle', callback);
    }
}

// 싱글톤 인스턴스 export
export const okxService = new OKXWebSocket();
