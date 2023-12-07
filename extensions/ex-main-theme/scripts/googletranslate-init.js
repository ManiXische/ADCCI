// store google translate's change event
var trackChange = null,
    pageDelayed = 3000;

// overwrite prototype to snoop, reset after we find it (keep this right before translate init)
Element.prototype._addEventListener = Element.prototype.addEventListener;
Element.prototype.addEventListener = function (a, b, c) {
    reset = false;

    // filter out firstTranslator change event
    if (a == "change") {
        trackChange = b;
        reset = true;
    }

    if (c == undefined)
        c = false;

    this._addEventListener(a, b, c);

    if (!this.eventListenerList)
        this.eventListenerList = {};

    if (!this.eventListenerList[a])
        this.eventListenerList[a] = [];

    this.eventListenerList[a].push({ listener: b, useCapture: c });

    if (reset) {
        Element.prototype.addEventListener = Element.prototype._addEventListener;
    }
};

function googleTranslateElementInit() {
    var firstTranslator = $("#google_translate_element_1");
    var secondTranslator = $("#google_translate_element_2");
    var activeTranslator = "google_translate_element_1";
    var nowChanging = false;

    if(!firstTranslator.length && secondTranslator.length){
        firstTranslator = secondTranslator;
        activeTranslator = "google_translate_element_2";
    }

    if (firstTranslator.length) {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'af,am,az,be,bg,bn,bs,ca,ceb,co,cs,cy,da,de,el,eo,es,et,eu,fa,fi,fr,fy,ga,gd,gl,gu,ha,haw,hi,hmn,hr,ht,hu,hy,id,ig,is,it,iw,ja,jv,ka,kk,km,kn,ko,ku,ky,la,lb,lo,lt,lv,mg,mi,mk,ml,mn,mr,ms,mt,my,ne,nl,no,ny,pa,pl,ps,pt,ro,ru,sd,si,sk,sl,sm,sn,so,sq,sr,su,sv,sw,ta,te,tg,th,tl,tr,uk,ur,uz,vi,xh,yi,yo,zh-CN,zh-TW,zu',
            layout: google.translate.TranslateElement.InlineLayout.VERTICAL
        }, activeTranslator);


        // we need to let it load, since it"ll be in footer a small delay shouldn"t be a problem
        setTimeout(function () {
            select = firstTranslator.find("select");
            // lets clone the translate select
            secondTranslator.html(firstTranslator.clone());
            secondTranslator.find("select").val(select.val());

            // add our own event change
            firstTranslator.find("select").on("change", function (event) {
                if (nowChanging == false) {
                    secondTranslator.find("select").val($(this).val());
                }
                return true;
            });

            secondTranslator.find("select").on("change", function (event) {
                if (nowChanging) {
                    return;
                }

                nowChanging = true;
                firstTranslator.find("select").val($(this).val());
                trackChange();

                // give this some timeout incase changing events try to hit each other                    
                setTimeout(function () {
                    nowChanging = false;
                }, 1000);
            });
        }, pageDelayed);
    }
}


$(document).ready(function () {
    var firstTranslator = $("#google_translate_element_1");
    var secondTranslator = $("#google_translate_element_2");
    if(firstTranslator.length || secondTranslator.length){
        $("[data-settings]").on("click", function() {
            if(typeof google == "undefined" || typeof google.translate == "undefined" || typeof google.translate.TranslateElement == "undefined" ){
                $('body').append('<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>');
            }
        });
    }
});






