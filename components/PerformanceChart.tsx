
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ErrorBar } from 'recharts';
import { ChartDataItem } from '../types';
import { MODEL_COLORS } from '../constants';

interface PerformanceChartProps {
  data: ChartDataItem[];
  metricName: string;
  title?: string;
  headerControls?: React.ReactNode;
  yAxisTickInterval?: number;
  tightenYAxis?: boolean; // Used for average performance charts
  yAxisMinPointBuffer?: number; // New prop for academic individual charts
}

const neuralkLogoUrl = "https://cdn-images.welcometothejungle.com/v82GguLLmnQoPY4v0Gu9ZTGrzAwtFaKjAd0pF-mNsFw/resize:auto:400::/czM6Ly93dHRqLXByb2R1Y3Rpb24vYWNjb3VudHMvdXBsb2Fkcy9vcmdhbml6YXRpb25zL2xvZ29zL2E5MWQ5M2U5MWMyNDYyZjA0MzNjMTc0Zjc0YjNjMjMwLzU2NmZkOTBjLTY2M2ItNDJlZC04N2I4LTVmMGIwYTg1NGU0NS5wbmc";

const CustomBarShape = (props: any) => {
  const { fill, x, y, width, height, payload } = props;
  const logoSize = 30; 
  const logoPadding = 2;
  const isNiclBar = payload.modelName === 'NICL';

  const barTopY = height >= 0 ? y : y + height; 
  const visualBarHeight = Math.abs(height);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {isNiclBar && visualBarHeight > (logoSize + logoPadding) && width > logoSize && (
        <image
          href={neuralkLogoUrl}
          x={x + (width - logoSize) / 2}
          y={barTopY - logoSize - logoPadding} 
          height={logoSize}
          width={logoSize}
          preserveAspectRatio="xMidYMid meet"
        />
      )}
    </g>
  );
};


const isHigherBetter = (metricName: string): boolean => {
  const lowerIsBetterMetrics = ['rmse', 'inference latency (ms)', 'training time (s)'];
  return !lowerIsBetterMetrics.includes(metricName.toLowerCase());
};

// Helper function to generate "nice" tick values
const generateNiceTicks = (
  domainMin: number,
  domainMax: number,
  metricName: string,
  targetTickCount: number = 5,
  fixedInterval?: number, // Optional fixed interval
  tightenYAxisParam?: boolean // Renamed to avoid conflict
): number[] => {
    const common01Metrics = ['Accuracy', 'AUC', 'F1 Score', 'Precision', 'Recall'];

    if (typeof fixedInterval === 'number' && fixedInterval > 0 && common01Metrics.includes(metricName)) {
        const tickPrecision = Math.max(0, String(fixedInterval).includes('.') ? String(fixedInterval).split('.')[1].length : 0);
        let generatedTicksBase: number[] = [];

        // Generate ticks based on fixedInterval around the provided domainMin and domainMax
        let startTick = Math.floor(domainMin / fixedInterval) * fixedInterval;
        // Ensure startTick is not slightly above domainMin due to precision if domainMin itself is a multiple of fixedInterval
        if (startTick > domainMin && Math.abs(startTick - domainMin) < 1e-9 * fixedInterval) { // Check relative to interval size
           startTick -= fixedInterval;
        }
         // Further ensure startTick is at or below domainMin
        while (startTick > domainMin + 1e-9) { // Use a small epsilon for float comparison
            startTick -= fixedInterval;
        }


        let endTick = Math.ceil(domainMax / fixedInterval) * fixedInterval;
         // Ensure endTick is not slightly below domainMax
        if (endTick < domainMax && Math.abs(endTick - domainMax) < 1e-9 * fixedInterval) {
            endTick += fixedInterval;
        }
        // Further ensure endTick is at or above domainMax
        while (endTick < domainMax - 1e-9) {
            endTick += fixedInterval;
        }
        
        for (let val = startTick; val <= endTick + (fixedInterval / 2); val += fixedInterval) { // Loop up to endTick or slightly past
             generatedTicksBase.push(parseFloat(val.toFixed(tickPrecision)));
        }
        
        let displayTicks = generatedTicksBase.filter(
            tick => tick >= domainMin - fixedInterval * 0.01 && tick <= domainMax + fixedInterval * 0.01 // Filter generously
        );

        if (tightenYAxisParam) { // This is for the "Average Performance" chart specific zoom [0.6, 1.0]
            if (!displayTicks.some(t => Math.abs(t - domainMin) < 1e-9)) displayTicks.push(parseFloat(domainMin.toFixed(tickPrecision)));
            if (!displayTicks.some(t => Math.abs(t - domainMax) < 1e-9)) displayTicks.push(parseFloat(domainMax.toFixed(tickPrecision)));
             displayTicks = displayTicks.map(t => parseFloat(Math.max(domainMin, Math.min(domainMax, t)).toFixed(tickPrecision)));
        } else {
            // Original behavior: clamp to [0,1] if appropriate
            if (domainMin <= 0.05 && !displayTicks.some(t=>Math.abs(t-0.0)<1e-9)) displayTicks.push(0.0);
            // If domainMax is 1.0 (or very close) ensure 1.0 is a tick
            if (domainMax >= (1.0 - 1e-9) && !displayTicks.some(t=>Math.abs(t-1.0)<1e-9)) displayTicks.push(1.0);
            displayTicks = displayTicks.map(t => parseFloat(Math.max(0, Math.min(1, t)).toFixed(tickPrecision)));
        }
        
        displayTicks = [...new Set(displayTicks)].sort((a,b)=>a-b);
        // Ensure ticks are within the domain for fixed interval cases
        displayTicks = displayTicks.filter(t => t >= domainMin - 1e-9 && t <= domainMax + 1e-9);


        if (displayTicks.length < 2 && (domainMax - domainMin > 1e-9)) {
            const tempTicks = new Set(displayTicks);
            tempTicks.add(parseFloat(domainMin.toFixed(tickPrecision)));
            tempTicks.add(parseFloat(domainMax.toFixed(tickPrecision)));
            displayTicks = Array.from(tempTicks).sort((a,b)=>a-b);
        }
        
        return displayTicks.length > 0 ? displayTicks : [parseFloat(domainMin.toFixed(tickPrecision)), parseFloat(domainMax.toFixed(tickPrecision))];
    }


    // Determine precision based on typical metric values or step sizes (Existing logic)
    const getPrecision = (val: number): number => {
        const s = String(val);
        if (s.includes('.')) {
            return s.split('.')[1].length;
        }
        return 0;
    };
    
    let defaultPrecision = 2; 
    if (metricName.toLowerCase().includes('rmse') || Math.abs(domainMax - domainMin) < 0.01) {
        defaultPrecision = 3;
    }
    if (Math.abs(domainMax - domainMin) > 10) {
        defaultPrecision = 1;
    }
     if (Math.abs(domainMax - domainMin) > 50) {
        defaultPrecision = 0;
    }

  if (domainMin > domainMax) { 
      [domainMin, domainMax] = [domainMax, domainMin];
  }
    
  if (Math.abs(domainMin - domainMax) < 1e-9) { 
    let base = domainMin;
    let step = 0.1; 

    if (common01Metrics.includes(metricName) && !tightenYAxisParam) {
      step = 0.1;
      if (base === 1.0) return [0.8, 0.9, 1.0].filter(t => t>= domainMin - step && t <= domainMax + step);
      if (base === 0.0) return [0.0, 0.1, 0.2].filter(t => t>= domainMin - step && t <= domainMax + step);

      const ticks = [
        parseFloat(Math.max(0, base - step).toFixed(defaultPrecision)),
        parseFloat(base.toFixed(defaultPrecision)),
        parseFloat(Math.min(1, base + step).toFixed(defaultPrecision))
      ].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
      
      return ticks.filter(t => t >= domainMin && t <= domainMax);

    }
     // For tightenYAxisParam or non-01 metrics with single point
     const typicalRangeFraction = tightenYAxisParam ? 0.02 : 0.1; // smaller step for tightenYAxisParam with 01 metrics. 0.2 for others.
     step = Math.max(Math.abs(base * typicalRangeFraction), 0.005 * targetTickCount /2 , 0.005); 


    return [
      parseFloat((base - step).toFixed(defaultPrecision)),
      parseFloat(base.toFixed(defaultPrecision)),
      parseFloat((base + step).toFixed(defaultPrecision))
    ].sort((a,b)=>a-b).filter(t => t >= domainMin - step*0.01 && t <= domainMax + step*0.01); // ensure filter covers the new step
  }

  const range = domainMax - domainMin;

  const niceStepsCandidates = [
    0.001, 0.002, 0.0025, 0.005, 
    0.01, 0.02, 0.025, 0.05, 
    0.1, 0.2, 0.25, 0.5, 
    1, 2, 2.5, 5, 
    10, 20, 25, 50, 
    100, 200, 250, 500
  ];
  
  let bestStep = range / (targetTickCount -1); 
  
  let currentBestCandidateStep = niceStepsCandidates[niceStepsCandidates.length - 1]; 
  for (const candidate of niceStepsCandidates) {
      if (candidate <=0) continue; 
      const numTicksWithCandidate = range / candidate;
      if (numTicksWithCandidate >= (targetTickCount - 2) && numTicksWithCandidate <= (targetTickCount + 3)) { 
          currentBestCandidateStep = candidate;
          const simplerSteps = [0.01, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 5, 10, 20, 25, 50, 100];
          if (simplerSteps.includes(candidate)) break; 
      }
  }

  if (currentBestCandidateStep > 0) {
    if (range / currentBestCandidateStep > 10) { 
        for (const candidate of niceStepsCandidates) {
            if (candidate <=0) continue;
            if (range / candidate <= 7) { 
                currentBestCandidateStep = candidate;
                break;
            }
        }
    } else if (range / currentBestCandidateStep < 2.5 && range/currentBestCandidateStep > 0) { 
        for (let i = niceStepsCandidates.length - 1; i >=0; i--) {
            const candidate = niceStepsCandidates[i];
            if (candidate <=0) continue;
            if (candidate < currentBestCandidateStep && range / candidate >= 2) { 
                currentBestCandidateStep = candidate;
                break;
            }
        }
    }
  } else { 
    currentBestCandidateStep = (range / (targetTickCount -1)) || 0.1;
  }
  if(currentBestCandidateStep <=0) currentBestCandidateStep = 0.1; 


  const step = currentBestCandidateStep;
  const tickPrecision = Math.max(defaultPrecision, getPrecision(step));

  const ticks: number[] = [];
  let currentTickVal = Math.floor(domainMin / step) * step;

  while (currentTickVal > domainMin + 1e-9) { 
      currentTickVal -= step;
  }


  const loopLimit = Math.ceil(domainMax / step) * step + step / 2; 

  for (let val = currentTickVal; val < loopLimit + step; val += step) { 
    const tickToAdd = parseFloat(val.toFixed(tickPrecision));
    ticks.push(tickToAdd);
    if (ticks.length > 15) break; 
  }
  
  if (tightenYAxisParam || (ticks.length > 0 && (ticks[0] > domainMin || ticks[ticks.length-1] < domainMax))) {
      if (!ticks.some(t => Math.abs(t - domainMin) < 1e-9)) ticks.push(parseFloat(domainMin.toFixed(tickPrecision)));
      if (!ticks.some(t => Math.abs(t - domainMax) < 1e-9)) ticks.push(parseFloat(domainMax.toFixed(tickPrecision)));
  }


  if (common01Metrics.includes(metricName)) {
    let finalTicks = [...new Set(ticks.map(t => parseFloat(t.toFixed(tickPrecision))))].sort((a, b) => a - b);
    
    if (tightenYAxisParam) {
        finalTicks = finalTicks.filter(t => t >= domainMin - 1e-9 && t <= domainMax + 1e-9);
        if (!finalTicks.some(t => Math.abs(t - domainMin) < 1e-9)) finalTicks.push(parseFloat(domainMin.toFixed(tickPrecision)));
        if (!finalTicks.some(t => Math.abs(t - domainMax) < 1e-9)) finalTicks.push(parseFloat(domainMax.toFixed(tickPrecision)));
        finalTicks = finalTicks.map(t => parseFloat(Math.max(0, Math.min(1, t)).toFixed(tickPrecision))); 
    } else {
        finalTicks = finalTicks.filter(t => t >= -1e-9 && t <= 1.0 + 1e-9);
        if (domainMin <= 0.05 && !finalTicks.some(t => Math.abs(t-0) < 1e-9)) finalTicks.push(0);
        if (domainMax >= 0.95 && !finalTicks.some(t => Math.abs(t-1) < 1e-9)) finalTicks.push(1.0);
        finalTicks = finalTicks.map(t => parseFloat(Math.max(0, Math.min(1, t)).toFixed(tickPrecision)));
    }
    return [...new Set(finalTicks)].sort((a, b) => a - b);
  }
  
  const uniqueResult = [...new Set(ticks.map(t => parseFloat(t.toFixed(tickPrecision))))].sort((a,b) => a - b);
  if(uniqueResult.length < 2 && Math.abs(domainMin - domainMax)>1e-9){
      return [parseFloat(domainMin.toFixed(tickPrecision)), parseFloat(domainMax.toFixed(tickPrecision))].sort((a,b)=>a-b);
  }
  return uniqueResult;
};


const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, metricName, title, headerControls, yAxisTickInterval, tightenYAxis = false, yAxisMinPointBuffer }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind 'md' breakpoint
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm p-4 text-center">No chart data available for {metricName}.</p>;
  }

  let yAxisDomainCalculated: [number, number] = [0,1]; 
  let niceTicks: number[] = [0, 0.5, 1];
  const common01Metrics = ['Accuracy', 'AUC', 'F1 Score', 'Precision', 'Recall'];
  const is01Metric = common01Metrics.includes(metricName);


  const values = data.map(item => item[metricName] as number).filter(v => typeof v === 'number' && !isNaN(v));
  
  if (values.length > 0) {
    if (tightenYAxis && is01Metric) { // Specific for "Average Performance" charts
      yAxisDomainCalculated = [0.6, 1.0];
      niceTicks = generateNiceTicks(0.6, 1.0, metricName, 5, 0.1, true); 
    } else {
        let minActualValue = Infinity;
        let maxActualValue = -Infinity;

        data.forEach(item => {
            const value = item[metricName] as number;
            if (typeof value === 'number' && !isNaN(value)) {
                minActualValue = Math.min(minActualValue, value);
                maxActualValue = Math.max(maxActualValue, value);
            }
        });
        
        let minBoundWithStdDev = minActualValue; 
        let maxBoundWithStdDev = maxActualValue; 
        let hasStdDev = false;

        data.forEach(item => {
          const value = item[metricName] as number;
          if (typeof value !== 'number' || isNaN(value)) return;

          const stdDevKey = `${metricName}_stdDev`;
          const stdDev = item[stdDevKey] as number | undefined;

          if (typeof stdDev === 'number' && stdDev > 0) {
            hasStdDev = true;
            minBoundWithStdDev = Math.min(minBoundWithStdDev, value - stdDev);
            maxBoundWithStdDev = Math.max(maxBoundWithStdDev, value + stdDev);
          }
        });
        if (!hasStdDev) { 
            minBoundWithStdDev = minActualValue;
            maxBoundWithStdDev = maxActualValue;
        }

        if (minBoundWithStdDev !== Infinity && maxBoundWithStdDev !== -Infinity) {
          const dataRange = maxBoundWithStdDev - minBoundWithStdDev; 
          let padding;

          if (tightenYAxis) { // For non-01 metrics on "Average" charts or if tightenYAxis is used elsewhere
            if (dataRange < 0.02) { padding = 0.002; } 
            else if (dataRange < 0.05) { padding = 0.005; } 
            else { padding = dataRange * 0.02; }
            padding = Math.max(padding, 0.001); 
          } else { // Default padding for most charts
            if (dataRange < 0.001 && dataRange >=0) { padding = 0.02;} 
            else if (dataRange < 0.1) { padding = Math.max(dataRange * 0.2, 0.01); } 
            else { padding = dataRange * 0.1; }
            padding = Math.min(padding, dataRange > 0 ? 0.2 * dataRange : 0.2);
            padding = Math.max(padding, 0.005);
          }

          let domainMinInputForTicks = minBoundWithStdDev - padding;
          let domainMaxInputForTicks = maxBoundWithStdDev + padding;
          
          // Apply specific logic for academic individual charts
          if (yAxisMinPointBuffer !== undefined && is01Metric && !tightenYAxis) {
              let actualDataMinForBuffer = Infinity;
              values.forEach(v => { actualDataMinForBuffer = Math.min(actualDataMinForBuffer, v); });
              if (actualDataMinForBuffer === Infinity) actualDataMinForBuffer = 0;

              domainMinInputForTicks = Math.max(0, actualDataMinForBuffer - yAxisMinPointBuffer);
              domainMaxInputForTicks = 1.0; // Force ticks up to 1.0
          }


          if (Math.abs(maxActualValue - minActualValue) < 1e-9 && !(yAxisMinPointBuffer !== undefined && is01Metric && !tightenYAxis)) { 
              const base = maxActualValue;
              let expansion = tightenYAxis ? 0.025 : 0.05; 
              if (is01Metric && tightenYAxis && base >=0 && base <=1) {
                 expansion = 0.01; 
              }
              if (is01Metric && base >= 0 && base <= 1) {
                  if (base === 1.0) { domainMinInputForTicks = Math.max(0, 1.0 - (expansion*2)); domainMaxInputForTicks = 1.0; }
                  else if (base === 0.0) { domainMinInputForTicks = 0.0; domainMaxInputForTicks = Math.min(1, 0.0 + (expansion*2)); }
                  else { 
                      domainMinInputForTicks = Math.max(0, base - expansion);
                      domainMaxInputForTicks = Math.min(1, base + expansion);
                  }
              } else { 
                  domainMinInputForTicks = base - expansion;
                  domainMaxInputForTicks = base + expansion;
                  if (!isHigherBetter(metricName) && domainMinInputForTicks < 0 && base >= 0) {
                      domainMinInputForTicks = 0;
                  }
              }
          } else if (!(yAxisMinPointBuffer !== undefined && is01Metric && !tightenYAxis)) { // Don't apply this general clamping if academic individual logic already set domainMax to 1.0
              if (is01Metric) {
                  if (!tightenYAxis) { 
                      domainMinInputForTicks = Math.max(0, domainMinInputForTicks); 
                      domainMaxInputForTicks = Math.min(1, domainMaxInputForTicks);
                  } else { 
                     if(minActualValue >= 0 && maxActualValue <=1) { // For 0-1 metrics on tightenYAxis charts (that are not avg perf)
                        domainMinInputForTicks = Math.max(0, domainMinInputForTicks);
                        domainMaxInputForTicks = Math.min(1, domainMaxInputForTicks);
                     }
                  }
              } else if (metricName === 'R2 Score') {
                  if (maxActualValue <= 1 || tightenYAxis) domainMaxInputForTicks = Math.min(domainMaxInputForTicks, 1 + padding);
              } else if (!isHigherBetter(metricName)) { 
                  if (minActualValue >= 0) domainMinInputForTicks = Math.max(0, domainMinInputForTicks);
              } else { 
                 if (minActualValue >= 0) domainMinInputForTicks = Math.max(0, domainMinInputForTicks);
              }
          }
          
          if (tightenYAxis && is01Metric && !common01Metrics.includes(metricName) ) { // Corrected: was common01MetricsForFixedScale
              if (domainMaxInputForTicks >= 0.99 && domainMaxInputForTicks < 1.0 && maxActualValue > 0.90) {
                  domainMaxInputForTicks = 1.0;
              }
          }

          if (domainMinInputForTicks >= domainMaxInputForTicks) { 
            const baseVal = (domainMaxInputForTicks + domainMinInputForTicks) / 2; 
            const defaultStep = (tightenYAxis && is01Metric) ? 0.005 : 0.01;

            if (domainMaxInputForTicks <= ((tightenYAxis && is01Metric) ? 0.995 : 0.95) || !is01Metric ) { 
                domainMaxInputForTicks = baseVal + defaultStep;
                domainMinInputForTicks = baseVal - defaultStep;
            } else { 
                domainMinInputForTicks = baseVal - defaultStep;
                domainMaxInputForTicks = baseVal + defaultStep; 
            }
            if (is01Metric) { 
                 domainMinInputForTicks = Math.max(0, domainMinInputForTicks);
                 domainMaxInputForTicks = Math.min(1, domainMaxInputForTicks);
            }
             if (domainMinInputForTicks >= domainMaxInputForTicks) { 
                 domainMaxInputForTicks = domainMinInputForTicks + 0.001;
                  if (is01Metric) domainMaxInputForTicks = Math.min(1, domainMaxInputForTicks);
             }
          }
          
          niceTicks = generateNiceTicks(domainMinInputForTicks, domainMaxInputForTicks, metricName, 5, yAxisTickInterval, tightenYAxis);

          if (niceTicks.length > 0) {
            let finalDomainMin = niceTicks[0];
            let finalDomainMax = niceTicks[niceTicks.length - 1];
            if (finalDomainMin >= finalDomainMax && niceTicks.length === 1) {
                const tickValue = niceTicks[0];
                const defaultStep = typeof yAxisTickInterval === 'number' && yAxisTickInterval > 0 ? yAxisTickInterval : (tightenYAxis ? 0.01 : 0.1);
                 if (is01Metric) {
                    finalDomainMin = Math.max(0, tickValue - defaultStep);
                    finalDomainMax = Math.min(1, tickValue + defaultStep);
                    if (finalDomainMin >= finalDomainMax) {
                         finalDomainMin = Math.max(0, tickValue - defaultStep/2);
                         finalDomainMax = Math.min(is01Metric ? 1 : Infinity, tickValue + defaultStep/2);
                         if (finalDomainMin >= finalDomainMax) {finalDomainMax = Math.min(is01Metric ? 1 : Infinity, finalDomainMin + defaultStep/10);}
                    }
                } else {
                    finalDomainMin = tickValue - defaultStep;
                    finalDomainMax = tickValue + defaultStep;
                }
            } else if (finalDomainMin >= finalDomainMax) { 
                 finalDomainMax = finalDomainMin + (tightenYAxis ? 0.005 : 0.01); 
                 if (is01Metric) {
                    finalDomainMax = Math.min(1, finalDomainMax);
                 }
            }
            yAxisDomainCalculated = [finalDomainMin, finalDomainMax];
          } else { 
            let finalDomainMinCalc = parseFloat(domainMinInputForTicks.toFixed(3));
            let finalDomainMaxCalc = parseFloat(domainMaxInputForTicks.toFixed(3));
             if (finalDomainMinCalc >= finalDomainMaxCalc) {
                finalDomainMaxCalc = finalDomainMinCalc + (tightenYAxis ? 0.005 : 0.01);
                 if (is01Metric) {
                    finalDomainMaxCalc = Math.min(1, finalDomainMaxCalc);
                 }
            }
            yAxisDomainCalculated = [finalDomainMinCalc, finalDomainMaxCalc];
            niceTicks = [yAxisDomainCalculated[0], yAxisDomainCalculated[1]]; 
          }
        }
    }
  }


  // Determine X-axis label properties based on chart type and screen size
  let xAxisAngle = -45;
  let xAxisTextAnchor: "end" | "middle" | "start" = "end";
  let xAxisHeight = 70;
  let xAxisTickFontSize = 10;

  if (tightenYAxis) { // This prop identifies "Average Model Performance" charts
    if (!isMobile) { // Horizontal labels for desktop/tablet on these specific charts
      xAxisAngle = 0;
      xAxisTextAnchor = "middle";
      xAxisHeight = 30; 
      xAxisTickFontSize = 11; // Slightly larger font for horizontal average charts
    }
  }


  return (
    <div className="bg-white shadow-lg rounded-xl p-3 sm:p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
      {title && <h4 className="text-md sm:text-lg md:text-xl font-semibold text-gray-700 mb-4 text-center">{title}</h4>}
      {headerControls && <div className="mb-4 md:mb-6">{headerControls}</div>}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 35, right: 10, left: -5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="modelName" 
            angle={xAxisAngle} 
            textAnchor={xAxisTextAnchor} 
            height={xAxisHeight}
            interval={0}
            tick={{ fontSize: xAxisTickFontSize, fill: '#4A5568' }} 
          />
          <YAxis 
            domain={yAxisDomainCalculated}
            ticks={niceTicks}
            tickFormatter={(value) => {
                let precision;
                const domainRange = yAxisDomainCalculated[1] - yAxisDomainCalculated[0];
                // Use yAxisTickInterval if provided (it's passed as fixedInterval to generateNiceTicks)
                const effectiveYAxisTickInterval = yAxisTickInterval;


                if (typeof effectiveYAxisTickInterval === 'number' && effectiveYAxisTickInterval > 0) {
                    if (Math.floor(effectiveYAxisTickInterval) === effectiveYAxisTickInterval && effectiveYAxisTickInterval !==0) precision = 0;
                    else precision = String(effectiveYAxisTickInterval).split('.')[1]?.length || 2;
                } else {
                    precision = 2; 
                    if (domainRange > 0) {
                        if (domainRange < 0.001) precision = 4;
                        else if (domainRange < 0.01) precision = 3;
                        else if (domainRange < 0.1) precision = tightenYAxis ? 3 : 2;
                        else if (domainRange < 1) precision = 2;
                        else if (domainRange < 10) precision = 1;
                        else precision = 0;
                    }
                    if (niceTicks.length >= 2) {
                        const step = Math.abs(niceTicks[1] - niceTicks[0]);
                        if (step > 0) {
                            if (step < 0.001) precision = Math.max(precision,4);
                            else if (step < 0.01) precision = Math.max(precision,3);
                            else if (step < 0.1) precision = Math.max(precision,2);
                        }
                    }
                }
                // Ensure 1.0 is formatted as "1.0" if precision is 1, not "1"
                if (value === 1.0 && precision === 1 && String(effectiveYAxisTickInterval).includes("0.1")) return "1.0"; // Specific for 0.1 interval
                if (value === 1.0 && String(effectiveYAxisTickInterval).includes("0.05")) return "1.00"; // Specific for 0.05 interval

                if (typeof value === 'number') {
                     if (Math.abs(value) > 0 && Math.abs(value) < 1e-3 && precision > 2 && value !== 0) return value.toExponential(1); 
                     return value.toFixed(precision);
                }
                return value;
            }}
            tick={{ fontSize: 10, fill: '#4A5568' }}
            allowDataOverflow={false} 
            width={55} 
          />
          <Tooltip
            formatter={(value: number, name: string, props) => {
              const stdDevKey = `${name}_stdDev`;
              const stdDev = props.payload?.[stdDevKey] as number | undefined;
              let displayValue = typeof value === 'number' ? value.toFixed(4) : value;
              if (typeof stdDev === 'number' && stdDev > 0) {
                return [`Mean: ${displayValue}, StdDev: ${stdDev.toFixed(4)}`, name];
              }
              return [displayValue, name];
            }}
            labelFormatter={(label: string) => <span className="font-semibold">{`Model: ${label}`}</span>}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '8px', 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderColor: '#1b998b' 
            }}
            itemStyle={{ color: '#333' }}
            cursor={{fill: 'rgba(226, 232, 240, 0.5)'}}
          />
          <Bar dataKey={metricName} name={metricName} shape={<CustomBarShape />}>
            {data.map((entry, index) => {
              return (
                <Cell key={`cell-${index}`} fill={MODEL_COLORS[entry.modelName as string] || MODEL_COLORS['Unknown Model']} />
              );
            })}
          </Bar>
          {data.some(item => {
            const stdDevVal = item[`${metricName}_stdDev`];
            return typeof stdDevVal === 'number' && stdDevVal > 0;
          }) && (
            <ErrorBar dataKey={`${metricName}_stdDev`} width={4} strokeWidth={1.5} stroke="rgba(0,0,0,0.5)" direction="y" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
