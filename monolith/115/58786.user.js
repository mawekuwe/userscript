// ==UserScript==
// @name LaTeX4FriendFeed
// @namespace http://www.danhagon.me.uk/LaTeX4FriendFeed/
// @copyright 2009+, Daniel Hagon (http://www.danhagon.me.uk/)
// @version 0.9.1a
// @license (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/3.0/
// @description Display LaTeX markup as presentational MathML in FriendFeed conversations.
// @include http://friendfeed.com/*
// @require http://friendfeed.com/static/javascript/jquery-1.3.js?v=bb38
// @require http://math.etsu.edu/LaTeXMathML/LaTeXMathML.js
// @require http://markitup.jaysalvat.com/examples/markitup/jquery.markitup.js
// ==/UserScript==


/*  TODO:

     - Add an event handler to spot when a user selects to open a collapsed set of comments and process these new comments when they arrive.
     - Improve the style of the markup to be closer to that found in http://math.etsu.edu/LaTeXMathML/LateXMathML.standardarticle.css
     - Add an event that will place a WYSIWYG editor around each edit box to allow easy placement of common LaTeX strings.
     - Improve the stylesheet for the editor.

*/


/*  First off, disable the code in LaTeXMathML that will
    automatically convert a page upon loading the page,
    as this has interaction issues with jQuery in FriendFeed.
    
    To disable we simply redefine the variable to nothing.
*/ 
translate = null ;


/*  Initialize the symbol translation table as used in the
    orignal ASCIIMath script.
*/
AMinitSymbols();


/*  Put all the translation code into a function so that it can
    be called several times during a browsing session.
*/
function translatetoMathml() {

    /* We only want to work on the sections of the page that contain
       fragment of FriendFeed conversations so use an XPath to select
       these.
    */
    var snapItems = document.evaluate("//*[@class='content']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    /* For each of these sections (as found in the original page),
       use the LaTeXMathML script to convert to MathML.
    */
    for (var i = snapItems.snapshotLength - 1; i >= 0; i--) {

        // Select a node for processing.
        var contentNode = snapItems.snapshotItem(i);

        // Pre-process the LaTeX node.
        contentNode = LaTeXpreProcess(contentNode);

        // Now actually do the processing to convert to MathML.
        AMprocessNode(contentNode, false);

    }

    // This fixes problems with additional whitespace that was generated by the translation process.
    $(".LaTeXMathML").remove()
}

/*  markitup! settings, specifically for LaTeX markup
*/
mySettings = {	
	markupSet:  [
            /* Initial Setup */ 	
            {name:'$$', openWith:'$', closeWith:'$' },
            /*{name:'Preview', className:'preview',  call:'preview'}*/
            {separator:'--' },
            /* Lower Case Greek */
            {name:'GrL', dropMenu: [

            {name:'$\\alpha$', replaceWith:'\\alpha', className:'LaTeXString'},		
            {name:'$\\beta$', replaceWith:'\\beta', className:'LaTeXString'},		
            {name:'$\\gamma$', replaceWith:'\\gamma', className:'LaTeXString'},		
            {name:'$\\epsilon$', replaceWith:'\\epsilon', className:'LaTeXString'},
            {name:'$\\theta$', replaceWith:'\\theta', className:'LaTeXString'},
            {name:'$\\lambda$', replaceWith:'\\lambda', className:'LaTeXString'},
            {name:'$\\pi$', replaceWith:'\\pi', className:'LaTeXString'},
            {name:'$\\sigma$', replaceWith:'\\sigma', className:'LaTeXString'},
            {name:'$\\phi$', replaceWith:'\\phi', className:'LaTeXString'},
            {name:'$\\omega$', replaceWith:'\\omega', className:'LaTeXString'},
            {name:'$\\varepsilon$', replaceWith:'\\varepsilon', className:'LaTeXString'},
            {name:'$\\vartheta$', replaceWith:'\\vartheta', className:'LaTeXString'},
            {name:'$\\mu$', replaceWith:'\\mu', className:'LaTeXString'},
            {name:'$\\varpi$', replaceWith:'\\varpi', className:'LaTeXString'},
            {name:'$\\varsigma$', replaceWith:'\\varsigma', className:'LaTeXString'},
            {name:'$\\varphi$', replaceWith:'\\varphi', className:'LaTeXString'},
            {name:'$\\gamma$', replaceWith:'\\gamma', className:'LaTeXString'},
            {name:'$\\zeta$', replaceWith:'\\zeta', className:'LaTeXString'},
            {name:'$\\iota$', replaceWith:'\\iota', className:'LaTeXString'},
            {name:'$\\nu$', replaceWith:'\\nu', className:'LaTeXString'},
            {name:'$\\rho$', replaceWith:'\\rho', className:'LaTeXString'},
            {name:'$\\tau$', replaceWith:'\\tau', className:'LaTeXString'},
            {name:'$\\chi$', replaceWith:'\\chi', className:'LaTeXString'},
            {name:'$\\delta$', replaceWith:'\\delta', className:'LaTeXString'},
            {name:'$\\eta$', replaceWith:'\\eta', className:'LaTeXString'},
            {name:'$\\kappa$', replaceWith:'\\kappa', className:'LaTeXString'},
            {name:'$\\xi$', replaceWith:'\\xi', className:'LaTeXString'},
            {name:'$\\varrho$', replaceWith:'\\varrho', className:'LaTeXString'},
            {name:'$\\upsilon$', replaceWith:'\\upsilon', className:'LaTeXString'},
            {name:'$\\psi$', replaceWith:'\\psi', className:'LaTeXString'}

            ]},
            {separator:'--' },
            /* Upper Case Greek */
            {name:'GrU', dropMenu: [

            {name:'$\\Gamma$', replaceWith:'\\Gamma', className:'LaTeXString'},
            {name:'$\\Theta$', replaceWith:'\\Theta', className:'LaTeXString'},
            {name:'$\\Xi$', replaceWith:'\\Xi', className:'LaTeXString'},
            {name:'$\\Sigma$', replaceWith:'\\Sigma', className:'LaTeXString'},
            {name:'$\\Phi$', replaceWith:'\\Phi', className:'LaTeXString'},
            {name:'$\\Omega$', replaceWith:'\\Omega', className:'LaTeXString'},
            {name:'$\\Delta$', replaceWith:'\\Delta', className:'LaTeXString'},
            {name:'$\\Lambda$', replaceWith:'\\Lambda', className:'LaTeXString'},
            {name:'$\\Pi$', replaceWith:'\\Pi', className:'LaTeXString'},
            {name:'$\\Upsilon$', replaceWith:'\\Upsilon', className:'LaTeXString'},
            {name:'$\\Psi$', replaceWith:'\\Psi', className:'LaTeXString'}
            
            ]},
            {separator:'--' },
            /* Fractions */
            {name:'Frac', dropMenu: [

            {name:'$\\frac{a}{b}$', replaceWith:'\\frac{}{}', className:'LaTeXString'},
            /* {name:'$x\\tfrac{a}{b}$', replaceWith:'\\tfrac{}{}', className:'LaTeXString'}, */
            {name:'$\\frac{\\partial }$', replaceWith:'\\frac{\\partial }{\\partial x}', className:'LaTeXString'},
            {name:'$\\frac{\\partial^2 }{\\partial x^2}$', replaceWith:'\\frac{\\partial^2 }{\\partial x^2}', className:'LaTeXString'},
            {name:'$\\frac{\\mathrm{d} }{\\mathrm{d} x}$', replaceWith:'\\frac{\\mathrm{d} }{\\mathrm{d} x}', className:'LaTeXString'}
            
            ] },
            {separator:'--' },
            /* Relations */
            {name:'Rel', dropMenu: [

            {name:'$<$', replaceWith:'<', className:'LaTeXString'},
            {name:'$\\leq$', replaceWith:'\\leq', className:'LaTeXString'},
            {name:'$\\prec$', replaceWith:'\\prec', className:'LaTeXString'},
            {name:'$\\preceq$', replaceWith:'\\preceq', className:'LaTeXString'},
            {name:'$\\ll$', replaceWith:'\\ll', className:'LaTeXString'},
            {name:'$\\vdash$', replaceWith:'\\vdash', className:'LaTeXString'},
            {name:'$\\smile$', replaceWith:'\\smile', className:'LaTeXString'},
            {name:'$\\models$', replaceWith:'\\models', className:'LaTeXString'},
            {name:'$\\mid$', replaceWith:'\\mid', className:'LaTeXString'},
            {name:'$\\bowtie$', replaceWith:'\\bowtie', className:'LaTeXString'},
            {name:'$>$', replaceWith:'>', className:'LaTeXString'},
            {name:'$\\geq$', replaceWith:'\\geq', className:'LaTeXString'},
            {name:'$\\succ$', replaceWith:'\\succ', className:'LaTeXString'},
            {name:'$\\succeq$', replaceWith:'\\succeq', className:'LaTeXString'},
            {name:'$\\gg$', replaceWith:'\\gg', className:'LaTeXString'},
            {name:'$\\dashv$', replaceWith:'\\dashv', className:'LaTeXString'}

            ]},
            {separator:'--' },
            {name:'Rel2', dropMenu: [

            {name:'$\\perp$', replaceWith:'\\perp', className:'LaTeXString'},
            {name:'$\\frown$', replaceWith:'\\frown', className:'LaTeXString'},
            {name:'$\\parallel$', replaceWith:'\\parallel', className:'LaTeXString'},
            {name:'$\\Join$', replaceWith:'\\Join', className:'LaTeXString'},
            {name:'$=$', replaceWith:'=', className:'LaTeXString'},
            {name:'$\\neq$', replaceWith:'\\neq', className:'LaTeXString'},
            {name:'$\\equiv$', replaceWith:'\\equiv', className:'LaTeXString'},
            {name:'$\\doteq$', replaceWith:'\\doteq', className:'LaTeXString'},
            {name:'$\\sim$', replaceWith:'\\sim', className:'LaTeXString'},
            {name:'$\\approx$', replaceWith:'\\approx', className:'LaTeXString'},
            {name:'$\\simeq$', replaceWith:'\\simeq', className:'LaTeXString'},
            {name:'$\\cong$', replaceWith:'\\cong', className:'LaTeXString'},
            {name:'$\\asymp$', replaceWith:'\\asymp', className:'LaTeXString'},
            {name:'$\\propto$', replaceWith:'\\propto', className:'LaTeXString'}
            
            ]},
            {separator:'--' },
            /* Subscripts and superscripts */
            {name:'Sub/sup', dropMenu: [

            {name:'$x^a$', replaceWith:'^{}', className:'LaTeXString'},
            {name:'$x_a$', replaceWith:'_{}', className:'LaTeXString'},
            {name:'$x_a^b$', replaceWith:'_{}^{}', className:'LaTeXString'},
            {name:'${x_a}^b$', replaceWith:'{_{}}^{}', className:'LaTeXString'}
            /* {name:'$_a^{b}\\textrm{C}$', replaceWith:'_{}^{}\\textrm{}', className:'LaTeXString'},*/
            
            ]},
            {separator:'--' },
            /* Big Unions and Intersections */
            {name:'Uni/Inter', dropMenu: [

            {name:'$\\bigcap$', replaceWith:'\\bigcap', className:'LaTeXString'},
            {name:'$\\bigcap_a^b$', replaceWith:'\\bigcap_{}^{}', className:'LaTeXString'},
            {name:'$\\bigcup$', replaceWith:'\\bigcup', className:'LaTeXString'},
            {name:'$\\bigcup_a^b$', replaceWith:'\\bigcup_{}^{}', className:'LaTeXString'},
            
            ]},
            {separator:'--' },
            /* Integrals */
            {name:'Intgs', dropMenu: [

            {name:'$\\int_{a}^{b}$', replaceWith:'\\int_{}^{}', className:'LaTeXString'},		
            {name:'$\\int$', replaceWith:'\\int', className:'LaTeXString'},
            {name:'$\\oint$', replaceWith:'\\oint', className:'LaTeXString'},
            {name:'$\\oint_a^b$', replaceWith:'\\oint_{}^{}', className:'LaTeXString'},
            /* {name:'$\\iint_a^b$', replaceWith:'\\iint_{}^{}', className:'LaTeXString'}, */
            
            ]},
            {separator:'--' },
            /* Limits, sums and products */
            {name:'Sums', dropMenu: [

            {name:'$\\lim_{x \\to \\inf}$', replaceWith:'\\lim_{ \\to }', className:'LaTeXString'},
            {name:'$\\sum$', replaceWith:'\\sum', className:'LaTeXString'},
            {name:'$\\sum_a^b$', replaceWith:'\\sum_{}^{}', className:'LaTeXString'},
            {name:'$\\sqrt{x}$', replaceWith:'\\sqrt{}', className:'LaTeXString'},
            {name:'$\\sqrt[n]{x}$', replaceWith:'\\sqrt[]{}', className:'LaTeXString'},
            {name:'$\\prod$', replaceWith:'\\prod', className:'LaTeXString'},
            {name:'$\\prod_a^b$', replaceWith:'\\prod_{}^{}', className:'LaTeXString'},
            {name:'$\\coprod$', replaceWith:'\\coprod', className:'LaTeXString'},
            {name:'$\\coprod_a^b$', replaceWith:'\\coprod_{}^{}', className:'LaTeXString'},
            
            ]},
            {separator:'--' },
            /* Brackets */
            {name:'Bkts', dropMenu: [

            {name:'$\\left ( \\cdots \\right )$', replaceWith:'\\left (  \\right )', className:'LaTeXString'},
            {name:'$\\left [ \\cdots \\right ]$', replaceWith:'\\left [  \\right ]', className:'LaTeXString'},
            {name:'$\\left \\{ \\cdots \\right \\}$', replaceWith:'\\left \\{  \\right \\}', className:'LaTeXString'},
            {name:'$\\left | \\cdots \\right |$', replaceWith:'\\left |  \\right |', className:'LaTeXString'},
            {name:'$\\left \\langle \\cdots \\right \\rangle$', replaceWith:'\\left \\langle  \\right \\rangle', className:'LaTeXString'},
            {name:'$\\left \\lfloor \\cdots \\right \\rfloor$', replaceWith:'\\left \\lfloor  \\right \\rfloor', className:'LaTeXString'},
            {name:'$\\left \\lceil \\cdots \\right \\rceil$', replaceWith:'\\left \\lceil  \\right \\rceil', className:'LaTeXString'}
            
            ]}
	]
}

/*  Applies a LateX widget around each textarea.
*/
function applyLaTeXwidget() {

// textarea name=body  within div class=commentForm

    // Add markItUp! to textarea, flagging up the fact that the textarea has already been
    // widgetized by setting the 'LaTeXwidget' class
    $('textarea[name=body]:not(.LaTeXwidget)').markItUp(mySettings).attr('class','LaTeXwidget');

    // Tranlsate the buttons from LaTeX to human-readable MathML
    $('li[class*=LaTeXString] a').each(function(i){
        var contentNode = this ;
        contentNode = LaTeXpreProcess(contentNode);
        AMprocessNode(contentNode, false);
    });

    // Finally apply a more user-friendly stylesheet so that buttons are in row
    // rather than as vertical lists
    $(".markItUpHeader ul li").css('list-style','none').css('float','left').css('position','relative') ;
    $(".markItUpHeader ul .markItUpSeparator").css('margin','0 5px').css('width','1px').css('height','32px').css('overflow','hidden').css('background-color','#CCC');

    // The following should hide the drop-down menu until needed ...
    $(".markItUpHeader ul li ul").css('display','none') ;
    // ... and the following should show it again once the user hovers over the menu item
    /*$(".markItUpHeader ul li:hover").css('display','block');*/
    $(".markItUpHeader ul li").hover( function() { $("ul",this).css('display','block'); }, function() { /*$("ul",this).css('display','none');*/ } );

    // Put the next level of buttons into an absolute position
    $('.markItUpHeader ul ul').css('position','absolute').css('top','18px').css('left','10px').css('background','#F5F5F5').css('border','1px solid #3C769D');


}

/*  Global variables
    Based on: http://userscripts.org/scripts/review/53910
*/
var commentCount = 0;
var commentTextareaCount = 0;


/*  Check to see if the number of comments within the page has changed
    and if so pre process the page

    Based on: http://userscripts.org/scripts/review/53910 
*/
function processOnCommentCountChange() {
    var commentCountNow = $('.comment .content').length;
    if(commentCount != commentCountNow) {
        commentCount = commentCountNow;
        translatetoMathml();
    }
}

/*  Check to see if the number of comment textareas within the page has changed
    and if so pre process the page to add LaTeX widgets around each of them.

    Based on: http://userscripts.org/scripts/review/53910 
*/
function processOnTextareaCountChange() {
    var commentTextareaCountNow = $('textarea').length;
    if(commentTextareaCount != commentTextareaCountNow) {
        commentTextareaCount = commentTextareaCountNow;
        applyLaTeXwidget();
    }
}

/*  Implements an infinite loop that will poll the contents of
    a page and process changes.

    Based on: http://userscripts.org/scripts/review/53910 
*/
function processOnDocumentChange_wait() {

    // Do the processing
    processOnCommentCountChange();
    processOnTextareaCountChange() ;
    //alert("Test: I'm here");

    // Recursively wait
    window.setTimeout(processOnDocumentChange_wait,250);
}


/*  Apply the markitup! editor to the comments textarea
*/
$(document).ready(function()	{

    // Perform a first-pass translation of the LaTeX that is visible in the intial document
    translatetoMathml();
    // Initial pass to get LaTeX textarea widgets
    applyLaTeXwidget();
    // Add markItUp! to textarea to the single textarea at the top of the page
    // In the case: textarea name=title  within div class=title
    $('textarea.title').markItUp(mySettings);

    // Place a refresh button in the corner of the page
    /*
    $("#bodydiv").append("<a id=\"LaTeX4FriendFeedrefresh\">Refresh LaTeX4FriendFeed</a>");
    $("#LaTeX4FriendFeedrefresh").css("position","fixed").css("bottom","5%").css("right","5%").css("background-color","white").css("text-decoration","none").css("cursor","pointer");
    $("#LaTeX4FriendFeedrefresh").bind("click", function(e){
        translatetoMathml();
    });
    */

    // Start an infinite loop to detect changes
    processOnDocumentChange_wait() ;

});

