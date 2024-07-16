import { FoodNutrition } from "./utils/data.js";
import { FoodResult } from "./utils/data.js";
import { apiKey } from "./secrets.js";
import { displayError } from "./utils/utils.js";
import { createElement} from "./utils/dom.js";
import * as dv from './dataViz.js';

// let searchResults;
// let selectedFoods = [];
const tblHeadings = ["Portion Size (g)", "", "Item"];
const dataProcessor = new dv.ProcessData(20);

export class FoodDbApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.nal.usda.gov/fdc/v1/";
    this.searchPath = "foods/search";
    this.foodPath = "food";
  }
  async getResults(searchQuery) {
    const foodResults = [];
    try {
      const reqUrl = this.baseUrl + this.searchPath;
      const params = {
        query: searchQuery,
        pageSize: 5,
        dataType: "Foundation",
        sortBy: "dataType.keyword",
        sortOrder: "asc",
        api_key: this.apiKey,
      };
      const resp = await axios.get(reqUrl, { params: params });
      if (resp.data.foods) {
        const foodResponse = resp.data.foods;
        foodResponse.forEach((food) => {
          const foodResult = new FoodResult(
            food.fdcId,
            food.description,
            food.foodCategory
          );
          foodResults.push(foodResult);
        });
      }
    } catch (error) {
      console.log("Could not get search results.", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      }
    }
    return foodResults;
  }
  
  async getFoodDetails(fdcId) {
    try {
      const reqUrl = this.baseUrl + this.foodPath + `/${fdcId}`;
      const params = {
        nutrients: "203,204,205",
        api_key: this.apiKey,
      };
      const resp = await axios.get(reqUrl, { params: params });
      if (resp.data) {
        this.foodData = resp.data;
        console.log('food details:', this.foodData);
        // let foodPortions = null;
        // if (this.foodData.foodPortions) {
        //   foodPortions = this.foodData.foodPortions[0].gramWeight;
        // } else null;
        this.portions = this.extractPortion();
        console.log('portions:', this.portions);
        const nutrition = new FoodNutrition(
          this.foodData.fdcId,
          this.foodData.description,
          this.foodData.foodNutrients,
          this.portions
        );
        return nutrition;
      }
    } catch (error) {
      console.log("Could not get food details.", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      }
    }
    return {};
  }

  extractPortion() {    
    if (this.foodData?.foodPortions) {
      const portionsArray = this.foodData.foodPortions.map(object => {
        const portionObject = {
          gramWeight: object?.gramWeight ?? 100,
          amount: object?.amount,
          measureUnit: object?.measureUnit.name
        }
        console.log('portionObject', portionObject);
        return portionObject;
      })
      return portionsArray;

    } else {
      return {
        gramWeight: 100
      }
    }
  }
}

export class getFoods {
  constructor() {
    this.apiObj = new FoodDbApi(apiKey);
    this.selectedFoodsArray = [];
  }
  
  async search(searchQuery) {
    try {
      this.searchResults = await apiObj.getResults(searchQuery);
      this.displayResults(this.searchResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
      displayError("An error occurred while fetching search results.");
    }
    return this.searchResults;
  };
  displayResults() {
    const formElement = createElement('form', 'add-to-plate-form'); //
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.innerHTML = "";
    if (this.searchResults.length === 0) {
      resultsContainer.appendChild(
        createElement("div", "no-results", "No results found.")
      );
    } else {
      this.createResultsTable();
      this.createTblRows();
      formElement.appendChild(this.tableElement);
      resultsContainer.appendChild(formElement);
      // resultsContainer.appendChild(this.tableElement);
    }
  };
  
  createResultsTable() {
    this.tableElement = createElement("table", "results-table");
    
    // replaces `createTblHeading()`
    const elTHead = createElement("thead");
    const elTHeadRow = createElement("tr");
    
    elTHead.appendChild(elTHeadRow);
    this.tableElement.appendChild(elTHead);
    
    tblHeadings.forEach((heading) => {
      const thEl = createElement("th", "results__field");
      thEl.innerText = heading;
      thEl.setAttribute("scope", "col");
      elTHeadRow.appendChild(thEl);
    });
    
    // replaces `createTblBody()`
    this.tableBody = createElement("tbody");
    this.tableElement.appendChild(this.tableBody);
    
  }
  
  createTblRows() {
    this.searchResults.forEach((result, index) => {
      // <tr> = table row
      const elRow = createElement("tr");
      const portionInputElement = createElement('input', 'user-input__portion');
      portionInputElement.name = `portion-${index}`;
      portionInputElement.type = "number";
      const addButtonElement = createElement('button', 'user-input__submit-button', 'Add to plate');

      // Create table cells
      console.log('creating table cells');
      elRow.appendChild(
        this.createTblCell(tblHeadings[0], portionInputElement, "results__quantity-column")
      );
      elRow.appendChild(
        this.createTblCell(tblHeadings[1], addButtonElement, "results__button-column")
      );
      elRow.appendChild(
        this.createTblCell(tblHeadings[2], result.description, "results__description")
      );
      this.tableBody.appendChild(elRow);

      // event listener for "Add to plate" button
      addButtonElement.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Add to plate button clicked');
        console.log('portionInputElement', portionInputElement.value);
        const portionSize = portionInputElement.value;
        applySelectStyle(elRow);
        this.selectedFoodsArray.push(this.getFoodDetails(result.fdcId, portionSize));
      })
    });
  };
  
  createTblCell(th, text, className) {
    // <td> = table cell
    const elTd = createElement("td", className);
    elTd.setAttribute("data-th", th);
    if (typeof (text) === 'string') {
      elTd.innerText = text;
    } else {
      elTd.appendChild(text)
    }
    return elTd;
  };
  
  async getFoodDetails (fdcId, portionSize) {
    const foodObject = await apiObj.getFoodDetails(fdcId);
    console.log(`Fetching food details for ${fdcId}`)
    dataProcessor.updatePlate(foodObject, portionSize, () =>
      createElement("p", "plate__item")
  );
  dataProcessor.plotProgress(() => createElement('div', 'plot'));
  dataProcessor.createProteinText(() => createElement('p', 'protein-message'));
  dataProcessor.createCalorieText(() => createElement('p', 'calorie-message'));
  };
}


// ------------------- event listeners -------------------
function applySelectStyle(selectedElement, selectClassName='selected') {
    const classesArray = Object.values(selectedElement.classList);
    if (classesArray.includes(selectClassName)) {
      selectedElement.classList.remove(selectClassName);
    } else {
      selectedElement.classList.add(selectClassName);
    }
};





export const apiObj = new FoodDbApi(apiKey);
export const foodsFetcher = new getFoods();