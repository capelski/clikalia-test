import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => res.send('Setting up'));

app.listen(PORT, () => {
    console.log(`Server up & running at port ${PORT}`);
});
