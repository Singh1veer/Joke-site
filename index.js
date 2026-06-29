import express from "express";
import axios from "axios";
import path from "path";
import bodyParser from "body-parser"
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app=express();
const port=3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "Public")));
app.use(bodyParser.json());          
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",async(req,res)=>{
    const category=req.query.category||"Any";
    const type=req.query.type||"";  
    var url = `https://v2.jokeapi.dev/joke/${category}?type=${type}&safe-mode&blacklistFlags=nsfw,racist,sexist,explicit`;
      try {
    const { data: joke } = await axios.get(url);
    res.render("index", { joke, category, type });
  } catch (err) {
    console.log(err);
    res.render("index", { joke: null, category, type });
  }
});
app.get("/submit", (req, res) => {
  res.render("input", { category: "Any", type: "single", success: false });
});
app.post("/submit", async (req, res) => {
  const { type, category, joke, setup, delivery } = req.body;
  if (!type || !category)
    return res.status(400).json({ error: "Please select type and category." });
  if (type === "single" && !joke)
    return res.status(400).json({ error: "Please write your joke." });
  if (type === "twopart" && (!setup || !delivery))
    return res.status(400).json({ error: "Please fill in setup and punchline." });
 
  console.log("New joke submitted:", { type, category, joke, setup, delivery });
  res.json({ success: true });
});
app.listen(3000,()=>{
 console.log("Entered port 3000 successfully!");
});