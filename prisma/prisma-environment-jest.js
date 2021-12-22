

const NodeEnvironment = require('jest-environment-node')
const { IdGenerator } = require('../src/business/services/idGenerator')
const { execSync } = require('child_process')
const { resolve } = require('path')
const { Client } = require('pg')

const id = new IdGenerator().generate()

const prismaCLI = "yarn prisma"

require("dotenv").config({
    path: resolve(__dirname, '..', ".env.test")
})

class CustomNodeEnvironment extends NodeEnvironment {
    constructor(config) {
        super(config)

        this.schema = `code_schema_${id}`
        this.connetionString = `${process.env.DATABASE_URL}${this.schema}`
    }
    
    setup() {
        process.env.DATABASE_URL = this.connetionString
        this.global.process.env.DATABASE_URL = this.connetionString
        
        execSync(`${prismaCLI} migrate dev`)
    }

    async teardown() {
        const client = new Client({
            connectionString: this.connetionString
        })

        await client.connect()
        await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    }
}

module.exports = CustomNodeEnvironment