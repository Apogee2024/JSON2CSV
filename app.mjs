// use mjs for import and export capability
import express from 'express';
import { Parser } from 'json2csv';
import 'dotenv/config';
const PORT = process.env.PORT || 3010;  // Defaults to 3010 if PORT is not set in .env
const app = express();  // Initialize the app

// necessary for processing JSON
app.use(express.json({
    strict: true,
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf);  // Try parsing the JSON
        } catch (err) {
            res.status(400).json({ error: "Invalid JSON format." });
            throw new Error("Invalid JSON format.");  // Prevents further middleware execution
        }
    }
})); 

app.post('/export-data', (req, res) => {
    let data;
    let file = req.body.filename;

    // initialize default state of response type
    let response_type = 'file';
    if (req.body.response_type == 'raw'){
        response_type = 'raw';
    }
    // js doesnt have tuples to convert the tuples to an array
    if (req.body.data){
         data = Array.from(req.body.data);
    }
    else {
         data = Array.from([])
    }

    // set default headers value
    let headers = true;
    if (req.body.headers == false){
        headers = false;
    }
    
    //validate the array
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object') {
        return res.status(400).json({ error: "Invalid input. 'data' must be a non-empty array of JSON objects." });
    }

    try {
        // Define fields only if headers are enabled
        let fields = null;
        if (headers) {
            fields = Object.keys(data[0]);
        }

        const options = { fields, header: headers};
        const parser = new Parser(options);
        const json2csvParser = new Parser(options);
        const csvData = json2csvParser.parse(data);
    
        // Check the response type to decide the format
        if (response_type === 'file') {
            let sanitizeFileName = (name) => {
                //remove all invalid characters, restrict to lowercase chars
                let sanitized = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                return sanitized.replace(/^_+|_+$/g, ''); 
            };
            // to specify the filename
            let fileName;

            if (req.body.filename) {
                fileName = sanitizeFileName(req.body.filename);
            } else {
                fileName = 'data';
            }
            if (!fileName || /^_+$/.test(fileName)) {  // Check if filename is empty or all underscores
                fileName = 'data.csv';
            } else {
                fileName += '.csv';
            }
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);


                res.setHeader('Cache-Control', 'no-store');
                return res.status(200).send(csvData);
            
        } else {
            res.header('Content-Type', 'text/plain');
            return res.status(299).send(csvData);
        }
    } catch (err) {
        console.error('Error while processing data:', err);
        res.status(500).send('An error occurred while processing the data.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


export default app;