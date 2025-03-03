import { app } from "./app";

const port = Bun.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
