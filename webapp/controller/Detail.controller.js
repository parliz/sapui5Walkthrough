sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, History, MessageToast, JSONModel) {
	"use strict";
	return Controller.extend("sap.ui.demo.walkthrough.controller.Detail", {
		onInit: function () {
			var oData = {
				boxes : [
					{"key1": "value1",},
					{"key1": "value2",},
					{"key1": "value3",},
					{"key1": "value4",}
				]
			}
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "view");
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.byId("rating").reset();
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
				model: "film",
				parameters: {
					expand: 'film2session'
				}
			});
		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("overview", {}, true);
			}
		},

		onRatingChange: function (oEvent) {
			var fValue = oEvent.getParameter("value");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
		}
		,

		onFilterSelect: function (oEvent) {
			var oBinding = this.byId("productsTable").getBinding("items"),
				sKey = oEvent.getParameter("key"),
				// Array to combine filters
				aFilters = [],
				// Values for Filter
				fMaxOkWeightKG = 1,
				fMaxOkWeightG = fMaxOkWeightKG * 1000,
				fMaxHeavyWeightKG = 5,
				fMaxHeavyWeightG = fMaxHeavyWeightKG * 1000;

			if (sKey === "1") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("WeightMeasure", "LT", fMaxOkWeightG), new Filter("WeightUnit", "EQ", "G")], true),
						new Filter([new Filter("WeightMeasure", "LT", fMaxOkWeightKG), new Filter("WeightUnit", "EQ", "KG")], true)
					], false)
				);
			} else if (sKey === "2") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("WeightMeasure", "BT", fMaxOkWeightG, fMaxHeavyWeightG), new Filter("WeightUnit", "EQ", "G")], true),
						new Filter([new Filter("WeightMeasure", "BT", fMaxOkWeightKG, fMaxHeavyWeightKG), new Filter("WeightUnit", "EQ", "KG")], true)
					], false)
				);
			} else if (sKey === "3") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("WeightMeasure", "GT", fMaxHeavyWeightKG), new Filter("WeightUnit", "EQ", "KG")], true),
						new Filter([new Filter("WeightMeasure", "GT", fMaxHeavyWeightG), new Filter("WeightUnit", "EQ", "G")], true)
					], false)
				);
			}

			oBinding.filter(aFilters);
		}
	});
});