'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const schemas = require('../models');

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(async(req, res)=>{
      console.log(`GET request received`);
    let project = req.params.project;
    console.log(`Project: ${project}`);
    try {
      // Dynamically create a model for the specific collection
      const Issue = mongoose.model(project, schemas.issueSchema, project);

      // Build the query object from req.query
      let queryObject = { ...req.query };
      
      // Find issues based on the query parameters
      let issues = await Issue.find(queryObject).exec();
      console.log(`Issues found: ${issues.length}`);
      res.json(issues);
    }
      catch(err){
        console.log(err)
      }
    }
  )
    
    .post(async (req, res)=>{
      console.log(`GET request received`);
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      console.log(`Project: ${project}`);

      if(!created_by||!issue_text||!issue_title){
        return res.json({ error: 'required field(s) missing' })
       }
       else{
      try{
      let issue = mongoose.model("Issue",schemas.issueSchema,project);
      let newIssue = new issue({
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || ''
    })
   let saved = await newIssue.save();
   res.json(saved);
  }
  
  catch(err){
    console.log(err)
  }
}
    })
    
    .put(async (req, res)=>{
      let project = req.params.project;
      const{_id,  issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;
      
      try{
        if(!_id){
          res.json({ error: 'missing _id' })
      }
      else if(!issue_title&&!issue_text&&!created_by&&!assigned_to&&!status_text&&!open){
        res.json({ error: 'no update field(s) sent', '_id': _id })
      }
      else{
        const Issue = mongoose.model("Issue", schemas.issueSchema, project);
        const updatedIssue = await Issue.findByIdAndUpdate(_id, { 
         ...req.body,
          updated_on: new Date()
        }, { new: true });
        await updatedIssue.save();
        res.json({  result: 'successfully updated', '_id': _id })
      }
    }
    catch(err){
      res.json({ error: 'could not update', '_id': _id })
      console.log(err)
    }
    })
    
    .delete(async (req, res)=>{
      let project = req.params.project;
      let {_id} = req.body; 
      try{
       
        if(!_id){
          res.json({ error: 'missing _id'})
        }
        else{
          const Issue = mongoose.model("Issue", schemas.issueSchema, project);
          const updatedIssue = await Issue.findByIdAndUpdate(_id,{new: true});
          if(updatedIssue){
          res.json({ result: 'successfully deleted', '_id': _id })
          }
          else{
            res.json({ error: 'could not delete', '_id': _id })
          }
        }
      }
      catch(err){
        console.log(err)
        res.json({ error: 'could not delete', '_id': _id })
      }
    });
    
};
