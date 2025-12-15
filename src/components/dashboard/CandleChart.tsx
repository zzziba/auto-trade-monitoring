import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries, type IChartApi, type ISeriesApi, type Time } from 'lightweight-charts';
import { okxService } from '../../services/okx';

/**
 * CandleChart 컴포넌트
 * Lightweight Charts 라이브러리를 사용하여 캔들스틱, 거래량(Volume), 이동평균선(MA)을 렌더링합니다.
 */
export const CandleChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    // 차트 시리즈 참조 변수들
    // 차트 시리즈 참조 변수들
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const ma200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const ma400SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // 실시간 업데이트를 위한 MA 값 저장소
    const maValues = useRef({ ma20: 0, ma200: 0, ma400: 0 });

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. 차트 생성 및 기본 옵션 설정
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#8b9bb4', // 텍스트 색상 (Muted)
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 56, 0.3)' }, // 그리드 라인 투명도 조절
                horzLines: { color: 'rgba(42, 46, 56, 0.3)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                borderColor: '#2a2e38',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: '#2a2e38',
            },
        });

        // 2. 거래량(Volume) 시리즈 추가 (오버레이)
        // 캔들보다 먼저 추가하여 배경처럼 깔리게 하거나 scaleMargins로 위치 조정
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // 메인 가격 스케일과 별도로 오버레이
        });
        // 거래량은 차트 하단 20% 영역에만 표시되도록 설정
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // 3. 캔들스틱(Price) 시리즈 추가
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#00ff9d',    // 상승 시 네온 그린
            downColor: '#ff3b30',  // 하락 시 네온 레드
            borderVisible: false,
            wickUpColor: '#00ff9d',
            wickDownColor: '#ff3b30',
            priceLineVisible: true,
            lastValueVisible: true,
            priceLineWidth: 0.3 as any, // Try fractional width
            priceLineStyle: 0, // Solid
        });

        // 4. 이동평균선(MA) 시리즈 추가 (20일선 예시)
        const maSeries = chart.addSeries(LineSeries, {
            color: 'rgba(4, 111, 232, 1)', // 파란색 라인
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: false, // 가격 레이블 숨김
            priceLineVisible: false, // 가격 라인 숨김
        });

        // MA 200 (추가) - 주황색
        const ma200Series = chart.addSeries(LineSeries, {
            color: '#ff9800',
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: false, // 가격 레이블 숨김
            priceLineVisible: false, // 가격 라인 숨김
        });

        // MA 400 (추가) - 보라색
        const ma400Series = chart.addSeries(LineSeries, {
            color: '#9c27b0',
            lineWidth: 2,
            crosshairMarkerVisible: false,
            lastValueVisible: false, // 가격 레이블 숨김
            priceLineVisible: false, // 가격 라인 숨김
        });



        // 참조 저장
        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        maSeriesRef.current = maSeries;
        ma200SeriesRef.current = ma200Series;
        ma400SeriesRef.current = ma400Series;

        // 5. OKX 실시간 데이터 구독 및 업데이트 처리
        okxService.onCandleUpdate((data: any[]) => {
            // OKX 데이터 포맷: [ts, open, high, low, close, vol, ...]
            if (data && data.length > 0) {
                const candle = data[0];
                const time = parseInt(candle[0]) / 1000 as Time; // 타임스탬프 (초 단위)

                // 캔들 데이터 객체 생성
                const item = {
                    time: time,
                    open: parseFloat(candle[1]),
                    high: parseFloat(candle[2]),
                    low: parseFloat(candle[3]),
                    close: parseFloat(candle[4]),
                };

                // 거래량 데이터 객체 생성 (상승/하락에 따라 색상 변경)
                const volumeItem = {
                    time: time,
                    value: parseFloat(candle[5]),
                    color: item.close > item.open ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 59, 48, 0.3)',
                };

                // 각 시리즈 업데이트
                candleSeries.update(item);
                volumeSeries.update(volumeItem);

                // MA 업데이트 (EMA 방식 근사치 적용)
                const closePrice = item.close;

                // 값이 없으면 현재가로 초기화
                if (maValues.current.ma20 === 0) maValues.current = { ma20: closePrice, ma200: closePrice, ma400: closePrice };

                maValues.current.ma20 = (maValues.current.ma20 * 19 + closePrice) / 20;
                maValues.current.ma200 = (maValues.current.ma200 * 199 + closePrice) / 200;
                maValues.current.ma400 = (maValues.current.ma400 * 399 + closePrice) / 400;

                maSeries.update({ time: time, value: maValues.current.ma20 });
                ma200Series.update({ time: time, value: maValues.current.ma200 });
                ma400Series.update({ time: time, value: maValues.current.ma400 });
            }
        });

        // 6. 초기 데모 데이터 생성 (빈 차트 방지용)
        const initialCandleData = [];
        const initialVolumeData = [];
        const initialMaData = [];    // MA 20
        const initialMa200Data = []; // MA 200
        const initialMa400Data = []; // MA 400

        let time = Math.floor(Date.now() / 1000) - 60 * 60 * 24; // 24시간 전부터 시작 (데이터량 확보)
        let value = 68000;

        // MA 계산을 위한 초기값
        let ma20_val = value;
        let ma200_val = value;
        let ma400_val = value;

        for (let i = 0; i < 1440; i++) { // 24시간 * 60분 = 1440개 캔들 생성
            const volatility = 30;
            const change = (Math.random() - 0.5) * volatility;
            const close = value + change;
            const open = value;
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;
            const vol = Math.random() * 100 + 50;

            const timestamp = (time + i * 60) as Time;

            // MA 시뮬레이션 (EMA 방식 근사치 사용: old * (N-1) + new) / N)
            ma20_val = (ma20_val * 19 + close) / 20;
            ma200_val = (ma200_val * 199 + close) / 200;
            ma400_val = (ma400_val * 399 + close) / 400;

            // 최근 240개 데이터만 차트에 표시 (너무 많으면 초기 로딩 느릴 수 있음)
            if (i >= 1200) {
                initialCandleData.push({ time: timestamp, open, high, low, close });
                initialVolumeData.push({
                    time: timestamp,
                    value: vol,
                    color: close > open ? 'rgba(0, 255, 157, 0.3)' : 'rgba(255, 59, 48, 0.3)'
                });
                initialMaData.push({ time: timestamp, value: ma20_val });
                initialMa200Data.push({ time: timestamp, value: ma200_val });
                initialMa400Data.push({ time: timestamp, value: ma400_val });
            }

            value = close;
        }

        // 초기 데이터 설정
        candleSeries.setData(initialCandleData);
        volumeSeries.setData(initialVolumeData);
        maSeries.setData(initialMaData);
        ma200Series.setData(initialMa200Data);
        ma400Series.setData(initialMa400Data);

        // 내 포지션 라인 표시 (사용자 요청: 차트 데이터 중 하나를 진입가로 설정)
        // 예: 50번째 전 캔들의 종가를 진입가로 사용하여 차트 흐름 상에 위치시킴
        const targetCandle = initialCandleData[initialCandleData.length - 50];
        const entryPrice = targetCandle ? targetCandle.close : 68500;

        const myPositionLine = {
            price: entryPrice,
            color: '#2979ff', // Blue
            lineWidth: 1 as const, // Thin
            lineStyle: 0, // Solid
            axisLabelVisible: true,
            // title removed - 라벨 없음
        };
        candleSeries.createPriceLine(myPositionLine);

        // 7. 반응형 크기 조절 핸들러
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
            }
        };

        window.addEventListener('resize', handleResize);

        // 언마운트 시 정리
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />;
};
