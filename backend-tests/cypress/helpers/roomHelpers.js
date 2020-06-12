const faker = require('faker')

const ENDPOINT_CREATE_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

function createRandomRoomPayload(){
    // const fakeRoomNumber = faker.number()
    // const fakeFloorNumber = faker.internet.email()
    // const fakeRoomPrice = faker.phone.phoneNumber()
    const payload = {
        "features":["balcony","sea_view"],
        "category":"twin",
        "number":"345",
        "floor":"3",
        "available":true,
        "price":"950"
    }
    return payload
}

function getRooms(cy){
    cy.authenticateSession().then((response =>{
    cy.request({
    method: "GET",
    url: ENDPOINT_GET_ROOMS,
    headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
    },
}).then((response =>{
    const responseAsString = JSON.stringify(response)
    cy.log(responseAsString)
}))
    }))
}

function createRoom(){
    cy.authenticateSession().then((response =>{
        let roomPayload = createRandomRoomPayload()

        // Post request to create a room
        cy.request({
            method: "POST",
            url: ENDPOINT_CREATE_ROOM,
            headers:{
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
        },
        body:roomPayload
    }).then((response =>{
        const responseAsString = JSON.stringify(response)
        expect(responseAsString).to.have.string(roomPayload.number)
    }))

    //getClientsWithAssertion(cy, fakeClientPayload.name, fakeClientPayload.email, fakeClientPayload.telephone)

}))
}


function deleteLastCreatedRoomAfterGet(cy){
    cy.authenticateSession().then((response =>{

    cy.request({
    method: "GET",
    url: ENDPOINT_GET_ROOMS,
    headers:{
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
    },
}).then((response =>{
    let lastId = response.body[response.body.length -1].id
    cy.request({
        method: "DELETE",
        url: ENDPOINT_GET_ROOM+lastId,
        headers:{
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