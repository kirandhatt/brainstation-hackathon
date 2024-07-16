import { foodsFetcher } from "./foodDb.js";


const searchForm = document.getElementById("searchForm");
const elPlateForm = document.getElementById("plateForm");


// Query database to return item IDs
function renderPage() {
    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const searchQuery = event.target.searchBox.value;
        await foodsFetcher.search(searchQuery);
        
    });
    
    // Add food to plate and get food details
    elPlateForm.addEventListener("submit", function (event) {
        event.preventDefault();
        foodsFetcher.addSelectedToPlate();
    });
}

renderPage();