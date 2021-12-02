const base_url = "https://api.jikan.moe/v3";


/*
This is during the event of "Searching" we are grabbing the data from the API Database of Jikan, and thus giving it results based on the user input. 
*/ 
function searchAnime(event){

    event.preventDefault();

    const form = new FormData(this);
    const query = form.get("search");

    fetch(`${base_url}/search/anime?q=${query}&page=1`)
    .then(res=>res.json())
    .then(updateDom)
    .catch(err=>console.warn(err.message));
}

/*
We are taking in the user input and then actually uploading the results, so from the database we now need to somehow display this information.

You can see the program actually does take in the response and generates suggestions / results but we only see this using "Inspect element" while in the browser. 
We need these results to be displayed so that way the user sees the different animes.
*/ 
function updateDom(data){

    const searchResults = document.getElementById('search-results');

    const animeByCategories = data.results
        .reduce((acc, anime)=>{

            const {type} = anime;
            if(acc[type] === undefined) acc[type] = [];
            acc[type].push(anime);
            return acc;

        }, {});

        /*
        Mapping the objects / results from the API 
        */
        searchResults.innerHTML = Object.keys(animeByCategories).map(key=>{

            const animesHTML = animeByCategories[key]
            .sort((a,b)=>a.episodes-b.episodes)
            .map(anime=>{

                /*
                This is how we are structuring the search results (using a similar HTML code, as we are creating a class, dividng these classes and rows into different sections.)
                */
                return `
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${anime.title}</span>
                            <p>${anime.synopsis}</p>
                        </div>
                        <div class="card-action">
                            <a href="${anime.url}" target="_blank">Find out more</a>
                        </div>
                    </div>
                `
            }).join("");


            return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="kemicofa-row">${animesHTML}</div>
                </section>
            `
        }).join("");
}

function pageLoaded(){
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchAnime);
}


window.addEventListener("load", pageLoaded);