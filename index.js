import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: './src/config/.env' });

import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import walletRoute from './src/routes/walletRoute.js';
import accountRoute from './src/routes/accountRoute.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/account', accountRoute);
app.use('/wallets', walletRoute);

app.get('/', (req, res) => {
  fs.readFile('public/index.html', 'utf-8', (err, ok) => {
    res.send(ok);
  });
});

app.use('/', (req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

app.listen(port, () =>
  console.log(`listening on port: http://localhost:${port}`)
);
