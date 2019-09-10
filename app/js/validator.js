var regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,4}$/i;
var regName = /^[a-zA-Z\s]+$/i;
var regNameRus = /^[А-Яа-яЁёa\s]+$/i;
var regPass = /^[a-zA-Z0-9]+$/i ;
var regDate = /(\d{2}\.\d{2}\.\d{4})/ ;
var regNum = /^\d+$/;
var regCardSum = /^[0-9\.\,]+$/;


//функция проверки корректности заполненения полей
function validateForm(type, id) {

	var val = jQuery.trim($("#"+id).val());
	var placeholder = jQuery.trim($("#"+id).attr("data-placeholder"));
	//alert(val+" = "+placeholder);
	switch(type){

		/*Дата*/
		case "date":
			//проверка поля
			if (val == "" || val.search(regDate) == -1 || val == placeholder){
				return false;
			} else {
				return true;
			}	
		break;

		/*ТОЛЬКО ЦИФРЫ*/
		case "number":
			//проверка поля
			val = val.replace(/\s+/g,"");
			if (val == "" || val.search(regNum) == -1 ){
				return false;
			} else {
				return true;
			}	
		break;

		/*просто проверка на НЕ пустоту поля*/
		case "required":
			//проверка поля
			if (val == "" || val == placeholder){
				return false;
			} else{
				return true;
			}	
		break;	
		/*селект проверка на НЕ пустоту поля*/
		case "required_select":
			//проверка поля
			if (val == 0){
				return false;
			} else{
				return true;
			}	
		break;

		/*просто пароля на длину*/
		case "pass":
			//проверка поля
			if (val == "" || val.length < 5){
				return false;
			} else{
				return true;
			}	
		break;	

		/*проверка на корректный email адрес*/	
		case "email":
			//проверка поля на пустоту и корректность email
			if (val == "" || val.search(regEmail) == -1 || val.length > 40 || val == placeholder){
				return false;
			} else{
				return true;
			}	
		break;	

		/*русские символы*/
		case "rusfield":
			var name = jQuery.trim($("#"+id).val());
			//проверка поля
			if (name == "" || name.search(regNameRus) == -1 ||  name.length > 40 || name.length < 2 || name == placeholder){
				return false;
			} else{
				return true;
			}	
		break;

		/*проверка чекбоксов*/
		case "checkbox_accept":
			var count = $("#"+id+" input:checkbox:checked").length;
			if (count == "0"){
				return false;
			} else{
				return true;
			}	
		break;

		//мобильный телефон
		case "number_phone":
			var name = jQuery.trim($("#"+id).val());
			//var name_n = parseInt(name);
			name = name.replace("(","");
			name = name.replace(")","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			//alert(name);

			if (name == "" || name.search(regNum) == -1 || name.length < 10 || name[0] == 0 || name[0] == 1 || name[0] == 2 || name[0] == 7){
				return false;
			} else {
				return true;
			}
		break;

		//пароль
		case "password":
			var pass = jQuery.trim($("#"+id).val());
			//проверка на латиницу/цифры
			if ( pass.search(regPass) == -1 || !pass.match(/[0-9]+/) || !pass.match(/[A-Z]+/) || pass.length < 8 ) {
				return false;
			} else {
				return true;
			}
			
		break;

		/*мобильный телефон + код города + м.б. пустое*/
		case "mobile_phone_empty":
			var name = jQuery.trim($("#"+id).val());
			name = name.replace("(","");
			name = name.replace(")","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			name = name.replace(" ","");
			var name_1 = name.substr(0,1);
			if (name == "") {
				return true;
			} else {
				if (name.search(regNum) == -1 || name.length < 10 || name_1 == 0 || name_1 == 1 || name_1 == 2 || name_1 == 7){
					return false;
				} else {
					return true;
				}
			}
			
		break;

		/*№ договора*/
		case "number_dogovor":
			//проверка поля
			val = val.replace(/\s+/g,"");
			if (val == "") {
				return true;
			} else {
				if (val.search(regNum) == -1 || val.length != 10 || val == placeholder ){
					return false;
				} else{
					return true;
				}	
			}
			
		break;

		/*ЦИФРЫ, ТОЧКА, ЗАПЯТАЯ*/
		case "cardsum":
			//проверка поля

			val = val.replace(/\s+/g,"");
			//console.log(val);
			if (val == "" || val.search(regCardSum) == -1 ){
				return false;
			} else{
				return true;
			}	
		break;
		
	} //end switch
}//end validateForm
