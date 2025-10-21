const express = require("express")

const app = express();
app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT)
})

function longerWord(str) {
    let words = str.split(" ")

    let palabra = ""
    let length = 0;

    words.forEach(word => {
        if (word.length > length) {
            palabra = word
            length = word.length
        }
    });

    return palabra
}

app.get('/endpoint/:string', (req, res) => {
    const { string } = req.params;
    const { status } = req.query;

    const response = {
        moreText: longerWord(string),
        status: (status !== undefined),
        allCapital: string.toUpperCase()
    }

    res.send(response)
})