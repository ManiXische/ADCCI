/***************************************************************************************************

Extension Name: \\ex-polls

File: component-polls

Owner: tawfik

Version: 1.0.0

***************************************************************************************************/



//sitecore function related to search result



    function initPollsLogic() {
        // load recaptcha if not loaded 
        $.dispatchEvent("load-recaptcha");


        //check if signiture is the same as poll list or poll featured
        var baseClass = ".ex-polls",
            itemSelector = baseClass + "__item";

        // polls container 
        var pollsContainer = $(baseClass);

        //catch the parent element that contain data source
        var nodePoll = pollsContainer.find(itemSelector);
     
        //function that make some action based on poll closing date and todays date
        function compareClosingDate() {
       
            //check if we are not in featured poll
            //loop over each item in the list and send the closing date of this item
            $(nodePoll).each(function () {

                //filter the date string only from 20200326T200000Z to this 20200326

                var thisdate = $(this).find(".closing-date").data("closingdate").substring(0, 8);

              

                if (isDateLowerThanToday(thisdate)) {

                    //if today's date is bigger than yesterday date show view polls

                    $(this).find('.take-polls').hide();

                    $(this).find('.view-polls').show();

                } else {

                    //if today's date is not bigger than yesterday date show take polls

                    $(this).find('.view-polls').hide();

                    $(this).find('.take-polls').show();
                }
            });
        }

        //function to compare dates UTC formats
        function isDateLowerThanToday(thisdate) {

            var isoDate =new Date().toISOString();



            var isoDatestr = isoDate.replace(/\-/g,"").substr(0,8);

            if (parseInt(thisdate) < parseInt(isoDatestr)) {

                return true;

            } else {

                return false;

            }

        }

        function createProgressItem(item) {

            let progressItem = $("<div />", {
                'class': 'progress-item position-relative',
                "data-value": item.VotesPercent
            });
            let progressBar = $("<div />", {
                'class': 'progress-bar progress-bar-animated',
                'role': 'progressbar',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                'style': {
                    'width': '0%'
                }
            }).appendTo(progressItem);

            let heading = $("<h4 />", {
                'class': 'd-flex px-4 position-absolute w-100',
            }).appendTo(progressBar);

            let strong = $("<strong />", {
                'class': '',
            }).text(item.VotesPercent + "%").appendTo(heading);

            let span = $("<span />", {
                'class': 'truncate truncate-2',
            }).text(item.Answer).appendTo(heading);

            return progressItem;
        }

        function createProgressBars(data, itemContainer) {
            let progressWrap = $(itemContainer).find(".progress-wrap");

            // empty the progress bar
            progressWrap.empty();

            // appending the items at the progress wrap 
            if (data && data.length) {
                data.forEach(function (item) {
                    progressWrap.append(createProgressItem(item));
                });
            }

            // loop the current childs to animate each one 
            progressWrap.children().each(function (idx, item) {
                let value = $(item).data("value"),
                    progresBar = $(item).find(".progress-bar");

                if (value >= 75) {
                    progresBar.addClass("progress-bar--verygood");
                } else if (value >= 50) {
                    progresBar.addClass("progress-bar--good");
                } else {
                    progresBar.addClass("progress-bar--verybad");
                }

                // animate the progress bar 
                progresBar.animate({
                    width: value + "%"
                }, 300);
            });
        };

        var captchaobject, viewAction;
        // captcha callback 
        function captchaCallback(response) {
            if (viewAction) {
                // initiate get results request 
                getResults(response);
              
            } else {
                // submit form data 
                validateAndSubmit(response);
            }
        }

        //function that init captcha
        function initCaptcha() {
            var captchadivID = "polls_google_recaptcha";
            var siteKey = $(baseClass).data("sitekey");
            document.addEventListener("grecaptcha-loaded", function () {
                if(document.getElementById("polls_google_recaptcha")){
                    captchaobject == undefined && (captchaobject = grecaptcha.render(captchadivID, {
                        'sitekey': siteKey,
                        'callback': captchaCallback,
                        'theme': 'light',
                        'size': "invisible"
                    }));
                }
            });

        }

        //function that reset captcha
        function resetCaptcha() {
            //reset captcha by id
            captchaobject & grecaptcha.reset(captchaobject);
        }

        // open the popup 
        function openPopup(popup) {
            if (popup) {
                $.fancybox.open({
                    src: popup,
                    type: 'inline',
                    touch: {
                        vertical: false, // Allow to drag content vertically
                        momentum: false // Continue movement after releasing mouse/touch when panning
                    },
                    opts: {
                        afterShow: function (instance, current) {

                        },
                        afterClose: function () {
                            // reset the form after closing the popup
                            $(popup).find("input").val("").prop("checked", false);
                        }
                    }
                });
            }
        }
        if(!$(".ex-polls-featured").length){
    var tiggerPopupButton = $(baseClass + " .open-polls-popup");
        // open popup 
        tiggerPopupButton.on("click", function (e) {
            e.preventDefault();

            // setting the view action button
            viewAction = $(this).hasClass("view-polls");

            // variables 
            let itemId = $(this).data("src"),
                prefix = "fancy-popup-",
                popup = document.getElementById(prefix + itemId);

            // adding active to identify active item
            $(baseClass).attr("data-active", itemId);

            // open the popup
            // if it's not the view button 
$(baseClass).find(".message-block--error").hide(); 
            if (viewAction) {
                // make the call first
                
                showLoader(this);
                submitRequest(e);
                
            } else {
            
                $(popup).find(".polls-form").show();
                $(popup).find(".polls-results").hide();
                removeLoader($(popup).find(".polls-form"));
                $(popup).find(".message-block--success").hide();
                $(popup).find(".message-block--error").hide();
                openPopup(popup);
                 
            }

        });
        } else{
            $(baseClass).attr("data-active", ($(".ex-polls__item").data("itemid")));
        }
       

        //function that based on the comparison between closing date of polls and today's date make some actions
        compareClosingDate();


        // init single captcha 
        initCaptcha();

        // on clicks 
        //fire click on this button and send 2 attributes related to future calculation

        // $('.ex-polls .view-polls').on("click", function () {
        //     animateProgress($($(this).data("src")), $(this).closest(nodePoll).data("pollid"))
        // });

        //function for submit button 
        $(baseClass + ' .submit-polls').on("click", function (e) {
            if($(this).closest(".polls-form").find('input[type="radio"]:checked').length){
                $(this).closest(".ex-polls__popup").find(".field-validation-error").hide()
            showLoader(this);
            submitRequest(e);
            }else{
                $(this).closest(".ex-polls__popup").find(".field-validation-error").show()
            }
        });

        // submit the form by triggering the captcha 
        function submitRequest(e) {
            e.preventDefault();
            if (captchaobject != undefined) {
                grecaptcha.execute(captchaobject);
            }
        } 

        function validateAndSubmit(response) {

            var questionID = $(baseClass).attr("data-active"),
                itemContainer = $(document.getElementById("fancy-popup-" + questionID)),
                answerID = itemContainer.find('input[type="radio"]:checked').attr("id"),
                url = location.origin+$(baseClass).data("submit");
                if( $(baseClass).find(".hiddenviewall").length){
                    $(baseClass).find(".hiddenviewall").removeClass("d-none").addClass("d-flex");
                }
            //to prevent init captcha twice to the same object
            if (answerID) {
                //hide error that showed before to tell user to select answer
                $(itemContainer).find(".field-validation-error").hide();


                let payload = {
                    "questionId": questionID,
                    "answerId": answerID,
                    "CaptchaResponse": response
                };
               
                // submit the data 
                submitData(itemContainer, url, payload, questionID);
                

            } else {
                //show error to select radio buttons
                resetCaptcha();
                $(itemContainer).find(".field-validation-error").show();
                removeLoader(itemContainer);
            }
        }

        // map the get response to match the data 
        function getMappedDataForGet(data) {
            if (data && data.length) {
                let poll = {
                    Votes: 0,
                    Answers: [],
                    EndDateFormatted: '',
                };
                data.forEach(function (item) {
                    item.percentage && (poll.Votes += parseInt(item.percentage));
                    poll.Answers.push({
                        Votes: item.percentage,
                        Answer: item.answer
                    });
                });

                return poll;
            }
        }
        // get results from pollls api 
        function getResults(response) {

            var questionID =  $(baseClass).attr("data-active"),
                itemContainer = $(document.getElementById("fancy-popup-" + questionID)),
                url = location.origin+$(baseClass).data("get");

            let payload = {
                "pollid": questionID,
                "CaptchaResponse": response
            };

            submitData(itemContainer.parent(), url, payload, questionID);
        }



        //function to show loader
        function showLoader(button) {
            // disable the button
            $(button).addClass("button--disabled");

            // show loading at submit polls
            let icon = $(button).find(".icon");
            if (icon.length) {
                icon.attr("data-class", icon.attr("class"));
                icon.removeClass(icon.attr("class")).addClass("spinner-grow");
            }
        }

        //function to remove loader
        function removeLoader(parentObject) {
            let buttonIcon = parentObject.find(".spinner-grow"),
                button = buttonIcon.parent();
            button.removeClass("button--disabled");
            buttonIcon.removeClass("spinner-grow").addClass(buttonIcon.data("class")).removeAttr("data-class");
            parentObject.find(".polls-form").hide();
        }



        //function when submit successfully done
        function successfulySubmited(data, itemContainer, questionID) {
            // populate the votes 
            $(".statistics .polls-total-vote").text(data.Votes);
            $(".statistics .closing-date").text(data.EndDateFormatted);

            // toggle form/progress view 
            itemContainer.find(".polls-form").hide();
            itemContainer.find(".polls-results").show();

            // animate progress bar 
            createProgressBars(data.Answers, itemContainer, questionID);

            // hide the take polls button 
            itemContainer.find(".take-polls").hide();
        }


        // submit the request 
        function submitData(itemContainer, url, payload, questionID) {
            $(itemContainer).find(".message-block--error").hide();

            send(url, payload).then(function (data) {
                if (data && data.success) {
                    // map the data to complete the cycle 
                    let poll = data.poll;
                    successfulySubmited(poll || {}, itemContainer.parent(), questionID);

                    if (viewAction) {
                        let popup = document.getElementById("fancy-popup-" + questionID);
                        openPopup(popup);
                    }
                    $(itemContainer).find(".message-block--success").show();
                
                } else {
                   
                    $(itemContainer).find(".message-block--error").show();
                    $(itemContainer).find(".polls-form").hide();
                }
            }).catch(function () {
                $(itemContainer).find(".message-block--error").show();
                $(itemContainer).find(".polls-form").hide();
                // $(itemContainer).find(".message-block--success").hide();
            }).finally(function () {
                removeLoader($(baseClass));
                resetCaptcha();
            });
        }
        // function send 
        function send(url, payload) {
            return new Promise(function (resolves, rejects) {
                // resolves(viewAction ? getDummy : dummy);
                $.ajax({
                    type: "POST",
                    url: url,
                    data: payload || {},
                    cache: false,
                    success: function (data) {
                        resolves(data);
                    },
                    error: function (error) {
                        rejects(error);
                    }
                });
            });


        }
    }

   


XA.component.search.vent.on("results-loaded", function (data) {
    $(document).ready(function () {
        initPollsLogic();
    });
   });