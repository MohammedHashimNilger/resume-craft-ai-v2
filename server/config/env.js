// Loads environment variables BEFORE any other module is evaluated.
//
// ES modules hoist and evaluate every `import` before the importing module's
// body runs. If we waited to call dotenv.config() inside server.js (as was
// done before), modules imported by server.js that read process.env at
// load time (e.g. groqService creating its Groq client) would see undefined
// values and crash — exactly the "GROQ_API_KEY is missing" error.
//
// By loading dotenv from the FIRST import statement, this file executes
// before every other imported module, so process.env is populated in time.
import dotenv from "dotenv";
dotenv.config();

export default process.env;