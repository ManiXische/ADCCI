/***************************************************************************************************
Extension Name: \\ex-formcalculation
File: component-formcalculation
Owner: null
Version: 1.0.0
***************************************************************************************************/

$(document).ready(function () {
    var baseClass = ".ex-formcalculation";

    // helpers 
    function formatString(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
   

    // clear button 
    $(baseClass).find(baseClass + "__clear").on("click" , function(){
        // clear inputs
        $(baseClass).find("input").val("");
        // toggle table
        $(baseClass).find(baseClass + "__table-holder").slideUp(500);
    });


    // suffixes 
    var noCellSuffix = "-no-cell",
    sapCellSuffix = "-sap-cell",
    totalCellSuffix = "-total-cell";

    // columns 
    var familyIncome = "familyincome",
    familyHead = "familyhead",
    under14 = "under",
    over14 = "over",
    possibleEntitlement = "possible",
    monthlyIncome = "monthlyincome";


    // form inputs 
    var under14dependentsInput = $(baseClass).find("[name='under14dependents']"),
    over14dependentsInput = $(baseClass).find("[name='over14dependents']"),
    monthlyincomeInput = $(baseClass).find("[name='monthlyincome']"),
    under14SocialAssistanceCell = $(baseClass).find("." + under14 + sapCellSuffix),
    over14SocialAssistanceCell = $(baseClass).find("." + over14 + sapCellSuffix),
    familyHeadSocialAssistanceCell = $(baseClass).find("." +  familyHead + sapCellSuffix),
    under14DependentsNoCell = $(baseClass).find("." +  under14 + noCellSuffix),
    over14DependentsNoCell = $(baseClass).find("." +  over14 + noCellSuffix),
    familyHeadNoCell = $(baseClass).find("." +  familyHead + noCellSuffix),
    under14DependentsTotalCell = $(baseClass).find("." +  under14 + totalCellSuffix),
    over14DependentsTotalCell = $(baseClass).find("." +  over14 + totalCellSuffix),
    familyHeadTotalCell = $(baseClass).find("." +  familyHead + totalCellSuffix),
    familyIncomeCell = $(baseClass).find("." +  familyIncome + totalCellSuffix),
    monthlyIncomeCell = $(baseClass).find("." +  monthlyIncome + totalCellSuffix),
    possibleEntitlementCell = $(baseClass).find("." +  possibleEntitlement + totalCellSuffix);
	var MinAllowanceInput= $(baseClass).find("[name='minallowance']"),
		MaxAllowanceInput= $(baseClass).find("[name='maxallowance']");


    // prevent inputs to type chars 
    const regex = /[^0-9]+/g;
    $(baseClass).find("[name='under14dependents'], [name='over14dependents'] , [name='monthlyincome']").on("keyup", function(){
        var value = $(this).val();
        $(this).val(value.replace(regex , ""));
    });

    // button 
    var button = $(baseClass).find(baseClass + "__calculate"),
    form = $(baseClass).find("form");

     // init form requester 
     let formPlugin =  form.FormPlugin({
        debug : true,
        errorBlock : '.field-validation-error',
        errorClass : 'input-validation-error',
        invalidCssClass : 'is-invalid',
        inputWrapper : '.ex-sitecore-form__input',
    }).data("FormPlugin");


    // claculate 
    button.on("click" , function(){


        let validated = form.valid();
        
        if(validated){
      
            var under14dependentsValue = under14dependentsInput.val() || 0 ,
            over14dependentsValue = over14dependentsInput.val() || 0,
            monthlyincomeValue = monthlyincomeInput.val() || 0,
            familyHeadNoValue = 1,
            socialAssistanceUnder14Value = under14SocialAssistanceCell.text().trim().replace(",", ""),
            socialAssistanceOver14Value = over14SocialAssistanceCell.text().trim().replace(",", ""),
            socialAssistanceFamilyHeadValue = familyHeadSocialAssistanceCell.text().trim().replace(",", ""),
			MinAllowanceValue = MinAllowanceInput.val() || 0,
			MaxAllowanceValue = MaxAllowanceInput.val() || 0;
			

            // replace numbers with comma seperated 
            familyHeadSocialAssistanceCell.text(formatString(socialAssistanceFamilyHeadValue));
            over14SocialAssistanceCell.text(formatString(socialAssistanceOver14Value));
            under14SocialAssistanceCell.text(formatString(socialAssistanceUnder14Value));

            // calculated 
            var totalUnder14SAP = under14dependentsValue * parseFloat(socialAssistanceUnder14Value);
            var totalOver14SAP = over14dependentsValue * parseFloat(socialAssistanceOver14Value);
            var totalFamilyHeadSAP = familyHeadNoValue * parseFloat(socialAssistanceFamilyHeadValue);
            var totalIncome = totalUnder14SAP + totalOver14SAP + totalFamilyHeadSAP;
            var socialAssistanceAllowance4Family =  totalIncome - monthlyincomeValue
			//Min-Max Allowance Validation
			if( parseFloat(socialAssistanceAllowance4Family) <= parseFloat(MinAllowanceValue))
			{
				socialAssistanceAllowance4Family=MinAllowanceValue;
			}
			if(parseFloat(socialAssistanceAllowance4Family) >= parseFloat(MaxAllowanceValue))
			{
				socialAssistanceAllowance4Family=MaxAllowanceValue;
			}
			
            // populate data 
            under14DependentsNoCell.text(formatString(under14dependentsValue));
            over14DependentsNoCell.text(formatString(over14dependentsValue));
            familyHeadNoCell.text(formatString(familyHeadNoValue));
            under14DependentsTotalCell.text(formatString(totalUnder14SAP));
            over14DependentsTotalCell.text(formatString(totalOver14SAP));
            familyHeadTotalCell.text(formatString(totalFamilyHeadSAP));
            familyIncomeCell.text(formatString(totalIncome));
            monthlyIncomeCell.text( "-" + formatString(monthlyincomeValue));
            possibleEntitlementCell.text(formatString(socialAssistanceAllowance4Family));

            // toggle table
            $(baseClass).find(baseClass + "__table-holder").slideDown(500);
              
        }
    });

});