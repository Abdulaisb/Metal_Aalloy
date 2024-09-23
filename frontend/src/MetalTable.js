import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

function MetalTable({ properties }) {
    const propertyEntries = Object.entries(properties);

    // Function to download data as CSV
    const downloadCSV = () => {
        // Create CSV data
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Property,Value\n"; // Header row

        // Add property entries
        propertyEntries.forEach(([key, value]) => {
            csvContent += `${key.replace(/_/g, ' ')},${value}\n`;
        });

        // Create a downloadable link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "alloy_properties.csv");
        document.body.appendChild(link); // Required for Firefox

        // Trigger the download
        link.click();
        document.body.removeChild(link); // Clean up after download
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="properties table">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Property</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {propertyEntries.map(([key, value], index) => (
                            <TableRow key={index}>
                                <TableCell>{key.replace(/_/g, ' ')}</TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className = 'mt-8 mb-4 cursor-pointer w-72 border-black rounded-lg flex items-center justify-center px-2 py-2 bg-violet-600 text-white border-4 font-bold' onClick={downloadCSV}> Download as CSV </div>
        </>
    );
}

export default MetalTable;
