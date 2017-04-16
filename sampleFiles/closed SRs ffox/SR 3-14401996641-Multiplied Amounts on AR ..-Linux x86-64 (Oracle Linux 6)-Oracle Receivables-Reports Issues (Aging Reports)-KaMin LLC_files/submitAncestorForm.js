//-----------------------------------------------------------------------------

// In the DOM, find the nearest ancestor that is of a certain type
function findAncestorNode(node, tagName) {
    if (node.tagName == tagName) {
        return node;
    }

    parentNode = node.parentNode;
    if (parentNode == null) {
        return null;
    }

    return findAncestorNode(parentNode, tagName);
}

// Submit a form if <RETURN> is encountered
function submitFormOnReturn(formId, sourceId, event) {
    var code;
    if (event.which) {
        //FF
        code = event.which;
    }
    else {
        //IE
        code = window.event.keyCode;
    }

    if (code == 13)  {
        window.submitForm(formId, 1, {source:sourceId});
        return false;
    }
}

// get full id for an id potentially in a subform
function getSubformTargetId(node, targetId) {
    var id = node.id;
    var lastColonIndex = id.lastIndexOf(':');
    if (lastColonIndex == -1) {
        return targetId;
    }
    return id.substring(0, lastColonIndex + 1).concat(targetId);
}

// Submit nearest ancestor form, potentially inside subform, if <RETURN> is encountered
function submitAncestorFormOnReturn(node, sourceId, event) {
    var ancestorForm = findAncestorNode(node, 'FORM');
    var subformSourceId = getSubformTargetId(node, sourceId);
    submitFormOnReturn(ancestorForm.id, subformSourceId, event);
}

//-----------------------------------------------------------------------------

// get full id for an id potentially in a subform
function getSubformTargetId(node, targetId) {
    var id = node.id;
    var lastColonIndex = id.lastIndexOf(':');
    if (lastColonIndex == -1) {
        return targetId;
    }
    return id.substring(0, lastColonIndex + 1).concat(targetId);
}

function clickButton(node, buttonId) {
    var subformButtonId = getSubformTargetId(node, buttonId);
    var ancestorForm = findAncestorNode(node, 'FORM');
    submitForm(ancestorForm.id, 0, {source:subformButtonId});
    return false;
}

function isReturn(event) {
    var code;
    if (event.which) {
        //FF
        code = event.which;
    } else {
        //IE
        code = window.event.keyCode;
    }

    if (code == 13)  {
        return true;
    } else {
        return false;
    }
}

//-----------------------------------------------------------------------------

function submitSearchBarOnReturn(node, message, inputTextId, buttonId, event) {
    if (isReturn(event)) {
        clickSearchBarButton(node, message, inputTextId, buttonId);
    }
}

function clickSearchBarButton(node, message, inputTextId, buttonId) {
    if (validateSearchBar(node, message, inputTextId)) {
        clickButton(node, buttonId);
    }
}

function validateSearchBar(node, message, inputTextId) {
    var subformInputTextId = getSubformTargetId(node, inputTextId);
    var inputText = window.document.getElementById(subformInputTextId);
    if (inputText.value == '') {
        alert(message);
        return false;
    } else {
        return true;
    }
}

//-----------------------------------------------------------------------------
