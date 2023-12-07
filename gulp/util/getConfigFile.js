import { getParam } from './fetchParams';


export default ()=>{
    var environment = getParam("env");
    var username = getParam("username");
    var password = getParam("password");
    var config = {};
    try{
        if(environment){
            config = require(`../configs/config.${environment}`).default;
        }else {
            config = require("../configs/config").default
        }
        if(username && password){
            // set the user name and password params
            config.user.login = username;
            config.user.password = password;
        }
    }catch(err){
        console.log("Error: ", err);
        console.log("Error reading config files".red);
    }

    return config;
}