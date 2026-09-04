// xVA Validation Platform Demo - JavaScript

// Update current time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Initialize and update time every second
updateTime();
setInterval(updateTime, 1000);

// Generate synthetic data for calibration error trend
function generateCalibrationData() {
    const days = 30;
    const dates = [];
    const errors = [];
    const threshold = [];
    
    const today = new Date('2026-09-04');
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        // Generate realistic calibration errors with occasional spikes
        let error = 0.3 + Math.random() * 0.4;
        if (i === 2) error = 1.2; // Spike on Sep 3
        if (i === 1) error = 0.7; // Recovery
        
        errors.push(error);
        threshold.push(1.0);
    }
    
    return { dates, errors, threshold };
}

// Generate P&L attribution data
function generatePnLData() {
    const days = 30;
    const dates = [];
    const attribution = [];
    const target = [];
    
    const today = new Date('2026-09-04');
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        // Generate realistic P&L attribution ratios
        const ratio = 92 + Math.random() * 6;
        attribution.push(ratio);
        target.push(95);
    }
    
    return { dates, attribution, target };
}

// Plot Calibration Error Chart
function plotCalibrationChart() {
    const data = generateCalibrationData();
    
    const trace1 = {
        x: data.dates,
        y: data.errors,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Calibration Error',
        line: { color: '#0d6efd', width: 2 },
        marker: { size: 6 }
    };
    
    const trace2 = {
        x: data.dates,
        y: data.threshold,
        type: 'scatter',
        mode: 'lines',
        name: 'Threshold (1.0bp)',
        line: { color: '#dc3545', width: 2, dash: 'dash' }
    };
    
    const layout = {
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        xaxis: {
            title: 'Date',
            tickangle: -45
        },
        yaxis: {
            title: 'Error (bp)',
            rangemode: 'tozero'
        },
        margin: { l: 50, r: 30, t: 30, b: 80 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('calibration-chart', [trace1, trace2], layout, {responsive: true});
}

// Plot P&L Attribution Chart
function plotPnLChart() {
    const data = generatePnLData();
    
    const trace1 = {
        x: data.dates,
        y: data.attribution,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'P&L Attribution',
        line: { color: '#28a745', width: 2 },
        marker: { size: 6 },
        fill: 'tozeroy',
        fillcolor: 'rgba(40, 167, 69, 0.1)'
    };
    
    const trace2 = {
        x: data.dates,
        y: data.target,
        type: 'scatter',
        mode: 'lines',
        name: 'Target (95%)',
        line: { color: '#ffc107', width: 2, dash: 'dash' }
    };
    
    const layout = {
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        xaxis: {
            title: 'Date',
            tickangle: -45
        },
        yaxis: {
            title: 'Attribution Ratio (%)',
            range: [85, 100]
        },
        margin: { l: 50, r: 30, t: 30, b: 80 },
        hovermode: 'x unified'
    };
    
    Plotly.newPlot('pnl-chart', [trace1, trace2], layout, {responsive: true});
}

// Plot Degradation Monitoring Chart
function plotDegradationChart() {
    const metrics = ['Calibration', 'P&L Attrib', 'Forecast Bias', 'Data Quality', 'Performance'];
    const current = [98.5, 94.1, 96.8, 99.8, 92.0];
    const baseline = [98.0, 95.3, 97.0, 99.6, 100.0];
    
    const trace1 = {
        x: metrics,
        y: current,
        name: 'Current',
        type: 'bar',
        marker: { color: '#0d6efd' }
    };
    
    const trace2 = {
        x: metrics,
        y: baseline,
        name: 'Baseline',
        type: 'bar',
        marker: { color: '#6c757d', opacity: 0.5 }
    };
    
    const layout = {
        title: 'Metrics vs. Baseline',
        barmode: 'group',
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        yaxis: {
            title: 'Score (%)',
            range: [85, 105]
        },
        margin: { l: 50, r: 30, t: 50, b: 80 }
    };
    
    Plotly.newPlot('degradation-chart', [trace1, trace2], layout, {responsive: true});
}

// Plot Benchmark Comparison Chart
function plotBenchmarkChart() {
    const trades = ['Vanilla Swap', 'FX Forward', 'Swaption', 'CDS'];
    const modelError = [0.05, 0.08, 0.09, 0.19];
    const threshold = [0.5, 0.5, 0.5, 0.5];
    
    const trace1 = {
        x: trades,
        y: modelError,
        name: 'Model Error',
        type: 'bar',
        marker: { color: '#28a745' }
    };
    
    const trace2 = {
        x: trades,
        y: threshold,
        name: 'Threshold (0.5%)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#dc3545', width: 2, dash: 'dash' }
    };
    
    const layout = {
        title: 'Model vs. Analytical Benchmarks',
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        yaxis: {
            title: 'Error (%)',
            rangemode: 'tozero'
        },
        margin: { l: 50, r: 30, t: 50, b: 80 }
    };
    
    Plotly.newPlot('benchmark-chart', [trace1, trace2], layout, {responsive: true});
}

// Plot P&L Decomposition Chart
function plotPnLDecompositionChart() {
    const factors = ['Delta', 'Vega', 'Gamma', 'Theta', 'CS01', 'Unexplained'];
    const values = [45.2, 28.3, 8.1, 10.5, 2.0, 5.9];
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#dc3545'];
    
    const trace = {
        labels: factors,
        values: values,
        type: 'pie',
        marker: { colors: colors },
        textinfo: 'label+percent',
        hoverinfo: 'label+value+percent'
    };
    
    const layout = {
        title: 'P&L Attribution by Factor',
        showlegend: true,
        margin: { l: 20, r: 20, t: 50, b: 20 }
    };
    
    Plotly.newPlot('pnl-decomposition-chart', [trace], layout, {responsive: true});
}

// Populate alerts table
function populateAlertsTable() {
    const alerts = [
        {
            time: '09:02',
            severity: 'MEDIUM',
            alert: 'GBP calibration error increased to 1.1bp',
            status: 'In Progress',
            action: 'Recalibration triggered',
            badgeClass: 'warning'
        },
        {
            time: '08:45',
            severity: 'LOW',
            alert: '2 trades with high unexplained P&L',
            status: 'Assigned',
            action: 'Under review',
            badgeClass: 'info'
        },
        {
            time: '07:30',
            severity: 'INFO',
            alert: 'Daily batch completed successfully',
            status: 'Resolved',
            action: 'No action needed',
            badgeClass: 'success'
        },
        {
            time: 'Yesterday',
            severity: 'MEDIUM',
            alert: 'Performance degradation detected',
            status: 'Resolved',
            action: 'Cache cleared, services restarted',
            badgeClass: 'success'
        }
    ];
    
    const tbody = document.getElementById('alerts-table');
    tbody.innerHTML = '';
    
    alerts.forEach(alert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><small>${alert.time}</small></td>
            <td><span class="badge bg-${alert.badgeClass}">${alert.severity}</span></td>
            <td>${alert.alert}</td>
            <td>${alert.status}</td>
            <td><small>${alert.action}</small></td>
        `;
        tbody.appendChild(row);
    });
}

// Generate Report Function
function generateReport() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Generating...';
    btn.disabled = true;
    
    // Simulate report generation
    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Report Generated!';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        
        // Show success message
        alert('Report generated successfully!\n\nIn a production system, this would:\n- Generate a PDF/HTML report\n- Save to document repository\n- Send email notifications\n- Update audit log');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-primary');
            btn.disabled = false;
        }, 3000);
    }, 2000);
}

// Add interactive demo features
function addInteractiveFeatures() {
    // Add click handlers to "Details" buttons
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.textContent.includes('Details')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const testName = this.closest('tr').querySelector('td:first-child').textContent;
                showTestDetails(testName);
            });
        }
    });
}

function showTestDetails(testName) {
    alert(`Test Details: ${testName}\n\n` +
          `Status: PASSED ✓\n` +
          `Execution Time: 2.3 seconds\n` +
          `Last Run: Sep 4, 2026 07:15:00\n` +
          `Historical Pass Rate: 99.8% (last 90 days)\n\n` +
          `In a production system, this would show:\n` +
          `- Detailed test methodology\n` +
          `- Input parameters and assumptions\n` +
          `- Output values and comparisons\n` +
          `- Historical trending\n` +
          `- Detailed logs and diagnostics`);
}

// Initialize all charts and data when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Plot all charts
    plotCalibrationChart();
    plotPnLChart();
    plotDegradationChart();
    plotBenchmarkChart();
    plotPnLDecompositionChart();
    
    // Populate alerts
    populateAlertsTable();
    
    // Add interactive features
    addInteractiveFeatures();
    
    // Add animation to health score
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.animation = 'pulse 2s ease-in-out';
    }
    
    // Add tooltips to metrics
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const metricName = this.querySelector('p').textContent;
            alert(`${metricName}\n\nClick for detailed drill-down analysis.\n\nIn a production system, this would:\n- Show historical trends\n- Display detailed metrics\n- Provide what-if analysis\n- Show related alerts`);
        });
    });
    
    console.log('MOBU_Xval Platform by FedeAnalytics loaded successfully!');
    console.log('Version: 1.0 | Production Ready');
});

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    Plotly.Plots.resize('calibration-chart');
    Plotly.Plots.resize('pnl-chart');
    Plotly.Plots.resize('degradation-chart');
    Plotly.Plots.resize('benchmark-chart');
    Plotly.Plots.resize('pnl-decomposition-chart');
});

// Add keyboard shortcuts for demo navigation
document.addEventListener('keydown', function(e) {
    // Alt+1 through Alt+5 for tab navigation
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        const tabs = ['dashboard-tab', 'tests-tab', 'degradation-tab', 'benchmarks-tab', 'reports-tab'];
        const tabIndex = parseInt(e.key) - 1;
        const tab = document.getElementById(tabs[tabIndex]);
        if (tab) {
            tab.click();
        }
    }
});

// Export functions for global access
window.generateReport = generateReport;
