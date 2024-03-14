const express = require('express');
const routes = require('./routes/routes');
const twillioRoutes=require("./routes/twillioRoutes");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('upload'));

app.use('/', routes);
app.use('/twillio',twillioRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


/***
 * EAAWCOpSQs2gBO83WyqNAvlxq1tpqgkPhvsVEtlPktsU2hONOJDKoZCG7zlCFo83TVb2g7ZCY4GUm3QiLw3pYE6HhSI529ojXsZAkaqMI1DJ1smIToiZCdKrZAQA1CCwI50xlCplul7kQOKDGY9DKDWwrpRNnIFM6rYfdkPnC7K8Mmcm9cWKPkHnDa7FGn2hcar95A9BSXZCktcrDTIHkQZD
 * 
 * 
 */