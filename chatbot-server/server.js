import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("Groq AI Chatbot Server Running");
});

app.post("/chat", async (req, res) => {

const message = req.body.message;

try {

const response = await fetch(
"https://api.groq.com/openai/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${GROQ_API_KEY}`
},
body: JSON.stringify({
model: "llama-3.1-8b-instant",
messages: [
{
role: "system",
content: "You are a helpful career guidance assistant."
},
{
role: "user",
content: message
}
]
})
}
);

const data = await response.json();

console.log("Groq Response:", data);

if (!data.choices) {
  return res.json({ reply: "AI Error: " + JSON.stringify(data) });
}

res.json({
  reply: data.choices[0].message.content
});

} catch (error) {

console.log(error);

res.json({
reply: "Error connecting to AI"
});

}

});

app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});