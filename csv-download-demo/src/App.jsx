import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [rawText, setRawText] = useState('');

  const data = [
    {
      "ARInvoiceID": 1,
      "Invoice": "123",
      "Customer Name": "John Doe",
      "Description": "Test AR Invoice",
      "Invoice Date": "2024-10-01",
      "Due Date": "2024-11-01",
      "Amount": "5000.55"
  },
  {
      "ARInvoiceID": 2,
      "Invoice": "456",
      "Customer Name": "Jane Smith",
      "Description": "Test AR Invoice 2",
      "Invoice Date": "2025-01-01",
      "Due Date": "2025-02-01",
      "Amount": "12345.67"
  }
  ];

  const handleDownload = () => {
    axios.post("/export-data", {
      response_type: "file",
      data: data,
      headers: true,
      filename: "data_export"
    }, {
      responseType: 'blob' // Important for handling binary data
    })
    .then(response => {
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = "download.csv";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }
  
      // Create a blob link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.setAttribute("download", filename); // Use tempLink here
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error("Error:", error));
  };

  const handleDisplayRawText = () => {
    axios.post("/export-data", {
      response_type: "raw",
      data: data,
      headers: true,
    })
    .then(response => {
      setRawText(response.data);
    })
    .catch(error => console.error("Error:", error));
  };
  return (
        <>
        <h1>AR Invoices</h1>
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <thead>
            <tr>
              <th>ARInvoiceID</th>
              <th>Invoice</th>
              <th>Customer Name</th>
              <th>Description</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ARInvoiceID}</td>
                <td>{item.Invoice}</td>
                <td>{item["Customer Name"]}</td>
                <td>{item.Description}</td>
                <td>{item["Invoice Date"]}</td>
                <td>{item["Due Date"]}</td>
                <td>{item.Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleDownload} style={{ padding: '10px 20px', marginRight: '10px' }}>
            Download as CSV
          </button>
          <button onClick={handleDisplayRawText} style={{ padding: '10px 20px' }}>
            Display Raw Text
          </button>
        </div>
        {rawText && (
          <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ddd', padding: '10px'}}>
            <h2>Raw Text Response:</h2>
            <pre>{rawText}</pre>
          </div>
        )}
     
    </>
  );
};

export default App;
