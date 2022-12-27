const { PrismaClient } = require("@prisma/client");
const { _ } = require("lodash");

const prisma = new PrismaClient();


function getRandomRoute() {
  // Bunch of random coordinates in the UK, 
  // 71% of the earths surface is water covered according to
  // google, which does not make for a
  const coords = [
    { 
      lat: 53.243595,
      lng: -1.580183
    },
    { 
      lat: 54.121961,
      lng: -2.080394
    },
    { 
      lat: 54.375508,
      lng: -1.053041
    },
    { 
      lat: 54.741817,
      lng: -2.241398
    },
    { 
      lat: 55.402267,
      lng: -3.313280
    },
    { 
      lat: 55.129974,
      lng: -4.288874
    },
    { 
      lat: 56.265998,
      lng: -4.409804
    },
    { 
      lat: 57.062904,
      lng: -3.601770
    },
  ]
  return _.sample(coords);
}

const dropAll = async () => {
  const deleteEvents = prisma.event.deleteMany();
  const deleteDescriptions = prisma.eventDescription.deleteMany();
  const deleteCoordinates = prisma.coordinate.deleteMany();
  const deleteAttendees = prisma.eventAttendee.deleteMany();
  const deleteKit = prisma.kitItem.deleteMany();
  await prisma.$transaction([
    deleteDescriptions,
    deleteCoordinates,
    deleteAttendees,
    deleteKit,
    deleteEvents,
  ]);
};


const seed = async () => {
  for (let i = 0; i < 100; i++) {
    await prisma.event
      .create({
        data: {
          creator: {
            connect: {
              email: process.env.SEED_EMAIL,
            },
          },
          description: {
            create: {
              visibility: "PUBLIC",
              difficulty: Math.floor(1 + Math.random() * 4),
              activity: "hiking",
              name: "An Event",
              start: "2022-11-08T00:00:00.000Z",
              end: "2022-11-17T00:00:00.000Z",
              description: "test",
            },
          },
          coordinates: {
            create: getRandomRoute(),
          },
          kitItems: {
            create: [
              {
                name: "TENT",
                capacity: 1 + Math.floor(Math.random() * 4),
                owner: {
                  connect: {
                    email: process.env.SEED_EMAIL,
                  },
                },
              },
            ],
          },
          attendees: {
            create: [
              {
                user: {
                  connect: {
                    email: process.env.SEED_EMAIL
                  }
                },
                status: "ACCEPTED"
              }
            ]
          }
        },
      })
      .then((res) => console.log(res));
  }
};

dropAll();
seed();
