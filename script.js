document.addEventListener('DOMContentLoaded', function() {
    // Dark/Light mode toggle
    const modeToggle = document.getElementById('modeToggle');
    let isDark = true;
    function setTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        modeToggle.textContent = dark ? '🌙' : '☀️';
        isDark = dark;
    }
    modeToggle.onclick = () => setTheme(!isDark);
    setTheme(true);

    // Chart.js setup
    let sentimentChart;
    function renderChart(data) {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        if (sentimentChart) sentimentChart.destroy();
        sentimentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [data.positive, data.negative, data.neutral],
                    backgroundColor: [
                        '#6ee7b7', '#f87171', '#fbbf24'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Simulated sentiment analysis (replace with real API integration)
    function analyzeSentiment(inputValue) {
        // Simulate loading and random results
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = [];
                let positive = 0, negative = 0, neutral = 0;
                // Split input by sentences for demo
                let sentences = inputValue.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
                if (sentences.length === 0) sentences = [inputValue];
                sentences.forEach(text => {
                    const r = Math.random();
                    let sentiment = r < 0.4 ? 'positive' : (r < 0.7 ? 'neutral' : 'negative');
                    results.push({ text, sentiment });
                    if (sentiment === 'positive') positive++;
                    else if (sentiment === 'negative') negative++;
                    else neutral++;
                });
                resolve({ results, positive, negative, neutral });
            }, 1200);
        });
    }

    // Form handling
    const form = document.getElementById('sentimentForm');
    const inputValue = document.getElementById('inputValue');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeBtnText = document.getElementById('analyzeBtnText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMsg = document.getElementById('errorMsg');
    const resultsSection = document.getElementById('resultsSection');
    const positiveLabel = document.getElementById('positiveLabel');
    const negativeLabel = document.getElementById('negativeLabel');
    const neutralLabel = document.getElementById('neutralLabel');
    const individualResults = document.getElementById('individualResults');

    form.onsubmit = async function(e) {
        e.preventDefault();
        const value = inputValue.value.trim();
        if (!value) {
            errorMsg.textContent = 'Please enter a valid input.';
            errorMsg.style.display = 'block';
            return;
        }
        errorMsg.style.display = 'none';
        resultsSection.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        analyzeBtn.disabled = true;
        analyzeBtnText.textContent = 'Analyzing...';
        try {
            const data = await analyzeSentiment(value);
            positiveLabel.textContent = `Positive: ${data.positive}`;
            negativeLabel.textContent = `Negative: ${data.negative}`;
            neutralLabel.textContent = `Neutral: ${data.neutral}`;
            renderChart(data);
            individualResults.innerHTML = '';
            data.results.forEach(r => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `<span>${r.text}</span><span class="sentiment-label sentiment-${r.sentiment}">${r.sentiment.charAt(0).toUpperCase() + r.sentiment.slice(1)}</span>`;
                individualResults.appendChild(li);
            });
            resultsSection.style.display = 'block';
        } catch (err) {
            errorMsg.textContent = 'Error analyzing sentiment. Please try again.';
            errorMsg.style.display = 'block';
        } finally {
            loadingSpinner.style.display = 'none';
            analyzeBtn.disabled = false;
            analyzeBtnText.textContent = 'Analyze Sentiment';
        }
    };
});
