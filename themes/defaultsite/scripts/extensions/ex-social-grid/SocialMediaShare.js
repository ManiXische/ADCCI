
function firemailshare(sub,body) {
    window.onbeforeunload = function () {
        window.scrollto(0, window.pageyoffset);
    }
location.href = "mailto:?subject="+sub+"&body="+body;
} 

