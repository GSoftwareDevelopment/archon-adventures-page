exports = function(changeEvent) {
   const logEntry={
    type: changeEvent.operationType,
    fsId: changeEvent.dokument._id,
    timestamp: new Date(),
    userId: undefined // <-- here I want to know the user ID
  }
  
  const fslog=context.service.get("mongodb-atlas").db("ArchonSite").collection("fslog");
  fslog.insetOne(logEntry);
  
};
