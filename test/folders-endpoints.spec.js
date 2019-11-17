const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures')

describe(`Folders Endpoints`, function() {
    let db

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy())

    before(`clean the table`, () => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    afterEach(`cleanup`, () => db.raw(`TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE`))

    describe.only(`GET /api/folders`, () => {
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200, [])
            })
        })

        context(`Given there are folders in the database`, () => {
            const testFolders = makeFoldersArray();

            beforeEach(`insert folders`, () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it(`responds with 200 and all of the folders`, () => {
                return supertest(app)
                    .get(`/api/folders`)
                    .expect(200, testFolders)
            })
        })

        
    })
})