//
// Hit Tad X2 to see all the import GV you can choose
// 3+5 = 8
// _ + 6 = 14 , _ is what we get get before

// Just JS
const hello = "Hello World";
//console.log(hello);

//******************************//
//           Slugify            //
//******************************//

const slugify = require("slugify");

console.log(slugify("Avocado", { lower: true }));

//*****************************//
//     File System module      //
//*****************************//

//require the module
const fs = require("fs");

//read from file
const textIn = fs.readFileSync("../section2/TextFiles/hi.txt", "utf-8");
console.log(textIn);

//write to file
const textOut = `This is what you know about me:\n${textIn}\nCreate on ${Date.now()}`;
//Path and what String
fs.writeFileSync("../section2/TextFiles/output.txt", textOut);
console.log("File Written\n");

// =============================== //
//         Async -//- Sync         //
// =============================== //

//Synchronous - line by line and wont continue until the line calc is complete
//Also called Blocking Code

//ASynchronous - line by line but continue to do the rest of the code and will get back to the
//line that complete.
//That means that the code wont stop, other code will execute as parallel.
//Also called None Blocking Code

//Example
//fs.readFileS gets a callback function and read the file in the background and move to the next statement
//Using callback
fs.readFile("../section2/TextFiles/start1.txt", "utf-8", (err, data) => {
  if (err) {
    return console.log("Cant read the file");
  }
  console.log(data);
});

//*********************************//
//     Web Server HTTP module      //
//*********************************//

const http = require("http");
// import path from 'path';
// const __dirname = path.resolve();

//Because is execute once
const tempOverview = fs.readFileSync(
  `${__dirname}/HTML/tempOverview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/HTML/tempCard.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/HTML/tempProduct.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = require("./modules/replaceTemplate");

//Server
//*********************************//
//      Dealing With Routing       //
//            URL module           //
//*********************************//

const url = require("url");

const server = http.createServer((req, res) => {
  //from the server
  const { query, pathname } = url.parse(req.url, true);

  //OverViewPage
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHTML = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);
  }
  //ProductPage
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, { "Content-Type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // Api
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  }
  // Not Found
  else {
    res.writeHead(404, {
      //Header here to inform the browser
      "Content-type": "text/html",
      "my-own-header": "hello",
    });
    res.end('<h1 style="color:red;">Page not found</h1>');
  }
});

server.listen(8000, "localhost", () => {
  console.log("Listening to request on port 8000");
});
