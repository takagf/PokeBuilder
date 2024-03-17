const MAX_POKEMON = 649;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemon(allPokemons);
});

async function fetchPokemonDataBeforeRedirect(id){
    try{
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
                res.json()
            ),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
                res.json()
            )
        ]);
        return true;
    } catch(error) {
        console.error("Failed to fetch");
    }
}

function displayPokemon(pokemon){
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">
                #${pokemonID}
                </p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" 
                     alt="${pokemon.name}"
                />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;
        listItem.addEventListener( "click", async ()=> {
            const success = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
        }
        });
        listWrapper.appendChild(listItem);
    });
}

searchInput.addEventListener("keyup", handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemon;

    if(numberFilter.checked) {
        filteredPokemon = allPokemons.filter((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        return pokemonID.startsWith(searchTerm);
    });
    } else if (nameFilter.checked) {
        filteredPokemon = allPokemons.filter((pokemon) => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    } else {
        filteredPokemon = allPokemons;
    }

    displayPokemon(filteredPokemon);

    if(filteredPokemon.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click", clearSearch);

function clearSearch() {
  searchInput.value = "";
  displayPokemons(allPokemons);
  notFoundMessage.style.display = "none";
}

