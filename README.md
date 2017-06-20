# Another QA Helper

### Description

This Chrome extension is designed to fulfill a completely different purpose from the original QA Helper. The original QA Helper facilitates the meta-QA tasks of navigating slides and clicking through menus inside of Microsoft Team Foundation Server. On the other hand, this extension is geared towards facilitating the actual act of Quality Assurance itself. In the future, it's possible the two tools will be combined into one, but for now, they will stay separate.

### Logical Steps


#### **TODO**: fix this wall of text that I mind-vomited

1. When clicking the extension for the first time, a separate window will open in Chrome that will have three separate tabs contained within it. The three tabs, respectively, will be opened to:
    a. Microsoft Team Foundation Server
    b. The new course slides (Blackboard)
    c. The old course slides (DR site)
3. All of the calls heretofore referred to (opening the windows and tabs) will be contained within a series of files referred to as <code>background scripts</code>. The principal background script that does all of the routing will be <code>MainController.js</code>.
4. The user will open the new slide of the web being QA'd. A button in the extension dropdown, "Link new slide", will be clicked, that will send a message to the main controller letting it know that the slide page has been reached. The main controller, in turn, will respond by injecting the new slide page with javascript - <code>Content_BB.js</code> - that attaches an event listener to the entire animation. (maybe this would be better done via hotkey?)
5. The user will repeat the same process by opening up the old slide of the web being QA'd. A button in the extension dropdown, "Link old slide" will be clicked, sending a message to the main controller. The main controller will respond by injecting the old slide page with javascript - <code>Content_DR.js</code> - that attaches a click event listener to the entire flash frame. (maybe this would be better done via hotkey?)
5. Now that both pages are linked up with the correct event listeners, every time a click is made on the page, a message is sent from the content scripts to the main controller. The main controller should have a message listener initialized on it, and when it receives an appropriate message from either page (since both of them should be sending the same message), it should fire off the function referred to in the main controller as "1to1Validate".
6. 1to1Validate is a controller function that will execute the following substeps:
    a. For each of the slide pages (old and new), take a screenshot 
    b. With that screenshot (which is by default encoded as a base 64 string), query the OCR API to receive in return an analysis of the text that is contained within each slide. In addition to storing the text, the OCR API should respond with a "text overlay" object that contains coordinates relative to the page about where each word is found.
    c. With the variables that now have data about the text on each slide, clean the data by removing all punctation, regularizing the spaces, and converting all text to lowercase.
    d. With the cleaned new slide text, run a word-by-word comparison on the old slide text. If there are any words on the new slide that are not on the old slide, push them into an array called "uniqueWords_newSlide", otherwise "nonUniqueWords_newSlide". It's likely that this unique words array will be populated with spelling mistakes. If there are any words on the old slide that are not in the new slide, push them into an array called "uniqueWords_oldSlide", otherwise "nonUniqueWords_newSlide". It's likely that this unique words array will be populated with words that have been accidentally ommitted.
    e. All of the residual data from these operations will be passed to the content script running on the new slide page via a window message.
    f. Inside of the content script now, the code will cycle through the array nonUniqueWords_newSlide, grab each word's position on the page, and insert a slightly transparent green div the size of that word in order to cover it and indicate that the word was found on the old page, and therefore, is correct.
    g. The code will then cycle through the array uniqueWords_newSlide, grab each word's position on the page, and insert a slightly transparent red div the size of that word in order to cover it and indicate that the word was not found on the old page, and therefore, is likely incorrect.

All of this will happen with the intent of making the QA task less visually repetitious and automating as much as possible. Clearly, since OCR is imperfect, it will not catch all of the correct/incorrect words 100% of the time. However, with the visual representation, it should make it MUCH quicker see if the text matches at a glance and reserve most of the truly engaged QA work for examining the images and animations.

- It's possible that instead of having to manually click the extension in each of those pages, we could add an event listener to the URL changes inside of those two tabs, and automatically send appropriate messages to the main controller/inject the proper scripts when the URL changes to the locations that we're watching for.