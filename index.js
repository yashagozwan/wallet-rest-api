import express from 'express';

import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import walletRoute from './src/routes/walletRoute.js';
import accountRoute from './src/routes/accountRoute.js';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/account', accountRoute);
app.use('/wallets', walletRoute);

app.get('/', (req, res) => {
  res.json({ success: true, status: 'server ready!' });
});

app.listen(port, () =>
  console.log(`listening on port: http://localhost:${port}`)
);
