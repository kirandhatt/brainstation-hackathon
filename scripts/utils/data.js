export class FoodResult {
  constructor(fdcId, description, category) {
    this.fdcId = fdcId;
    this.description = description;
    this.category = category;
  }
}

export class FoodNutrition {
  constructor(
    fdcId,
    description,
    nutrients,
    portionGrams
  ) {
    this.fdcId = fdcId;
    this.description = description;
    this.portionGrams = portionGrams;
    nutrients.forEach((nutrientObj) => {
        if(nutrientObj.nutrient.name === "Protein") {
            this.proteinAmt = nutrientObj.amount;
            this.proteinUnit = nutrientObj.nutrient.unitName;
        } else if(nutrientObj.nutrient.name === "Total lipid (fat)") {
            this.fatAmt = nutrientObj.amount;
        this.fatUnit = nutrientObj.nutrient.unitName;
        } else if(nutrientObj.nutrient.name === "Carbohydrate, by difference") {
            this.carbohydrateAmt = nutrientObj.amount;
        this.carbohydrateUnit = nutrientObj.nutrient.unitName;
        }

  });
}
}
