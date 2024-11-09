const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 6000;

app.use(express.json());

const STORAGE_PATH = path.join("/ali_PV_dir");

if (!fs.existsSync(STORAGE_PATH)) {
	fs.mkdirSync(STORAGE_PATH);
}

app.post("/process-data", async (req, res) => {
	try {
		const response = await axios.post(
			`http://processorcontainer:7000/calculate-sum`,
			req.body,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (response.status === 200) {
			res.status(200).json({
				message: "Request reached Container 2 successfully",
				data: response.data,
			});
		} else {
			res.status(500).json({
				error: "Failed to reach Container 2",
				message: "Error in communication with Container 2",
			});
		}
	} catch (error) {
		console.error("Error calling Container 2:", error.message);
		res.status(500).json({
			error: "Error reached only Container 1",
			message: "Could not reach Container 2",
		});
	}
});

app.post("/test", (req, res) => {
	return res.status(200).json({ message: "Hello World" });
});

app.post("/store-file", (req, res) => {
	const { file, data } = req.body;

	if (!file || !data) {
		return res.status(400).json({ file: null, error: "Invalid JSON input." });
	}

	const filePath = path.join(STORAGE_PATH, file);

	fs.writeFile(filePath, data, (err) => {
		if (err) {
			return res
				.status(500)
				.json({ file, error: "Error while storing the file to the storage." });
		}
		return res.status(200).json({ file, message: "Success." });
	});
});

app.post("/calculate", async (req, res) => {
	const { file, product } = req.body;

	console.log(req.body);

	if (!file || !product) {
		return res.status(400).json({ file: null, error: "Invalid JSON input." });
	}

	const filePath = path.join(STORAGE_PATH, file);

	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ file, error: "File not found." });
	}

	try {
		const response = await axios.post(
			`http://processorcontainer:7000/calculate-sum`,
			{
				file,
				product,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		res.status(200).json(response.data);
	} catch (error) {
		console.error("Error calling Container 2:", error.message);
		res
			.status(500)
			.json({ error: "Error while contacting Container 2 for calculation." });
	}
});

app.listen(PORT, () => console.log(`Container 1 running on port ${PORT}`));
