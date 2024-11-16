
# JSON2CSV Microservice

This microservice converts JSON data into CSV format. The service provides options for specifying the response format, headers, and filename. Below are instructions on how to use the service, including Docker commands to run the app and an example API call.

## Running the Microservice with Docker

To build and run the microservice using Docker, follow these steps:
### Step 0: download the repo as a zip, extract it and open the folder in the terminal

### Step 1: Build the Docker Image after cd ing into the correct 

Use this command to build the Docker image:

```bash
docker build -t csv-service-app .
```

- **Explanation**: This command builds a Docker image from the Dockerfile in the current directory and tags it as `csv-service-app`. This image contains the microservice and all required dependencies.

### Step 2: Run the Docker Container

Once the image is built, you can run it as a container:

```bash
docker run -p 3010:3010 csv-service-app
```

- **Explanation**: This command starts a container from the `csv-service-app` image, mapping port `3010` on the container to port `3010` on your local machine. This allows you to access the microservice at `http://localhost:3010`. You can map it to any port that you want.

## API Endpoint

**POST /export-data**

- **Description**: Converts JSON data to CSV format with configurable options.
- **Request Type**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:
  - `data`: An array of JSON objects to be converted to CSV (required).
  - `filename`: The desired name for the CSV file (optional; defaults to "data.csv" if not specified).
  - `response_type`: `"file"` to receive as a file or `"raw"` to receive as plain text (optional; defaults to `"file"`).
  - `headers`: Boolean to include headers in the CSV output (optional; defaults to `true`).

### Specifying a Custom Filename

You can specify a custom filename by including the `filename` attribute in the request body. If a valid filename is provided, the response will use this name for the CSV file. The filename will automatically have `.csv` appended if not specified, and any special characters will be replaced with underscores. If no filename is specified or if the filename is empty or invalid, the service defaults to `data.csv`.

### Example Requests

#### File Response Example

Here’s an example of how to call the `/export-data` endpoint with an AR invoice dataset and receive a downloadable file response:

```sh
curl -X POST http://localhost:3010/export-data -H "Content-Type: application/json" -d '{
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
    "headers": true,
    "filename": "data_export"
}'
```
here is how you can do it in a web app
```javascript
// code taken from here https://javascript.plainenglish.io/download-pdf-from-api-in-reactjs-using-axios-and-blobs-699be8a27ca7
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
      let filename = "data.csv";
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
  ```

#### Raw CSV Response Example

If you prefer to receive the CSV data as a raw text response instead of a downloadable file, set `response_type` to `"raw"`:

```sh
curl -X POST http://localhost:3010/export-data \
    -H "Content-Type: application/json" \
    -d '{
        "response_type": "raw",
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
        "headers": true
    }' -w "\n"
```

In this case, the response will be plain text CSV data:

```
ARInvoiceID,Invoice,Customer Name,Description,Invoice Date,Due Date,Amount
1,123,John Doe,Test AR Invoice,2024-10-01,2024-11-01,5000.55
2,456,Jane Smith,Test AR Invoice 2,2025-01-01,2025-02-01,12345.67
```

### Expected Response

The microservice responds with a CSV file or raw CSV data based on the `response_type`.

- **File Response (`response_type: file`)**:
  - Responds with a downloadable CSV file (e.g., `data_export.csv`).

- **Raw Response (`response_type: raw`)**:
  - Responds with CSV data as plain text, suitable for displaying or logging.

### Error Handling

- **400 Bad Request**: Returned if the JSON data is improperly formatted or if `data` is missing or empty.
- **500 Internal Server Error**: Returned if there’s an unexpected issue during processing.

### Important Note

A `POST` request cannot immediately send a downloadable file as a response. Instead, the response can either provide raw CSV text or return data that can be processed into a downloadable file on the client side. This is why the `response_type` option is provided: setting `response_type` to `"file"` sends a response with headers to suggest a download, while `"raw"` sends CSV data as plain text. The client-side application is then responsible for triggering the download if necessary. see the example with axios

### Communication Contract
All communications will be responded to within 72 hours, preferably on teams.

UML sequence diagram

![image](https://github.com/user-attachments/assets/6fb57c3f-dd1d-4dac-bdf5-867587af0a68)


