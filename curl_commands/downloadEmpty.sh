curl -X POST http://localhost:3010/export-data \
    -H "Content-Type: application/json" \
    -d '{
        "response_type": "file",
        "data": [
        ],
        "headers": false
    }' -o Empty.csv