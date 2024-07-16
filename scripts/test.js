import * as dv from './dataViz.js'
import { createElement } from "./utils/dom.js";

import { apiKey } from './secrets.js';

const target = 20;
let foods = [
    {
        description: 'chicken',
        proteinAmt: 15,
        fatAmt: 3,
        carbohydrateAmt: 5,
        portionGrams: 100
    },
    {
        description: 'almonds',
        proteinAmt: 2,
        fatAmt: 3,
        carbohydrateAmt: 5,
        portionGrams: 100
    },
    {
        description: 'peanut butter',
        proteinAmt: 2,
        fatAmt: 3,
        carbohydrateAmt: 5,
        portionGrams: 100
    }
]
let foodweight = 100;
const dataProcessor = new dv.ProcessData(target);

foods.forEach(foodObject => {
    dataProcessor.updatePlate(
        foodObject, foodweight, 
        () => createElement('p', 'plate__item')
    );
});

dataProcessor.plotProgress(() => createElement('div', 'plot'));
dataProcessor.createProteinText(() => createElement('p', 'protein-message'));
dataProcessor.createCalorieText(() => createElement('p', 'calorie-message'));
