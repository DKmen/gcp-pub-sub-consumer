import 'dotenv/config'
import { pushMessage } from "./service/pub";

(async () => {
    for (let i = 0; i < 1; i++) {
        await pushMessage(`Hello World ${i} v2`)
    }
})();