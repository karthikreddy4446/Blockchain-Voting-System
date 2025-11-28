
fetch('/api/results')
    .then(response => response.json())
    .then(votes => {
        const ctx = document.getElementById('voteChart').getContext('2d');
        const data = {
            labels: ['Alice', 'Bob', 'Charlie'],
            datasets: [{
                data: [votes.Alice, votes.Bob, votes.Charlie],
                backgroundColor: ['#FF9999', '#66B3FF', '#99FF99'],
            }]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        };
        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        });
    });
