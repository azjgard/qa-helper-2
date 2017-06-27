/*
PRE-LOAD

This file will initialize anything that needs to be
initialized AFTER the library scripts get loaded
but BEFORE the regular content scripts are loaded.
*/

// This is the global object that every "global" function
// and variable will actually be a member of. This is to
// prevent the content scripts from polluting the global
// namespace of the page and make inner functions
// accessible to other members.
var QA_HELPER_GLOBAL = {};

// This creates a jQuery alias that we can use in the rest
// of our scripts and avoid conflict with pages that may
// already have jQuery loaded, whether it's the same version
// or a different one. All of the content scripts will
// need to be wrapped in a function that aliases
// QA_HELPER_JQUERY to $ and allows us to use jQuery
// normally.
var QA_HELPER_JQUERY = $.noConflict(true);