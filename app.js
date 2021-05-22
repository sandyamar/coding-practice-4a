const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
const dbPath = path.join(__dirname, "cricketTeam.db");
app.use(express.json());
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

//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
    * 
    FROM 
    cricket_team 
    ORDER By 
    player_id;`;

  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});
module.exports = app;

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
    INSERT 
    INTO 
    cricket_team(player_name,jersey_number,role)
    VALUES
    (
        '${playerName}',
        '${jerseyNumber}',
        '${role}'
    );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastId;
  response.send("Player Added To Team");
});
module.exports = app;

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `
    SELECT 
    *
    FROM
    cricket_team
    WHERE
    player_id = ${playerId};`;
  const player = await db.get(getPlayerDetails);
  response.send(player);
});
module.exports = app;

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updatePlayerDetails = `
    UPDATE
    cricket_team
    SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE
    player_id = ${playerId};`;
  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});
module.exports = app;

//API 5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.prams;
  const deletePlayer = `
    DELETE FROM
    cricket_team
    WHERE 
    player_id = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Player Removed");
});
module.exports = app;
