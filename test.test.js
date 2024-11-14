import request from 'supertest';
import app from './app.mjs'; // Import the app from app.mjs

describe('CSV Export Service - POST /export-data', () => {
    const testData = [
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

    test('should return CSV as a file when response_type is "file"', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({
                response_type: 'file',
                data: testData,
                headers: true
            })
            .expect(200);

        expect(response.headers['content-type']).toContain('text/csv');
        expect(response.headers['content-disposition']).toContain('attachment; filename="data.csv"');
        
        const lines = response.text.trim().split('\n');
        const normalizedLines = lines.map(line => line.replace(/"/g, ''));

        expect(normalizedLines).toContain('ARInvoiceID,Invoice,Customer Name,Description,Invoice Date,Due Date,Amount');
        expect(normalizedLines).toContain('1,123,John Doe,Test AR Invoice,2024-10-01,2024-11-01,5000.55');
        expect(normalizedLines).toContain('2,456,Jane Smith,Test AR Invoice 2,2025-01-01,2025-02-01,12345.67');;
    });

    test('should return raw CSV text when response_type is "raw"', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({
                response_type: 'raw',
                data: testData,
                headers: true
            })
            .expect(299);  // Expect 299 for raw response

        expect(response.headers['content-type']).toContain('text/plain');

        const lines = response.text.trim().split('\n');
        const normalizedLines = lines.map(line => line.replace(/"/g, ''));

        expect(normalizedLines).toContain('ARInvoiceID,Invoice,Customer Name,Description,Invoice Date,Due Date,Amount');
        expect(normalizedLines).toContain('1,123,John Doe,Test AR Invoice,2024-10-01,2024-11-01,5000.55');
        expect(normalizedLines).toContain('2,456,Jane Smith,Test AR Invoice 2,2025-01-01,2025-02-01,12345.67');;
    });

    test('should exclude headers when headers is set to false', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({
                response_type: 'raw',
                data: testData,
                headers: false
            })
            .expect(299);  // Expect 299 for raw response

        const lines = response.text.trim().split('\n');
        const normalizedLines = lines.map(line => line.replace(/"/g, ''));

        expect(normalizedLines).not.toContain('ARInvoiceID,Invoice,Customer Name,Description,Invoice Date,Due Date,Amount');
        expect(normalizedLines).toContain('1,123,John Doe,Test AR Invoice,2024-10-01,2024-11-01,5000.55');
        expect(normalizedLines).toContain('2,456,Jane Smith,Test AR Invoice 2,2025-01-01,2025-02-01,12345.67');;

       
    });

    test('should return 400 for invalid input (empty data array)', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({
                response_type: 'file',
                data: []
            })
            .expect(400);

        expect(response.body).toHaveProperty('error', "Invalid input. 'data' must be a non-empty array of JSON objects.");
    });

    test('should return 400 for invalid data structure (missing data field)', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({})
            .expect(400);

        expect(response.body).toHaveProperty('error', "Invalid input. 'data' must be a non-empty array of JSON objects.");
    });

    test('should return 400 for invalid data structure (invalid json)', async () => {
        const response = await request(app)
            .post('/export-data')
            .send({
                response_type: 'file',
                data: (
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
                ),
                headers: true
            })
            .expect(400);

        expect(response.body).toHaveProperty('error', "Invalid input. 'data' must be a non-empty array of JSON objects.");
    });
});
