const faker = require('faker')

const ENDPOINT_CREATE_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

// Create partially random payload for the rooms
function createRandomRoomPayload() {
    const fakeRoomNumber = faker.random.number({min:101, max:499})
    const fakeFloorNumber = faker.random.number({min:2, max:5})
    const fakeRoomPrice = faker.random.number({min:500, max:1499})
    const payload = {
        "features": ["balcony", "sea_view"],
        "category": "twin",
        "number": fakeRoomNumber,
        "floor": fakeFloorNumber,
        "available": true,
        "price": fakeRoomPrice
    }
    return payload
}

// Function get rooms. Lists all rooms 
function getRooms(cy) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            cy.log(responseAsString)
        }))
    }))
}

// Function create room. Creates a new room using the randomly generated payload
function createRoom() {
    cy.authenticateSession().then((response => {
        let roomPayload = createRandomRoomPayload()

        // Post request to create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_CREATE_ROOM,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: roomPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(roomPayload.number)
            expect(responseAsString).to.have.string(roomPayload.price)

        }))

        //getClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)

    }))
}

// Function to delete the last generated room
function deleteLastCreatedRoomAfterGet(cy) {
    cy.authenticateSession().then((response => {

        cy.request({
            method: "GET",
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            let lastId = response.body[response.body.length - 1].id
            cy.request({
                method: "DELETE",
                url: ENDPOINT_GET_ROOM + lastId,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            })
        }))
    }))

}




module.exports = {
    createRandomRoomPayload,
    getRooms,
    createRoom,
    deleteLastCreatedRoomAfterGet
}