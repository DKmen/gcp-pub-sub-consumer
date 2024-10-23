import 'dotenv/config'
import { startConsumer } from "./service/pub"

(async () => {
    startConsumer()
})()