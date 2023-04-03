const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getList = `
    SELECT
    *
    FROM
    cricket_team`;
  const playerList = await db.all(getList);
  response.send(
    playerList.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getList = `
    SELECT
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId}`;
  const player1 = await db.get(getList);
  response.send(convertDbObjectToResponseObject(player1));
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;

  const addPlayerDetails = `
    INSERT INTO
    cricket_team (player_name, jersey_number, role)
    VALUES
     (
         ${player_name},
         ${jersey_number},
         ${role}
      );`;

  const dbResponse = db.run(addPlayerDetails);
  const bookId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});
module.exports = app;

app.get("/players/", async (request, response) => {
  const getList = `
    SELECT
    *
    FROM
    cricket_team`;
  const playerList = await db.all(getList);
  response.send(
    playerList.map((eachPlayer) => convertDbObjectToResponseObject(eachPlayer))
  );
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;

  const addPlayerDetails = `
    INSERT INTO
    cricket_team (player_name, jersey_number, role)
    VALUES
     (
         ${player_name},
         ${jersey_number},
         ${role}
      );`;

  const dbResponse = db.run(addPlayerDetails);
  const bookId = dbResponse.lastID;
  response.send("Player Added to Team");
});

module.exports = app;
