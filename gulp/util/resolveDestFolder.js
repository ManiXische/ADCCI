import lookups from './lookups';

const constants = lookups.constants;

export default (args , folder) =>{
    let folderPath = `${args.isExtension ? constants.extensionsFolder : constants.themesFolder}/${args.path}/${folder}`;
    if(args.dest && args.compilationType == lookups.compilationType.theme){
        // compiling extension inside theme
        folderPath = `${constants.themesFolder}/${args.dest}/${folder}/${constants.extensionsFolder}/${args.path}`;
    }
    return folderPath;
}