// Wrap wrapper around nodes
// Just pass a collection of nodes, and a wrapper element
function wrapAll(nodes, wrapper) {
    // Cache the current parent and previous sibling of the first node.
    var parent = nodes[0].parentNode;
    var previousSibling = nodes[0].previousSibling;

    // Place each node in wrapper.
    //  - If nodes is an array, we must increment the index we grab from
    //    after each loop.
    //  - If nodes is a NodeList, each node is automatically removed from
    //    the NodeList when it is removed from its parent with appendChild.
    for (var i = 0; nodes.length - i; wrapper.firstChild === nodes[0] && i++) {
        wrapper.appendChild(nodes[i]);
    }

    // Place the wrapper just after the cached previousSibling,
    // or if that is null, just before the first child.
    var nextSibling = previousSibling ? previousSibling.nextSibling : parent.firstChild;
    parent.insertBefore(wrapper, nextSibling);

    return wrapper;
}

var defaultWaitTimer = 500;
function waitForElement(elementSelector, callBack, waitTimer = defaultWaitTimer){
    window.setTimeout(function() {
        var element = document.querySelector(elementSelector);
        if(element){
            callBack(elementSelector, element);
        } else {
            waitForElement(elementSelector, callBack, waitTimer);
        }
    }, waitTimer);
}

// document.addEventListener('DOMContentLoaded', () => {
// });

waitForElement('input[type="submit"]', function(){
    // Author Field/Label
        // document.querySelector('input[name="author"]').classList.add('TESTING');
        var authorField = document.querySelector('input[name="author"]');
        var authorLabel = document.createElement('label');
        authorLabel.htmlFor = "author";
        // authorField.classList.add('TESTING');

    // Email Field/Label
        // document.querySelector('input[name="email"]').classList.add('TESTING');
        var emailField = document.querySelector('input[name="email"]');
        var emailLabel = document.createElement('label');
        emailLabel.htmlFor = "email";
        // emailField.classList.add('TESTING');

    // Website Field/Label
        // document.querySelector('input[name="website"]').classList.add('TESTING');
        var websiteField = document.querySelector('input[name="website"]');
        var websiteLabel = document.createElement('label');
        websiteLabel.htmlFor = "website";
        // websiteField.classList.add('TESTING');

    // Wrap them all
        wrapAll( [authorField], authorLabel );
        wrapAll( [emailField], emailLabel );
        wrapAll( [websiteField], websiteLabel );
}, 250);
