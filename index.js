
axios.get("https://ajax.test-danit.com/api/swapi/films")
  .then(({ data }) => {
    data.forEach(({ episodeId, name, openingCrawl, characters }) => {
      const filmCard = new FilmCard(episodeId, name, openingCrawl);
      filmCard.render();
      
      const characterPromises = characters.map(character => axios.get(character));
      
      Promise.all(characterPromises)
        .then((characterResponses) => {
          characterResponses.forEach(({ data }) => {
            const character = new Character(data.birthYear, data.gender, data.name);
            character.render();
            filmCard.addCharacter(character);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  })
  .catch((err) => {
    console.error(err);
  });

class FilmCard {
  constructor(episodeId, name, openingCrawl) {
    this.episodeId = episodeId;
    this.name = name;
    this.openingCrawl = openingCrawl;
    this.characters = [];
    this.card = null;
  }

  render() {
    this.card = document.createElement("div");
    this.card.classList.add("card");
    this.card.innerHTML = `
      <p>Episode: ${this.episodeId}</p> 
      <p>Film: ${this.name}</p>
      <p>Opening crawl: ${this.openingCrawl}</p>
      <p> Characters:</p>
    `;
    document.querySelector(".container").appendChild(this.card);
  }

  addCharacter(character) {
    this.characters.push(character);
    const characterElement = character.getElement();
    if (characterElement) {
      this.card.appendChild(characterElement);
    }
  }
}

class Character {
  constructor(birthYear, gender, characterName) {
    this.birthYear = birthYear || "Unknown";
    this.gender = gender || "Unknown";
    this.characterName = characterName || "Unknown";
    this.card = null;
  }

  render() {
    this.card = document.createElement("div");
    this.card.classList.add("characters");
    this.card.innerHTML = `
      <p>Character:</p>
      <p>Name: ${this.characterName} </p> 
      <p>Gender: ${this.gender}</p>
      <p>Birth year: ${this.birthYear}</p>
    `;
  }

  getElement() {
    return this.card;
  }
}
