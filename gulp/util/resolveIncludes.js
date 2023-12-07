import lookups from './lookups';


export default (args) =>{
    if(args && args.dest &&  args.compilationType == lookups.compilationType.theme){
        return [`themes/${args.dest}/vars`];
    }
    return [`shared/vars`];
}