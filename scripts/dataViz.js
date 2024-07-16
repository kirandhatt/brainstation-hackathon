/* https://plotly.com/javascript/plotlyjs-function-reference/#plotlyreact 
https://plotly.com/javascript/bar-charts

https://plotly.com/javascript/reference/bar/
*/

const targetBarColor = 'transparent';
const valueBarColor = 'black';
const targetBarWidth = 0.25;
const valueBarWidth = targetBarWidth;
const paper_bgcolor = 'transparent'; // https://plotly.com/javascript/reference/layout/#layout-paper_bgcolor
const plot_bgcolor = paper_bgcolor;

export class ProcessData {
    constructor(target, metric = 'protein') {
        this.value = 0;
        this.target = target;
        this.metric = metric;
        this.calories = 0;
    }

    updatePlate(foodObject, foodWeight, createElementFunction) {
        
        const { proteinAmt, carbohydrateAmt, fatAmt, portionGrams, description} = foodObject;
        
        const nPortions = foodWeight / 100 //portionGrams;
        const calorieAmt = nPortions * ((proteinAmt * 4) + (carbohydrateAmt * 4) + (fatAmt * 9));
        this.value += nPortions * proteinAmt;
        this.calories += calorieAmt;
        this.difference = this.value - this.target;
        this.absDifference = Math.abs(this.difference);
        const plateItemElement = createElementFunction();
        plateItemElement.innerText = `${foodWeight} g ${description}: ${nPortions * proteinAmt} g protein (${calorieAmt} calories)`;
        plateElement.appendChild(plateItemElement);
    }

    plotProgress(createElementFunction) {
    
        const plotElement = createElementFunction();
        const barChartProperties = {
            type: 'bar',
            orientation: 'h'
        }
        const targetBar = {
            // name: 'Remaining',
            y: [this.metric],
            x: [this.target],
            width: targetBarWidth,
        }
        const valueBar = {
            // name: 'Total',
            y: [this.metric],
            x: [this.value],
            width: valueBarWidth,
        }

        const largerBarProperties = {
            marker: {
                color: targetBarColor,
                line: {
                    color: valueBarColor,
                    width: 1
                }
            },
            hovertemplate: this.absDifference,
        }

        const smallerBarProperties = {
            hoverinfo: 'name+x', // https://plotly.com/javascript/reference/bar/#bar-hoverinfo,
            marker: {
                color: valueBarColor
            }
        }

        let largerBar;
        let smallerBar;
        if (this.value < this.target) {
            largerBar = targetBar;
            smallerBar = valueBar;
            largerBar.name = 'Remaining';
            smallerBar.name = 'Total';
            
        } else {
            largerBar = valueBar;
            smallerBar = targetBar;
            largerBar.name = 'Exceeded';
            smallerBar.name = 'Target';
        }
        const data = [
            { ...largerBar, ...barChartProperties, ...largerBarProperties },
            { ...smallerBar, ...barChartProperties, ...smallerBarProperties }
        ];
        
        const layout = {
            barmode: 'overlay', 
            orientation: 'horizontal',
            showlegend: false,
            paper_bgcolor: paper_bgcolor, // https://plotly.com/javascript/reference/layout/#layout-paper_bgcolor
            plot_bgcolor: plot_bgcolor,
            xaxis: {
                title: `${this.metric} (g)`
            },
            yaxis: {
                showticklabels: false
            }
        }
    
        Plotly.react(plotElement, data, layout);
        plotsContainerElement.innerHTML = '';
        plotsContainerElement.appendChild(plotElement);
    }

    createProteinText(createElementFunction) {
        if (this.difference < 0) {
            this.proteinMessage = `${this.absDifference} g of ${this.metric} remaining to reach your target of ${this.target} g`;
        } else if (this.difference > 5) { 
            this.proteinMessage = `${this.metric} target of ${this.target} exceeded by ${this.absDifference} g`
        } else {
            this.proteinMessage = `${this.target} target met`
        }
        const proteinMessageElement = createElementFunction();
        proteinMessageElement.innerText = this.proteinMessage;
        plotsContainerElement.appendChild(proteinMessageElement);
    }

    createCalorieText(createElementFunction) {
        const calorieMessageElement = createElementFunction();
        calorieMessageElement.innerText = `Total calories: ${this.calories}`;
        plotsContainerElement.appendChild(calorieMessageElement);
    }


}


const plotsContainerElement = document.querySelector('.plots-container');
const plateElement = document.querySelector('.plate__list');