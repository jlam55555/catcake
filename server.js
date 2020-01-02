// import and set up express (routing)
const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('static'));

// import and set up image objects: fill in missing fields with defaults
// and replace timestamp string with Date object. default sorted by age.
const images = require('./image_meta.json')
  .meta
  .map(art => ({
    title:      art.title,
    filename:   art.filename,
    perma:      art.perma||art.filename.split('.').slice(0,-1)
                  .join('.').replace(/_/g,'-'),
    desc:       art.desc,
    long_desc:  art.long_desc||'',
    timestamp:  new Date(art.timestamp),
    tags:       art.tags,
  }))
  .map(art => ({
    ...art,
    __token_str:`${art.title} ${art.perma} ${art.desc} ${art.long_desc}`
                  .toLowerCase()
                  .replace(/[^A-Za-z0-9]/, ' ')
  }))
  .map(art => ({
    ...art,
    // for search
    __tokens:   new Set(art.__token_str.split(' '))
  }))
  .sort((a,b)=>a.timestamp-b.timestamp);
const recent_images = images.slice(-5);

// image search: takes req.query as an input to parse
// request query may have the following parameters:
// - query (string)
// - sort ('no', 'on', 'az')
// - tags (array of strings)
const SORT_DFL = 'no';
const sortfns = {
  'no': (a,b)=>a.timestamp-b.timestamp,
  'on': (a,b)=>b.timestamp-a.timestamp,
  'az': (a,b)=>a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
};
const image_search = req_query => {
  const query = req_query.query?req_query.query.toLowerCase()
                  .replace(/[^A-Za-z0-9]/,' ')
                  .split(' ').filter(q=>q.length):[];
  const sortfn = sortfns[req_query.sort||SORT_DFL]||sortfns[SORT_DFL];
  const tags = req_query.tags?req_query.tags.replace(/[^a-zA-Z,]/,'')
                  .split(',').filter(t=>t.length):[];

  return images.filter(art => {
    for(const word of query)
      if(!art.__tokens.has(word) && art.__token_str.indexOf(word)==-1)
        return false;
    for(const tag of tags)
      if(art.tags.indexOf(tag)==-1)
        return false;
    return true;
  }).sort(sortfn);
};

// search api endpoints
app.get('/api/search/', (req, res) => {
  res.json({idata:image_search(req.query)});
});

// routing endpoints
app.get('/', (req, res) => {
  res.render('index', {idata:recent_images,title:'Juliet Lam'});
});
app.get('/gallery', (req, res) => {
  res.render('gallery', {idata:image_search(req.query),title:'Gallery'});
});
app.get('/about', (req, res) => {
  res.render('about', {title:'About'});
});
app.get('/peruse/:iid', (req, res, next) => {
  const idatum = images.find(art=>art.perma==req.params.iid);
  if(idatum)
    res.render('idetails', {idatum:idatum,title:idatum.title});
  else
    next();
});
app.get('*', (req, res) => {
  res.render('404', {url: req.originalUrl,title:'the VOID'});
});

// listen on the correct port
app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}.`);
});
