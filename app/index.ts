import { app } from "./app";

app.listen(3001).on("listening", () => {
	console.log("running");
});

module.exports = app;
