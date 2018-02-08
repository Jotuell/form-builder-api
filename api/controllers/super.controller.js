
module.exports = function(Model) {

  const modelName = Model.collection.name;
  
  const findItemById = (req, res, next) => {
    Model.findById(req.params.id, { password: 0 }, (err, item) => {
      if(err)
        return res.status(500).send(err);
      if (item) {
        req.item = item;
        return next();
      }
      res.status(404).send(`Error: ` + modelName.slice(0, -1) + `not found (id: ${req.params.id})`);
    });   
  };

  // CHECK IF USER OWNS THE REQUESTED DOCUMENT
  const checkOwner = (req, res, next) => {
    if(req.userRoles.indexOf('ADMIN') < 0 && req.item.user !== req.userId)
      return res.status(403).send('Access denied: not enough permissions.');
    next();
  };

  // UPDATES A SINGLE ITEM IN THE DATABASE
  const updateItem = (req, res) => {
  
    if(req.item.updated)
      req.body.updated = Date.now();
  
    req.item.update(req.body, (err, raw)=>{
      if(err) {
        if(err.code === 11000)
          return res.status(400).send(err);
        return res.status(500).send(err);
      }
      res.json(raw);
    });
  
  };
  
  // DELETES AN ITEM FROM THE DATABASE
  const deleteItem = (req, res) => {
    
    req.item.remove(err => {
      if(err)
        return res.status(500).send(err);
      res.status(204).end();
    });

  };

  return {
    findItemById,
    checkOwner,
    updateItem,
    deleteItem,
  };

};