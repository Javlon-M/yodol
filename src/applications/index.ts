import { MongooseStorageImpl } from "app/components"

async function main() {
    const storage = new MongooseStorageImpl()

    await storage.open()
}

main()
