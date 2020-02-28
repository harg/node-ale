const process = require('process');
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

let outputPath = '.'

// first arg is output path if valid
const args = process.argv.slice(2);
if (args.length > 0) {
  if (fs.existsSync(args[0])) {
    outputPath = args[0]
  } else {
    console.error('Invalid output path')
    process.exit(1)
  }
}


// Events
let apiKey = '' // todo your api key
request(`https://api.sportradar.us/motogp/trial/v2/fr/sport_events/sr:stage:432911/summary.json?api_key=${apiKey}`, { json: true }, (err, res) => {
  if (err) { return console.error(err) }
  const b = JSON.stringify(res.body)

  fs.writeFile(`${outputPath}/events.json`, b, err => {
    if (err) { return console.error(err) }
    //file written successfully
  })

});

// Pilots
request('https://www.motogp.com/en/riders/MotoGP', (err, res, data) => {
  if (err) { return console.error(err) }
  const $ = cheerio.load(data)

  const pilots = $('ul.rider_list li').map((i, el) => {
    // this === el
    return {
      name: $(this).find('a.decoration_none').attr('title'),
      country: $(this).find('p.flag_n img').attr('alt'),
      flagurl: $(this).find('p.flag_n img').attr('src'),
      number: $(this).find('p.flag_n span.num').text(),
      imgurl: $(this).find('a.decoration_none img').attr('src')
    };
  }).get()

  const content = JSON.stringify({ pilots: pilots })

  fs.writeFile(`${outputPath}/pilots.json`, content, err => {
    if (err) { return console.error(err) }
    //file written successfully
  })

});