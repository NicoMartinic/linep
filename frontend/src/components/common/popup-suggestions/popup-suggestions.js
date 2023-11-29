import React, { useState, useEffect } from 'react';
import './popup-suggestions.css';
import { getCaretPosition, handleKeyPopupEvents, handleEscKeyPopupEvents } from '../../../common'
import Spinner from '../../common/spinner/spinner';
// import Spinner from '../../../common/spinner/spinner';

let timer = null;

function PopupSuggestions(props) {
    const [showPopup, setShowPopup] = useState(false);
    const [dataFiltered, setDataFiltered] = useState([]);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: null });
    const [replaceEdges, setReplaceEdges] = useState({ from: 0, to: 0 });
    const initialInfo = props.data
    const [loading, setLoading] = useState(false)
    const [currentSearchValue, setCurrentSearchValue] = useState('')
    const [valueSelectedFromSuggestions, setValueSelectedFromSuggestions] = useState(false)

    const selectedFromSuggestions = (valueToDisplay, selectedSuggestionForCallback) => {
        setValueSelectedFromSuggestions(true);

        let newValue = props.elementValue.substring(0, replaceEdges.from) + valueToDisplay + props.elementValue.substring(replaceEdges.to) + " ";
        
        if (props.replaceTotalValue){
            newValue = valueToDisplay;
        }

        props.elementSetter(newValue);
        setShowPopup(false);
        getTarget().focus();
        if (props.callback){
            props.callback(selectedSuggestionForCallback);
        }
    }

    const getTarget = () => {
        return document.getElementById(props.elementId);
    }

    const updateSearch = (searchValue) => {
        
        let value = searchValue;
        
        if (props.specialChar){
            value = searchValue.slice(1)
        }
        
        setCurrentSearchValue(value)
        if (value && props.fetchToBackend && !valueSelectedFromSuggestions) { // Fetch to back if available
            setLoading(true)
            clearTimeout(timer);
            timer = setTimeout(() => {
                props.fetchToBackend(value)
                    .then(response => {
                        setDataFiltered(response);
                        response.length > 0 ? setShowPopup(true) : setShowPopup(false);
                        setLoading(false)
                        focusFirstElement()
                    })
            }, 700);
        } else {
            setLoading(false)
            let suggestions = initialInfo
            if (props.initialInfo) {
                suggestions = props.initialInfo()
            }
            suggestions = props.data.filter(x => { return (x[props.attributeToDisplay].includes(value) || x[props.attributeToDisplay].includes(value.toLowerCase())) });
            setDataFiltered(suggestions);
            suggestions.length > 0 ? setShowPopup(true) : setShowPopup(false);
        }
        setValueSelectedFromSuggestions(false);
    }

    const updateCursorXY = () => {
        let caretPosition = getCaretPosition(getTarget());
        let leftPosition = caretPosition.x + 10;

        if (props.moveWithCursor == false){
            leftPosition = null;
        }
        else {
            setPopupPosition({ bottom: caretPosition.y + 115, left: leftPosition });
        }
    }

    useEffect(() => {
        let currentString = props.elementValue;
        if (currentString.length === 0) {

            setShowPopup(false);
        }
        else {
            //SEARCH WITH FULL VALUE
            if (props.replaceTotalValue){
                updateSearch(currentString);
                updateCursorXY();
            }
            else {
                //GET AND SEARCH BY FOCUSED WORD 
                let charPosition = getTarget().selectionStart;

                let leftSideSplitted = currentString.substring(0, charPosition).split(" ");
                let leftSide = leftSideSplitted[leftSideSplitted.length - 1];
                let rightSide = currentString.substring(charPosition).split(" ")[0]

                if (leftSide.includes(props.specialChar)) {
                    setReplaceEdges({ from: charPosition - leftSide.length, to: charPosition + rightSide.length });
                    updateCursorXY();
                    updateSearch(leftSide + rightSide);
                }
                else {
                    setShowPopup(false);
                }
            }
        }
    }, [props.elementValue]);

    const focusFirstElement = () => {
        let popupElement = document.getElementsByClassName(props.classPopUp);
        let suggestions = popupElement[0].getElementsByClassName("suggestion-item");
        if (suggestions.length > 0) {
            suggestions[0].classList.add("focused");
        }
    }

    useEffect(() => {
        if (showPopup) {
            focusFirstElement()
            document.onkeydown = (e) => handleKeyPopupEvents(e, props.classPopUp);
            document.onkeyup = (e) => handleEscKeyPopupEvents(e, setShowPopup, props.classPopUp);
            return () => {
                document.onkeydown = null;
                document.onkeyup = props.handleEscKeyEvent;
            }
        }
        else {
            document.onkeydown = null;
            document.onkeyup = props.handleEscKeyEvent;
        }
    }, [showPopup]);

    const highlightText = (text) => { // highlights text in insensitive mode
        let searchable_text = currentSearchValue.trim()
        let positions = getIndicesOf(searchable_text, text)
        let setOfValues = new Set()
        positions.forEach(position => {
            setOfValues.add(text.substring(position, position + searchable_text.length))
        });

        let highlighted;

        if(searchable_text.length == 1){
            highlighted = '';
            [...text].forEach(letra => {   
                if(setOfValues.has(letra)){
                   
                    highlighted = highlighted + `<mark>${letra}</mark>`
                }else{
                    highlighted = highlighted + letra
                }
            })
        }else{
            highlighted = text;
            setOfValues.forEach((value) => {
            highlighted = highlighted.replaceAll(value, `<mark>${value}</mark>`)
        })}
         
        return highlighted
    }

    function getIndicesOf(searchStr, str, caseSensitive) { // returns indices of ocurrences of substring in a string
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {

            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    const rowFormat = (element, key) => {
        let splittedString = (element[props.attributeToDisplay].split('<->'))

        let highlatableString = splittedString[0] // refactor?
        let text = highlatableString

        if (currentSearchValue) {
            text = highlightText(highlatableString)
        }

        text = `${text}`;

        if (props.specialChar){
            text = `${props.specialChar}${text}`
        }

        let rowEnd = splittedString[1] ? `<small style="color:rgb(178, 176, 176);"> (${splittedString[1]})</small>` : ''
        let rowText = text + rowEnd

         
        return <div
            key={key}
            dangerouslySetInnerHTML={{ __html: rowText }}
            className="suggestion-item"
            onClick={() => selectedFromSuggestions(props.display(element[props.attributeForSetter]), element)}
        />
    }
    return (
        /* tabIndex enables onKeyDown event on divs */
        <div className={"pop-up " + props.classPopUp + (showPopup ? "" : " hidden")} style={popupPosition}>
            {
                loading ?
                    <Spinner className="suggestion-spinner"></Spinner>
                    :
                    dataFiltered.map((element, key) => rowFormat(element, key))
            }
        </div>

    );
}

export default PopupSuggestions;
