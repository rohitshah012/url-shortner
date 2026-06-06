const  sessionIdToUserMap = new Map();

function setuser(id, session ){
    sessionIdToUserMap.set(id, session)
}

function getuser(id){
   return  sessionIdToUserMap.get(id)
}

module.exports = {
    setuser,
    getuser


}
