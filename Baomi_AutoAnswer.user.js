// ==UserScript==
// @name         某保密自动答题油猴脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Print exam answers
// @author       Tokeii
// @match        http://www.baomi.org.cn/bmExam*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Backup original XMLHttpRequest object
    const originalXhr = XMLHttpRequest;
    let answers = [];

    // Create a new XMLHttpRequest object
    XMLHttpRequest = function() {
        const xhr = new originalXhr();

        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                // Get answers for the first two question types
                for(let i = 0; i < 2; i++) {
                    // Get answers for the questions in each type
                    for(let j = 0; j < response.data.typeList[i].questionList.length; j++) {
                        answers.push(response.data.typeList[i].questionList[j].answer);
                    }
                }
            }
        }, false);

        return xhr;
    };

    // Copy original XMLHttpRequest object properties
    for(let i in originalXhr) {
        XMLHttpRequest[i] = originalXhr[i];
    }

    window.addEventListener('load', function() {
        // Wait for the DOM to fully load
        let questionList = document.querySelectorAll('.ques_options-box');

        for(let i = 0; i < questionList.length; i++) {
            // The answer is mapped to the radio button as 'A' -> 0, 'B' -> 1, etc.
            let answerIndex = answers[i].charCodeAt(0) - 'A'.charCodeAt(0);
            let options = questionList[i].querySelectorAll('.el-radio');

            // Check if options exist and the answer index is within the options length
            if(options && answerIndex < options.length) {
                options[answerIndex].click();
            }
        }

        // Wait for 1 second (1000 milliseconds)
        setTimeout(function() {
            // 查找提交按钮
            let submitButton = document.querySelector('.el-button.el-button--primary');

            // 检查按钮是否存在，然后点击它
            if(submitButton) {
                submitButton.click();
            }
        }, 500);
    }, false);
})();
