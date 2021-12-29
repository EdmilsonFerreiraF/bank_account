import { app } from './app';
import config from './config';

const PORT = config.app.port

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));