import axios from 'axios';
import { CONFIG } from './config';
import * as ALERT_ACTIONS from './actions/alert-actions';

export const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = `${dd}-${mm}-${yyyy}`

    return formattedToday;
}

const formatToTodayOrYesterday = (str) => {
    var date = new Date(str);
    var now = new Date();
    now.setHours(0,0,0,0);

    var hours_offset = (now.getTime() - date.getTime()) / 36e5;
    if (hours_offset > 24 || hours_offset < 0){
        return null; //not today or yesterday
    }
    else {
        var date_day = date.getDate();
        var now_day = now.getDate();
        var day_prefix = (now_day - date_day) === 0 ? "Hoy " : "Ayer ";
        
        var hours = date.getHours();
        hours = hours < 10 ? ('0' + hours) : hours;

        var minutes = date.getMinutes();
        minutes = minutes < 10 ? ('0' + minutes) : minutes;

        return day_prefix + hours + ':' + minutes + 'hs ';
    }    
}

export const formatToDateAndHour = (str, slashes, withoutTime) => {
    var date = new Date(str);
    
    var day = parseInt(date.getDate());
    day = day < 10 ? ('0' + day) : day;
    
    var month = parseInt(date.getMonth()+1);
    month = month < 10 ? ('0' + month) : month;
    
    var year = date.getFullYear();

    var hours = date.getHours();
    hours = hours < 10 ? ('0' + hours) : hours;

    var minutes = date.getMinutes();
    minutes = minutes < 10 ? ('0' + minutes) : minutes;

    if (slashes){
        // HH:MMhs - DD/MM/YYYY
        var time = withoutTime ? "" : hours + ':' + minutes + 'hs - ';
        return time + day+'/'+month+'/'+year;
    }
    else {
        // DD-MM-YY HH:MMhs
        var time = withoutTime ? "" : ' ' + hours + ':' + minutes + 'hs';
        return day + "-" + month + "-" + year.toString().substr(-2) + time;
    }    
}

export const formatDateWithSlashes = (format) => {
    let isTodayOrYesterday = format.isTodayOrYesterday;
    let str = format.fecha;
    let withoutTime = format.withoutTime
    if (isTodayOrYesterday){
        var todayOrYesterday = formatToTodayOrYesterday(str);
        if (todayOrYesterday !== null){
            return todayOrYesterday;
        }
    }
    return formatToDateAndHour(str, true, withoutTime);
}

export const formatDateWithDashes = (format) => {
    let isTodayOrYesterday = format.isTodayOrYesterday;
    let str = format.fecha;
    let withoutTime = format.withoutTime
    if (isTodayOrYesterday){
        var todayOrYesterday = formatToTodayOrYesterday(str);
        if (todayOrYesterday !== null){
            return todayOrYesterday;
        }
    }
    return formatToDateAndHour(str, false, withoutTime);
}

export const parseOnlyLetters = (str, specialChar) => {
    let sChar = specialChar ? "\\"+specialChar : "";
    let reg = new RegExp("[^a-zA-Z"+sChar+"]", "g");
    return str ? str.replace(reg, "") : "";
}

export const parseOnlyNumbers = (str) => {
    let reg = new RegExp("[^0-9]", "g");
    return str ? str.replace(reg, "") : "";
}

export const parseLettersNumbersAndSpecialChar = (str, specialChar) => {
    let sChar = specialChar ? "\\"+specialChar : "";
    let reg = new RegExp("[^0-9a-zA-Z"+sChar+"]", "g");
    return str ? str.replace(reg, "") : "";
}

export const convertDateToLastHour = (d) => {
    if (d){
        return new Date(d.setHours(23,59,59,0));
    }
    else return d;
}

export const convertDateToCeroHours = (d) => {
    if (d){
        return new Date(d.setHours(0,0,0,0));
    }
    else return d;
}

export const checkFechaVencida = (fecha) => {
    return new Date((new Date().setHours(23,59,59,0))) > new Date(fecha); 
}

export const styleModal = {
    position: 'absolute',
    top: '100px',
    color: '#fff',
    left: '5%',
    width: '86%',
    bgcolor: (theme) => theme.palette.background.main,
    boxShadow: 24,
    px: '2%',
    pb: 4
};

export const styleConfirmModal = {
    position: 'absolute',
    top: '100px',
    color: '#fff',
    left: {xs: '8%', sm: '18%', lg:'33%'},
    width: {xs: '80%', sm: '60%', lg:'30%'},
    bgcolor: (theme) => theme.palette.background.main,
    boxShadow: 24,
    px: '2%',
    pb: 4
};

export const styleModalMini = {
    position: 'absolute',
    top: '100px',
    color: '#fff',
    left: {xs: '8%', lg:'16%'},
    width: {xs: '80%', lg:'64%'},
    bgcolor: (theme) => theme.palette.background.main,
    boxShadow: 24,
    px: '2%',
    pb: 4
};

export const checkIfPersonExists = (tipoDocumento, numeroDocumento, dispatch, setPersonaExistente, checkIfHasAfiliado) => {
    axios.post(CONFIG.API_SERVER_ADDRESS+'/personas/get_by_documento', {
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            check_if_has_afiliado: checkIfHasAfiliado
        },
        {
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("access_token")
            }
        })
        .then(response => {
            if (response.data.msg){
                dispatch(ALERT_ACTIONS.setAlert({ type: 'success', message: response.data.msg }));
            }
            setPersonaExistente(response.data.persona);
        })
        .catch(error => {
            console.log(error);
            dispatch(ALERT_ACTIONS.setAlert({ type: 'error', message: error.response.data.error }));
            setPersonaExistente(null);
        });
}

export const parseNumber19DigitsAnd2Decimals = (value) => {
    let conComa = String(value).split(',')
    let conPunto = String(value).split('.')

    if ( conPunto.length === 2 ) {
        value = parseOnlyNumbers(conPunto[0].slice(0,17))
        value += "." + parseOnlyNumbers(conPunto[1].slice(0,2))
    }

    else{
        if ( conComa.length === 2 ) {
            value = parseOnlyNumbers(conComa[0].slice(0,17))
            value += "," + parseOnlyNumbers(conComa[1].slice(0,2))
        }

        else {
            if (value !== undefined) {
                value = parseOnlyNumbers(String(value).slice(0,17))
            }
        }
    }
    
    return value;
}

export const handleNroLegajo = (e, nroLegajo, setNroLegajo, nroDoc) => {
    let val = e.target.value;
    val = parseLettersNumbersAndSpecialChar(val, "/");
    if (val[val.length - 1] !== "/" && val.length > nroLegajo.length){
        val = val.replaceAll("/", "");

        let docLength = 8;
        if (e.target.value.split("/").length > 1){
            docLength = e.target.value.split("/")[1].length;
        }

        let v1 = val.slice(0, 1);
        let v2 = val.slice(1, 1 + docLength);
        let v3 = val.slice(1 + docLength, 1 + docLength + 2);
        let v4 = val.slice(1 + docLength + 2, 1 + docLength + 2 + 1);

        let newValue = "";
        if (v1 !== ""){
            newValue = v1 + "/";
            if (v2 === "" && nroDoc.length >= 7 && nroDoc.length <= 9){
                let doc = nroDoc.length === 7 ? "0"+nroDoc : nroDoc;
                newValue = newValue + doc + "/";
            }
        }
        if (v2 !== ""){
            newValue = newValue + v2;
            if (docLength >= 8 && docLength <= 9){
                newValue = newValue + "/";
            }
        }
        if (v3 !== ""){
            newValue = newValue + v3;
            if (v3.length === 2){
                newValue = newValue + "/";
            }
        }
        if (v4 !== ""){
            newValue = newValue + v4;
        }

        setNroLegajo(newValue.slice(0,7+docLength));
    }
    else {
        setNroLegajo(val);
    }
}

export const handleCuit = (e, cuit, setCuit, nroDoc) => {
    let val = e.target.value;
    val = parseLettersNumbersAndSpecialChar(val, "-");
    if (val[val.length - 1] !== "-" && val.length > cuit.length){
        val = val.replaceAll("-", "");

        let docLength = 8;
        if (e.target.value.split("-").length > 1){
            docLength = e.target.value.split("-")[1].length;
        }

        let v1 = val.slice(0, 2);
        let v2 = val.slice(2, 2 + docLength);
        let v3 = val.slice(2 + docLength, 2 + docLength + 1);

        let newValue = "";
        if (v1 !== ""){
            newValue = v1;
            if (v1.length === 2){
                newValue = newValue + "-";
                if (v2 === "" && nroDoc.length >= 7 && nroDoc.length <= 9){
                    let doc = nroDoc.length === 7 ? "0"+nroDoc : nroDoc;
                    newValue = newValue + doc + "-";
                }
            }
        }
        if (v2 !== ""){
            newValue = newValue + v2;
            if (docLength >= 8 && docLength <= 9){
                newValue = newValue + "-";
            }
        }
        if (v3 !== ""){
            newValue = newValue + v3;
        }

        setCuit(newValue.slice(0,5+docLength));
    }
    else {
        setCuit(val);
    }
}

export const createUseEffectsForTablePagination = (restoreFiltersFunction, searchFunction, props, searchInFirstRender) => {

    return [
        
        {
            func: () => {
                if (searchInFirstRender) {
                    restoreFiltersFunction();
                    //searchFunction(0, 10, props.orderBy, props.order);
                    props.setPageConfig({current: 0, size: 10});
                }
            }, 
            deps: []
        },
        {
            func: () => {
                if (props.pageConfig) {
                    let newStartIndex = (props.pageConfig.current) * props.pageConfig.size;
                    let newEndIndex = newStartIndex + props.pageConfig.size;
                    searchFunction(newStartIndex, newEndIndex, props.orderBy, props.order);
                }
            }, 
            deps: [props.pageConfig]
        },
        {
            func: () => {
                if (props.pageConfig) {
                    props.setPageConfig({current: 0, size: props.pageConfig.size});
                }
            }, 
            deps: [props.order, props.orderBy]
        }
    ]
}

export const sortArrayByLabel = (array) => {
    return array.sort((a,b) => {
        let fa = a.label.toLowerCase(), fb = b.label.toLowerCase();
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
}

const createCopy = (textArea) => {
    var copy = document.createElement('div');
    copy.textContent = textArea.value;
    var style = getComputedStyle(textArea);
    [
     'fontFamily',
     'fontSize',
     'fontWeight',
     'wordWrap', 
     'whiteSpace',
     'borderLeftWidth',
     'borderTopWidth',
     'borderRightWidth',
     'borderBottomWidth',
    ].forEach(function(key) {
      copy.style[key] = style[key];
    });
    copy.style.overflow = 'auto';
    copy.style.width = textArea.offsetWidth + 'px';
    copy.style.height = textArea.offsetHeight + 'px';
    copy.style.position = 'absolute';
    copy.style.left = textArea.offsetLeft + 'px';
    copy.style.top = textArea.offsetTop + 'px';
    document.body.appendChild(copy);
    return copy;
}
  



export const getCaretPosition = (textArea) => {
    var start = textArea.selectionStart;
    var end = textArea.selectionEnd;
    var copy = createCopy(textArea);
    var range = document.createRange();
    range.setStart(copy.firstChild, start);
    range.setEnd(copy.firstChild, end);
    var selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    var rect = range.getBoundingClientRect();
    document.body.removeChild(copy);
    textArea.selectionStart = start;
    textArea.selectionEnd = end;
    textArea.focus();
    return {
      x: rect.left - textArea.scrollLeft,
      y: textArea.offsetTop//rect.top - textArea.scrollTop
    };
}

export const handleKeyPopupEvents = (e, classPopUp) => {
    let popUp = document.getElementsByClassName(classPopUp)[0];
    
    //popup is not hidden
    if (popUp && !popUp.classList.contains("hidden")){
        let items = popUp.getElementsByClassName("suggestion-item");
        let row_heigth = items.length ? items[0].clientHeight : 0;
        let div_height = popUp.scrollHeight;
        let visible_div_heigth = popUp.clientHeight
        
        //38 up - 40 down
        if (e.keyCode === 38 || e.keyCode === 40){
            e.preventDefault();
            
            let currentSelection = -1;
            for (var i = 0; i < items.length; i++){
                //something focused
                if (items[i].classList.contains("focused")){
                    currentSelection = i;
                    items[i].classList.remove("focused");
                }
            }
            
            if (currentSelection !== -1){
                let scroll_height = 0
                if (currentSelection == 8 ) {
                    
                    scroll_height = row_heigth * (currentSelection + 1)
                }
                //up and items above
                if (e.keyCode === 38){
                    let item_selected_position = Math.max(0, currentSelection - 1)
                    let selected_height = item_selected_position * row_heigth
                    if(selected_height <= popUp.scrollTop){
                        popUp.scroll(0, popUp.scrollTop - row_heigth)
                    }
                    items[Math.max(0, currentSelection - 1)].classList.add("focused");
                }
                //down and items underneath
                if (e.keyCode === 40){
                    let item_selected_position = Math.min(items.length - 1, currentSelection + 1)
                    let selected_height = item_selected_position * row_heigth

                    // si la altura del seleccionado es mayor a la del tope del scroll + la altura de lo que se ve el div entonces scrolleo
                    if(selected_height >= popUp.scrollTop + visible_div_heigth){
                        popUp.scroll(0, popUp.scrollTop + row_heigth)
                    }
                    items[Math.min(items.length - 1, currentSelection + 1)].classList.add("focused");
                }
            }
            else items[0].classList.add("focused");
        }
        else {
            let focused = Array.from(items).filter(x => x.classList.contains("focused"));
            //enter
            if (e.keyCode === 13){
                if (focused.length === 1){
                    e.preventDefault();
                    focused[0].classList.remove("focused");
                    focused[0].click();
                }
            }
        }
    }
}

export const handleEscKeyPopupEvents = (e, callback, classPopUp) => {
    let popUp = document.getElementsByClassName(classPopUp)[0];
    //popup is not hidden
    if (popUp && !popUp.classList.contains("hidden")){
        let items = popUp.getElementsByClassName("suggestion-item");
        let focused = Array.from(items).filter(x => x.classList.contains("focused"));
        //esc
        if (e.keyCode === 27){
            if (focused.length === 1){
                focused[0].classList.remove("focused");
            }
            callback(false);
        }
    }
}

