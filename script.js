
function calculateStatistics() {
    const totalClaims = parseInt(document.getElementById('totalClaims').value);
    const acceptedTickets = parseInt(document.getElementById('acceptedTickets').value);
    const assignedNotInCharge = parseInt(document.getElementById('assignedNotInCharge').value);
    const closedTickets = parseInt(document.getElementById('closedTickets').value);
    const inProgressTickets = parseInt(document.getElementById('inProgressTickets').value);
    const duplicateTickets = parseInt(document.getElementById('duplicateTickets').value);

    
    const percentageTreatedLess24h = parseFloat(document.getElementById('results1').innerText.split(': ')[1]);
    const percentageTreated24h48h = parseFloat(document.getElementById('results2').innerText.split(': ')[1]);
    const percentageNonTreated = parseFloat(document.getElementById('results').innerText.split(': ')[1]);
    const percentageTreatedMore48h = parseFloat(document.getElementById('results3').innerText.split(': ')[1]);
    const averageAcceptanceValue = parseFloat(document.getElementById('results4').innerText.split(': ')[1]);
    const averageTraitementValue = parseFloat(document.getElementById('results5').innerText.split(': ')[1]);

    
    const treatmentTimesData = {
        labels: ['<24h', '24-48h', '>48h'],
        datasets: [{
            label: 'Reclamation Treatment Times',
            data: [percentageTreatedLess24h, percentageTreated24h48h, percentageTreatedMore48h],
            backgroundColor: ['#00f', '#ff0', '#f00']
        }]
    };

    
    const nonTreatedData = {
        labels: ['Non-Treated'],
        datasets: [{
            label: 'Non-Treated Tickets',
            data: [percentageNonTreated],
            backgroundColor: ['#0f0']
        }]
    };

    
    const averagesData = {
        labels: ['Average Acceptance Value', 'Average Resolution Time per Day'],
        datasets: [{
            label: 'Average Values',
            data: [averageAcceptanceValue, averageTraitementValue],
            backgroundColor: ['#0f0', '#00f']
        }]
    };

    
    const treatmentTimesChartCtx = document.getElementById('treatmentTimesChart').getContext('2d');
    new Chart(treatmentTimesChartCtx, {
        type: 'bar',
        data: treatmentTimesData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    
    const nonTreatedChartCtx = document.getElementById('nonTreatedChart').getContext('2d');
    new Chart(nonTreatedChartCtx, {
        type: 'doughnut',
        data: nonTreatedData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    
    const averagesChartCtx = document.getElementById('averagesChart').getContext('2d');
    new Chart(averagesChartCtx, {
        type: 'bar',
        data: averagesData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}







document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                processCSVData(results.data);
            }
        });
    } else {
        alert('Please select a file.');
    }
});

function processCSVData(data) {
    let totalRows = data.length;
    let nonTreatedCount = 0;

    data.forEach(row => {
        if (row.Statut !== 'fermé') {
            nonTreatedCount++;
        }
    });
    let rowscount = data.length;
    let treatementcount = 0;
    let treatementcount4824 = 0;
    let treatementcountsup48=0;

    data.forEach(row => {
        let traitementValue = parseInt(row.TRAITEMENT, 10);
        if (traitementValue === 0 || traitementValue === 1) {
            treatementcount++;
        }
        if (traitementValue === 2){
            treatementcount4824++;

        }
        else if (traitementValue > 2)  {treatementcountsup48++;}

    });

    console.log(`Total rows: ${rowscount}`);
    console.log(`Treatment count: ${treatementcount}`);


console.log(`Treatment count: ${treatementcountsup48}`);

    const percentage = ((treatementcount / rowscount) * 100).toFixed(2);
    document.getElementById('results1').innerText = `Percentage of reclamations treated <24h: ${percentage}%`;

    const percentage4824 = ((treatementcount4824 / rowscount) * 100).toFixed(2);
    document.getElementById('results2').innerText = `Percentage of reclamations treated between 24h & 48h: ${percentage4824}%`;

    const percentageNonTreated = ((nonTreatedCount / totalRows) * 100).toFixed(2);
    document.getElementById('results').innerText = `Percentage of Non-Treated Tickets: ${percentageNonTreated}%`;

    const percentage48 = ((treatementcountsup48 / rowscount) * 100).toFixed(2);
    document.getElementById('results3').innerText = `Percentage of reclamations treated >48h: ${percentage48}%`;



       
        
    let acceptanceCounts = {}; 
    let totalAcceptedRows = 0;

    
    data.forEach(row => {
        if (row.Statut === 'accepté') {
            const acceptanceValue = parseInt(row.ACCEPTATION, 10);

            if (!isNaN(acceptanceValue)) {
                if (!acceptanceCounts[acceptanceValue]) {
                    acceptanceCounts[acceptanceValue] = 0;
                }
                acceptanceCounts[acceptanceValue]++;
                totalAcceptedRows++;
            }
        }
    });

    
    let weightedSum = 0;
    for (const value in acceptanceCounts) {
        if (acceptanceCounts.hasOwnProperty(value)) {
            const count = acceptanceCounts[value];
            weightedSum += count * parseInt(value, 10); 
        }
    }

    
    const averageAcceptanceValue = totalAcceptedRows > 0 ? (weightedSum / totalAcceptedRows).toFixed(2) : 'N/A';

    
    document.getElementById('results4').innerText = `Average ACCEPTATION Value: ${averageAcceptanceValue}`;


        
        let traitementCounts = {}; 
        let totalClosedRows = 0;
    
        
        data.forEach(row => {
            if (row.Statut === 'fermé') {
                const traitementValue = parseInt(row.TRAITEMENT, 10);
    
                if (!isNaN(traitementValue)) {
                    if (!traitementCounts[traitementValue]) {
                        traitementCounts[traitementValue] = 0;
                    }
                    traitementCounts[traitementValue]++;
                    totalClosedRows++;
                }
            }
        });
    
        
        let traitementWeightedSum = 0;
        for (const value in traitementCounts) {
            if (traitementCounts.hasOwnProperty(value)) {
                const count = traitementCounts[value];
                traitementWeightedSum += count * parseInt(value, 10); 
            }
        }
    
        
        const averageTraitementValue = totalClosedRows > 0 ? (traitementWeightedSum / totalClosedRows).toFixed(2) : 'N/A';
    
        
        document.getElementById('results5').innerText = `Average Resolution Time Value: ${averageTraitementValue}`;
    

    
}

    
