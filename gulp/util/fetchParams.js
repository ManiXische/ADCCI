// themeType can pass it as a param (type, t , core , c)

const filterParams = function(){
    var params = process.argv;
    const filtered = params ? params.map((param , i)=> {
        return param.startsWith("--") ? {[param.replace("--", "")]: (params[i + 1] ? (params[i + 1].startsWith("--") ? true : params[i + 1]) : true) } : null
    }).filter(Boolean) : [];
    return filtered;
}

const getParam = function(param) {
    const filtered = filterParams();
    if(param == "type"){
        // you should configure dotenv before calling this line
        // or default will be color
        let type = "";
        filtered.forEach((prm)=>{
            if(prm.core || prm.c || (prm.type || prm.t) == "core"){
                type = "core";
            } else if(prm.color || prm.clr || (prm.type || prm.t) == "color"){
                type = "color"
            }
        });
        return type;
    }else if (param == "path"){
        let themepath = "";

        filtered.forEach((prm)=>{
            if(!themepath){
                themepath = (prm.path || prm.p);
            }
        });
        return themepath;
    }else if (param == "theme"){
        let isTheme = "";
        filtered.forEach((prm)=>{
            if(!isTheme){
                isTheme = (prm.theme || prm.th) || (prm.hasOwnProperty("theme") || prm.hasOwnProperty("th"));
            }
        });
        return isTheme;
    }else if (param == "extension"){
        let isExtension = "";
        filtered.forEach((prm)=>{
            if(!isExtension){
                isExtension = (prm.extension || prm.ext) || (prm.hasOwnProperty("extension") || prm.hasOwnProperty("ext"));
            }
        });
        return isExtension;
    }else {
        let found = filtered.find((fit)=> fit[param]);
        if(found){
            return found[param];
        }else if(process.argv.some((d)=> d == param)) {
            return true;
        }
    }

    return '';
};
let setParam = function(param , input){
    const filtered = filterParams();
    let attr = "";
    if(param == "type"){
        filtered.forEach((prm)=>{
            if(prm.hasOwnProperty("type")){
                attr = "type";
            }else if(prm.hasOwnProperty("color")) {
                attr = "color";
            }else if(prm.hasOwnProperty("clr")) {
                attr = "clr";
            }else if(prm.hasOwnProperty("t")) {
                attr = "t";
            }else if(prm.hasOwnProperty("core")) {
                attr = "core";
            }else if(prm.hasOwnProperty("c")) {
                attr = "c";
            }
        });
    }else if(param == "path"){
        filtered.forEach((prm)=>{
           if(prm.hasOwnProperty("path")) {
                attr = "path";
            }else if(prm.hasOwnProperty("p")) {
                attr = "p";
            }
        });
    }else if(param == "theme" ){
        filtered.forEach((prm)=>{
            if(prm.hasOwnProperty("theme")){
                attr = "theme";
            }else if(prm.hasOwnProperty("th")) {
                attr = "th";
            }
        });
    }else {
        attr = param;
    }
    let index,found = process.argv.some((it,idx)=>{index =idx; return it == `--${attr}`});
    if(found){
        if(!process.argv[index + 1] || process.argv[index + 1].startsWith("--")){
            // this is an boolean param 
            process.argv[index] = `--${input}`;
        }else{
            // this is a string or int param 
            process.argv[index + 1] == input;
        }
    }else {
        attr && process.argv.push(`--${attr}`);
        input && process.argv.push(input);
    }

}

export {getParam , setParam}