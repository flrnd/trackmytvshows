import app from 'app';
const PORT = process.env.port;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
