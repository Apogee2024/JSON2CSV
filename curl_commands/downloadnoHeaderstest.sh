curl -X POST http://localhost:3010/export-data \
    -H "Content-Type: application/json" \
    -d '{
        "response_type": "file",
        "data": [
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
        ],
        "headers": false
    }' -o NoHeaders.csv