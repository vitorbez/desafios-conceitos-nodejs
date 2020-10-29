const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //Simply return the array repositories:
  return response.json(repositories)

});

app.post("/repositories", (request, response) => {
  //The route must request the title, url and techs from the user:
  const title = request.body.title;
  const url = request.body.url;
  const techs = request.body.techs;

  //With the informations received above we can create a new repository, adding also an id and the likes:
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
 
  //Include the new repository in the array repositories (creates in fact the repository):
  repositories.push(repository);

  //Return created repository:
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //The route must request the id, title, url and techs from the user:
  const id = request.params.id;
  const title = request.body.title;
  const url = request.body.url;
  const techs = request.body.techs;
  // Find the position (index) of an id of the array repositories in which the repository id is equal to the id received above (in the request params):
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error:'Repository Not Found' });
  }
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

    //Take the new repository updated (the repositoryIndex position within the array is the new repository), and replace it, making it equal to the repository
  repositories[repositoryIndex] = repository;

  //Return updated repository:
  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error:'Repository Not Found' });
  }

  //The splice method is used to remove an information from the array:
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error:'Repository Not Found' });
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
