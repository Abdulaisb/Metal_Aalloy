import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function MetalChart({ curve }) {
    // Combine strain and stress into data points for the chart
    const data = curve.strain.map((strainValue, index) => ({
        strain: strainValue,
        stress: curve.stress[index],
    }));
     // Function to download chart data as CSV
     const downloadCSV = () => {
        // Create CSV data
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Strain (%),Stress (MPa)\n"; // Header row

        // Add strain and stress data to the CSV
        data.forEach(({ strain, stress }) => {
            csvContent += `${strain},${stress}\n`;
        });

        // Create a downloadable link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "strain_stress_curve.csv");
        document.body.appendChild(link); // Required for Firefox

        // Trigger the download
        link.click();
        document.body.removeChild(link); // Clean up after download
    };

    return (
        <>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="strain"
                        label={{ value: 'Strain (%)', position: 'insideBottom', offset: -5 }}
                        domain={[0, 70]} // Set strain range from 0 to 70
                        tickFormatter={(value) => `${value}%`} // Display strain as percentages
                    />
                    <YAxis
                        label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `${value} MPa`} // Display stress in MPa
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="stress" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
            <div className = 'mt-8 mb-4 cursor-pointer w-72 border-black rounded-lg flex items-center justify-center px-2 py-2 bg-violet-600 text-white border-4 font-bold' onClick={downloadCSV}> Download as CSV </div>
        </>
    );
}

export default MetalChart;
